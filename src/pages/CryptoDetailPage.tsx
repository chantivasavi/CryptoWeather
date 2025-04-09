
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, StarIcon, ExternalLink, Info } from "lucide-react";
import { fetchCryptoDetails, fetchHistoricalData } from "@/services/api";
import { PriceChart } from "@/components/charts/PriceChart";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const CryptoDetailPage = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const { favoriteCryptos, addFavoriteCrypto, removeFavoriteCrypto } = useAppContext();
  
  const isFavorite = favoriteCryptos.some((c) => c.id === coinId);

  const { data: coinDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["coinDetails", coinId],
    queryFn: () => fetchCryptoDetails(coinId || ""),
    enabled: !!coinId,
  });

  const { data: historicalData7d, isLoading: historyLoading7d } = useQuery({
    queryKey: ["historicalData", coinId, 7],
    queryFn: () => fetchHistoricalData(coinId || "", 7),
    enabled: !!coinId,
  });

  const { data: historicalData30d, isLoading: historyLoading30d } = useQuery({
    queryKey: ["historicalData", coinId, 30],
    queryFn: () => fetchHistoricalData(coinId || "", 30),
    enabled: !!coinId,
  });

  const handleFavoriteClick = () => {
    if (!coinId || !coinDetails) return;
    
    if (isFavorite) {
      removeFavoriteCrypto(coinId);
    } else {
      addFavoriteCrypto({ id: coinId, name: coinDetails.name });
    }
  };

  if (!coinId) {
    navigate("/crypto");
    return null;
  }

  const isLoading = detailsLoading || historyLoading7d;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="outline" 
        onClick={() => navigate("/crypto")}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Cryptocurrencies
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 w-48 bg-muted rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 h-[400px] bg-muted rounded animate-pulse"></div>
            <div className="h-[400px] bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      ) : coinDetails ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={coinDetails.image?.large} 
                alt={coinDetails.name}
                className="w-12 h-12" 
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  {coinDetails.name}
                  <span className="text-muted-foreground text-lg font-normal">
                    ({coinDetails.symbol.toUpperCase()})
                  </span>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="col-span-2 space-y-6">
              <Tabs defaultValue="7d">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Price History</h2>
                  <TabsList>
                    <TabsTrigger value="7d">7 Days</TabsTrigger>
                    <TabsTrigger value="30d">30 Days</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="7d">
                  {historicalData7d && historicalData7d.length > 0 ? (
                    <PriceChart 
                      data={historicalData7d} 
                      coinName={coinDetails.name}
                      days={7}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Info className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p>Historical data not available</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="30d">
                  {historicalData30d && historicalData30d.length > 0 ? (
                    <PriceChart 
                      data={historicalData30d} 
                      coinName={coinDetails.name}
                      days={30}
                    />
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Info className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p>Historical data not available</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>About {coinDetails.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: coinDetails.description?.en?.split(". ").slice(0, 3).join(". ") + "." || "No description available." 
                    }}
                    className="prose prose-sm dark:prose-invert max-w-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold">${coinDetails.market_data?.current_price?.usd.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="font-medium">${(coinDetails.market_data?.market_cap?.usd / 1000000000).toFixed(2)}B</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="font-medium">${(coinDetails.market_data?.total_volume?.usd / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">24h High</p>
                      <p className="font-medium">${coinDetails.market_data?.high_24h?.usd.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Low</p>
                      <p className="font-medium">${coinDetails.market_data?.low_24h?.usd.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Circulating Supply</p>
                      <p className="font-medium">
                        {coinDetails.market_data?.circulating_supply.toLocaleString()} {coinDetails.symbol.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Supply</p>
                      <p className="font-medium">
                        {coinDetails.market_data?.max_supply 
                          ? `${coinDetails.market_data.max_supply.toLocaleString()} ${coinDetails.symbol.toUpperCase()}`
                          : "∞"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {coinDetails.links?.homepage?.[0] && (
                    <a
                      href={coinDetails.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-md hover:bg-card transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  
                  {coinDetails.links?.blockchain_site?.[0] && (
                    <a
                      href={coinDetails.links.blockchain_site[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-md hover:bg-card transition-colors"
                    >
                      <span>Explorer</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  
                  {coinDetails.links?.subreddit_url && (
                    <a
                      href={coinDetails.links.subreddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-md hover:bg-card transition-colors"
                    >
                      <span>Reddit</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">Cryptocurrency not found</h2>
          <p className="text-muted-foreground">
            The cryptocurrency you're looking for doesn't exist or couldn't be loaded.
          </p>
        </div>
      )}
    </div>
  );
};

export default CryptoDetailPage;
