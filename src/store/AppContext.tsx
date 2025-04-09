
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

// Define the types for our context
type CryptoFavorite = {
  id: string;
  name: string;
};

type CityFavorite = {
  name: string;
  country?: string;
};

type NotificationType = "price_alert" | "weather_alert";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}

interface AppContextType {
  favoriteCryptos: CryptoFavorite[];
  favoriteCities: CityFavorite[];
  notifications: Notification[];
  addFavoriteCrypto: (crypto: CryptoFavorite) => void;
  removeFavoriteCrypto: (id: string) => void;
  addFavoriteCity: (city: CityFavorite) => void;
  removeFavoriteCity: (name: string) => void;
  addNotification: (type: NotificationType, message: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  favoriteCryptos: [],
  favoriteCities: [],
  notifications: [],
  addFavoriteCrypto: () => {},
  removeFavoriteCrypto: () => {},
  addFavoriteCity: () => {},
  removeFavoriteCity: () => {},
  addNotification: () => {},
  clearNotification: () => {},
  clearAllNotifications: () => {},
});

// Local storage keys
const FAVORITE_CRYPTOS_KEY = "favorite_cryptos";
const FAVORITE_CITIES_KEY = "favorite_cities";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from local storage or defaults
  const [favoriteCryptos, setFavoriteCryptos] = useState<CryptoFavorite[]>(() => {
    const saved = localStorage.getItem(FAVORITE_CRYPTOS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return []; // Default if no favorites are saved
  });

  const [favoriteCities, setFavoriteCities] = useState<CityFavorite[]>(() => {
    const saved = localStorage.getItem(FAVORITE_CITIES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default cities if none saved
    return [
      { name: "New York", country: "US" },
      { name: "London", country: "GB" },
      { name: "Tokyo", country: "JP" },
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Save to local storage whenever favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITE_CRYPTOS_KEY, JSON.stringify(favoriteCryptos));
  }, [favoriteCryptos]);

  useEffect(() => {
    localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  // Functions to modify state
  const addFavoriteCrypto = (crypto: CryptoFavorite) => {
    if (!favoriteCryptos.some((c) => c.id === crypto.id)) {
      setFavoriteCryptos([...favoriteCryptos, crypto]);
      toast.success(`Added ${crypto.name} to favorites`);
    }
  };

  const removeFavoriteCrypto = (id: string) => {
    const crypto = favoriteCryptos.find((c) => c.id === id);
    setFavoriteCryptos(favoriteCryptos.filter((c) => c.id !== id));
    if (crypto) {
      toast.success(`Removed ${crypto.name} from favorites`);
    }
  };

  const addFavoriteCity = (city: CityFavorite) => {
    if (!favoriteCities.some((c) => c.name.toLowerCase() === city.name.toLowerCase())) {
      setFavoriteCities([...favoriteCities, city]);
      toast.success(`Added ${city.name} to favorites`);
    }
  };

  const removeFavoriteCity = (name: string) => {
    setFavoriteCities(favoriteCities.filter((c) => c.name !== name));
    toast.success(`Removed ${name} from favorites`);
  };

  const addNotification = (type: NotificationType, message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep only last 10 notifications
    
    // Show a toast for the new notification
    type === "price_alert"
      ? toast.info(message, { id: `price-${notification.id}` })
      : toast.warning(message, { id: `weather-${notification.id}` });
  };

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    favoriteCryptos,
    favoriteCities,
    notifications,
    addFavoriteCrypto,
    removeFavoriteCrypto,
    addFavoriteCity,
    removeFavoriteCity,
    addNotification,
    clearNotification,
    clearAllNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
