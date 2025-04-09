
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { fetchWeatherData, WeatherData } from "@/services/api";
import { useAppContext } from "@/store/AppContext";
import { Search, Loader2, MapPin } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

// Popular city suggestions
const popularCities = [
  // International cities
  "New York", "London", "Tokyo", "Paris", "Sydney", 
  // Indian cities
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", 
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
];

const WeatherPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const { favoriteCities } = useAppContext();

  // Fetch weather for favorite cities
  useEffect(() => {
    const loadFavoriteCitiesWeather = async () => {
      if (favoriteCities.length > 0) {
        setSearching(true);
        const promises = favoriteCities.map((city) =>
          fetchWeatherData(city.name)
            .then((data) => data)
            .catch(() => null)
        );
        
        const results = await Promise.all(promises);
        setWeatherData(results.filter(Boolean));
        setSearching(false);
      }
    };

    loadFavoriteCitiesWeather();
  }, [favoriteCities]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setSearching(true);
    
    try {
      const data = await fetchWeatherData(searchTerm);
      if (data) {
        setWeatherData((prev) => {
          // Check if the city is already in the list
          const exists = prev?.some((item) => 
            item.cityName.toLowerCase() === data.cityName.toLowerCase()
          );
          
          if (exists) {
            return prev?.map((item) =>
              item.cityName.toLowerCase() === data.cityName.toLowerCase() ? data : item
            ) || [data];
          }
          
          return prev ? [data, ...prev] : [data];
        });
      }
      setSearchTerm("");
      toast.success(`Weather data for ${data.cityName} loaded successfully`);
    } catch (error) {
      toast.error(`City "${searchTerm}" not found. Please try another.`);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCity = async (city: string) => {
    setSearchTerm(city);
    try {
      setSearching(true);
      const data = await fetchWeatherData(city);
      if (data) {
        setWeatherData((prev) => {
          // Check if the city is already in the list
          const exists = prev?.some((item) => 
            item.cityName.toLowerCase() === data.cityName.toLowerCase()
          );
          
          if (exists) {
            return prev?.map((item) =>
              item.cityName.toLowerCase() === data.cityName.toLowerCase() ? data : item
            ) || [data];
          }
          
          return prev ? [data, ...prev] : [data];
        });
      }
      setSearchTerm("");
      toast.success(`Weather data for ${data.cityName} loaded successfully`);
    } catch (error) {
      toast.error(`Failed to fetch weather for ${city}`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weather</h1>
        <p className="text-muted-foreground mt-1">
          Current weather conditions for cities around the world
        </p>
      </div>
      
      <form 
        onSubmit={handleSearch} 
        className="flex gap-2 max-w-md"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <Button 
          type="submit" 
          disabled={searching || !searchTerm.trim()}
        >
          {searching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>

      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-1">
          <MapPin className="h-4 w-4" /> Popular Cities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {popularCities.map((city) => (
            <Button 
              key={city} 
              variant="outline" 
              size="sm"
              className="justify-start truncate"
              onClick={() => handleSelectCity(city)}
              disabled={searching}
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Cities</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="indian">Indian Cities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          {searching && !weatherData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse bg-card rounded-lg"></div>
              ))}
            </div>
          ) : weatherData === null ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No cities added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Search for a city or select from popular cities to see its current weather
              </p>
            </div>
          ) : weatherData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData.map((data, index) => (
                <WeatherCard key={`${data.cityName}-${index}`} weatherData={data} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No cities added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Search for a city to see its current weather
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="pt-4">
          {searching && !weatherData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse bg-card rounded-lg"></div>
              ))}
            </div>
          ) : weatherData === null || weatherData.filter(data => 
              favoriteCities.some(city => 
                city.name.toLowerCase() === data.cityName.toLowerCase())
            ).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No favorite cities added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add favorites by clicking the star icon on any weather card
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData
                .filter(data => 
                  favoriteCities.some(city => 
                    city.name.toLowerCase() === data.cityName.toLowerCase())
                )
                .map((data, index) => (
                  <WeatherCard key={`favorite-${data.cityName}-${index}`} weatherData={data} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="indian" className="pt-4">
          {searching && !weatherData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse bg-card rounded-lg"></div>
              ))}
            </div>
          ) : weatherData === null || weatherData.filter(data => 
              data.country === "IN"
            ).length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No Indian cities added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Search for an Indian city or select from the popular Indian cities above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData
                .filter(data => data.country === "IN")
                .map((data, index) => (
                  <WeatherCard key={`indian-${data.cityName}-${index}`} weatherData={data} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeatherPage;
