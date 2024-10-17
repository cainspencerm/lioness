import { app } from "electron"
import { JSONFilePreset } from "lowdb/node"
import path from "path"
import { Log } from "../types/Log"
import { Rule } from "../types/Rule"
import { Upload } from "../types/Upload"

export type UserData = {
  rules: Rule[]
  uploads: Upload[]
  frameIoToken?: string
  logs: Log[]
  frameIoState?: string
}

export default async function initDb() {
  const dbFile = path.join(app.getPath("userData"), "db.json")
  const db = await JSONFilePreset<UserData>(dbFile, {
    rules: [],
    uploads: [],
    logs: [],
  })
  return db
}
