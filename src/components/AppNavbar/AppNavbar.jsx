import { Button } from '@/components/ui/button';
import { Wallet, Bell } from "lucide-react";
import ThemeToggle from '../ThemeToggle';
import { SidebarTrigger } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/useMobile';

export default function AppNavbar() {

    const isMobile = useIsMobile();

    return (
        <nav className="w-full bg-sidebar border-b z-10 sticky top-0">
            <div className="flex items-center justify-end h-12 px-6">

                {/* Right side icons */}
                {isMobile ?
                    <div className="flex w-full justify-between items-center gap-2">
                        <SidebarTrigger className="hover:bg-accent rounded-md" />
                        <div>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                            </Button>

                            <Button variant="ghost" size="icon">
                                <Wallet className="h-5 w-5" />
                            </Button>

                            <ThemeToggle />
                        </div>
                    </div>
                    :
                    <div className="flex justify-end items-center gap-2">
                        <div>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                            </Button>

                            <Button variant="ghost" size="icon">
                                <Wallet className="h-5 w-5" />
                            </Button>

                            <ThemeToggle />
                        </div>
                    </div>
                }
            </div>
        </nav>
    );
}