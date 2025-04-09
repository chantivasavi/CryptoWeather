
import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoricalPrice } from "@/services/api";

interface PriceChartProps {
  data: HistoricalPrice[];
  coinName: string;
  color?: string;
  days?: number;
}

export function PriceChart({ data, coinName, color = "#0EA5E9", days = 7 }: PriceChartProps) {
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      date: new Date(item.timestamp).toLocaleDateString(),
      price: item.price,
    }));
  }, [data]);

  const isPriceUp = useMemo(() => {
    if (data.length < 2) return true;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    return lastPrice > firstPrice;
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg md:text-xl">
          {coinName} Price Chart ({days} days)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#94A3B8" }}
              tickMargin={10}
              width={80}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #475569",
                borderRadius: "0.375rem",
                color: "#F8FAFC",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPriceUp ? "#22C55E" : "#EF4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
