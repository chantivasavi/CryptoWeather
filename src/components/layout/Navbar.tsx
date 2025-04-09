
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppContext } from "@/store/AppContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notifications, clearAllNotifications } = useAppContext();
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            CryptoWeather
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden text-foreground p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/crypto" className="text-foreground hover:text-primary transition-colors">
            Crypto
          </Link>
          <Link to="/weather" className="text-foreground hover:text-primary transition-colors">
            Weather
          </Link>
          <Popover>
            <PopoverTrigger className="relative">
              <Bell className="text-foreground hover:text-primary transition-colors" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                  {notifications.length}
                </Badge>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Notifications</h3>
                <button 
                  onClick={clearAllNotifications}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="p-3 border rounded-md bg-card text-sm"
                    >
                      <p className="font-medium">
                        {notification.type === "price_alert" ? "Price Alert" : "Weather Alert"}
                      </p>
                      <p className="text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background pt-16 px-4 animate-fade-in">
          <nav className="flex flex-col gap-6 p-4">
            <Link 
              to="/" 
              className="text-foreground text-xl py-2 border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/crypto" 
              className="text-foreground text-xl py-2 border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Crypto
            </Link>
            <Link 
              to="/weather" 
              className="text-foreground text-xl py-2 border-b border-border"
              onClick={() => setIsMenuOpen(false)}
            >
              Weather
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
