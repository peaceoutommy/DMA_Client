import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"

export function EditCompanyTypeModal({ open, onClose, onSave, editItem, setEditItem }) {
    return (

        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[425px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Edit company type</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Public Limited Company"
                            value={editItem != null ? editItem.name : ''}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Public Limited Company"
                            value={editItem != null ? editItem.description : ''}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                        />
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