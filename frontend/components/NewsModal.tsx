"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles, X, Activity } from "lucide-react";
import { Button } from "./ui/button";
import type { NewsItem } from "../lib/api";
import { Badge } from "./ui/badge";

interface NewsModalProps {
  item: NewsItem;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsModal({ item, isOpen, onClose }: NewsModalProps) {
  const [explanation, setExplanation] = useState<{
    explanation: string;
    impact: string;
    use_cases: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExplain = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/news/${item.id}/explain`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setExplanation(data);
      } else {
        setExplanation({
          explanation: "Could not fetch AI explanation due to an API error.",
          impact: "Unknown",
          use_cases: []
        });
      }
    } catch {
       setExplanation({
          explanation: "Could not connect to the backend.",
          impact: "Unknown",
          use_cases: []
        });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (explanation) {
      const text = `Explanation: ${explanation.explanation}\n\nImpact: ${explanation.impact}\n\nUse Cases:\n${explanation.use_cases.map(u => "- " + u).join('\n')}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="mb-6 pr-12">
          <Badge variant="blue" className="mb-4">{item.source}</Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {item.title}
          </h2>
        </div>

        <div className="space-y-6">
          <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
            {item.summary}
          </p>
          
          <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900">
             {item.tags.map(tag => <Badge key={tag} variant="zinc">#{tag}</Badge>)}
             {item.entities?.model && (
               <Badge variant="purple"><Sparkles className="h-3 w-3 mr-1"/> {item.entities.model}</Badge>
             )}
          </div>

          <div className="pt-6 border-t border-zinc-800/50">
            {!explanation ? (
              <Button 
                onClick={handleExplain} 
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/20"
              >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {loading ? "Analyzing..." : "Explain this news (ELI5)"}
              </Button>
            ) : (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> AI Analysis
                  </h3>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30">
                    <Copy className="h-3 w-3 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm text-zinc-300">
                  <div>
                    <h4 className="text-white font-medium mb-1">Simple Explanation</h4>
                    <p className="leading-relaxed">{explanation.explanation}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Key Impact</h4>
                    <p className="leading-relaxed">{explanation.impact}</p>
                  </div>
                  {explanation.use_cases.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-1">Use Cases</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {explanation.use_cases.map((uc, i) => (
                          <li key={i}>{uc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
