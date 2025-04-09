
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppContext";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import CryptoPage from "./pages/CryptoPage";
import CryptoDetailPage from "./pages/CryptoDetailPage";
import WeatherPage from "./pages/WeatherPage";
import WeatherDetailPage from "./pages/WeatherDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/crypto" element={<CryptoPage />} />
              <Route path="/crypto/:coinId" element={<CryptoDetailPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/weather/:cityName" element={<WeatherDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
