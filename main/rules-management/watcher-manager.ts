import { Mutex } from "async-mutex"
import chokidar, { FSWatcher } from "chokidar"
import ffmpeg from "fluent-ffmpeg"
import { minimatch } from "minimatch"
import { v4 as uuidv4 } from "uuid"
import { addUpload, getUploadByPath, modifyUpload } from "../db/uploads"
import { Rule } from "../types/Rule"
import { Upload } from "../types/Upload"

// A map to store active watchers by rule ID
const watchers: Map<string, FSWatcher> = new Map()

// Mutex map for each file path
const mutexMap = new Map<string, Mutex>()

const isMatch = (filePath: string, filters: string[]) => {
  if (filters.length === 0) {
    return true
  }

  return filters.some((f) => minimatch(filePath, f))
}

// Function to check if a file is complete using ffprobe
function checkFileCompleteness(
  filePath: string,
  callback: (isComplete: boolean, metadata: any) => void,
) {
  ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      callback(false, null) // Assume the file is incomplete if there's an error
      return
    }

    // Check if the file has video streams and duration
    const hasVideoStream = metadata.streams.some(
      (stream) => stream.codec_type === "video",
    )
    const isComplete = hasVideoStream && metadata.format.duration > 0

    callback(isComplete, metadata) // Pass the result to the callback
  })
}

// Function to start a watcher for a given rule
export function startWatcher(rule: Rule) {
  const watcher = chokidar.watch(rule.directory, {
    persistent: true,
    depth: 1,
    ignoreInitial: true,
  })

  watcher.on("add", async (filePath) => {
    if (!isMatch(filePath, rule.filters)) {
      return
    }

    // Get a lock on the file to prevent concurrent uploads
    if (!mutexMap.has(filePath)) {
      mutexMap.set(filePath, new Mutex())
    }

    const mutex = mutexMap.get(filePath)

    await mutex.runExclusive(async () => {
      // Verify that the upload has not already started
      const existingUpload = await getUploadByPath(filePath)
      if (existingUpload) {
        console.log(`Upload for file ${filePath} already exists`)
        return
      }

      // Create a new upload entry in the database
      const upload: Upload = {
        id: uuidv4(),
        ruleId: rule.id,
        path: filePath,
        status: "pending",
      }

      // Update the database with the new upload
      await addUpload(upload)

      console.log(`New file detected: ${filePath}`)
    })
  })

  watcher.on("change", (filePath) => {
    if (!isMatch(filePath, rule.filters)) {
      return
    }

    // Check if the file is complete
    checkFileCompleteness(filePath, async (isComplete, metadata) => {
      if (isComplete) {
        console.log(`File ${filePath} is ready for processing`)

        // Obtain the lock for the file
        if (!mutexMap.has(filePath)) {
          mutexMap.set(filePath, new Mutex())
        }

        const mutex = mutexMap.get(filePath)

        await mutex.runExclusive(async () => {
          // Update the upload status to "processing"
          const upload = await getUploadByPath(filePath)
          if (!upload) {
            console.log(`Upload for file ${filePath} not found`)
            return
          }

          if (upload.status !== "pending") {
            console.log(`Upload for file ${filePath} is no longer pending`)
            return
          }

          upload.status = "processing"
          await modifyUpload(upload)

          console.log(`Processing file ${filePath}`)

          // Simulate upload processing
          setTimeout(async () => {
            // Update the upload status to "completed" and set the date
            upload.status = "completed"
            upload.date = new Date()
            await modifyUpload(upload)

            console.log(`File ${filePath} is complete`)
          }, 5000)
        })
      }
    })
  })

  watchers.set(rule.id, watcher)

  console.log(`Watcher for rule ${rule.id} started.`)
}

// Function to stop and remove a watcher by rule ID
export function stopWatcher(ruleId: string) {
  const watcher = watchers.get(ruleId)
  if (watcher) {
    watcher.close().then(() => {
      console.log(`Watcher for rule ${ruleId} stopped.`)
      watchers.delete(ruleId)
    })
  }
}

// Function to restart a watcher
export function restartWatcher(rule: Rule) {
  stopWatcher(rule.id)
  startWatcher(rule)
}

// Initialize watchers for existing rules (called on app launch)
export function initializeWatchers(rules: Rule[]) {
  rules.forEach((rule) => startWatcher(rule))
}
