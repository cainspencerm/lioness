"use client"

import { AdjustmentsHorizontalIcon, TrashIcon } from "@heroicons/react/16/solid"
import { rulesApi } from "@lib/electron"
import { useRules } from "@lib/hooks"
import { Rule } from "@main/types/Rule"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import { useMemo, useState } from "react"
import { AddRuleModal } from "./AddRuleModal"

export function RuleTable() {
  const { rules, isLoading, isError, mutate } = useRules()
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal

  const handleAddRuleClick = () => {
    setIsModalOpen(true) // Open the modal when button is clicked
  }

  const handleDeleteRule = async (id: string) => {
    await rulesApi.deleteRule(id)
    if (rules) {
      mutate(rules.filter((rule: Rule) => rule.id !== id))
    }
  }

  const filteredRules = rules
    ? rules.filter((rule: Rule) =>
        rule.name.toLowerCase().includes(search.toLowerCase()),
      )
    : []

  const sortedRules = filteredRules.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "directory") {
      return a.directory.localeCompare(b.directory)
    }
    return 0
  })

  const topContent = useMemo(
    () => (
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by rule name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <div className="flex items-center gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => setSortBy(key as string)}
              selectedKeys={[sortBy]}
              selectionMode="single"
            >
              <DropdownItem key="name">Name</DropdownItem>
              <DropdownItem key="directory">Directory</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button variant="solid" onClick={handleAddRuleClick}>
            New Rule
          </Button>
        </div>
      </div>
    ),
    [search, sortBy],
  )

  return (
    <div className="not-prose flex justify-center">
      <Table
        removeWrapper
        aria-label="Example static collection table"
        title="Rules"
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DIRECTORY</TableColumn>
          <TableColumn>FILTERS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={isError ? "An error occurred." : "No rules to display."}
          isLoading={isLoading}
        >
          {!isLoading &&
            !isError &&
            rules &&
            sortedRules.map((rule: Rule, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.directory}</TableCell>
                <TableCell>{rule.filters?.join(", ")}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    startContent={
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    }
                    onClick={() =>
                      alert("Not implemented. Use Delete and Add Rule for now.")
                    }
                  />
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    startContent={<TrashIcon className="w-5 h-5" />}
                    onClick={() => handleDeleteRule(rule.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* AddRuleModal component */}
      <AddRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
