import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function EditPermissionModal({ open, onClose, onSave, editItem, setEditItem, types }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[425px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Edit permission</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="View Dashboard"
                            value={editItem?.name || ''}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Allows user to view the dashboard"
                            value={editItem?.description || ''}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={editItem?.type || ''}
                            onValueChange={(value) => setEditItem({ ...editItem, type: value })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types?.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}