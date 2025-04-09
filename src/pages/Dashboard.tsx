
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, TrendingUp, CloudIcon, NewspaperIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoCard } from "@/components/crypto/CryptoCard";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { NewsCard } from "@/components/news/NewsCard";
import { fetchCryptoData, fetchWeatherData, fetchCryptoNews } from "@/services/api";
import { useAppContext } from "@/store/AppContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { favoriteCities } = useAppContext();
  const [cityWeatherData, setCityWeatherData] = useState<any[]>([]);

  // Fetch crypto data
  const { data: cryptoData = [], isLoading: cryptoLoading } = useQuery({
    queryKey: ["cryptoData"],
    queryFn: fetchCryptoData,
  });

  // Fetch news data
  const { data: newsData = [], isLoading: newsLoading } = useQuery({
    queryKey: ["cryptoNews"],
    queryFn: fetchCryptoNews,
  });

  // Fetch weather data for favorite cities
  useEffect(() => {
    const fetchWeatherForCities = async () => {
      const promises = favoriteCities.slice(0, 3).map((city) =>
        fetchWeatherData(city.name)
          .then((data) => data)
          .catch(() => null)
      );
      
      const results = await Promise.all(promises);
      setCityWeatherData(results.filter(Boolean));
    };
    
    fetchWeatherForCities();
  }, [favoriteCities]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your real-time crypto and weather dashboard
        </p>
      </div>
      
      {/* Cryptocurrency Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary" />
            <h2 className="text-xl font-semibold">Cryptocurrency</h2>
          </div>
          <Link to="/crypto" className="flex items-center gap-1 text-sm text-primary">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {cryptoLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-4">
                  <div className="h-6 w-32 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="h-8 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptoData.slice(0, 3).map((coin) => (
              <CryptoCard key={coin.id} coin={coin} />
            ))}
          </div>
        )}
      </section>
      
      {/* Weather Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CloudIcon className="text-primary" />
            <h2 className="text-xl font-semibold">Weather</h2>
          </div>
          <Link to="/weather" className="flex items-center gap-1 text-sm text-primary">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {cityWeatherData.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-4">
                  <div className="h-6 w-32 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="h-8 w-24 bg-muted rounded"></div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityWeatherData.map((weather, index) => (
              <WeatherCard key={index} weatherData={weather} />
            ))}
          </div>
        )}
      </section>
      
      {/* News Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <NewspaperIcon className="text-primary" />
            <h2 className="text-xl font-semibold">Crypto News</h2>
          </div>
        </div>
        
        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse h-48">
                <CardHeader className="p-4">
                  <div className="h-6 w-32 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsData.slice(0, 5).map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
