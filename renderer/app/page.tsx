"use client"

import { Divider } from "@nextui-org/react"
import { RuleTable } from "./components/RuleTable"
import { AddRule } from "./components/AddRule"

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">Lioness</h1>
        <Divider />
      </div>

      <AddRule />

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-xl">Current Rules</h2>
        <RuleTable />
      </div>
    </div>
  )
}
