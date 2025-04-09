
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useWebSocket } from "@/services/websocketService";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Setup WebSocket simulation for real-time updates
  useWebSocket();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
