"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardTitle } from "../../components/ui/card";
import { Mail, Loader2, Sparkles, Send } from "lucide-react";

export default function NewsletterPage() {
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const generateNewsletter = async () => {
    setGenerating(true);
    try {
      // Mock generate logic
      const response = await fetch("http://localhost:8000/api/v1/newsletter/generate", {
        method: "POST"
      });
      const data = await response.json();
      setContent(data.content || "Newsletter content generated successfully.");
    } catch {
      setContent("# Top AI Developments\n\nCould not fetch from backend, but the API expects a POST to `/newsletter/generate`.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Smart Newsletter</h1>
          <p className="text-zinc-400 mt-2">Auto-generate a comprehensive markdown newsletter from recent top news.</p>
        </div>
        <Button onClick={generateNewsletter} disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {generating ? "Generating..." : "Generate Draft"}
        </Button>
      </header>

      {content && (
        <Card className="mt-8 border-blue-500/20 shadow-[0_0_30px_-15px_rgba(59,130,246,0.3)]">
          <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4 mb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              Generated Newsletter Draft
            </CardTitle>
            <Button size="sm" variant="secondary">
              <Send className="h-3 w-3 mr-2" />
              Send to Subscribers
            </Button>
          </div>
          <div className="prose prose-invert prose-blue max-w-none text-zinc-300">
            <pre className="whitespace-pre-wrap font-sans text-sm bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
              {content}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}
