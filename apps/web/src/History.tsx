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
import { historyEntries, type HistoryStatus } from "./history-data"

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
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">History</h1>
          <p className="text-muted-foreground text-sm">
            Every component, style, and theme change made to this design system.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link to="/">Back to preview</Link>} />
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyEntries.map((entry) => (
              <TableRow key={entry.name}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>
                  <span className="text-sm">{entry.kind}</span>
                  <span className="text-muted-foreground text-xs"> · {entry.change}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
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
                    <span className="text-muted-foreground text-sm">—</span>
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
