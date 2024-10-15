import { Rule } from "./types/Rule"
import {
  getRules,
  getRule,
  addRuleToDb,
  modifyRuleInDb,
  deleteRuleFromDb,
} from "./db"
import {
  startWatcher,
  stopWatcher,
  restartWatcher,
  initializeWatchers,
} from "./watcherManager"

// Initialize database and watchers
export async function initialize() {
  const rules = await getRules()
  initializeWatchers(rules)
}

// Get all rules
export async function getAllRules() {
  return await getRules()
}

// Get a single rule by ID
export async function getSingleRule(id: string) {
  return await getRule(id)
}

// Add a new rule
export async function addRule(rule: Rule) {
  await addRuleToDb(rule)
  startWatcher(rule) // Start the watcher for the new rule
}

// Modify an existing rule
export async function modifyRule(rule: Rule) {
  await modifyRuleInDb(rule)
  restartWatcher(rule) // Restart the watcher after modification
}

// Delete a rule
export async function deleteRule(id: string) {
  await deleteRuleFromDb(id)
  stopWatcher(id) // Stop the watcher for the deleted rule
}
