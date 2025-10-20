import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columnsCompany = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const type = row.getValue("type");
            return <div className="font-medium">{type.name}</div>;
        },
    },
    {
        accessorKey: "taxId",
        header: "Tax ID",
        cell: ({ row }) => {
            const taxId = row.getValue("taxId")
            return (
                <div className="font-mono">{taxId}</div>
            )
        },
    },
    {
        accessorKey: "registrationNumber",
        header: "Registration Number",
        cell: ({ row }) => {
            const registrationNumber = row.getValue("registrationNumber")
            return (
                <div className="font-mono">{registrationNumber}</div>
            )
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                   
                >
                    <SquarePen className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                </Button>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </div>
        ),
    },

]