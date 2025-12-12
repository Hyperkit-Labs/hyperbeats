"use client";

import { useState } from "react";
import { RefreshCw, Download, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChartPreviewProps {
  repos: string[];
  onReposChange: (repos: string[]) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://beats.hyperionkit.xyz";

export function ChartPreview({ repos, onReposChange }: ChartPreviewProps) {
  const [timeframe, setTimeframe] = useState("7d");
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [repoInput, setRepoInput] = useState(repos.join(", "));
  const [copied, setCopied] = useState(false);

  const chartUrl = `${API_BASE}/api/v1/chart/activity?repos=${repos.join(",")}&timeframe=${timeframe}&theme=${theme}`;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleRepoChange = (value: string) => {
    setRepoInput(value);
    const newRepos = value.split(",").map(r => r.trim()).filter(r => r.includes("/"));
    if (newRepos.length > 0) {
      onReposChange(newRepos);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(chartUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" />
       
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Live Preview</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Interact with the API in real-time. Enter repositories and customize the output.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-6 space-y-6">
                
                {/* Repositories */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">Repositories</label>
                  <Input
                    type="text"
                    value={repoInput}
                    onChange={(e) => handleRepoChange(e.target.value)}
                    placeholder="owner/repo"
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/50"
                  />
                  <p className="text-xs text-zinc-500">Comma-separated (e.g. facebook/react, vercel/next.js)</p>
                </div>

                {/* Timeframe */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">Timeframe</label>
                  <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
                    <TabsList className="w-full grid grid-cols-4 bg-white/5">
                      <TabsTrigger value="1d">1d</TabsTrigger>
                      <TabsTrigger value="7d">7d</TabsTrigger>
                      <TabsTrigger value="30d">30d</TabsTrigger>
                      <TabsTrigger value="90d">90d</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Theme */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "light", label: "Light", bg: "#ffffff", border: "border-gray-200" },
                      { id: "dark", label: "Dark", bg: "#1a202c", border: "border-gray-700" },
                      { id: "hyperkit", label: "Hyperkit", bg: "#0f1419", border: "border-cyan-900" },
                      { id: "mint", label: "Mint", bg: "#f0fdf4", border: "border-emerald-200" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg border transition-all text-sm",
                          theme === t.id 
                            ? "bg-white/10 border-cyan-500/50 text-white ring-1 ring-cyan-500/20" 
                            : "bg-transparent border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                        )}
                      >
                        <span className={cn("w-4 h-4 rounded-full border", t.border)} style={{ backgroundColor: t.bg }} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="flex-1 border-white/10 hover:bg-white/5 text-zinc-300"
                    disabled={loading}
                  >
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    Refresh
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 bg-white text-black hover:bg-zinc-200"
                    asChild
                  >
                    <a href={chartUrl} download="chart.svg">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="ml-3 text-xs text-zinc-500 font-mono">preview.svg</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className={cn("h-8 text-xs hover:bg-white/5", copied && "text-emerald-400 hover:text-emerald-400")}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-full h-full flex items-center justify-center relative">
                   {/* Grid Background inside preview */}
                  <div className="absolute inset-0 bg-grid-small-white/[0.1] -z-10 rounded-lg" />
                  
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        </div>
                      </div>
                      <span className="text-sm text-zinc-500 animate-pulse">Generating visualization...</span>
                    </div>
                  ) : (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={chartUrl} // trigger animation on url change
                      src={chartUrl}
                      alt="Activity Chart"
                      className="max-w-full max-h-[400px] object-contain drop-shadow-2xl"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div className="w-full mt-6 p-3 bg-black/50 rounded-lg border border-white/5 flex items-center justify-between group">
                  <code className="text-xs text-zinc-500 font-mono truncate mr-4 group-hover:text-zinc-300 transition-colors">
                    {chartUrl}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
