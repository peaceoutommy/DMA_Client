import { ArrowUpDown, SquarePen, Trash2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <div className="space-y-2">
          <Input
            placeholder="Enter company type name"
            value={editingItem.name}
            autoFocus
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                onSubmitEdit(editingItem);
              } else if (e.key === 'Escape') {
                onCancelEdit();
              }
            }}
          />
          <Textarea
            placeholder="Enter description (optional)"
            value={editingItem.description || ""}
            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                onSubmitEdit(editingItem);
              } else if (e.key === 'Escape') {
                onCancelEdit();
              }
            }}
            className="min-h-[60px] text-sm"
          />
          <div className="text-xs text-muted-foreground">
            Press Ctrl+Enter to save, Esc to cancel
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="font-medium">{row.getValue("name")}</div>
          {row.original.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>{row.original.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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