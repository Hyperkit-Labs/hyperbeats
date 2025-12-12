"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#embed", label: "Embed" },
    { href: "#api", label: "API Docs" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        scrolled
          ? "bg-background/60 backdrop-blur-xl border-white/10 shadow-lg shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full group-hover:bg-cyan-500/40 transition-colors" />
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/20 overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="HyperBeats Logo" 
                  width={32} 
                  height={32} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
              HyperBeats
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-full px-4 transition-all"
                asChild
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-full px-3 gap-2"
              asChild
            >
              <Link
                href="https://github.com/Hyperkit-Labs/hyperbeats"
                target="_blank"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only lg:not-sr-only">GitHub</span>
              </Link>
            </Button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 font-semibold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
              asChild
            >
              <Link href="#embed" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-x-0 top-16 bg-background/95 backdrop-blur-2xl border-b border-white/10 md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className="justify-start text-lg h-12"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                asChild
                className="justify-start text-lg h-12 gap-2"
              >
                <Link
                  href="https://github.com/Hyperkit-Labs/hyperbeats"
                  target="_blank"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </Link>
              </Button>
              <div className="h-px bg-white/10 my-2" />
              <Button className="w-full bg-white text-black h-12 text-lg font-semibold" asChild>
                <Link href="#embed">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
