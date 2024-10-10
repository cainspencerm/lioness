"use client"

import { useCallback, useEffect, useState } from "react"
import { Store } from "tauri-plugin-store-api"
import { Rule } from "../lib/types"

// Define the Tauri store
const store = new Store("rules.json")

// Custom hook to manage rules
export function RulesContextManager() {
  // State to hold the rules in memory
  const [rules, setRules] = useState<Rule[]>([])

  // Load the rules from the store when the component mounts
  useEffect(() => {
    const loadRules = async () => {
      try {
        const savedRules = await store.get("rules")
        if (savedRules) {
          setRules(savedRules as Rule[])
        }
      } catch (error) {
        console.error("Error loading rules from store:", error)
      }
    }
    loadRules()
  }, [])

  // Save the rules to the store whenever they change
  useEffect(() => {
    const saveRules = async () => {
      try {
        await store.set("rules", rules)
        await store.save()
      } catch (error) {
        console.error("Error saving rules to store:", error)
      }
    }

    if (rules !== null && rules !== undefined) {
      saveRules()
    }
  }, [rules])

  // Function to add a new rule
  const addRule = useCallback((rule: Rule) => {
    setRules((prevRules) => [...prevRules, rule])
  }, [])

  // Function to modify an existing rule by index
  const modifyRule = useCallback((index: number, newRule: Rule) => {
    setRules((prevRules) => {
      const updatedRules = [...prevRules]
      updatedRules[index] = newRule
      return updatedRules
    })
  }, [])

  // Function to delete a rule by index
  const deleteRule = useCallback((index: number) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== index))
  }, [])

  return {
    rules,
    addRule,
    modifyRule,
    deleteRule,
  }
}
