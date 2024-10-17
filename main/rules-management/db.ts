import { app } from "electron"
import { Low } from "lowdb/lib"
import { JSONFilePreset } from "lowdb/node"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { Log } from "../types/Log"
import { Rule } from "../types/Rule"
import { Upload } from "../types/Upload"

type UserData = {
  rules: Rule[]
  uploads: Upload[]
  frameIoToken?: string
  logs: Log[]
  frameIoState?: string
}

let db: Low<UserData> | null = null

export async function initDb() {
  const dbFile = path.join(app.getPath("userData"), "db.json")
  db = await JSONFilePreset<UserData>(dbFile, {
    rules: [],
    uploads: [],
    logs: [],
  })
}

export async function getRules() {
  if (!db) await initDb()
  return db.data.rules
}

export async function getRule(id: string) {
  if (!db) await initDb()
  return db.data.rules.find((rule) => rule.id === id)
}

export async function addRuleToDb(rule: Rule) {
  if (!db) await initDb()
  await db.update(({ rules }) => rules.push(rule))
}

export async function modifyRuleInDb(rule: Rule) {
  if (!db) await initDb()
  await db.update(({ rules }) => {
    const index = rules.findIndex((r) => r.id === rule.id)
    rules[index] = rule
  })
}

export async function deleteRuleFromDb(id: string) {
  if (!db) await initDb()
  await db.update(({ rules }) => {
    const index = rules.findIndex((r) => r.id === id)
    rules.splice(index, 1)
  })
}

export async function getUploads() {
  if (!db) await initDb()
  return (
    db.data.uploads.map((upload) => {
      if (upload.date) {
        upload.date = new Date(upload.date)
      }
      return upload
    }) ?? []
  )
}

export async function getUpload(id: string) {
  if (!db) await initDb()
  const upload = db.data.uploads.find((upload) => upload.id === id)
  if (upload && upload.date) {
    upload.date = new Date(upload.date)
  }
  return upload
}

export async function getUploadByPath(path: string) {
  if (!db) await initDb()
  const upload = db.data.uploads.find((upload) => upload.path === path)
  if (upload && upload.date) {
    upload.date = new Date(upload.date)
  }
  return upload
}

export async function addUpload(upload: Upload) {
  if (!db) await initDb()
  await db.update(({ uploads }) => uploads.push(upload))
}

export async function modifyUpload(upload: Upload) {
  if (!db) await initDb()
  await db.update(({ uploads }) => {
    const index = uploads.findIndex((u) => u.id === upload.id)
    uploads[index] = upload
  })
}

export async function deleteUpload(id: string) {
  if (!db) await initDb()
  await db.update(({ uploads }) => {
    const index = uploads.findIndex((u) => u.id === id)
    uploads.splice(index, 1)
  })
}

export async function getFrameIoToken() {
  if (!db) await initDb()
  return db.data.frameIoToken ?? null
}

export async function setFrameIoToken(token: string) {
  if (!db) await initDb()
  await db.update(() => {
    db!.data.frameIoToken = token
  })
}

export async function addLog(message: string) {
  if (!db) await initDb()

  const log: Log = {
    id: uuidv4(),
    message: message,
    timestamp: new Date().getTime(),
  }
  await db.update(({ logs }) => logs.push(log))
}

export async function getLogs() {
  if (!db) await initDb()
  return db.data.logs
}

export async function getFrameIoState(create: boolean = false) {
  if (!db) await initDb()
  if (!db.data.frameIoState || create) {
    await db.update(() => {
      db.data.frameIoState = uuidv4()
    })
  }

  return db.data.frameIoState
}
