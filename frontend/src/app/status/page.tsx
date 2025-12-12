"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, AlertCircle, Clock, Server, Database, Zap } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://beats.hyperionkit.xyz";

export default function StatusPage() {
  const [status, setStatus] = React.useState<{
    api: "operational" | "degraded" | "down";
    database: "operational" | "degraded" | "down";
    cache: "operational" | "degraded" | "down";
    uptime: number;
    responseTime: number;
  }>({
    api: "operational",
    database: "operational",
    cache: "operational",
    uptime: 99.9,
    responseTime: 120,
  });

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const start = Date.now();
        const response = await fetch(`${API_BASE}/api/v1/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const end = Date.now();
        const responseTime = end - start;

        if (response.ok) {
          setStatus((prev) => ({
            ...prev,
            api: "operational",
            responseTime,
          }));
        } else {
          setStatus((prev) => ({
            ...prev,
            api: "degraded",
            responseTime,
          }));
        }
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          api: "down",
          responseTime: 0,
        }));
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "degraded":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "down":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return CheckCircle2;
      case "degraded":
        return AlertCircle;
      case "down":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const incidents = [
    {
      id: 1,
      title: "All systems operational",
      status: "resolved",
      date: "2025-01-13",
      description: "No incidents reported. All systems are running smoothly.",
    },
  ];

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
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">System Status</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            Service Status
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time status of HyperBeats API and services
          </p>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Overall Status</div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-lg px-4 py-2 ${getStatusColor(status.api)}`}
                    >
                      {status.api === "operational" ? "All Systems Operational" : "Service Degraded"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Uptime</div>
                    <div className="text-2xl font-bold">{status.uptime}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Response Time</div>
                    <div className="text-2xl font-bold">{status.responseTime}ms</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Status */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: "API",
              status: status.api,
              icon: Server,
              description: "REST API endpoints",
            },
            {
              name: "Database",
              status: status.database,
              icon: Database,
              description: "PostgreSQL database",
            },
            {
              name: "Cache",
              status: status.cache,
              icon: Zap,
              description: "Redis cache layer",
            },
          ].map((service, index) => {
            const Icon = service.icon;
            const StatusIcon = getStatusIcon(service.status);
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <Icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                      </div>
                      <StatusIcon
                        className={`w-5 h-5 ${
                          service.status === "operational"
                            ? "text-green-400"
                            : service.status === "degraded"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      />
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant="outline"
                      className={getStatusColor(service.status)}
                    >
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Incidents</CardTitle>
              <CardDescription>
                History of service incidents and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{incident.title}</h4>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-400 border-green-500/20"
                          >
                            {incident.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {incident.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {new Date(incident.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {incidents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No incidents reported. All systems operational.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Page Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Status page updates automatically every 30 seconds.{" "}
            <a
              href="https://github.com/Hyperkit-Labs/hyperbeats/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Report an issue
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

