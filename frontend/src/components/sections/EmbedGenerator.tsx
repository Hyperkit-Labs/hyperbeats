"use client";

import { useState } from "react";
import { Copy, Check, FileCode, Code2, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface EmbedGeneratorProps {
  repos: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://beats.hyperionkit.xyz";

export function EmbedGenerator({ repos }: EmbedGeneratorProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [timeframe] = useState("30d");
  const [theme] = useState("dark");

  const repoString = repos.join(",");
  const chartUrl = `${API_BASE}/api/v1/chart/activity?repos=${repoString}&timeframe=${timeframe}&theme=${theme}`;

  const embedCodes = {
    markdown: `![Activity Chart](${chartUrl})`,
    html: `<img src="${chartUrl}" alt="Activity Chart" width="800" height="400" />`,
    json: `curl "${API_BASE}/api/v1/metrics/aggregate?repos=${repoString}&timeframe=${timeframe}"`,
  };

  const copyToClipboard = async (key: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="embed" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Embed Anywhere
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Copy the code snippet for your platform and paste it into your README, docs, or website.
          </p>
        </div>

        <Tabs defaultValue="markdown" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="markdown" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" /> Markdown
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" /> HTML
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <FileJson className="w-4 h-4" /> JSON API
            </TabsTrigger>
          </TabsList>

          {/* Content for each tab */}
          {(Object.keys(embedCodes) as Array<keyof typeof embedCodes>).map((type) => (
            <TabsContent key={type} value={type}>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{type} Snippet</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(type, embedCodes[type])}
                      className={copied === type ? "text-emerald-400" : ""}
                    >
                      {copied === type ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {type === "markdown" && "Great for GitHub READMEs and Notion docs."}
                    {type === "html" && "Perfect for websites and custom dashboards."}
                    {type === "json" && "Raw data for building your own visualizations."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="p-4 bg-background/50 rounded-lg overflow-x-auto border border-border/50">
                      <code className={`text-sm font-mono ${
                        type === "markdown" ? "text-cyan-400" : 
                        type === "html" ? "text-purple-400" : "text-amber-400"
                      }`}>
                        {embedCodes[type]}
                      </code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Example Result */}
        <div className="mt-12">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle>Example Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl mx-auto bg-background rounded-lg p-6 border border-border">
                <div className="prose prose-sm dark:prose-invert mx-auto">
                  <h4 className="font-semibold mb-2">Project Activity</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Here is our repository activity for the last 30 days:
                  </p>
                  <img
                    src={chartUrl}
                    alt="Activity Chart"
                    className="w-full rounded-lg shadow-lg border border-border/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
