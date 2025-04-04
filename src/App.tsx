
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import LipinskiPage from "./pages/LipinskiPage";
import BindingPage from "./pages/BindingPage";
import AdmetPage from "./pages/AdmetPage";
import NotFound from "./pages/NotFound";

// Import layout
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/lipinski" element={<LipinskiPage />} />
            <Route path="/binding" element={<BindingPage />} />
            <Route path="/admet" element={<AdmetPage />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
