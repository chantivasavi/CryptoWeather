
import { CloudRainIcon, CloudSunIcon, StarIcon, ThermometerIcon, WindIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { WeatherData } from "@/services/api";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WeatherCardProps {
  weatherData: WeatherData;
}

export function WeatherCard({ weatherData }: WeatherCardProps) {
  const { favoriteCities, addFavoriteCity, removeFavoriteCity } = useAppContext();
  const isFavorite = favoriteCities.some(
    (c) => c.name.toLowerCase() === weatherData.cityName.toLowerCase()
  );

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavoriteCity(weatherData.cityName);
    } else {
      addFavoriteCity({
        name: weatherData.cityName,
        country: weatherData.country,
      });
    }
  };

  // Helper to get appropriate weather icon
  const getWeatherIcon = () => {
    const { description } = weatherData;
    if (description.includes("rain") || description.includes("drizzle")) {
      return <CloudRainIcon className="w-10 h-10 text-blue-400" />;
    }
    return <CloudSunIcon className="w-10 h-10 text-yellow-400" />;
  };

  return (
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <Link to={`/weather/${weatherData.cityName}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <CardTitle>{weatherData.cityName}</CardTitle>
          </Link>
          <button
            onClick={handleFavoriteClick}
            className="focus:outline-none"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <StarIcon
              className={cn(
                "w-5 h-5 transition-colors",
                isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
              )}
            />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getWeatherIcon()}
            <div>
              <p className="text-2xl font-bold">{Math.round(weatherData.temp)}°C</p>
              <p className="text-sm text-muted-foreground capitalize">
                {weatherData.description}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <ThermometerIcon className="w-4 h-4 text-orange-400" />
              <span>Feels like: {Math.round(weatherData.feels_like)}°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <WindIcon className="w-4 h-4 text-blue-400" />
              <span>Wind: {weatherData.wind_speed} m/s</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
        <span>Humidity: {weatherData.humidity}%</span>
        <span>Country: {weatherData.country}</span>
      </CardFooter>
    </Card>
  );
}
