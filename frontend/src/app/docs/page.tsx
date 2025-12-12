"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Book, Code, Wrench, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = "bash", id }: { code: string; language?: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <Book className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Documentation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            HyperBeats Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete guide to integrating and using HyperBeats for real-time activity visualization
          </p>
        </motion.div>

        {/* Documentation Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-white/5 border border-white/10 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-white/10">
              <Code className="w-4 h-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="embedding" className="data-[state=active]:bg-white/10">
              Embedding
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="data-[state=active]:bg-white/10">
              <Wrench className="w-4 h-4 mr-2" />
              Troubleshooting
            </TabsTrigger>
            <TabsTrigger value="themes" className="data-[state=active]:bg-white/10">
              Themes
            </TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-white/10">
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">What is HyperBeats?</CardTitle>
                <CardDescription>
                  Real-time activity monitoring and visualization for blockchain ecosystems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    HyperBeats is a lightweight analytics visualization service that aggregates activity metrics 
                    from multiple blockchain repositories and exposes them as embeddable SVG/PNG widgets for README 
                    files, dashboards, and documentation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                      <div>
                        <h4 className="font-semibold mb-1">Multi-Repository Aggregation</h4>
                        <p className="text-sm text-muted-foreground">
                          Combine metrics from multiple GitHub repositories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                      <div>
                        <h4 className="font-semibold mb-1">Real-Time Updates</h4>
                        <p className="text-sm text-muted-foreground">
                          Charts update automatically as new data arrives
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                      <div>
                        <h4 className="font-semibold mb-1">Customizable Themes</h4>
                        <p className="text-sm text-muted-foreground">
                          Choose from 7 built-in themes or create custom ones
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
                      <div>
                        <h4 className="font-semibold mb-1">High Performance</h4>
                        <p className="text-sm text-muted-foreground">
                          Multi-layer caching for sub-second response times
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">1. Embed in Your README</h4>
                      <CodeBlock
                        id="quickstart-readme"
                        code={`![Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/repo&timeframe=30d&theme=hyperkit)`}
                        language="markdown"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">2. Use the API</h4>
                      <CodeBlock
                        id="quickstart-api"
                        code={`curl "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&timeframe=7d&format=svg"`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Base URL</h3>
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <code className="text-cyan-400 font-mono">https://beats.hyperionkit.xyz/api/v1</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">API Reference</CardTitle>
                <CardDescription>
                  Complete API documentation for all endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Authentication */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-cyan-400" />
                    Authentication
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Most endpoints are publicly accessible with rate limits. Include your API key in the 
                    <code className="mx-1 px-2 py-1 rounded bg-white/10 text-sm">X-API-Key</code> header for higher limits.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                  <CodeBlock
                    id="auth-example"
                    code={`curl -H "X-API-Key: hb_your_key_here" \\
  https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo`}
                  />
                </div>

                {/* GET /chart/activity */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      GET
                    </Badge>
                    <h3 className="text-xl font-semibold">/chart/activity</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Generate an activity chart for repositories.
                  </p>
                  
                  <div className="mb-4">
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

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Example Request</h4>
                    <CodeBlock
                      id="activity-example"
                      code={`curl "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=octocat/Hello-World&timeframe=30d&theme=dark"`}
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
                    </ul>
                  </div>
                </div>

                {/* GET /metrics/aggregate */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                      GET
                    </Badge>
                    <h3 className="text-xl font-semibold">/metrics/aggregate</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Get aggregated metrics as JSON.
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Example Request</h4>
                    <CodeBlock
                      id="metrics-example"
                      code={`curl "https://beats.hyperionkit.xyz/api/v1/metrics/aggregate?repos=microsoft/vscode,microsoft/typescript"`}
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
    }
  },
  "timeframe": "7d",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                      language="json"
                    />
                  </div>
                </div>

                {/* Error Responses */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Error Responses</h3>
                  <p className="text-muted-foreground mb-4">
                    All errors return JSON with the following structure:
                  </p>
                  <CodeBlock
                    id="error-response"
                    code={`{
  "detail": "Error message describing what went wrong"
}`}
                    language="json"
                  />
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="font-semibold text-red-400 mb-1">400 Bad Request</div>
                      <div className="text-sm text-muted-foreground">Invalid parameters</div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="font-semibold text-red-400 mb-1">429 Too Many Requests</div>
                      <div className="text-sm text-muted-foreground">Rate limit exceeded</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Embedding Tab */}
          <TabsContent value="embedding" className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Embedding Charts</CardTitle>
                <CardDescription>
                  Learn how to embed HyperBeats charts in various platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* GitHub README */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">GitHub README</h3>
                  <p className="text-muted-foreground mb-4">
                    The most common use case is embedding activity charts in your repository's README.md.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Basic Embed</h4>
                      <CodeBlock
                        id="readme-basic"
                        code={`![Repository Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/your-repo)`}
                        language="markdown"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">With Options</h4>
                      <CodeBlock
                        id="readme-options"
                        code={`![Repository Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/your-repo&timeframe=30d&theme=dark)`}
                        language="markdown"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Multiple Repositories</h4>
                      <CodeBlock
                        id="readme-multiple"
                        code={`![Ecosystem Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/repo1,your-org/repo2,your-org/repo3)`}
                        language="markdown"
                      />
                    </div>
                  </div>
                </div>

                {/* HTML Embedding */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">HTML Embedding</h3>
                  <p className="text-muted-foreground mb-4">
                    For websites and dashboards:
                  </p>
                  <CodeBlock
                    id="html-embed"
                    code={`<!-- Basic embed -->
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo" 
  alt="Repository Activity"
  width="800"
  height="400"
/>

<!-- With custom dimensions -->
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&width=600&height=300" 
  alt="Repository Activity"
/>

<!-- PNG format for better compatibility -->
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&format=png" 
  alt="Repository Activity"
/>`}
                    language="html"
                  />
                </div>

                {/* Other Platforms */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Other Platforms</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Notion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Use the <code>/embed</code> command and paste the chart URL
                        </p>
                        <CodeBlock
                          id="notion-embed"
                          code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&theme=dark`}
                        />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Slack</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Share the direct URL. SVG charts will unfurl automatically
                        </p>
                        <CodeBlock
                          id="slack-embed"
                          code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo`}
                        />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Discord</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Use markdown image syntax
                        </p>
                        <CodeBlock
                          id="discord-embed"
                          code={`![Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&format=png)`}
                          language="markdown"
                        />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Confluence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          Use the Image macro with the chart URL
                        </p>
                        <CodeBlock
                          id="confluence-embed"
                          code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo`}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Best Practices */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Best Practices</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-semibold mb-2">1. Use Appropriate Timeframes</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li><strong>1d</strong>: Real-time dashboards</li>
                        <li><strong>7d</strong>: Weekly reports</li>
                        <li><strong>30d</strong>: Monthly reviews</li>
                        <li><strong>90d</strong>: Quarterly summaries</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-semibold mb-2">2. Choose the Right Theme</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li><strong>light</strong>: Light-mode websites and documents</li>
                        <li><strong>dark</strong>: Dark-mode interfaces and GitHub dark mode</li>
                        <li><strong>hyperkit</strong>: HyperKit branded content</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-semibold mb-2">3. PNG vs SVG</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left p-2">Format</th>
                              <th className="text-left p-2">Use Case</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-white/5">
                              <td className="p-2"><code>SVG</code></td>
                              <td className="p-2">Web, GitHub, interactive dashboards</td>
                            </tr>
                            <tr>
                              <td className="p-2"><code>PNG</code></td>
                              <td className="p-2">Email, PDF exports, Slack/Discord</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Troubleshooting</CardTitle>
                <CardDescription>
                  Common issues and their solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    API Returns 400 Bad Request
                  </h3>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Problem:</strong> The API returns a 400 status code with an error message.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left p-2">Error Message</th>
                            <th className="text-left p-2">Cause</th>
                            <th className="text-left p-2">Solution</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5">
                            <td className="p-2"><code>"Invalid repository format"</code></td>
                            <td className="p-2">Wrong repo format</td>
                            <td className="p-2">Use <code>owner/repo</code> format</td>
                          </tr>
                          <tr className="border-b border-white/5">
                            <td className="p-2"><code>"Invalid timeframe"</code></td>
                            <td className="p-2">Unknown timeframe</td>
                            <td className="p-2">Use 1d, 7d, 30d, 90d, or 1y</td>
                          </tr>
                          <tr>
                            <td className="p-2"><code>"Maximum 10 repositories"</code></td>
                            <td className="p-2">Too many repos</td>
                            <td className="p-2">Reduce to 10 or fewer</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    API Returns 429 Too Many Requests
                  </h3>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Problem:</strong> Rate limit exceeded.
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Solution:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3">
                      <li>Wait for rate limit reset (check <code>X-RateLimit-Reset</code> header)</li>
                      <li>Use an API key for higher limits</li>
                      <li>Implement caching in your application</li>
                    </ul>
                    <CodeBlock
                      id="rate-limit-check"
                      code={`curl -I "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo"
# Look for:
# X-RateLimit-Remaining: 50
# X-RateLimit-Reset: 1800`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    Charts Show Zero Data
                  </h3>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Problem:</strong> Chart renders but shows no activity.
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Causes:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-3">
                      <li>Repository has no recent activity</li>
                      <li>Repository is private (API can't access)</li>
                      <li>Wrong timeframe for activity</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Try a longer timeframe: <code>?timeframe=90d</code></li>
                      <li>Verify repository is public</li>
                      <li>Check repository activity on GitHub</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-400" />
                    Cache Not Working
                  </h3>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Problem:</strong> Charts don't update or always show "MISS".
                    </p>
                    <CodeBlock
                      id="cache-check"
                      code={`curl -I "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo"
# Look for: X-Cache: HIT_L1 or MISS`}
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Wait for cache population (first request is always MISS)</li>
                      <li>Ensure Redis is running (for self-hosted)</li>
                      <li>Check cache configuration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Themes</CardTitle>
                <CardDescription>
                  Available color themes for your charts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "light", bg: "#ffffff", text: "#1f2937", primary: "#3182ce", desc: "White background with dark text" },
                    { name: "dark", bg: "#1a202c", text: "#e2e8f0", primary: "#63b3ed", desc: "Dark background with light text" },
                    { name: "hyperkit", bg: "#0f1419", text: "#e8f0f7", primary: "#2186b5", desc: "HyperKit brand colors" },
                    { name: "mint", bg: "#f0fdf4", text: "#1e4e2c", primary: "#10b981", desc: "Green-tinted light theme" },
                    { name: "sunset", bg: "#1c1917", text: "#fef3c7", primary: "#f59e0b", desc: "Warm orange/amber dark theme" },
                    { name: "ocean", bg: "#0c4a6e", text: "#e0f2fe", primary: "#0ea5e9", desc: "Blue teal theme" },
                    { name: "forest", bg: "#1a2e05", text: "#dcfce7", primary: "#22c55e", desc: "Green nature theme" },
                  ].map((theme) => (
                    <Card key={theme.name} className="bg-white/5 border-white/10 overflow-hidden">
                      <div 
                        className="h-24 flex items-center justify-center"
                        style={{ backgroundColor: theme.bg }}
                      >
                        <div 
                          className="text-2xl font-bold"
                          style={{ color: theme.text }}
                        >
                          {theme.name}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <h4 className="font-semibold capitalize">{theme.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{theme.desc}</p>
                        <CodeBlock
                          id={`theme-${theme.name}`}
                          code={`?theme=${theme.name}`}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Examples</CardTitle>
                <CardDescription>
                  Real-world examples and use cases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Single Repository</h3>
                  <CodeBlock
                    id="example-single"
                    code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=facebook/react&timeframe=30d&theme=dark`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Multiple Repositories</h3>
                  <CodeBlock
                    id="example-multiple"
                    code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=microsoft/vscode,microsoft/typescript,microsoft/edge&timeframe=7d&theme=hyperkit`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">PNG Format</h3>
                  <CodeBlock
                    id="example-png"
                    code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=vercel/next.js&format=png&width=1200&height=600&theme=light`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Custom Dimensions</h3>
                  <CodeBlock
                    id="example-dimensions"
                    code={`https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=nodejs/node&width=1000&height=500&theme=ocean`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">With API Key</h3>
                  <CodeBlock
                    id="example-api-key"
                    code={`curl -H "X-API-Key: hb_your_key_here" \\
  "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&timeframe=90d"`}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Button variant="link" asChild className="text-muted-foreground">
              <a href="https://github.com/Hyperkit-Labs/hyperbeats" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                GitHub Repository
              </a>
            </Button>
            <Button variant="link" asChild className="text-muted-foreground">
              <a href="https://hyperionkit.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                HyperKit Website
              </a>
            </Button>
            <Button variant="link" asChild className="text-muted-foreground">
              <a href="https://github.com/Hyperkit-Labs/hyperbeats/issues" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Report Issue
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

