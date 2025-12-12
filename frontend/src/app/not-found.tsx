"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 leading-none">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 blur-3xl -z-10" />
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 font-semibold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-full border-white/20 hover:bg-white/5"
            >
              <Link href="/docs" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse Docs
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="rounded-full"
              onClick={() => window.history.back()}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </div>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-muted-foreground mb-4">
              You might be looking for:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Home
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/docs"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Documentation
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/api"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                API Reference
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/status"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Status
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

