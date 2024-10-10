"use client"

import { NextUIProvider } from "@nextui-org/system"
import { RulesProvider } from "./context/RulesProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <RulesProvider>{children}</RulesProvider>
    </NextUIProvider>
  )
}
