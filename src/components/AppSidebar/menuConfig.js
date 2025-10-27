import { Home, BookText, BookPlus, ChevronDown, ChevronRight, Building2 } from "lucide-react"

export const getMenuItems = (user) => {
    const isAdmin = user?.role === "ADMIN";
    const isCompanyAccount = user?.role === "COMPANY_ACCOUNT";
    const hasCompany = !!user?.companyId;
    const isOwner = user?.companyRole === "OWNER";

    return [
        { title: "Home", url: "/", icon: Home, visible: true },
        {
            title: "Campaigns",
            url: "/campaigns",
            icon: BookText,
            visible: true,
            child: [
                { title: "List", url: "/campaigns", icon: BookText, visible: true },
                { title: "Create", url: "/campaigns/create", icon: BookPlus, visible: hasCompany },
            ],
        },
        {
            title: "Companies",
            url: "/companies",
            icon: Building2,
            visible: true,
            child: [
                { title: "List", url: "/companies", icon: Building2, visible: true },
                { title: "Create", url: "/companies/create", icon: Building2, visible: isCompanyAccount || isAdmin },
                { title: "Types", url: "/companies/types", icon: Building2, visible: isAdmin },
            ],
        },
        {
            title: "Manage company",
            url: `/companies/${user?.companyId}/manage`,
            icon: Building2,
            visible: isOwner,
            child: [
                { title: "Employees", url: `/companies/${user?.companyId}/employees`, icon: Building2, visible: hasCompany },
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