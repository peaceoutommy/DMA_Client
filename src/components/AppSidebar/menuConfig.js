import { Home, BookText, BookPlus, Building2, FolderLock } from "lucide-react"

export const getMenuItems = (user) => {
    const isAdmin = user?.role === "ADMIN";
    const isCompanyAccount = user?.role === "COMPANY_ACCOUNT";
    const hasCompany = !!user?.companyId;
    const isOwner = user?.companyRole === "OWNER";

    return [
        { title: "Home", url: "/", icon: Home, visible: true },
        {
            title: "Campaigns",
            icon: BookText,
            visible: true,
            child: [
                { title: "List", url: "/campaigns", icon: BookText, visible: true },
                { title: "Create", url: "/campaigns/create", icon: BookPlus, visible: hasCompany },
            ],
        },
        {
            title: "Companies",
            icon: Building2,
            visible: user,
            child: [
                { title: "Profile", url: `/companies/${user?.companyId}`, icon: Building2, visible: hasCompany },
                { title: "List", url: "/companies", icon: Building2, visible: true },
                { title: "Create", url: "/companies/create", icon: Building2, visible: isCompanyAccount },
            ],
        },
        {
            title: "Manage company",
            icon: Building2,
            visible: hasCompany,
            child: [
                { title: "Roles", url: `/companies/roles`, icon: Building2, visible: hasCompany },
                { title: "Employees", url: `/companies/employees`, icon: Building2, visible: hasCompany },
            ],
        },
        {
            title: "Admin",
            icon: FolderLock,
            visible: isAdmin,
            child: [
                { title: "Company Types", url: "/companies/types", icon: Building2, visible: isAdmin },
                { title: "Permissions", url: "/companies/permissions", icon: Building2, visible: isAdmin },
                { title: "Tickets", url: "/tickets", icon: Building2, visible: isAdmin },
            ],
        }
    ]
};

export const filterVisibleItems = (items) => {
    return items
        .filter(item => item.visible)
        .map(item => {
            if (item.child) {
                const visibleChildren = item.child.filter(child => child.visible);
                return {
                    ...item,
                    child: visibleChildren.length > 0 ? visibleChildren : undefined,
                };
            }
            return item;
        })
        .filter(item => !item.child || item.child.length > 0);
};