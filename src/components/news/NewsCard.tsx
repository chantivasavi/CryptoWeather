
import { ExternalLinkIcon } from "lucide-react";
import { NewsItem } from "@/services/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  const truncate = (text: string, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  
  // Format date
  const formattedDate = new Date(news.pubDate).toLocaleDateString();

  return (
    <Card className="overflow-hidden border-border hover:border-primary/50 transition-all h-full flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-base line-clamp-2">{news.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncate(news.description, 150)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {news.source_id} • {formattedDate}
        </span>
        <a 
          href={news.url} 
          target="_blank" 
          rel="noreferrer"
          className="text-primary hover:text-primary/80 flex items-center gap-1"
        >
          <span className="text-xs">Read</span>
          <ExternalLinkIcon size={12} />
        </a>
      </CardFooter>
    </Card>
  );
}
