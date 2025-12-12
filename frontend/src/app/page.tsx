"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { ChartPreview } from "@/components/sections/ChartPreview";
import { Features } from "@/components/sections/Features";
import { EmbedGenerator } from "@/components/sections/EmbedGenerator";
import { ApiDocs } from "@/components/sections/ApiDocs";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const [repos, setRepos] = useState<string[]>(["octocat/Hello-World"]);

  return (
    <main className="min-h-screen gradient-mesh">
      <Header />
      <Hero />
      <ChartPreview repos={repos} onReposChange={setRepos} />
      <Features />
      <EmbedGenerator repos={repos} />
      <ApiDocs />
      <Footer />
    </main>
  );
}
