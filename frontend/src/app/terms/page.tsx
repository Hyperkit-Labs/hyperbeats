"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Terms of Service</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Last updated: December 13, 2025
          </p>
        </motion.div>

        <div className="space-y-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing or using HyperBeats ("Service"), you agree to be bound by these Terms of Service. If you
                disagree with any part of these terms, you may not access the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                HyperBeats is provided under the MIT License. You are free to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Use the Service for personal or commercial purposes</li>
                <li>Integrate the API into your applications</li>
                <li>Modify and distribute the source code (subject to license terms)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems to abuse rate limits</li>
                <li>Reverse engineer or attempt to extract the source code</li>
                <li>Use the Service to violate any third-party rights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Rate Limiting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Service implements rate limiting to ensure fair usage:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Public</strong>: 100 requests per hour</li>
                <li><strong>Authenticated</strong>: 1,000 requests per hour</li>
                <li><strong>Enterprise</strong>: Custom limits based on agreement</li>
              </ul>
              <p>
                Exceeding rate limits may result in temporary or permanent suspension of access.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We strive to maintain high availability but do not guarantee uninterrupted service. The Service may be
                temporarily unavailable due to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Maintenance and updates</li>
                <li>Technical issues or failures</li>
                <li>Third-party service dependencies (e.g., GitHub API)</li>
                <li>Force majeure events</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Service, including its original content, features, and functionality, is owned by Hyperkit Labs and
                is protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You retain all rights to content you provide through the Service. By using the Service, you grant us a
                license to use, store, and process that content solely for the purpose of providing the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, either express or
                implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or reliability of data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                In no event shall Hyperkit Labs be liable for any indirect, incidental, special, consequential, or
                punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your use of the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice, for any
                reason, including breach of these Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes
                by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>
                  <strong>Email</strong>:{" "}
                  <a
                    href="mailto:contact@hyperionkit.xyz"
                    className="text-cyan-400 hover:underline"
                  >
                    legal@hyperionkit.xyz
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
        </div>
      </div>
    </div>
  );
}

