"use client"

import {
  Accordion,
  AccordionItem,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
} from "@nextui-org/react"
import { useState } from "react"

export function Filter() {
  return (
    <Accordion>
      <AccordionItem
        key="1"
        title="Filter"
        classNames={{
          title: "font-bold text-lg",
          indicator: "data-[open=true]:-rotate-90", // This should happen by default, not sure why it isn't
        }}
      >
        <FilterOptions />
      </AccordionItem>
    </Accordion>
  )
}

function FilterOptions() {
  const [filters, setFilters] = useState<string[]>([])
  const [currentFilter, setCurrentFilter] = useState("")
  const [error, setError] = useState("")

  const addFilter = () => {
    setError("")

    if (currentFilter.trim() === "") {
      setError("Please enter a filter.")
      return
    }

    if (filters.includes(currentFilter.trim())) {
      setError("Filter already exists.")
      return
    }

    setFilters((prev) => [...prev, currentFilter.trim()])
    setCurrentFilter("")
  }

  const removeFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter))
  }

  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          addFilter()
        }}
      >
        <Input
          placeholder="Filter by file name..."
          onValueChange={setCurrentFilter}
          value={currentFilter}
          errorMessage={error}
        />
      </form>
      <CheckboxGroup orientation="horizontal">
        <Checkbox value="mov">*.mov</Checkbox>
        <Checkbox value="mp4">*.mp4</Checkbox>
        <Checkbox value="avi">*.avi</Checkbox>
        <Checkbox value="wmv">*.wmv</Checkbox>
        <Checkbox value="mkv">*.mkv</Checkbox>
      </CheckboxGroup>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter, idx) => (
          <Chip key={idx} onClose={() => removeFilter(filter)}>
            {filter}
          </Chip>
        ))}
      </div>
    </div>
  )
}
