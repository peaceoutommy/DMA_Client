import { Link } from "react-router-dom";
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogIn,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useLogout } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function UserCard({ collapsed = false }) {
    const { user } = useAuth()
    const navigate = useNavigate();
    const logoutMutation = useLogout()

    if (!user) {
        return (
            <Button
                variant="ghost"
                asChild
                className={cn(
                    "w-full justify-start gap-2",
                    collapsed && "justify-center px-2"
                )}
            >
                <Link to="/authenticate">
                    <LogIn className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="font-medium">Log in / Register</span>}
                </Link>
            </Button>
        )
    }

    if (collapsed) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        onMouseEnter={(e) => {
                            const button = e.currentTarget.querySelector('button')
                            button?.click()
                        }}
                    >
                        <Button
                            variant="ghost"
                            className="w-full justify-center p-2"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg select-none">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side="right"
                    align="end"
                    sideOffset={8}
                >
                    <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg select-none">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/profile/${user.id}`)}>
                            <BadgeCheck className="h-4 w-4" />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="h-4 w-4" />
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Bell className="h-4 w-4" />
                            Notifications
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                        <LogOut className="h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-2 px-2 hover:bg-accent"
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg select-none">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={8}
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/profile/${user.id}`)}>
                        <BadgeCheck className="h-4 w-4" />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className="h-4 w-4" />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Bell className="h-4 w-4" />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    <LogOut className="h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}