import { useState, useMemo, useCallback } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { UserCard } from "./UserCard"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    useSidebar,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { getMenuItems, filterVisibleItems } from "./menuConfig"

export function AppSidebar() {
    const { open } = useSidebar()
    const { user } = useAuth()
    const location = useLocation()
    // Memoize items to prevent recreation on every render
    const items = useMemo(() => {
        return filterVisibleItems(getMenuItems(user))
    }, [user?.companyId, user?.companyRole])

    // Initialize expanded sections with sections containing the active route (only on mount)
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
        <Sidebar collapsible="icon" className="border-r">
            <SidebarContent className="gap-0">
                {!open && (
                    <div className="border-b">
                        <SidebarTrigger className="hover:bg-accent rounded-md" />
                    </div>
                )}

                <SidebarGroup className="px-3 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <SidebarGroupLabel className="text-lg font-semibold tracking-tight">
                            DMA
                        </SidebarGroupLabel>
                        {open && <SidebarTrigger className="hover:bg-accent rounded-md" />}
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item) => {
                                const isExpanded = expandedSections.has(item.title)
                                const itemIsActive = !item.child && isActive(item.url)

                                return (
                                    <div key={item.title}>
                                        <SidebarMenuItem>
                                            {item.child ? (
                                                <SidebarMenuButton
                                                    onClick={() => toggleExpand(item.title)}
                                                    className="hover:bg-accent transition-colors rounded-lg"
                                                    aria-expanded={isExpanded}
                                                    aria-controls={`submenu-${item.title}`}
                                                >
                                                    <item.icon className="h-5 w-5 shrink-0" />
                                                    <span className="flex-1 font-medium group-data-[collapsible=icon]:hidden">
                                                        {item.title}
                                                    </span>
                                                    {isExpanded ? (
                                                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden transition-transform" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden transition-transform" />
                                                    )}
                                                </SidebarMenuButton>
                                            ) : (
                                                <SidebarMenuButton
                                                    asChild
                                                    className={`hover:bg-accent transition-colors rounded-lg ${itemIsActive ? 'bg-accent text-accent-foreground' : ''
                                                        }`}
                                                    isActive={itemIsActive}
                                                >
                                                    <Link
                                                        to={item.url}
                                                        className="flex items-center gap-2"
                                                        aria-current={itemIsActive ? 'page' : undefined}
                                                    >
                                                        <item.icon className="h-5 w-5 shrink-0" />
                                                        <span className="font-medium group-data-[collapsible=icon]:hidden">
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            )}
                                        </SidebarMenuItem>

                                        {item.child && isExpanded && open && (
                                            <div
                                                id={`submenu-${item.title}`}
                                                className="ml-4 mt-1 mb-2 space-y-0.5 pl-4 border-l-2 border-border"
                                                role="group"
                                                aria-label={`${item.title} submenu`}
                                            >
                                                {item.child.map((child) => {
                                                    const childIsActive = isActive(child.url)

                                                    return (
                                                        <SidebarMenuItem key={child.title}>
                                                            <SidebarMenuButton
                                                                asChild
                                                                className={`hover:bg-accent/50 transition-colors rounded-lg ${childIsActive ? 'bg-accent/50' : ''
                                                                    }`}
                                                                isActive={childIsActive}
                                                            >
                                                                <Link
                                                                    to={child.url}
                                                                    className="flex items-center gap-2 py-2 px-3 text-sm"
                                                                    aria-current={childIsActive ? 'page' : undefined}
                                                                >
                                                                    <child.icon className={`h-4 w-4 shrink-0 transition-colors ${childIsActive ? 'text-foreground' : 'text-muted-foreground'
                                                                        }`} />
                                                                    <span className={`transition-colors ${childIsActive ? 'font-medium text-foreground' : 'text-foreground/80'
                                                                        } hover:text-foreground`}>
                                                                        {child.title}
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <UserCard />
            </SidebarFooter>
        </Sidebar>
    )
}