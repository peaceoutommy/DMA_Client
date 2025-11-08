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
import { Shield, Check } from "lucide-react"

export function AddCompanyRoleModal({ open, onClose, onSave, newItem, setNewItem, permissions, companyId }) {

    // ADD DEBOUNCE LATER

    
    useEffect(() => {
        if (open && companyId) {
            setNewItem(prev => ({ ...prev, companyId: companyId }));
        }
    }, [open, companyId]);

    const selectedCount = newItem?.permissionIds?.length || 0;

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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Create Company Role</DialogTitle>
                            <DialogDescription className="text-sm">
                                Define a new role and assign permissions
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-2" />

                <div className="grid gap-6 pb-4">
                    {/* Role Name Input */}
                    <div className="grid gap-3">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Role Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Manager, Employee, Administrator"
                            value={newItem?.name || ''}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-10"
                        />
                    </div>

                    {/* Permissions Section */}
                    <div className="grid gap-3">
                        <ScrollArea className="h-[280px] rounded-md border">
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
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Shield className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                No permissions available
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>

                        {selectedCount > 0 && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                                <Check className="h-3 w-3 text-green-600" />
                                <span>
                                    This role will have access to {selectedCount} permission{selectedCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onSave}
                        disabled={!newItem?.name?.trim()}
                        className="w-full sm:w-auto"
                    >
                        Create Role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}