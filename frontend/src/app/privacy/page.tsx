"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Last updated: December 13, 2025
          </p>
        </motion.div>

        <div className="space-y-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                HyperBeats ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, and safeguard information when you use our service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. API Usage Data</h3>
                <p>
                  We collect anonymous usage statistics including API request counts, response times, and error rates
                  to improve service performance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Repository Information</h3>
                <p>
                  When you request charts for GitHub repositories, we access public repository data through the GitHub
                  API. We do not store repository content or private information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. API Keys</h3>
                <p>
                  If you use an API key, we store it securely to authenticate your requests. API keys are encrypted
                  and never shared with third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">How We Use Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and maintain our service</li>
                <li>To monitor and analyze usage patterns</li>
                <li>To detect and prevent abuse</li>
                <li>To improve service performance and reliability</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement industry-standard security measures to protect your data. All API keys are encrypted at
                rest, and we use secure connections (HTTPS) for all data transmission.
              </p>
              <p>
                Cached chart data is stored temporarily and automatically expires after the configured TTL (Time To
                Live).
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use the following third-party services that may collect information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>GitHub API</strong>: We access public repository data through GitHub's API. Your use of
                  HyperBeats is subject to GitHub's Terms of Service.
                </li>
                <li>
                  <strong>Vercel Analytics</strong>: We use Vercel Analytics to understand website usage patterns.
                  This service collects anonymous usage data.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Request access to your data</li>
                <li>Request deletion of your API keys</li>
                <li>Opt out of analytics tracking</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>
                  <strong>Email</strong>:{" "}
                  <a
                    href="mailto:contact@hyperionkit.xyz"
                    className="text-cyan-400 hover:underline"
                  >
                    privacy@hyperionkit.xyz
                  </a>
                </li>
                <li>
                  <strong>GitHub</strong>:{" "}
                  <a
                    href="https://github.com/Hyperkit-Labs/hyperbeats/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Open an issue
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

