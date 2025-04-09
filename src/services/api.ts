
import { toast } from "sonner";

// API endpoints
const COIN_GECKO_API = "https://api.coingecko.com/api/v3";
const OPEN_WEATHER_API = "https://api.openweathermap.org/data/2.5";
const NEWS_API = "https://newsdata.io/api/1";

// API keys - in a real application, these would be stored securely
// Using free tier API keys that don't require authentication where possible
const WEATHER_API_KEY = "45d30b32c970904a4a394330f1a17a23"; // Updated OpenWeatherMap API key
const NEWS_API_KEY = "pub_3348945e53fb5b948df187122a0fa1416f53a"; // Free NewsData.io API key

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  last_updated: string;
}

export interface WeatherData {
  cityName: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  source_id: string;
  pubDate: string;
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
}

// Crypto API functions
export const fetchCryptoData = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${COIN_GECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data");
    }
    
    return await response.json();
  } catch (error) {
    toast.error("Failed to fetch cryptocurrency data");
    console.error("Error fetching crypto data:", error);
    return [];
  }
};

export const fetchCryptoDetails = async (coinId: string): Promise<any> => {
  try {
    const response = await fetch(`${COIN_GECKO_API}/coins/${coinId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${coinId}`);
    }
    
    return await response.json();
  } catch (error) {
    toast.error(`Failed to fetch details for ${coinId}`);
    console.error(`Error fetching ${coinId} details:`, error);
    throw error;
  }
};

export const fetchHistoricalData = async (
  coinId: string,
  days = 7
): Promise<HistoricalPrice[]> => {
  try {
    const response = await fetch(
      `${COIN_GECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${coinId}`);
    }
    
    const data = await response.json();
    return data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1],
    }));
  } catch (error) {
    toast.error(`Failed to fetch price history for ${coinId}`);
    console.error(`Error fetching ${coinId} historical data:`, error);
    return [];
  }
};

// Weather API functions
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${OPEN_WEATHER_API}/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for ${city}`);
    }
    
    const data = await response.json();
    
    return {
      cityName: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
    };
  } catch (error) {
    toast.error(`Failed to fetch weather for ${city}`);
    console.error(`Error fetching weather for ${city}:`, error);
    throw error;
  }
};

// News API functions
export const fetchCryptoNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      `${NEWS_API}/news?apikey=${NEWS_API_KEY}&q=cryptocurrency+OR+bitcoin+OR+ethereum&language=en&category=business&size=5`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch crypto news");
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    toast.error("Failed to fetch cryptocurrency news");
    console.error("Error fetching crypto news:", error);
    return [];
  }
};
