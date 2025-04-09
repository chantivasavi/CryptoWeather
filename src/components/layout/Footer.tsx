
import { ExternalLink, GithubIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-medium mb-2">CryptoWeather Nexus</h3>
            <p className="text-sm text-muted-foreground">
              Real-time cryptocurrency prices, weather data, and news updates
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">API Credits</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-1">
                <ExternalLink size={14} />
                <a href="https://www.coingecko.com/api" target="_blank" rel="noreferrer" className="hover:text-primary">
                  CoinGecko
                </a>
              </li>
              <li className="flex items-center gap-1">
                <ExternalLink size={14} />
                <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" className="hover:text-primary">
                  OpenWeatherMap
                </a>
              </li>
              <li className="flex items-center gap-1">
                <ExternalLink size={14} />
                <a href="https://newsdata.io/" target="_blank" rel="noreferrer" className="hover:text-primary">
                  NewsData.io
                </a>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-sm text-muted-foreground mb-2">
            
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-sm hover:text-primary"
            >
              <GithubIcon size={14} />
              Project Repository
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 CryptoWeather Nexus</p>
        </div>
      </div>
    </footer>
  );
}
