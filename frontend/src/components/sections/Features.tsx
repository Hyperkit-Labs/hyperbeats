"use client";

import { 
  BarChart3, 
  Palette, 
  Zap, 
  Shield, 
  Code2, 
  Globe,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BarChart3,
    title: "Multiple Chart Types",
    description: "Activity, TVL, chain comparison, and leaderboard charts. Pick the visualization that fits your data.",
    className: "md:col-span-2",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Palette,
    title: "Customizable Themes",
    description: "Light, dark, hyperkit, and mint themes. Match your README or dashboard aesthetic.",
    className: "md:col-span-1",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Multi-layer caching with Redis and CDN. Cached responses in under 50ms.",
    className: "md:col-span-1",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Shield,
    title: "Rate Limit Tiers",
    description: "100 req/hour free. 1000 with API key. Unlimited for enterprise. Scale as you grow.",
    className: "md:col-span-2",
    gradient: "from-emerald-500/20 to-green-500/20",
  },
  {
    icon: Code2,
    title: "Easy Integration",
    description: "Simple URL-based API. Embed with markdown, HTML, or fetch JSON for custom rendering.",
    className: "md:col-span-1",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Globe,
    title: "Multi-Repo Support",
    description: "Aggregate metrics from up to 10 repositories. See your entire ecosystem at once.",
    className: "md:col-span-2",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Powerful features for monitoring and visualizing your ecosystem activity, built for performance and scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <Card 
              key={feature.title}
              className={cn(
                "group relative border-white/5 bg-black/40 backdrop-blur-sm hover:border-white/10 transition-all duration-300 overflow-hidden",
                feature.className
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                feature.gradient
              )} />
              
              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
                    <feature.icon className="w-6 h-6 text-zinc-300 group-hover:text-white transition-colors" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
