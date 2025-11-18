import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "./context/ThemeContext";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { Toaster } from "@/components/ui/sonner"

import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import CampaignList from "./pages/Campaign/CampaignList";
import CampaignCreate from "./pages/Campaign/CampaignCreate";

import CompanyList from "./pages/Company/CompanyList";
import CompanyCreate from "./pages/Company/CompanyCreate";
import CompanyRoleManagement from "./pages/Company/CompanyRoleManagement";
import Employee from "./pages/Company/EmployeeManagement";

import CompanyType from "./pages/Admin/CompanyType";
import PermissionManagement from "./pages/Admin/PermissionManagement";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import TermsOfService from "./pages/TermsOfService";
import CampaignView from "./pages/Campaign/CampaignView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full">
                <AppNavbar />
                <div className="p-4 md:p-8 lg:p-12">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/authenticate" element={<Authenticate />} />
                      <Route path="/campaigns" element={<CampaignList />} />
                      <Route path="/campaigns/:id" element={<CampaignView />} />
                      <Route path="/campaigns/create" element={<CampaignCreate />} />
                      <Route path="/companies" element={<CompanyList />} />
                      <Route path="/companies/create" element={<CompanyCreate />} />
                      <Route path="/companies/roles" element={<CompanyRoleManagement />} />
                      <Route path="/companies/employees" element={<Employee />} />
                      <Route path="/companies/permissions" element={<PermissionManagement />} />
                      <Route path="/companies/types" element={<CompanyType />} />
                      <Route path="/tos" element={<TermsOfService />} />
                    </Routes>
                  </div>
                </div>
              </main>
              <Toaster />
            </SidebarProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
