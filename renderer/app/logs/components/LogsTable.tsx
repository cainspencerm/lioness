"use client"

import { useLogs } from "@lib/hooks"
import { Log } from "@main/types/Log"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"

export function LogsTable() {
  const { logs, isLoading, isError, mutate } = useLogs()

  return (
    <div className="not-prose">
      <Table>
        <TableHeader>
          <TableColumn>MESSAGE</TableColumn>
          <TableColumn>TIME</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {logs?.map((log: Log, idx: number) => (
            <TableRow key={idx}>
              <TableCell>{log.message}</TableCell>
              <TableCell>
                {new Date(log.timestamp).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
