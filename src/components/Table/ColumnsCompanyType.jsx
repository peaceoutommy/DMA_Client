import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const columnsCompanyType = (
    onEdit,
    onDelete,
    editingItem,
    setEditingItem,
    onSubmitEdit,
    onCancelEdit
) => [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const isEditing = editingItem?.id === row.original.id;

                return isEditing ? (
                    <Input
                        placeholder="Enter company type name"
                        value={editingItem.name}
                        autoFocus
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSubmitEdit(editingItem);
                            } else if (e.key === 'Escape') {
                                onCancelEdit();
                            }
                        }}
                    />
                ) : (
                    <div className="font-medium">{row.getValue("name")}</div>
                );
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
                        onClick={() => onEdit(row.original)}
                    >
                        <SquarePen className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onDelete(row.original)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            ),
        },
    ];