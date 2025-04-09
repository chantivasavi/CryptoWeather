
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, StarIcon, MapPin, Droplets, Wind, Sun, Thermometer } from "lucide-react";
import { fetchWeatherData, WeatherData } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WeatherDetailPage = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { favoriteCities, addFavoriteCity, removeFavoriteCity } = useAppContext();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isFavorite = favoriteCities.some(
    (c) => c.name.toLowerCase() === cityName?.toLowerCase()
  );

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!cityName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchWeatherData(cityName);
        setWeatherData(data);
      } catch (err) {
        setError(`Failed to load weather data for ${cityName}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadWeatherData();
  }, [cityName]);

  const handleFavoriteClick = () => {
    if (!cityName || !weatherData) return;
    
    if (isFavorite) {
      removeFavoriteCity(cityName);
    } else {
      addFavoriteCity({
        name: weatherData.cityName,
        country: weatherData.country,
      });
    }
  };

  if (!cityName) {
    navigate("/weather");
    return null;
  }

  // Helper to get appropriate weather icon
  const getWeatherIcon = () => {
    if (!weatherData) return null;
    
    const { description } = weatherData;
    if (description.includes("rain") || description.includes("drizzle")) {
      return <Droplets className="w-24 h-24 text-blue-400" />;
    } else if (description.includes("cloud")) {
      return <Wind className="w-24 h-24 text-gray-400" />;
    }
    return <Sun className="w-24 h-24 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="outline" 
        onClick={() => navigate("/weather")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Weather
      </Button>

      {loading ? (
        <div className="space-y-4">
          <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-80 bg-muted rounded animate-pulse"></div>
            <div className="h-80 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => navigate("/weather")} 
            className="mt-4"
          >
            Return to Weather Page
          </Button>
        </div>
      ) : weatherData ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {weatherData.cityName}, {weatherData.country}
                </h1>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleFavoriteClick}
              className={cn(
                isFavorite && "bg-yellow-900/20 border-yellow-600/30"
              )}
            >
              <StarIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                )}
              />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Weather */}
            <Card>
              <CardHeader>
                <CardTitle>Current Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  {getWeatherIcon()}
                  <h2 className="text-5xl font-bold mt-4">{Math.round(weatherData.temp)}°C</h2>
                  <p className="text-xl capitalize mt-2">{weatherData.description}</p>
                  <p className="text-muted-foreground mt-1">
                    Feels like {Math.round(weatherData.feels_like)}°C
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </CardFooter>
            </Card>

            {/* Weather Details */}
            <Card>
              <CardHeader>
                <CardTitle>Weather Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg">
                    <Thermometer className="h-8 w-8 text-orange-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Feels Like</p>
                    <p className="text-xl font-semibold">{weatherData.feels_like}°C</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg">
                    <Droplets className="h-8 w-8 text-blue-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-xl font-semibold">{weatherData.humidity}%</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg">
                    <Wind className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="text-xl font-semibold">{weatherData.wind_speed} m/s</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg">
                    <Sun className="h-8 w-8 text-yellow-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="text-xl font-semibold capitalize">{weatherData.description}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-center text-sm">
                    Weather data provided by OpenWeatherMap API.
                    <br />
                    Forecasts may not be available in the demo version.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Local Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This demo shows current weather data for {weatherData.cityName}. In a production environment,
                this section would include historical weather data, forecasts, and location-specific information.
              </p>
              <p className="text-muted-foreground">
                For demonstration purposes, the weather data is refreshed when you revisit the page
                or manually search for the city again from the Weather page.
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
};

export default WeatherDetailPage;
