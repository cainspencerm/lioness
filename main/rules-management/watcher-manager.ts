import chokidar, { FSWatcher } from "chokidar"
import { Rule } from "../types/Rule"
import { minimatch } from "minimatch"
import ffmpeg from "fluent-ffmpeg"

// A map to store active watchers by rule ID
const watchers: Map<string, FSWatcher> = new Map()

const isMatch = (filePath: string, filters: string[]) => {
  if (filters.length === 0) {
    return true
  }

  return filters.some((f) => minimatch(filePath, f))
}

// Function to check if a file is complete using ffprobe
function checkFileCompleteness(
  filePath: string,
  callback: (isComplete: boolean, metadata: any) => void
) {
  ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      callback(false, null) // Assume the file is incomplete if there's an error
      return
    }

    // Check if the file has video streams and duration
    const hasVideoStream = metadata.streams.some(
      (stream) => stream.codec_type === "video"
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

  watcher.on("change", (filePath) => {
    if (!isMatch(filePath, rule.filters)) {
      return
    }

    // Check if the file is complete
    checkFileCompleteness(filePath, (isComplete, metadata) => {
      if (isComplete) {
        console.log(`File ${filePath} is complete`)
      }
    })
  })

  watchers.set(rule.id, watcher)
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
