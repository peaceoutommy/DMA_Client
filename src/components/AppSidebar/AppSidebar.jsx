import { useState } from "react"
import { Home, BookText, BookPlus, ChevronDown, ChevronRight, Building2 } from "lucide-react"
import { Link } from "react-router-dom"
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

const items = [
    { title: "Home", url: "/", icon: Home },
    {
        title: "Campaigns",
        url: "/campaigns",
        icon: BookText,
        child: [
            { title: "List", url: "/campaigns", icon: BookText },
            { title: "Create", url: "/campaigns/create", icon: BookPlus },
        ],
    },
    {
        title: "Companies",
        url: "/companies",
        icon: Building2,
        child: [
            { title: "List", url: "/companies", icon: Building2 },
            { title: "Create", url: "/companies/create", icon: Building2 },
            { title: "Types", url: "/companies/types", icon: Building2 },
        ],
    },
]

export function AppSidebar() {
    const { open } = useSidebar()
    const [expanded, setExpanded] = useState(null)

    const toggleExpand = (title) => {
        setExpanded(expanded === title ? null : title)
    }

    return (
        <Sidebar collapsible="icon" className="border-r">
            <SidebarContent className="gap-0">
                {/* Trigger for collapsed state */}
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
                            {items.map((item) => (
                                <div key={item.title}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild={!item.child}
                                            onClick={() => item.child && toggleExpand(item.title)}
                                            className="hover:bg-accent transition-colors rounded-lg"
                                        >
                                            {item.child ? (
                                                <button className="flex items-center w-full gap-2 text-left py-2.5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center">
                                                    <item.icon className="h-5 w-5 shrink-0" />
                                                    <span className="flex-1 font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                    {(expanded === item.title ? (
                                                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                                                    ))}
                                                </button>
                                            ) : (
                                                <Link 
                                                    to={item.url}
                                                    className="flex items-center gap-2 py-2.5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center"
                                                >
                                                    <item.icon className="h-5 w-5 shrink-0" />
                                                    <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                </Link>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    {/* Render child items when expanded with animation */}
                                    {item.child && expanded === item.title && open && (
                                        <div className="ml-4 mt-1 mb-2 space-y-0.5 pl-4 border-l-2 border-border">
                                            {item.child.map((child) => (
                                                <SidebarMenuItem key={child.title}>
                                                    <SidebarMenuButton 
                                                        asChild
                                                        className="hover:bg-accent/50 transition-colors rounded-lg"
                                                    >
                                                        <Link 
                                                            to={child.url} 
                                                            className="flex items-center gap-2 py-2 px-3 text-sm"
                                                        >
                                                            <child.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                            <span className="text-muted-foreground hover:text-foreground transition-colors">
                                                                {child.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
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