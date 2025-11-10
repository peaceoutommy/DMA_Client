import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Separator } from "@/components/ui/separator"
import { Shield, FileText, Tag, Plus, ShieldPlus } from "lucide-react"

export function AddPermissionModal({ open, onClose, onSave, newItem, setNewItem, types }) {
    const isFormValid = newItem?.name?.trim() && newItem?.type;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">
                                Add Permission
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Create a new permission for role management
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                            <ShieldPlus className="h-4 w-4 text-muted-foreground" />
                            Permission Name
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., View Dashboard, Manage Users"
                            value={newItem?.name || ''}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe what this permission allows..."
                            value={newItem?.description || ''}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="type" className="text-sm font-semibold flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            Type
                            <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={newItem?.type || ''}
                            onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select a permission type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types && types.length > 0 ? (
                                    types.map((type) => (
                                        <SelectItem key={type} value={type} className="cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                {type}
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No types available
                                        </p>
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="mt-6 gap-2 sm:gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={onSave} 
                        disabled={!isFormValid}
                        className="flex-1 sm:flex-none"
                    >
                        <Plus className="h-4 w-4" />
                        Add Permission
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}