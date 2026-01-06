import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "./context/ThemeContext";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { Toaster } from "@/components/ui/sonner"
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import NotApprovedYet from "./pages/NotApprovedYet";

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
import Footer from "./components/AppFooter/AppFooter"

import TicketList from "./pages/Admin/TicketList";
import TicketView from "./pages/Admin/TicketView";

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
              <main className="flex flex-col w-full min-h-screen">
                <AppNavbar />
                <div className="p-4 md:p-8 lg:p-12 flex-grow">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/authenticate" element={<Authenticate />} />
                      <Route path="/not-approved" element={<NotApprovedYet />} />
                      <Route path="/campaigns" element={<CampaignList />} />
                      <Route path="/campaigns/:id" element={<CampaignView />} />

                      <Route
                        path="/campaigns/create"
                        element={
                          <ProtectedRoute requireCompanyActive>
                            <CampaignCreate />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/companies" element={<CompanyList />} />

                      <Route
                        path="/companies/create"
                        element={
                          <ProtectedRoute>
                            <CompanyCreate />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/companies/roles" element={<CompanyRoleManagement />} />
                      <Route path="/companies/employees" element={<Employee />} />
                      <Route path="/companies/permissions" element={<PermissionManagement />} />
                      <Route path="/companies/types" element={<CompanyType />} />
                      <Route path="/tos" element={<TermsOfService />} />
                      <Route path="/tickets" element={<ProtectedRoute requireRole={"ADMIN"}><TicketList /></ProtectedRoute>} />
                      <Route path="/tickets/:id" element={<TicketView />} />
                    </Routes>
                  </div>
                </div>
                <Footer />
              </main>
              <Toaster />
            </SidebarProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
