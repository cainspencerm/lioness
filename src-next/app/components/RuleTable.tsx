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
import { AdjustmentsHorizontalIcon, TrashIcon } from "@heroicons/react/20/solid"

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
            <TableCell className="flex gap-2">
              <Button size="sm" variant="light" title="Edit Rule" className="hover:text-blue-500" isIconOnly startContent={<AdjustmentsHorizontalIcon className="w-5 h-5" />} />
              <Button size="sm" variant="light" title="Delete Rule" className="hover:text-red-500" isIconOnly startContent={<TrashIcon className="w-5 h-5" />} onClick={() => handleDeleteRule(idx)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
