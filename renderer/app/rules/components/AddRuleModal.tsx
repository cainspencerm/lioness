"use client"

import { pathApi, rulesApi } from "@lib/electron"
import { useRules } from "@lib/hooks"
import { Rule } from "@main/types/Rule"
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export function AddRuleModal({ isOpen, onClose }) {
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
    onClose() // Close the modal after adding rule
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
    onClose() // Close the modal on cancel
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
    updateFilters(Array.from(newFilters))
  }

  const isSubmittable = (() => {
    const name = rule.name.trim()
    const directory = rule.directory.trim()

    return name !== "" && directory !== ""
  })()

  return (
    <Modal
      placement="center"
      backdrop="blur"
      isOpen={isOpen}
      onClose={onClose}
      closeButton
    >
      <ModalContent>
        <ModalHeader>Add New Rule</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Enter the name of the rule..."
            value={rule.name}
            onValueChange={(value) =>
              setRule((prev) => ({ ...prev, name: value }))
            }
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
            <AccordionItem key="1" title="Filter">
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
                  value={Array.from(
                    new Set(filters).intersection(checkboxValues),
                  )}
                  onValueChange={toggleFilters}
                >
                  {Array.from(checkboxValues).map((value) => (
                    <Checkbox key={value} value={value}>
                      {value}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from(
                    new Set(rule.filters).difference(checkboxValues),
                  ).map((filter: string, idx: number) => (
                    <Chip key={idx} onClose={() => removeFilter(filter)}>
                      {filter}
                    </Chip>
                  ))}
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button isDisabled={!isSubmittable} onClick={handleAddRule}>
            Add Rule
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
