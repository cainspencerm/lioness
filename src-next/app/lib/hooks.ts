"use client"

import { useContext } from "react"
import { RulesContext } from "../context/RulesProvider"
import { Rule } from "./types"

// Custom hook to access the rules context
export const useRules = () => {
  const context = useContext(RulesContext)
  if (!context) {
    throw new Error("useRules must be used within a RulesProvider")
  }

  return context
}
