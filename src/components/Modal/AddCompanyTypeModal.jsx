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
import { Textarea } from "../ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Building2, FileText, Plus } from "lucide-react"

export function AddCompanyTypeModal({ open, onClose, onSave, newItem, setNewItem }) {
    const isFormValid = newItem?.name?.trim();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">
                                Add Company Type
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Create a new company type for your organization
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            Name
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Public Limited Company, LLC"
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
                            placeholder="Describe this company type..."
                            value={newItem?.description || ''}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="min-h-[100px] resize-none"
                        />
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
                        Add Company Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}