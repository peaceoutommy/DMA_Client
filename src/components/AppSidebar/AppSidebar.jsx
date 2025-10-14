import { Home, BookText } from "lucide-react"
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
    SidebarTrigger
} from "@/components/ui/sidebar"


const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Campaigns", url: "/campaigns", icon: BookText },
]

export function AppSidebar() {
    const { open } = useSidebar()

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* Trigger for collapsed state - OUTSIDE SidebarGroup */}
                {!open && (
                    <div className="p-2">
                        <SidebarTrigger />
                    </div>
                )}

                <SidebarGroup>
                    {/* Trigger for expanded state - INSIDE SidebarGroup */}
                    <div className="flex justify-between py-2">
                        <SidebarGroupLabel>DMA</SidebarGroupLabel>
                        <SidebarTrigger />
                    </div>
                    
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <UserCard />
            </SidebarFooter>
        </Sidebar>
    )
}