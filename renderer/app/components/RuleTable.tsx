"use client"

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import { useRules } from "@lib/hooks"
import { Rule } from "@main/types/Rule"
import { AdjustmentsHorizontalIcon, TrashIcon } from "@heroicons/react/16/solid"

import { rulesApi } from "@lib/electron"

export function RuleTable() {
  const { rules, isLoading, isError, mutate } = useRules()

  const handleDeleteRule = async (id: string) => {
    await rulesApi.deleteRule(id)

    mutate(rules.filter((rule: Rule) => rule.id !== id))
  }

  return (
    <Table aria-label="Example static collection table">
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
          rules.map((rule: Rule, idx: number) => (
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
  )
}
