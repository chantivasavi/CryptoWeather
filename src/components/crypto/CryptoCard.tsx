
import { ArrowUpIcon, ArrowDownIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Coin } from "@/services/api";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CryptoCardProps {
  coin: Coin;
}

export function CryptoCard({ coin }: CryptoCardProps) {
  const { favoriteCryptos, addFavoriteCrypto, removeFavoriteCrypto } = useAppContext();
  const isFavorite = favoriteCryptos.some((c) => c.id === coin.id);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavoriteCrypto(coin.id);
    } else {
      addFavoriteCrypto({ id: coin.id, name: coin.name });
    }
  };

  return (
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <Link to={`/crypto/${coin.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-8 h-8 rounded-full"
            />
            <CardTitle>{coin.name}</CardTitle>
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
          <div>
            <p className="text-2xl font-bold">${coin.current_price.toLocaleString()}</p>
            <div
              className={cn(
                "flex items-center",
                coin.price_change_percentage_24h > 0 ? "text-crypto-positive" : "text-crypto-negative"
              )}
            >
              {coin.price_change_percentage_24h > 0 ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">${(coin.market_cap / 1000000000).toFixed(2)}B</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        Last updated: {new Date(coin.last_updated).toLocaleString()}
      </CardFooter>
    </Card>
  );
}
