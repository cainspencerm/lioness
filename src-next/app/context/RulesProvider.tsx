"use client"

import React, { createContext, ReactNode } from "react"
import { RulesContextManager } from "./RulesContextManager"
import { RulesContextType } from "../lib/types"

// Create a context
export const RulesContext = createContext<RulesContextType | null>(null)

// Provider component to wrap around your app
export const RulesProvider = ({ children }: { children: ReactNode }) => {
  const rulesData = RulesContextManager()

  return (
    <RulesContext.Provider value={rulesData}>{children}</RulesContext.Provider>
  )
}
