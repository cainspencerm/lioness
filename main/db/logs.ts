import { v4 as uuidv4 } from "uuid"
import { Log } from "../types/Log"
import initDb from "./init"

export async function addLog(message: string) {
  const db = await initDb()

  const log: Log = {
    id: uuidv4(),
    message: message,
    timestamp: new Date().getTime(),
  }
  await db.update(({ logs }) => logs.push(log))
}

export async function getLogs() {
  const db = await initDb()
  return db.data.logs
}
