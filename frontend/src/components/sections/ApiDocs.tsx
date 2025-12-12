"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/chart/activity",
    description: "Generate activity chart for repositories",
    params: [
      { name: "repos", type: "string[]", required: true, description: "Repository names (owner/repo)" },
      { name: "timeframe", type: "string", required: false, default: "7d", description: "1d, 7d, 30d, 90d, 1y" },
      { name: "format", type: "string", required: false, default: "svg", description: "svg or png" },
      { name: "theme", type: "string", required: false, default: "light", description: "light, dark, hyperkit, mint" },
      { name: "width", type: "number", required: false, default: "800", description: "Chart width (200-2000)" },
      { name: "height", type: "number", required: false, default: "400", description: "Chart height (100-1000)" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/metrics/aggregate",
    description: "Get aggregated metrics as JSON",
    params: [
      { name: "repos", type: "string[]", required: true, description: "Repository names (owner/repo)" },
      { name: "timeframe", type: "string", required: false, default: "7d", description: "1d, 7d, 30d, 90d, 1y" },
      { name: "include_historical", type: "boolean", required: false, default: "false", description: "Include time series" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/metrics/repos/{owner}/{repo}",
    description: "Get metrics for a single repository",
    params: [
      { name: "owner", type: "string", required: true, description: "Repository owner" },
      { name: "repo", type: "string", required: true, description: "Repository name" },
      { name: "timeframe", type: "string", required: false, default: "7d", description: "1d, 7d, 30d, 90d, 1y" },
    ],
  },
];

export function ApiDocs() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(0);

  return (
    <section id="api" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            API Reference
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple REST API for generating charts and fetching metrics.
            <Button variant="link" className="text-cyan-400 hover:text-cyan-300 ml-1 h-auto p-0" asChild>
              <Link href="https://beats.hyperionkit.xyz/docs" target="_blank">
                Full Documentation <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </p>
        </div>

        {/* Base URL */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Base URL:</span>
            <code className="text-sm text-cyan-400 font-mono">
              https://beats.hyperionkit.xyz
            </code>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              <div
                onClick={() => setExpandedEndpoint(expandedEndpoint === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm text-foreground font-mono">{endpoint.path}</code>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {endpoint.description}
                  </span>
                  {expandedEndpoint === index ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedEndpoint === index && (
                <div className="px-6 pb-6 border-t border-border/50 bg-background/20">
                  <p className="text-sm text-muted-foreground mt-4 mb-4 sm:hidden">
                    {endpoint.description}
                  </p>
                  
                  <h4 className="text-sm font-semibold text-foreground mb-3 mt-4">Parameters</h4>
                  <div className="rounded-md border border-border/50 bg-background/50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Required</TableHead>
                          <TableHead>Default</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {endpoint.params.map((param) => (
                          <TableRow key={param.name}>
                            <TableCell>
                              <code className="text-cyan-400 font-mono">{param.name}</code>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{param.type}</TableCell>
                            <TableCell>
                              {param.required ? (
                                <Badge variant="secondary" className="text-amber-400 bg-amber-500/10 hover:bg-amber-500/20">Yes</Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">No</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{param.default || "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{param.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="mt-12">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-background/40 border-border/50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-foreground mb-1">100</div>
                    <div className="text-sm text-muted-foreground">requests/hour</div>
                    <div className="text-xs text-muted-foreground mt-1">Public (no key)</div>
                  </CardContent>
                </Card>
                <Card className="bg-background/40 border-border/50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">1,000</div>
                    <div className="text-sm text-muted-foreground">requests/hour</div>
                    <div className="text-xs text-muted-foreground mt-1">Authenticated</div>
                  </CardContent>
                </Card>
                <Card className="bg-background/40 border-border/50">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-400 mb-1">Unlimited</div>
                    <div className="text-sm text-muted-foreground">requests/hour</div>
                    <div className="text-xs text-muted-foreground mt-1">Enterprise</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
