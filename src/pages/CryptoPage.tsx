
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoData, Coin } from "@/services/api";
import { Input } from "@/components/ui/input";
import { CryptoCard } from "@/components/crypto/CryptoCard";
import { useAppContext } from "@/store/AppContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const CryptoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { favoriteCryptos } = useAppContext();
  
  const { data: cryptoData = [], isLoading } = useQuery({
    queryKey: ["cryptoData"],
    queryFn: fetchCryptoData,
  });

  const filteredCrypto = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteCryptoData = cryptoData.filter((coin) =>
    favoriteCryptos.some((fav) => fav.id === coin.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency</h1>
        <p className="text-muted-foreground mt-1">
          Live prices, market cap, and 24h changes
        </p>
      </div>
      
      <div className="w-full max-w-sm">
        <Input
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card"
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Cryptocurrencies</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 animate-pulse bg-card rounded-lg"></div>
              ))}
            </div>
          ) : filteredCrypto.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCrypto.map((coin) => (
                <CryptoCard key={coin.id} coin={coin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No cryptocurrencies found matching "{searchTerm}"</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="pt-4">
          {favoriteCryptoData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoriteCryptoData.map((coin) => (
                <CryptoCard key={coin.id} coin={coin} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No favorite cryptocurrencies added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add favorites by clicking the star icon on any cryptocurrency card
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoPage;
