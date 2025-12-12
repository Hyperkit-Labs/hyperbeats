"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="HyperBeats Logo" 
                  width={32} 
                  height={32} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                HyperBeats
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Real-time activity monitoring and visualization for blockchain ecosystems. 
              Designed for developers who care about aesthetics and performance.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-white hover:bg-white/10 rounded-full" asChild>
                <Link href="https://github.com/Hyperkit-Labs/hyperbeats" target="_blank">
                  <Github className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-white hover:bg-white/10 rounded-full" asChild>
                <Link href="https://x.com/hyperkitlabs" target="_blank">
                  <Twitter className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 tracking-wider uppercase">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#features" className="text-sm hover:text-cyan-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#embed" className="text-sm hover:text-cyan-400 transition-colors">
                  Embed Generator
                </Link>
              </li>
              <li>
                <Link href="#api" className="text-sm hover:text-cyan-400 transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm hover:text-cyan-400 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-6 tracking-wider uppercase">Project</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="https://github.com/Hyperkit-Labs/hyperbeats" 
                  target="_blank"
                  className="text-sm hover:text-cyan-400 transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-sm hover:text-cyan-400 transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-sm hover:text-cyan-400 transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-6 tracking-wider uppercase">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-sm hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © 2025 Hyperkit Labs. MIT License.
          </p>
          <p className="text-sm flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by 
            <Link href="https://hyperionkit.xyz" className="text-white hover:underline ml-1">
              Hyperkit Labs
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
