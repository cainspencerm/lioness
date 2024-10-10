"use client"

import { Input, Button } from "@nextui-org/react"
import { Filter } from "./Filter"
import { useState } from "react"
import { Rule } from "../lib/types"
import { useRules } from "../lib/hooks"

export function AddRule() {
  const { addRule } = useRules()

  const [rule, setRule] = useState<Rule>({
    name: "",
    directory: "",
    fileNames: [],
    fileTypes: [],
  })

  const handleAddRule = () => {
    addRule(rule)

    setRule({
      name: "",
      directory: "",
      fileNames: [],
      fileTypes: [],
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">Add New Rule</h2>
      <Input
        placeholder="Enter the directory to watch..."
        value={rule.name}
        onValueChange={(value) => setRule((prev) => ({ ...prev, name: value }))}
      />
      <Filter />
      <div className="flex justify-end gap-2">
        <Button size="sm">Cancel</Button>
        <Button size="sm" onClick={handleAddRule}>
          Add Rule
        </Button>
      </div>
    </div>
  )
}
