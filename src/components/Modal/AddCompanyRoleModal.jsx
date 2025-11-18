import { useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, Plus, LockKeyhole } from "lucide-react"

export function AddCompanyRoleModal({ open, onClose, onSave, newItem, setNewItem, permissions, companyId }) {

    useEffect(() => {
        if (open && companyId) {
            setNewItem(prev => ({ ...prev, companyId: companyId }));
        }
    }, [open, companyId, setNewItem]);

    const selectedCount = newItem?.permissionIds?.length || 0;
    const isFormValid = newItem?.name?.trim();

    const handlePermissionToggle = (permissionId) => {
        const currentPermissions = newItem?.permissionIds || [];

        if (currentPermissions.includes(permissionId)) {
            setNewItem({
                ...newItem,
                permissionIds: currentPermissions.filter(id => id !== permissionId)
            });
        } else {
            setNewItem({
                ...newItem,
                permissionIds: [...currentPermissions, permissionId]
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">
                                Create Company Role
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Define a new role and assign permissions
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-6">
                    {/* Role Name Input */}
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            Role Name
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Manager, Employee, Administrator"
                            value={newItem?.name || ''}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-11"
                        />
                    </div>

                    {/* Permissions Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                            <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                            Assign Permissions
                        </Label>
                        
                        <ScrollArea className="h-[280px] rounded-md border bg-muted/20">
                            <div className="p-4">
                                <div className="space-y-4">
                                    {permissions && permissions.length > 0 ? (
                                        permissions.map((permission, index) => (
                                            <div key={permission.id}>
                                                <div className="flex items-center justify-between gap-4 py-2">
                                                    <div className="flex-1 space-y-1">
                                                        <Label
                                                            htmlFor={`permission-${permission.id}`}
                                                            className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {permission.name}
                                                        </Label>
                                                        {permission.description && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {permission.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Switch
                                                        id={`permission-${permission.id}`}
                                                        checked={newItem?.permissionIds?.includes(permission.id) || false}
                                                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                    />
                                                </div>
                                                {index < permissions.length - 1 && (
                                                    <Separator className="mt-2" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                                                <Shield className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                No permissions available
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Create permissions first to assign them
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>

                        {selectedCount > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                                <Check className="h-3 w-3 text-primary" />
                                <span>
                                    This role will have access to <span className="font-medium text-foreground">{selectedCount}</span> permission{selectedCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
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
                        Create Role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}