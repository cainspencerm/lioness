"use client"

import { TrashIcon } from "@heroicons/react/16/solid"
import { uploadsApi } from "@lib/electron"
import { useRules, useUploads } from "@lib/hooks"
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
import { useState } from "react"

export function UploadTable() {
  const {
    uploads,
    isLoading: isUploadsLoading,
    isError: isUploadsError,
    mutate: mutateUploads,
  } = useUploads()
  const { rules, isLoading: isRulesLoading, isError: isRulesError } = useRules()

  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("Path")

  const handleDeleteUpload = async (id: string) => {
    await uploadsApi.deleteUpload(id)
    mutateUploads() // Refresh the uploads after deletion
  }

  const getRuleName = (ruleId: string) => {
    const rule = rules?.find((r) => r.id === ruleId)
    return rule ? rule.name : "Unknown Rule"
  }

  const filteredUploads = uploads
    ? uploads.filter((upload) =>
        upload.path.toLowerCase().includes(search.toLowerCase()),
      )
    : []

  const sortedUploads = filteredUploads.sort((a, b) => {
    if (sortBy === "Path") {
      return a.path.localeCompare(b.path)
    } else if (sortBy === "Status") {
      return a.status.localeCompare(b.status)
    } else if (sortBy === "Date (Oldest)") {
      return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
    } else if (sortBy === "Date (Newest)") {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    }
    return 0
  })

  const topContent = (
    <div className="flex justify-between items-center mb-2 gap-4">
      <Input
        placeholder="Search by upload path"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <div className="flex items-center gap-4">
        <Dropdown>
          <DropdownTrigger>
            <Button>Sort by: {sortBy}</Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => setSortBy(key as string)}
            selectedKeys={[sortBy]}
            selectionMode="single"
          >
            <DropdownItem key="Path">Path</DropdownItem>
            <DropdownItem key="Status">Status</DropdownItem>
            <DropdownItem key="Date (Oldest)">Date (Oldest)</DropdownItem>
            <DropdownItem key="Date (Newest)">Date (Newest)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  )

  return (
    <div className="not-prose flex justify-center">
      <Table
        removeWrapper
        aria-label="Uploads Table"
        title="Uploads"
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn>RULE NAME</TableColumn>
          <TableColumn>PATH</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            isUploadsError
              ? "An error occurred while fetching uploads."
              : "No uploads to display."
          }
          isLoading={isUploadsLoading || isRulesLoading}
        >
          {!isUploadsLoading &&
            !isRulesLoading &&
            !isUploadsError &&
            !isRulesError &&
            uploads &&
            sortedUploads.map((upload, idx) => (
              <TableRow key={idx}>
                <TableCell>{getRuleName(upload.ruleId)}</TableCell>
                <TableCell>{upload.path}</TableCell>
                <TableCell>{upload.status}</TableCell>
                <TableCell>{upload.date?.toLocaleDateString() ?? ""}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    startContent={<TrashIcon className="w-5 h-5" />}
                    onClick={() => handleDeleteUpload(upload.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
