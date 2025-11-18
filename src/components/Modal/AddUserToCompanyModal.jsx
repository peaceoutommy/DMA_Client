import { useEffect, useState, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Mail, Loader2, Search, X, CheckCircle2, Users } from "lucide-react"
import { useSearchUsersByEmail } from "@/hooks/useUser"
import { useDebounce } from "@/hooks/useDebounce"

const MIN_SEARCH_LENGTH = 3;

export default function AddEmployeeModal({
    open,
    onClose,
    onSave,
    newItem,
    setNewItem,
    roles,
    companyId
}) {
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const debouncedEmail = useDebounce(searchEmail, 300);
    const dropdownRef = useRef(null);

    const { data: users = [], isLoading } = useSearchUsersByEmail(debouncedEmail);

    // Initialize company ID when modal opens
    useEffect(() => {
        if (open && companyId) {
            setNewItem(prev => ({ ...prev, companyId }));
        }
    }, [open, companyId, setNewItem]);

    // Control dropdown visibility
    useEffect(() => {
        setShowDropdown(searchEmail.length >= MIN_SEARCH_LENGTH);
    }, [searchEmail]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setSearchEmail('');
            setSelectedEmployee(null);
            setShowDropdown(false);
        }
    }, [open]);

    const handleSelectUser = (user) => {
        setNewItem(prev => ({ ...prev, employeeId: user.id }));
        setSelectedEmployee(user);
        setSearchEmail('');
        setShowDropdown(false);
    };

    const handleClearSelection = () => {
        setSelectedEmployee(null);
        setNewItem(prev => ({ ...prev, employeeId: null }));
    };

    const handleRoleChange = (value) => {
        setNewItem(prev => ({ ...prev, roleId: parseInt(value) }));
    };

    const isFormValid = newItem?.employeeId && newItem?.roleId;
    const selectedRole = roles?.find(role => role.id === newItem?.roleId);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]">
                {/* Header */}
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">
                                Add Employee
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Search for a user and assign them a role in your company
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="my-4" />

                {/* Form */}
                <div className="space-y-6">
                    {/* Email Search Section */}
                    <div className="space-y-3">
                        <Label htmlFor="email-search" className="text-sm font-semibold flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            Search User
                            <span className="text-destructive">*</span>
                        </Label>

                        {!selectedEmployee ? (
                            <div className="relative" ref={dropdownRef}>
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email-search"
                                    placeholder="Type email address..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    className="h-11 pl-10 pr-4"
                                    autoComplete="off"
                                />

                                {/* Search Dropdown */}
                                {showDropdown && (
                                    <div className="absolute z-50 w-full mt-2 bg-popover border rounded-lg shadow-lg max-h-64 overflow-auto">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Searching users...</span>
                                            </div>
                                        ) : users.length > 0 ? (
                                            <div className="py-2">
                                                {users.map((user, index) => (
                                                    <button
                                                        key={user.id}
                                                        type="button"
                                                        onClick={() => handleSelectUser(user)}
                                                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 group"
                                                    >
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                                                            {user.email.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate group-hover:text-primary transition-colors">
                                                                {user.email}
                                                            </div>
                                                            {user.name && (
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {user.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                    <Search className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium">No users found</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Try a different email address
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Selected User Display */
                            <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-primary/5 to-background p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-lg ring-2 ring-primary/10">
                                        {selectedEmployee.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold truncate">
                                                {selectedEmployee.email}
                                            </p>
                                            <Badge variant="secondary" className="shrink-0">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Selected
                                            </Badge>
                                        </div>
                                        {selectedEmployee.name && (
                                            <p className="text-sm text-muted-foreground truncate">
                                                {selectedEmployee.name}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 h-8 w-8"
                                        onClick={handleClearSelection}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!selectedEmployee && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Mail className="h-3 w-3" />
                                Type at least {MIN_SEARCH_LENGTH} characters to search
                            </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="role" className="text-sm font-semibold flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                            Assign Role
                            <span className="text-destructive">*</span>
                        </Label>

                        <Select
                            value={newItem?.roleId?.toString() || ''}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Choose a role for this employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles && roles.length > 0 ? (
                                    roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.id.toString()}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                {role.name}
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            No roles available
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Create a role first
                                        </p>
                                    </div>
                                )}
                            </SelectContent>
                        </Select>

                        {selectedRole && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                                <span>
                                    Will be assigned as <span className="font-medium text-foreground">{selectedRole.name}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="mt-6 gap-2 sm:gap-2">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="flex-1 sm:flex-none"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={onSave}
                        disabled={!isFormValid}
                        className="flex-1 sm:flex-none"
                    >
                        <UserPlus className="h-4 w-4" />
                        Add Employee
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}