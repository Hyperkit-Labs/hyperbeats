"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, Zap, Shield, Globe, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = "https://beats.hyperionkit.xyz/api/v1";

export default function ApiPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = "bash", id }: { code: string; language?: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm border border-white/10">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">REST API</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            API Reference
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Simple REST API for generating charts and fetching metrics. Full documentation.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <Globe className="w-4 h-4 text-cyan-400" />
            <code className="text-sm font-mono text-cyan-400">{API_BASE}</code>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">100</div>
                  <div className="text-sm text-muted-foreground">Requests/hour (Public)</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">1,000</div>
                  <div className="text-sm text-muted-foreground">Requests/hour (Auth)</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Code className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Endpoints</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Authentication */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Authentication
            </CardTitle>
            <CardDescription>
              Most endpoints are publicly accessible with rate limits. Include your API key for higher limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm text-muted-foreground mb-1">Public</div>
                <div className="text-2xl font-bold">100</div>
                <div className="text-xs text-muted-foreground">requests/hour</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm text-muted-foreground mb-1">Authenticated</div>
                <div className="text-2xl font-bold">1,000</div>
                <div className="text-xs text-muted-foreground">requests/hour</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm text-muted-foreground mb-1">Enterprise</div>
                <div className="text-2xl font-bold">∞</div>
                <div className="text-xs text-muted-foreground">unlimited</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Using API Key</h4>
              <CodeBlock
                id="auth-example"
                code={`curl -H "X-API-Key: hb_your_key_here" \\
  "${API_BASE}/chart/activity?repos=owner/repo"`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-8">
          {/* GET /chart/activity */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  GET
                </Badge>
                <CardTitle className="text-2xl">/chart/activity</CardTitle>
              </div>
              <CardDescription>
                Generate an activity chart for repositories. Returns SVG or PNG image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Parameter</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Required</th>
                        <th className="text-left p-3">Default</th>
                        <th className="text-left p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>repos</code></td>
                        <td className="p-3">string[]</td>
                        <td className="p-3">Yes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Repository names (owner/repo)</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>timeframe</code></td>
                        <td className="p-3">string</td>
                        <td className="p-3">No</td>
                        <td className="p-3">7d</td>
                        <td className="p-3">Time period: 1d, 7d, 30d, 90d, 1y</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>format</code></td>
                        <td className="p-3">string</td>
                        <td className="p-3">No</td>
                        <td className="p-3">svg</td>
                        <td className="p-3">Output format: svg or png</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>theme</code></td>
                        <td className="p-3">string</td>
                        <td className="p-3">No</td>
                        <td className="p-3">light</td>
                        <td className="p-3">Theme: light, dark, hyperkit, mint, etc.</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>width</code></td>
                        <td className="p-3">int</td>
                        <td className="p-3">No</td>
                        <td className="p-3">800</td>
                        <td className="p-3">Chart width (200-2000px)</td>
                      </tr>
                      <tr>
                        <td className="p-3"><code>height</code></td>
                        <td className="p-3">int</td>
                        <td className="p-3">No</td>
                        <td className="p-3">400</td>
                        <td className="p-3">Chart height (100-1000px)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <CodeBlock
                  id="activity-example"
                  code={`curl "${API_BASE}/chart/activity?repos=octocat/Hello-World&timeframe=30d&theme=dark"`}
                />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Returns SVG or PNG image with headers:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-4">
                  <li><code>X-Cache</code>: Cache status (HIT_L1, HIT_L2, MISS)</li>
                  <li><code>Cache-Control</code>: Caching directives</li>
                  <li><code>Content-Type</code>: image/svg+xml or image/png</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* GET /metrics/aggregate */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  GET
                </Badge>
                <CardTitle className="text-2xl">/metrics/aggregate</CardTitle>
              </div>
              <CardDescription>
                Get aggregated metrics as JSON for multiple repositories.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Parameter</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Required</th>
                        <th className="text-left p-3">Default</th>
                        <th className="text-left p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>repos</code></td>
                        <td className="p-3">string[]</td>
                        <td className="p-3">Yes</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Repository names (owner/repo)</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>timeframe</code></td>
                        <td className="p-3">string</td>
                        <td className="p-3">No</td>
                        <td className="p-3">7d</td>
                        <td className="p-3">Time period: 1d, 7d, 30d, 90d, 1y</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>include_historical</code></td>
                        <td className="p-3">bool</td>
                        <td className="p-3">No</td>
                        <td className="p-3">false</td>
                        <td className="p-3">Include historical data points</td>
                      </tr>
                      <tr>
                        <td className="p-3"><code>metrics</code></td>
                        <td className="p-3">string[]</td>
                        <td className="p-3">No</td>
                        <td className="p-3">all</td>
                        <td className="p-3">Filter: commits, prs, issues, contributors</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <CodeBlock
                  id="metrics-example"
                  code={`curl "${API_BASE}/metrics/aggregate?repos=microsoft/vscode,microsoft/typescript"`}
                />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Response</h4>
                <CodeBlock
                  id="metrics-response"
                  code={`{
  "aggregated": {
    "commits": 1250,
    "prs_merged": 85,
    "issues_closed": 230,
    "contributors": 45,
    "repos_count": 2
  },
  "per_repo": {
    "microsoft/vscode": {
      "commits": 800,
      "prs_merged": 50,
      "issues_closed": 150,
      "contributors": 30
    },
    "microsoft/typescript": {
      "commits": 450,
      "prs_merged": 35,
      "issues_closed": 80,
      "contributors": 25
    }
  },
  "timeframe": "7d",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                  language="json"
                />
              </div>
            </CardContent>
          </Card>

          {/* GET /metrics/repos/{owner}/{repo} */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  GET
                </Badge>
                <CardTitle className="text-2xl">/metrics/repos/{`{owner}`}/{`{repo}`}</CardTitle>
              </div>
              <CardDescription>
                Get metrics for a single repository.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Path Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Parameter</th>
                        <th className="text-left p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="p-3"><code>owner</code></td>
                        <td className="p-3">Repository owner</td>
                      </tr>
                      <tr>
                        <td className="p-3"><code>repo</code></td>
                        <td className="p-3">Repository name</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Query Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Parameter</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Default</th>
                        <th className="text-left p-3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3"><code>timeframe</code></td>
                        <td className="p-3">string</td>
                        <td className="p-3">7d</td>
                        <td className="p-3">Time period: 1d, 7d, 30d, 90d, 1y</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Request</h4>
                <CodeBlock
                  id="repo-metrics-example"
                  code={`curl "${API_BASE}/metrics/repos/facebook/react?timeframe=30d"`}
                />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example Response</h4>
                <CodeBlock
                  id="repo-metrics-response"
                  code={`{
  "repository": "facebook/react",
  "timeframe": "30d",
  "metrics": {
    "commits": 156,
    "prs_opened": 45,
    "prs_merged": 38,
    "issues_opened": 120,
    "issues_closed": 95,
    "contributors": 28
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                  language="json"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Responses */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl mt-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              Error Responses
            </CardTitle>
            <CardDescription>
              All errors return JSON with a consistent structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Error Format</h4>
              <CodeBlock
                id="error-format"
                code={`{
  "detail": "Error message describing what went wrong"
}`}
                language="json"
              />
            </div>

            <div>
              <h4 className="font-semibold mb-3">HTTP Status Codes</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-1">400 Bad Request</div>
                  <div className="text-sm text-muted-foreground">Invalid parameters</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-1">401 Unauthorized</div>
                  <div className="text-sm text-muted-foreground">Missing or invalid API key</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-1">403 Forbidden</div>
                  <div className="text-sm text-muted-foreground">Insufficient permissions</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-1">404 Not Found</div>
                  <div className="text-sm text-muted-foreground">Resource doesn't exist</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-1">429 Too Many Requests</div>
                  <div className="text-sm text-muted-foreground">Rate limit exceeded</div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-1">500 Internal Server Error</div>
                  <div className="text-sm text-muted-foreground">Server error</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Rate Limiting</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Rate limit information is included in response headers:
              </p>
              <CodeBlock
                id="rate-limit-headers"
                code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 3600`}
              />
              <p className="text-sm text-muted-foreground mt-3 mb-2">
                When rate limited, you'll receive a 429 response:
              </p>
              <CodeBlock
                id="rate-limit-error"
                code={`{
  "error": "Rate limit exceeded",
  "limit": 100,
  "reset_in_seconds": 1800
}`}
                language="json"
              />
            </div>
          </CardContent>
        </Card>

        {/* Themes */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Available Themes</CardTitle>
            <CardDescription>
              Choose from 7 built-in themes for your charts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "light", desc: "White background with dark text" },
                { name: "dark", desc: "Dark background with light text" },
                { name: "hyperkit", desc: "HyperKit brand colors" },
                { name: "mint", desc: "Green-tinted light theme" },
                { name: "sunset", desc: "Warm orange/amber dark theme" },
                { name: "ocean", desc: "Blue teal theme" },
                { name: "forest", desc: "Green nature theme" },
              ].map((theme) => (
                <div key={theme.name} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-cyan-400">{theme.name}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

