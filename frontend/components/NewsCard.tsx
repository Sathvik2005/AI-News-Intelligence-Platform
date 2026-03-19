import { useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Star, Share2, ExternalLink, ChevronDown, Sparkles } from "lucide-react";
import type { NewsItem } from "../lib/api";

type Props = {
  item: NewsItem;
  onFavorite?: (newsId: string) => Promise<void>;
  onBroadcast?: (channel: "email" | "linkedin" | "whatsapp", item: NewsItem) => Promise<void>;
};

export default function NewsCard({ item, onFavorite, onBroadcast }: Props) {
  const [channel, setChannel] = useState<"email" | "linkedin" | "whatsapp">("linkedin");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-zinc-100 leading-tight group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
        <div className="flex flex-col gap-2 items-end shrink-0">
          <Badge variant={item.source.toLowerCase().includes('openai') ? 'emerald' : 'blue'}>
            {item.source}
          </Badge>
          {item.entities?.model && (
            <Badge variant="purple" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {item.entities.model}
            </Badge>
          )}
        </div>
      </div>
      
      <p className="mt-4 text-sm text-zinc-400 line-clamp-3 leading-relaxed">
        {item.summary}
      </p>
      
      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="zinc">
            #{tag}
          </Badge>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-zinc-800/50 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-medium text-blue-500">
            {(item.score * 10).toFixed(0)}
          </div>
          <span className="text-xs text-zinc-500">Relevance Score</span>
        </div>
        
        <div className="flex items-center gap-2 opacity-80 transition-opacity group-hover:opacity-100">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`transition-colors ${(item as any).isFavorited ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10'}`}
            onClick={() => onFavorite?.(item.id)}
          >
            <Star className={`h-4 w-4 mr-2 ${(item as any).isFavorited ? 'fill-yellow-500' : ''}`} />
            Save
          </Button>
          
          <div className="relative group/share">
            <Button variant="ghost" size="sm" className="text-zinc-400">
              <Share2 className="h-4 w-4 mr-2" />
              Share
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <div className="absolute right-0 bottom-full mb-1 hidden flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-lg group-hover/share:flex">
                <Button size="sm" variant="ghost" onClick={() => onBroadcast?.("linkedin", item)} className="justify-start text-xs">LinkedIn</Button>
                <Button size="sm" variant="ghost" onClick={() => onBroadcast?.("email", item)} className="justify-start text-xs">Email</Button>
                <Button size="sm" variant="ghost" onClick={() => onBroadcast?.("whatsapp", item)} className="justify-start text-xs">WhatsApp</Button>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="text-zinc-400 hover:text-blue-400">
            <a href={item.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
