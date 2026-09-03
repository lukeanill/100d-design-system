import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { historyEntries, type HistoryEntry, type HistoryStatus } from "./history-data"

type TypeFilter = "all" | HistoryEntry["kind"]

const STATUS_VARIANT: Record<HistoryStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Approved: "default",
  Issue: "outline",
  Removed: "destructive",
  Pending: "secondary",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function History() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")

  const entries = useMemo(() => {
    const sorted = [...historyEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return typeFilter === "all" ? sorted : sorted.filter((entry) => entry.kind === typeFilter)
  }, [typeFilter])

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">History</h1>
          <p className="text-secondary-foreground text-sm">
            Every component, style, and theme change made to this design system.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link to="/">Back to preview</Link>} />
      </div>

      <div className="flex items-center gap-2">
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="Component">Component</SelectItem>
            <SelectItem value="Style">Style</SelectItem>
            <SelectItem value="Theme">Theme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.name}>
                <TableCell className="max-w-64 truncate font-medium" title={entry.name}>
                  {entry.name}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{entry.kind}</span>
                  <span className="text-secondary-foreground text-xs"> · {entry.change}</span>
                </TableCell>
                <TableCell className="text-sm text-secondary-foreground whitespace-nowrap">
                  {formatDate(entry.date)}
                </TableCell>
                <TableCell>
                  <Link to={entry.previewLink} className="text-sm text-primary underline underline-offset-2">
                    Preview
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[entry.status]}>{entry.status}</Badge>
                </TableCell>
                <TableCell>
                  {entry.sourceUrl ? (
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline underline-offset-2"
                    >
                      Link
                    </a>
                  ) : (
                    <span className="text-secondary-foreground text-sm">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
