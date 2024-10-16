"use client"

import {
  Input,
  Button,
  Accordion,
  AccordionItem,
  CheckboxGroup,
  Checkbox,
  Chip,
} from "@nextui-org/react"
import { useState } from "react"
import { Rule } from "@main/types/Rule"
import { useRules } from "@lib/hooks"
import { v4 as uuidv4 } from "uuid"

import { rulesApi, pathApi } from "@lib/electron"

export function AddRule() {
  const { mutate } = useRules()

  const [rule, setRule] = useState<Rule>({
    id: uuidv4(),
    name: "",
    directory: "",
    filters: [],
  })

  const handleAddRule = async () => {
    await rulesApi.addRule(rule)

    mutate()

    // Clear the state
    setRule({
      id: uuidv4(),
      name: "",
      directory: "",
      filters: [],
    })

    setCurrentFilter("")
    setFilters([])
  }

  const handleBrowse = async () => {
    const path = await pathApi.selectPath()
    if (path) {
      setRule((prev) => ({ ...prev, directory: path }))
    }
  }

  const handleCancel = () => {
    setRule({
      id: uuidv4(),
      name: "",
      directory: "",
      filters: [],
    })

    setCurrentFilter("")
    setFilters([])
  }

  const [filters, setFilters] = useState<string[]>(rule.filters ?? [])
  const [currentFilter, setCurrentFilter] = useState("")
  const [error, setError] = useState("")

  const updateFilters = (filters: string[]) => {
    setFilters(filters)

    setRule((rule) => {
      rule.filters = filters
      return rule
    })
  }

  const addFilter = () => {
    setError("")

    const filter = currentFilter.trim()

    if (filter === "") {
      setError("Please enter a filter.")
      return
    }

    if (rule.filters.includes(filter)) {
      setError("Filter already exists.")
      return
    }

    updateFilters([...filters, filter])

    setCurrentFilter("")
  }

  const removeFilter = (filter: string) => {
    updateFilters(filters.filter((f) => f !== filter))
  }

  const validateInput = (value: string) => {
    if (rule.filters.includes(value)) {
      setError("Filter already exists.")
    }

    if (error !== "") {
      setError("")
    }
  }

  const checkboxValues = new Set(["*.mov", "*.mp4", "*.avi", "*.wmv", "*.mkv"])

  const toggleFilters = (_filters: string[]) => {
    const existingFilters = new Set(filters).difference(checkboxValues)
    const newFilters = new Set(_filters).union(existingFilters)
    updateFilters(newFilters.values().toArray())
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">Add New Rule</h2>
      <Input
        placeholder="Enter the name of the rule..."
        value={rule.name}
        onValueChange={(value) => setRule((prev) => ({ ...prev, name: value }))}
      />
      <div className="flex gap-2">
        <Input
          placeholder="Enter the directory to watch..."
          value={rule.directory}
          isReadOnly
        />
        <Button onClick={handleBrowse}>Browse</Button>
      </div>
      <Accordion>
        <AccordionItem
          key="1"
          title="Filter"
          classNames={{
            title: "font-bold text-lg",
            indicator: "data-[open=true]:-rotate-90", // This should happen by default, not sure why it isn't
          }}
        >
          <div className="flex flex-col gap-2">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                addFilter()
              }}
            >
              <Input
                placeholder="Filter by file name..."
                onValueChange={(value) => {
                  setCurrentFilter(value)
                  validateInput(value)
                }}
                value={currentFilter}
                isInvalid={error !== ""}
                errorMessage={error}
              />
            </form>
            <CheckboxGroup
              orientation="horizontal"
              label="Select filters"
              color="primary"
              value={checkboxValues
                .intersection(new Set(filters))
                .values()
                .toArray()}
              onValueChange={toggleFilters}
            >
              {checkboxValues
                .values()
                .toArray()
                .map((value) => (
                  <Checkbox key={value} value={value}>
                    {value}
                  </Checkbox>
                ))}
            </CheckboxGroup>
            <div className="flex flex-wrap items-center gap-2">
              {new Set(rule.filters)
                .difference(checkboxValues)
                .values()
                .toArray()
                .map((filter, idx) => (
                  <Chip key={idx} onClose={() => removeFilter(filter)}>
                    {filter}
                  </Chip>
                ))}
            </div>
          </div>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end gap-2">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleAddRule}>Add Rule</Button>
      </div>
    </div>
  )
}
