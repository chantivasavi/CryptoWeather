
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { fetchWeatherData, WeatherData } from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to get user's local weather based on geolocation
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // For this demo, we'll use a default city since the API doesn't support
              // latitude/longitude in the free tier
              const defaultCity = "Delhi"; // You can change this to any default city
              const data = await fetchWeatherData(defaultCity);
              setLocalWeather(data);
            } catch (error) {
              console.error("Error fetching local weather:", error);
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoading(false);
            // Silently fail, no need to show an error toast for this
          }
        );
      } else {
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  return <Dashboard />;
};

export default Index;
