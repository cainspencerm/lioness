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
import { useRules } from "../lib/hooks"

export function RuleTable() {
  const { rules, modifyRule, deleteRule } = useRules()

  const handleDeleteRule = (index: number) => {
    deleteRule(index)
  }

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>DIRECTORY</TableColumn>
        <TableColumn>FILE NAMES</TableColumn>
        <TableColumn>FILE TYPES</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rules to display."}>
        {(rules ?? []).map((rule, idx) => (
          <TableRow key={idx}>
            <TableCell>{rule.name}</TableCell>
            <TableCell>{rule.directory}</TableCell>
            <TableCell>{rule.fileNames.join(", ")}</TableCell>
            <TableCell>{rule.fileTypes.join(", ")}</TableCell>
            <TableCell>
              <Button size="sm">Edit</Button>
              <Button size="sm" onClick={() => handleDeleteRule(idx)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
