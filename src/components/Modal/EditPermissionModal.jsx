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
import { Shield, FileText, Tag } from "lucide-react"

export function EditPermissionModal({ open, onClose, onSave, editItem, setEditItem, types }) {
    const isFormValid = editItem?.name?.trim() && editItem?.type;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[500px]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">
                                Edit Permission
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Update permission details and settings
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            Permission Name
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., View Dashboard, Manage Users"
                            value={editItem?.name || ''}
                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
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
                            value={editItem?.description || ''}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
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
                            value={editItem?.type || ''}
                            onValueChange={(value) => setEditItem({ ...editItem, type: value })}
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
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}