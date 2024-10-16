import path from "path"
import { app } from "electron"
import { Low } from "lowdb/lib"
import { JSONFilePreset } from "lowdb/node"
import { Rule } from "../types/Rule"

type RulesData = {
  rules: Rule[]
}

let db: Low<RulesData> | null = null

export async function initDb() {
  const dbFile = path.join(app.getPath("userData"), "db.json")
  db = await JSONFilePreset<RulesData>(dbFile, { rules: [] })
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
