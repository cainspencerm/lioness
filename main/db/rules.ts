import { Rule } from "../types/Rule"
import initDb from "./init"

export async function getRules() {
  const db = await initDb()
  return db.data.rules
}

export async function getRule(id: string) {
  const db = await initDb()
  return db.data.rules.find((rule) => rule.id === id)
}

export async function addRuleToDb(rule: Rule) {
  const db = await initDb()
  await db.update(({ rules }) => rules.push(rule))
}

export async function modifyRuleInDb(rule: Rule) {
  const db = await initDb()
  await db.update(({ rules }) => {
    const index = rules.findIndex((r) => r.id === rule.id)
    rules[index] = rule
  })
}

export async function deleteRuleFromDb(id: string) {
  const db = await initDb()
  await db.update(({ rules }) => {
    const index = rules.findIndex((r) => r.id === id)
    rules.splice(index, 1)
  })
}
