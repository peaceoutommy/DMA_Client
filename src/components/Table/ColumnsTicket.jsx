import { useNavigate } from "react-router-dom"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/utils/date"

export const columnsTicket = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="font-medium">{row.original.status}</div>,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) =>
      row.original.message === null ? (
        <div className="font-medium">-</div>
      ) : (
        <div className="font-medium">{row.original.message}</div>
      ),
  },
  {
    accessorKey: "createDate",
    header: "Created At",
    cell: ({ row }) => (
      <div className="font-medium">{formatDateTime(row.original.createDate)}</div>
    ),
  },
  {
    accessorKey: "closeDate",
    header: "Closed At",
    cell: ({ row }) =>
      row.original.closeDate === null ? (
        <div className="font-medium">-</div>
      ) : (
        <div className="font-medium">{formatDateTime(row.original.closeDate)}</div>
      ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate()
      const id = row.original.id // reliably get the ticket ID

      return (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:text-blue-700"
            onClick={() => navigate(`/tickets/${id}`)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
        </div>
      )
    },
  },
]
