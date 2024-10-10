"use client"

import { RulesProvider } from "./context/RulesProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RulesProvider>{children}</RulesProvider>
  )
}
