import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CreateResourcePage from "./pages/CreateResourcePage";
import DashboardPage from "./pages/DashboardPage";
import ResourceCatalogPage from "./pages/ResourceCatalogPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import ResourceListPage from "./pages/ResourceListPage";
import ProfilePage from "./pages/ProfilePage"; // Import the new ProfilePage
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-resource" element={<CreateResourcePage />} />
          <Route path="/resource-catalog" element={<ResourceCatalogPage />} />
          <Route path="/resource-detail" element={<ResourceDetailPage />} />
          <Route path="/resource-list" element={<ResourceListPage />} />
          <Route path="/account-settings" element={<ProfilePage />} /> {/* Add route for ProfilePage */}
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;