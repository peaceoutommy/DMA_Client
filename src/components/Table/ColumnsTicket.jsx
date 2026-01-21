import { useNavigate } from "react-router-dom"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/utils/date"
import { Badge } from "../ui/badge"

export const columnsTicket = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium min-w-[150px]">{row.original.name}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge className="font-medium">{row.original.status}</Badge>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) =>
      row.original.message === null ? (
        <div className="font-medium">-</div>
      ) : (
        <div
          className="font-medium max-w-[200px] truncate" // ← Reduced from 300px
          title={row.original.message}
        >{row.original.message}</div>
      ),
  },
  {
    accessorKey: "additionalInfo",
    header: "Extra info",
    cell: ({ row }) =>
      row.original.additionalInfo === null ? (
        <div className="font-medium">-</div>
      ) : (
        <div
          className="font-medium max-w-[200px] truncate" // ← Reduced from 300px
          title={row.original.additionalInfo}
        >{row.original.additionalInfo}</div>
      ),
  },
  {
    accessorKey: "createDate",
    header: "Created",  // ← Shorter header
    cell: ({ row }) => (
      <div className="font-medium whitespace-nowrap">{formatDateTime(row.original.createDate)}</div>
    ),
  },
  {
    accessorKey: "closeDate",
    header: "Closed",  // ← Shorter header
    cell: ({ row }) =>
      row.original.closeDate === null ? (
        <div className="font-medium">-</div>
      ) : (
        <div className="font-medium whitespace-nowrap">{formatDateTime(row.original.closeDate)}</div>
      ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate()
      const id = row.original.id

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:text-blue-700"
          onClick={() => navigate(`/tickets/${id}`)}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
      )
    },
  },
]
