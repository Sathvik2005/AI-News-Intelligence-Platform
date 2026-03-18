import { useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import type { NewsItem } from "../lib/api";

type Props = {
  item: NewsItem;
  onFavorite?: (newsId: string) => Promise<void>;
  onBroadcast?: (channel: "email" | "linkedin" | "whatsapp", item: NewsItem) => Promise<void>;
};

export default function NewsCard({ item, onFavorite, onBroadcast }: Props) {
  const [channel, setChannel] = useState<"email" | "linkedin" | "whatsapp">("linkedin");

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <Badge>{item.source}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-700">{item.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-600">Score: {item.score.toFixed(1)}</span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white"
            onClick={() => onFavorite?.(item.id)}
          >
            Favorite
          </button>
          <select
            className="rounded-md border border-slate-300 px-2 py-1 text-xs"
            value={channel}
            onChange={(e) => setChannel(e.target.value as "email" | "linkedin" | "whatsapp")}
          >
            <option value="linkedin">LinkedIn</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <button
            className="rounded-md bg-sky-700 px-2 py-1 text-xs font-medium text-white"
            onClick={() => onBroadcast?.(channel, item)}
          >
            Broadcast
          </button>
          <a className="text-sm font-medium text-sky-700 hover:text-sky-900" href={item.url} target="_blank">
            Open
          </a>
        </div>
      </div>
    </Card>
  );
}
