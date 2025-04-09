
import { useEffect, useRef } from "react";
import { useAppContext } from "../store/AppContext";

// WebSocket for crypto price updates is not available in free tier
// This service simulates WebSocket behavior for demo purposes

export const useWebSocket = (
  coinIds: string[] = ["bitcoin", "ethereum", "solana"]
) => {
  const { addNotification } = useAppContext();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Simulate connecting to WebSocket
    console.log("WebSocket connected");

    // Simulate receiving price updates every 20 seconds
    intervalRef.current = setInterval(() => {
      const randomCoin = coinIds[Math.floor(Math.random() * coinIds.length)];
      const priceChange = (Math.random() * 2 - 1) * 0.05; // Random change between -5% and +5%
      const direction = priceChange > 0 ? "increased" : "decreased";
      const changePercent = Math.abs(priceChange * 100).toFixed(2);

      const coinName = 
        randomCoin === "bitcoin" ? "Bitcoin" : 
        randomCoin === "ethereum" ? "Ethereum" : 
        randomCoin === "solana" ? "Solana" : randomCoin;

      addNotification(
        "price_alert",
        `${coinName} price ${direction} by ${changePercent}%`
      );
    }, 20000); // Every 20 seconds

    // Simulate weather alerts every 30-60 seconds
    const weatherInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of weather alert
        const cities = ["New York", "London", "Tokyo"];
        const conditions = ["Heavy Rain", "High Winds", "Extreme Heat", "Thunderstorm"];
        
        const city = cities[Math.floor(Math.random() * cities.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        addNotification(
          "weather_alert",
          `${condition} alert for ${city}`
        );
      }
    }, 45000); // Every 45 seconds

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearInterval(weatherInterval);
      console.log("WebSocket disconnected");
    };
  }, [addNotification, coinIds]);
};
