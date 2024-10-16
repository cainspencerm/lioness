import { app } from "electron"
import { Low } from "lowdb/lib"
import { JSONFilePreset } from "lowdb/node"
import path from "path"
import { Rule } from "../types/Rule"
import { Upload } from "../types/Upload"

type UserData = {
  rules: Rule[]
  uploads: Upload[]
  frameIoToken?: string
}

let db: Low<UserData> | null = null

export async function initDb() {
  const dbFile = path.join(app.getPath("userData"), "db.json")
  db = await JSONFilePreset<UserData>(dbFile, { rules: [], uploads: [] })
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
