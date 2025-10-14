import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";

import Home from "./pages/Home";
import Authenticate from "./pages/Authenticate";
import CampaignList from "./pages/Campaign/CampaignList";
import CampaignCreate from "./pages/Campaign/CampaignCreate";
import CompanyCreate from "./pages/Company/CompanyCreate";

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
      <AuthProvider>

        <Router>
          <SidebarProvider>
            <AppSidebar />

            <div className="max-w-7xl flex flex-1 mx-auto p-4 md:p-8 lg:p-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authenticate" element={<Authenticate />} />
                <Route path="/campaigns" element={<CampaignList />} />
                <Route path="/campaigns/create" element={<CampaignCreate />} />
                <Route path="/companies/create" element={<CompanyCreate />} />
              </Routes>
            </div>

          </SidebarProvider>
        </Router>

      </AuthProvider>
    </QueryClientProvider>
  );
}
