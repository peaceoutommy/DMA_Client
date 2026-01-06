import { useState, useMemo, useCallback } from "react"
import { ChevronDown, ChevronRight, Menu } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { UserCard } from "./UserCard"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { getMenuItems, filterVisibleItems } from "./menuConfig"

export function AppSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { user } = useAuth()
    const location = useLocation()

    // Memoize items to prevent recreation on every render
    const items = useMemo(() => {
        return filterVisibleItems(getMenuItems(user))
    }, [user?.companyId, user?.companyRole])

    // Initialize expanded sections with sections containing the active route
    const [expandedSections, setExpandedSections] = useState(() => {
        const initialExpanded = new Set()
        const menuItems = filterVisibleItems(getMenuItems(user))
        menuItems.forEach((item) => {
            if (item.child) {
                const hasActiveChild = item.child.some(
                    (child) => location.pathname === child.url
                )
                if (hasActiveChild) {
                    initialExpanded.add(item.title)
                }
            }
        })
        return initialExpanded
    })

    const toggleExpand = useCallback((title) => {
        setExpandedSections((prev) => {
            const next = new Set(prev)
            if (next.has(title)) {
                next.delete(title)
            } else {
                next.add(title)
            }
            return next
        })
    }, [])

    const isActive = useCallback((url) => {
        return location.pathname === url
    }, [location.pathname])

    return (
        <div
            className={cn(
                "sticky top-0 flex flex-col h-screen border-r bg-background transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-2">
                {!isCollapsed && (
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        DMA
                    </h1>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-8 w-8 hover:bg-accent"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-2">
                    {items.map((item) => {
                        const isExpanded = expandedSections.has(item.title)
                        const itemIsActive = !item.child && isActive(item.url)

                        return (
                            <div key={item.title}>
                                {/* Main Menu Item */}
                                {item.child ? (
                                    isCollapsed ? (
                                        // Collapsed with dropdown
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
                                                        className="w-full justify-center"
                                                    >
                                                        <item.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="right" align="start" className="w-48">
                                                <div className="px-2 py-1.5 text-sm font-semibold">
                                                    {item.title}
                                                </div>
                                                {item.child.map((child) => {
                                                    const childIsActive = isActive(child.url)
                                                    return (
                                                        <DropdownMenuItem key={child.title} asChild>
                                                            <Link
                                                                to={child.url}
                                                                className={cn(
                                                                    "flex items-center gap-2 cursor-pointer",
                                                                    childIsActive && "bg-primary/10 text-primary font-medium"
                                                                )}
                                                            >
                                                                <child.icon className={cn(
                                                                    "h-4 w-4",
                                                                    childIsActive ? "text-primary" : "text-muted-foreground"
                                                                )} />
                                                                <span>{child.title}</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        // Expanded with inline children
                                        <Button
                                            variant="ghost"
                                            onClick={() => toggleExpand(item.title)}
                                            className="w-full justify-start gap-3 font-medium transition-colors hover:bg-accent"
                                        >
                                            <item.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                                            <span className="flex-1 text-left">{item.title}</span>
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                                            )}
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            "w-full justify-start gap-3 font-medium transition-colors hover:bg-accent",
                                            isCollapsed && "justify-center",
                                            itemIsActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                                        )}
                                    >
                                        <Link to={item.url}>
                                            <item.icon className={cn(
                                                "h-5 w-5 shrink-0",
                                                itemIsActive ? "text-primary" : "text-muted-foreground"
                                            )} />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </Link>
                                    </Button>
                                )}

                                {/* Submenu Items (only when expanded) */}
                                {item.child && isExpanded && !isCollapsed && (
                                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary/20 pl-4">
                                        {item.child.map((child) => {
                                            const childIsActive = isActive(child.url)

                                            return (
                                                <Button
                                                    key={child.title}
                                                    variant="ghost"
                                                    asChild
                                                    className={cn(
                                                        "w-full justify-start gap-2.5 text-sm font-normal hover:bg-accent/60 relative",
                                                        childIsActive && "bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary font-medium"
                                                    )}
                                                >
                                                    <Link to={child.url}>
                                                        <child.icon className={cn(
                                                            "h-4 w-4 shrink-0",
                                                            childIsActive ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t bg-muted/30 p-2">
                <UserCard collapsed={isCollapsed} />
            </div>
        </div>
    )
}