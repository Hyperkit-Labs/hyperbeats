# Hyperbeats Technical Guide

**Version**: 1.0  
**Date**: December 12, 2025  
**Purpose**: Real-time activity monitoring & visualization for HyperKit ecosystem metrics  
**Status**: Integration Ready

---

## TABLE OF CONTENTS

1. [Overview & Purpose](#overview--purpose)
2. [What is Hyperbeats?](#what-is-hyperbeats)
3. [Integration with HyperKit](#integration-with-hyperkit)
4. [Architecture & Data Flow](#architecture--data-flow)
5. [Core Features](#core-features)
6. [API Endpoints](#api-endpoints)
7. [SVG/PNG Output Formats](#svgpng-output-formats)
8. [Implementation Details](#implementation-details)
9. [Deployment & Hosting](#deployment--hosting)
10. [Customization & Theming](#customization--theming)
11. [Performance Optimization](#performance-optimization)
12. [Security Considerations](#security-considerations)
13. [Monitoring Metrics](#monitoring-metrics)
14. [Integration Examples](#integration-examples)
15. [Troubleshooting Guide](#troubleshooting-guide)

---

## OVERVIEW & PURPOSE

**Hyperbeats** is a lightweight, hosted analytics visualization service that aggregates activity metrics from multiple blockchain repositories and exposes them as **embeddable SVG/PNG widgets** for README files, dashboards, and documentation.

### Why Hyperbeats Matters for HyperKit

HyperKit generates smart contracts and dApps across 100+ blockchain networks. Developers need **real-time visibility** into:
- ✅ Build activity across chains
- ✅ Community engagement metrics
- ✅ TVL trends for deployed dApps
- ✅ Gas efficiency metrics
- ✅ Template usage statistics
- ✅ Points/rewards distribution
- ✅ Network status indicators

**Hyperbeats solves this** by providing **shareable, auto-updating visualizations** that can be embedded anywhere.

### Key Benefits

```
WITHOUT HYPERBEATS:
├─ Manual metric collection (tedious)
├─ Static dashboards (lag behind reality)
├─ No shareable widgets
├─ Developers can't showcase their metrics
└─ Community doesn't see real activity

WITH HYPERBEATS:
├─ Automatic aggregation (live data)
├─ Real-time visualizations (always current)
├─ Embeddable SVG/PNG widgets
├─ Developers share their stats in READMEs
└─ Community transparency & trust
```

---

## WHAT IS HYPERBEATS?

### Definition

Hyperbeats is a **metrics aggregation and visualization platform** that:

1. **Ingests** activity data from multiple data sources (repos, chains, APIs)
2. **Aggregates** activity into meaningful metrics (daily, weekly, monthly)
3. **Renders** beautiful SVG/PNG charts with customizable themes
4. **Serves** embeddable widgets via HTTP endpoints
5. **Caches** results for performance
6. **Updates** in real-time as new data arrives

### Core Concept

```
Input (Repos/APIs)
    ↓
Aggregation Engine
    ↓
Metric Calculation
    ↓
SVG/PNG Rendering
    ↓
HTTP Endpoint
    ↓
Embed in README/Dashboard
    ↓
Real-time Display (auto-refresh)
```

### Example Use Cases

```
CASE 1: GitHub Repository Activity
Input: Hyperkit-Labs/hyperbeats repo
Output: Contributions chart (embeddable)
Embed: In repository README
Use: Show ecosystem activity

CASE 2: Multi-Repo Aggregation
Input: [HyperKit/SDK, HyperKit/Agent, HyperKit/Dashboard]
Output: Combined activity heatmap
Embed: In main org dashboard
Use: Show overall development velocity

CASE 3: Blockchain dApp Metrics
Input: TVL data from deployed dApps
Output: Growth chart over time
Embed: In project documentation
Use: Show ecosystem value growth

CASE 4: Points/Rewards Tracker
Input: User points from smart contract
Output: Community rewards leaderboard
Embed: In rewards portal
Use: Gamify contribution tracking
```

---

## INTEGRATION WITH HYPERKIT

### How Hyperbeats Fits in HyperKit Architecture

```
HyperKit Ecosystem
├─ HyperAgent (contract generator)
├─ HyperKit SDK (deployment)
├─ Smart Wallet (account abstraction)
├─ x402 Billing (payments)
├─ Developer Dashboard (UI)
└─ HYPERBEATS (monitoring & visualization) ← YOU ARE HERE

Hyperbeats Role:
├─ Collects metrics from all HyperKit components
├─ Aggregates across 100+ chains
├─ Renders shareable activity widgets
├─ Powers real-time dashboards
└─ Provides embeddable visualizations
```

### Metrics Hyperbeats Tracks for HyperKit

```
LEVEL 1: ACTIVITY METRICS
├─ Builds per day (by chain)
├─ Deployments per hour
├─ Success/failure rates
├─ Average build time
└─ Peak activity windows

LEVEL 2: TVL METRICS
├─ Total value locked across chains
├─ TVL by chain breakdown
├─ TVL growth trends
├─ Top dApps by TVL
└─ Liquidation events

LEVEL 3: ECOSYSTEM METRICS
├─ Active users (daily/weekly/monthly)
├─ Points earned per day
├─ $HYPE token distribution
├─ Community member count
└─ Governance participation

LEVEL 4: NETWORK METRICS
├─ Gas usage by network
├─ Transaction success rates
├─ Cross-chain bridge volume
├─ RPC provider performance
└─ Network status indicators

LEVEL 5: QUALITY METRICS
├─ AI audit pass rates
├─ Code quality scores
├─ Security incident count
├─ Bug discovery rate
└─ User satisfaction scores
```

### Data Sources for Hyperbeats

```
PRIMARY SOURCES:
├─ HyperKit API (/api/metrics)
├─ PostgreSQL (historical data)
├─ Redis (real-time counters)
├─ On-chain contracts (Moralis, The Graph)
└─ GitHub (repo activity)

SECONDARY SOURCES:
├─ Chainlink (oracle data)
├─ Dune Analytics (chain metrics)
├─ Alchemy (transaction data)
├─ Moralis Streams (webhooks)
└─ Custom event indexers
```

---

## ARCHITECTURE & DATA FLOW

### System Architecture

```
┌────────────────────────────────────────────────────┐
│          Data Collection Layer                     │
│  ├─ HyperKit API                                   │
│  ├─ Blockchain RPC nodes                          │
│  ├─ GitHub API                                    │
│  └─ Third-party APIs (Dune, Moralis, etc.)       │
└────────────┬─────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────┐
│      Data Processing Layer (Hyperbeats Core)      │
│  ├─ Event ingestion (Kafka/Redis Streams)        │
│  ├─ Data normalization                           │
│  ├─ Time-series aggregation                      │
│  ├─ Metric calculation engine                    │
│  └─ Cache layer (Redis)                          │
└────────────┬─────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────┐
│      Rendering & Storage Layer                   │
│  ├─ SVG renderer (Plotly, D3.js)                 │
│  ├─ PNG generator (Puppeteer)                    │
│  ├─ Database (PostgreSQL)                        │
│  └─ CDN storage (Cloudflare, S3)                 │
└────────────┬─────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────┐
│        HTTP API Layer                             │
│  ├─ FastAPI endpoints                            │
│  ├─ Query parameters (timeframe, theme, etc.)   │
│  ├─ Response caching (ETags)                     │
│  └─ Rate limiting                                │
└────────────┬─────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────┐
│     Distribution & Embedding Layer                │
│  ├─ README embeds (SVG/PNG)                      │
│  ├─ Dashboard iframes                            │
│  ├─ Real-time updates (WebSocket)                │
│  └─ Public CDN serving                           │
└────────────────────────────────────────────────────┘
```

### Data Flow: Real-Time Example

```
SCENARIO: New build completes on Solana

STEP 1: Event Capture (T+0)
├─ HyperKit API logs build event
├─ Event: {buildId, chain: "solana", timestamp, status: "complete"}
└─ Published to Redis Stream: builds:events

STEP 2: Data Ingestion (T+1s)
├─ Hyperbeats worker consumes Redis event
├─ Validates event schema
├─ Enriches with blockchain data
└─ Stores in time-series database

STEP 3: Metric Aggregation (T+5s)
├─ Aggregate worker recalculates metrics
├─ Updates: daily_builds_solana counter
├─ Computes: rolling 7-day average
├─ Invalidates cache for affected charts
└─ Recalculates: TVL impact estimation

STEP 4: Rendering (T+10s)
├─ Chart renderer detects cache miss
├─ Queries aggregated metrics from DB
├─ Renders SVG using latest data
├─ Generates PNG via Puppeteer
├─ Stores in CDN with 1-hour TTL
└─ Returns ETag for client caching

STEP 5: Distribution (T+15s)
├─ Embedded widget in README refreshes
├─ WebSocket connection receives update
├─ Chart animates new data point
├─ User sees real-time activity
└─ Metrics updated across ecosystem
```

---

## CORE FEATURES

### Feature 1: Multi-Repository Aggregation

**Purpose**: Combine activity from multiple repos into single visualization

```typescript
// backend/hyperbeats/aggregator/repo_aggregator.py

class RepositoryAggregator:
    """Combine metrics from multiple GitHub repos"""
    
    async def aggregate_repos(
        self,
        repo_list: List[str],  # ["user/repo1", "user/repo2"]
        timeframe: str = "7d"   # "1d", "7d", "30d", "90d"
    ) -> Dict:
        """
        Aggregate activity across repos
        Returns combined metrics object
        """
        
        metrics = {}
        
        for repo in repo_list:
            # Fetch GitHub data
            commits = await github_api.get_commits(repo, timeframe)
            prs = await github_api.get_prs(repo, timeframe)
            issues = await github_api.get_issues(repo, timeframe)
            
            # Store per-repo
            metrics[repo] = {
                "commits": len(commits),
                "prs_merged": len([pr for pr in prs if pr.merged]),
                "issues_closed": len([i for i in issues if i.closed]),
                "contributors": len(set(c.author for c in commits))
            }
        
        # Combine
        total = {
            "repos": len(repo_list),
            "total_commits": sum(m["commits"] for m in metrics.values()),
            "total_prs": sum(m["prs_merged"] for m in metrics.values()),
            "total_issues_closed": sum(m["issues_closed"] for m in metrics.values()),
            "unique_contributors": len(set(
                contrib
                for m in metrics.values()
                for contrib in m.get("contributors", [])
            ))
        }
        
        return {
            "per_repo": metrics,
            "aggregated": total,
            "timestamp": datetime.now().isoformat()
        }
```

### Feature 2: Theme Customization

**Purpose**: Match visualization to brand colors

```python
# backend/hyperbeats/themes/theme_manager.py

class ThemeManager:
    """Manage SVG/PNG color themes"""
    
    THEMES = {
        "light": {
            "background": "#ffffff",
            "text": "#1f2937",
            "primary": "#3182ce",
            "secondary": "#48bb78",
            "accent": "#ed8936",
            "grid": "#e2e8f0"
        },
        "dark": {
            "background": "#1a202c",
            "text": "#e2e8f0",
            "primary": "#63b3ed",
            "secondary": "#68d391",
            "accent": "#f6ad55",
            "grid": "#4a5568"
        },
        "hyperkit": {
            "background": "#0f1419",      # HyperKit dark
            "text": "#e8f0f7",            # Light blue-gray
            "primary": "#2186b5",         # Teal
            "secondary": "#8bcf7f",       # Green
            "accent": "#f59e0b",          # Amber
            "grid": "#2d3748"
        },
        "mint": {
            "background": "#f0fdf4",
            "text": "#1e4e2c",
            "primary": "#10b981",
            "secondary": "#34d399",
            "accent": "#6ee7b7",
            "grid": "#d1fae5"
        }
    }
    
    async def apply_theme(
        self,
        svg_content: str,
        theme: str = "light"
    ) -> str:
        """Apply theme colors to SVG"""
        
        colors = self.THEMES.get(theme, self.THEMES["light"])
        
        # Replace color variables
        for key, color in colors.items():
            svg_content = svg_content.replace(
                f"var(--color-{key})",
                color
            )
        
        return svg_content
```

### Feature 3: Caching & Performance

**Purpose**: Fast response times for popular queries

```python
# backend/hyperbeats/cache/cache_manager.py

class CacheManager:
    """Multi-layer caching strategy"""
    
    async def get_or_generate(
        self,
        cache_key: str,
        generator_func,
        ttl: int = 3600
    ):
        """
        L1: Check Redis cache
        L2: Check CDN cache
        L3: Generate if missing
        """
        
        # L1: Redis (memory)
        cached = await redis.get(cache_key)
        if cached:
            return cached, "HIT_REDIS"
        
        # L2: CDN (disk/edge)
        cdn_path = f"cache/{cache_key}.json"
        try:
            cached = await s3.get_object(cdn_path)
            # Restore to Redis
            await redis.setex(cache_key, ttl, cached)
            return cached, "HIT_CDN"
        except:
            pass
        
        # L3: Generate
        result = await generator_func()
        
        # Store in both layers
        await redis.setex(cache_key, ttl, result)
        await s3.put_object(cdn_path, result)
        
        return result, "GENERATED"
```

### Feature 4: Real-Time Updates

**Purpose**: Live dashboard updates without page refresh

```typescript
// frontend/hooks/useHyperbeatsStream.ts

export function useHyperbeatsStream(widgetId: string) {
  const [data, setData] = useState(null);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(
      `wss://beats.hyperionkit.xyz/stream/${widgetId}`
    );
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      if (update.type === "metric_update") {
        setUpdating(true);
        
        // Animate transition
        setData(prevData => ({
          ...prevData,
          ...update.metrics,
          lastUpdated: new Date().toISOString()
        }));
        
        setTimeout(() => setUpdating(false), 500);
      }
    };
    
    return () => ws.close();
  }, [widgetId]);
  
  return { data, updating };
}
```

---

## API ENDPOINTS

### Core Endpoints

#### 1. Generate Activity Chart

```
GET /api/v1/chart/activity

Parameters:
├─ repos: string[] (required)
│   Example: ?repos=Hyperkit-Labs/hyperbeats&repos=Hyperkit-Labs/sdk
├─ timeframe: "1d" | "7d" | "30d" | "90d" | "1y" (default: "7d")
├─ format: "svg" | "png" (default: "svg")
├─ theme: "light" | "dark" | "hyperkit" | "mint" (default: "light")
├─ width: number (default: 800)
└─ height: number (default: 400)

Response:
├─ If format=svg: Returns raw SVG content (Content-Type: image/svg+xml)
├─ If format=png: Returns PNG binary (Content-Type: image/png)
└─ Cache-Control: public, max-age=3600

Example:
GET /api/v1/chart/activity?repos=Hyperkit-Labs/hyperbeats&timeframe=30d&format=svg&theme=hyperkit
```

#### 2. Get Raw Metrics

```
GET /api/v1/metrics/aggregate

Parameters:
├─ repos: string[] (required)
├─ timeframe: string (default: "7d")
├─ metrics: string[] (optional)
│   Example: ?metrics=commits&metrics=prs&metrics=contributors
└─ include_historical: boolean (default: false)

Response:
{
  "aggregated": {
    "commits": 245,
    "prs_merged": 18,
    "issues_closed": 42,
    "contributors": 12
  },
  "per_repo": {
    "Hyperkit-Labs/hyperbeats": { /* ... */ },
    "Hyperkit-Labs/sdk": { /* ... */ }
  },
  "historical": [
    { "date": "2025-12-05", "commits": 20, "prs": 2, "issues": 5 },
    { "date": "2025-12-06", "commits": 18, "prs": 1, "issues": 3 }
  ],
  "timestamp": "2025-12-12T22:07:00Z"
}
```

#### 3. Chain Activity Dashboard

```
GET /api/v1/chart/chain-activity

Parameters:
├─ chains: string[] (required)
│   Example: ?chains=mantle&chains=solana&chains=sui
├─ metric: "builds" | "tvl" | "gas" | "transactions" (default: "builds")
├─ timeframe: string (default: "7d")
├─ format: "svg" | "png" (default: "svg")
└─ theme: string (default: "light")

Response:
├─ SVG/PNG with multi-chain comparison
├─ Shows metric breakdown by chain
└─ Real-time updates via WebSocket
```

#### 4. TVL Tracker

```
GET /api/v1/chart/tvl

Parameters:
├─ dapps: string[] (optional - if empty, shows all)
├─ chains: string[] (optional - if empty, shows aggregate)
├─ timeframe: string (default: "30d")
├─ format: "svg" | "png" (default: "svg")
└─ theme: string (default: "light")

Response:
├─ Area chart showing TVL over time
├─ Color-coded by chain
└─ Includes current TVL value in title
```

#### 5. Points Leaderboard

```
GET /api/v1/chart/points-leaderboard

Parameters:
├─ period: "week" | "month" | "all-time" (default: "month")
├─ top_n: number (default: 20)
├─ format: "svg" | "png" | "table" (default: "svg")
└─ theme: string (default: "light")

Response:
├─ Top 20 contributors by points earned
├─ Bar chart with usernames
├─ Shows points and badges
└─ Updates hourly
```

---

## SVG/PNG OUTPUT FORMATS

### SVG Output Structure

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
  <!-- Metadata -->
  <defs>
    <style>
      :root {
        --color-background: #ffffff;
        --color-text: #1f2937;
        --color-primary: #3182ce;
      }
      
      .chart-title { font-size: 18px; font-weight: bold; }
      .axis-label { font-size: 12px; }
      .grid-line { stroke: var(--color-grid); }
      .data-point { fill: var(--color-primary); }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="400" fill="var(--color-background)"/>
  
  <!-- Title -->
  <text x="400" y="30" class="chart-title" text-anchor="middle">
    Repository Activity - Last 7 Days
  </text>
  
  <!-- Grid -->
  <g class="grid">
    <line x1="60" y1="60" x2="60" y2="360" class="grid-line"/>
    <line x1="60" y1="360" x2="760" y2="360" class="grid-line"/>
  </g>
  
  <!-- Data visualization -->
  <polyline points="80,300 150,250 220,200 290,280..." 
            fill="none" stroke="var(--color-primary)" stroke-width="2"/>
  
  <!-- Legend -->
  <g transform="translate(600, 100)">
    <rect width="150" height="80" fill="white" stroke="var(--color-border)"/>
    <circle cx="15" cy="15" r="4" fill="var(--color-primary)"/>
    <text x="25" y="20" class="axis-label">Commits</text>
  </g>
  
  <!-- Last updated -->
  <text x="760" y="390" font-size="10" text-anchor="end" fill="var(--color-text-secondary)">
    Updated: 2025-12-12 22:07 UTC
  </text>
</svg>
```

### PNG Output (Puppeteer Generation)

```python
# backend/hyperbeats/renderer/png_renderer.py

class PNGRenderer:
    """Convert SVG to high-quality PNG"""
    
    async def render_png(
        self,
        svg_content: str,
        width: int = 800,
        height: int = 400,
        dpi: int = 150
    ) -> bytes:
        """Render SVG to PNG using Puppeteer"""
        
        async with await self.browser.create_page() as page:
            # Set viewport
            await page.set_viewport_size({
                "width": width,
                "height": height
            })
            
            # Set content
            await page.set_content(svg_content)
            
            # Render at high DPI
            png_buffer = await page.screenshot(
                path=None,
                type="png",
                full_page=True,
                quality=95,
                device_scale_factor=dpi / 96  # Convert DPI
            )
            
            return png_buffer
```

---

## IMPLEMENTATION DETAILS

### Backend Stack

```python
# backend/hyperbeats/main.py

from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import Response
import aioredis
import asyncpg
from datetime import datetime, timedelta

app = FastAPI(title="Hyperbeats", version="1.0")

# Dependencies
redis_client = None
db_pool = None

@app.on_event("startup")
async def startup():
    global redis_client, db_pool
    redis_client = await aioredis.create_redis_pool('redis://localhost')
    db_pool = await asyncpg.create_pool('postgresql://user:pass@localhost/hyperbeats')

@app.get("/api/v1/chart/activity")
async def chart_activity(
    repos: List[str] = Query(...),
    timeframe: str = Query("7d"),
    format: str = Query("svg"),
    theme: str = Query("light")
):
    """Generate activity chart for repos"""
    
    # Build cache key
    cache_key = f"chart:activity:{':'.join(sorted(repos))}:{timeframe}:{theme}"
    
    # Check cache
    cached = await redis_client.get(cache_key)
    if cached:
        return Response(
            content=cached,
            media_type=f"image/{format}",
            headers={"X-Cache": "HIT"}
        )
    
    # Aggregate metrics
    metrics = await aggregate_repos(repos, timeframe)
    
    # Render chart
    if format == "svg":
        chart = await render_svg(metrics, theme)
    else:
        chart = await render_png(metrics, theme)
    
    # Cache
    await redis_client.setex(cache_key, 3600, chart)
    
    return Response(
        content=chart,
        media_type=f"image/{format}",
        headers={"X-Cache": "MISS"}
    )
```

### Frontend Integration

```markdown
# HyperKit SDK

![Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=Hyperkit-Labs/sdk&timeframe=30d&theme=hyperkit)

## Project Stats

- ✅ Commits: See chart above
- ✅ Contributors: 12+
- ✅ Pull Requests: 45
- ✅ Issues Closed: 180
```

---

## DEPLOYMENT & HOSTING

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-tools \
    chromium-browser \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Start
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes Deployment

```yaml
# k8s/hyperbeats-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: hyperbeats
  namespace: hyperkit
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  
  selector:
    matchLabels:
      app: hyperbeats
  
  template:
    metadata:
      labels:
        app: hyperbeats
    spec:
      containers:
      - name: hyperbeats
        image: hyperkit/hyperbeats:1.0
        ports:
        - containerPort: 8000
        
        env:
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: hyperbeats-secrets
              key: redis-url
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: hyperbeats-secrets
              key: database-url
        
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: hyperbeats-service
  namespace: hyperkit
spec:
  type: LoadBalancer
  selector:
    app: hyperbeats
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
```

### CDN Configuration (Cloudflare)

```toml
# wrangler.toml (Cloudflare Workers)

name = "hyperbeats-cache"
type = "service-worker"

[env.production]
vars = { BACKEND_URL = "https://api.beats.hyperionkit.xyz" }

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "abc123..."
```

---

## CUSTOMIZATION & THEMING

### Available Themes

```python
# backend/hyperbeats/themes/predefined.py

THEMES = {
    "light": { /* Standard light theme */ },
    "dark": { /* Standard dark theme */ },
    "hyperkit": { /* HyperKit brand colors */ },
    "mint": { /* Mint green theme */ },
    "sunset": { /* Orange/pink theme */ },
    "ocean": { /* Blue theme */ },
    "forest": { /* Green theme */ },
    "custom": { /* User-defined via URL params */ }
}
```

### Custom Theme URL Parameters

```
GET /api/v1/chart/activity?repos=...&custom_theme=true&bg_color=%23f0f0f0&text_color=%23333333&primary_color=%23ff0000
```

---

## PERFORMANCE OPTIMIZATION

### Caching Strategy

```
L1 Cache (Redis):
├─ TTL: 1 hour for generated charts
├─ Size: Up to 100MB per instance
└─ Hit rate target: >85%

L2 Cache (CDN):
├─ TTL: 24 hours for static assets
├─ Geographic distribution
└─ Automatic invalidation on data change

L3 Cache (Browser):
├─ HTTP ETag support
├─ 304 Not Modified responses
└─ Client-side refresh policies
```

### Response Time Targets

```
First Request:
├─ API latency: <500ms
├─ SVG rendering: <200ms
├─ PNG rendering: <1000ms
└─ Total: <2s

Cached Request:
├─ Redis hit: <50ms
├─ CDN hit: <100ms
└─ Browser cache: <10ms
```

---

## SECURITY CONSIDERATIONS

### Access Control

```python
# backend/hyperbeats/security/access_control.py

class AccessControl:
    """Rate limiting and request validation"""
    
    RATE_LIMITS = {
        "public": "100/hour",           # Public endpoints
        "authenticated": "1000/hour",   # API key holders
        "enterprise": "unlimited"       # Enterprise tier
    }
    
    async def check_access(self, request: Request) -> bool:
        """Validate request access level"""
        
        api_key = request.headers.get("X-API-Key")
        
        if api_key:
            tier = await db.get_api_key_tier(api_key)
            return tier in ["authenticated", "enterprise"]
        
        return True  # Public access
```

### Input Validation

```python
# backend/hyperbeats/validators/input_validator.py

class InputValidator:
    """Validate user inputs"""
    
    @staticmethod
    def validate_repos(repos: List[str]) -> bool:
        """Ensure repos are valid GitHub repos"""
        
        pattern = r"^[a-zA-Z0-9-]+/[a-zA-Z0-9-_.]+$"
        
        for repo in repos:
            if not re.match(pattern, repo):
                raise ValueError(f"Invalid repo: {repo}")
            
            if len(repo) > 100:
                raise ValueError("Repo name too long")
        
        return True
```

---

## MONITORING METRICS

### Key Metrics to Track

```
PERFORMANCE METRICS:
├─ Response time (p50, p95, p99)
├─ Cache hit rate (%)
├─ API throughput (requests/sec)
├─ Error rate (%)
└─ PNG rendering time (sec)

BUSINESS METRICS:
├─ Daily active users
├─ API calls per day
├─ Popular repos tracked
├─ Cache effectiveness
└─ Storage usage (GB)

QUALITY METRICS:
├─ SVG validity
├─ PNG quality score
├─ Data freshness (lag)
├─ Availability (uptime %)
└─ Mean time to recovery (MTTR)
```

### Prometheus Metrics

```python
# backend/hyperbeats/metrics/prometheus_metrics.py

from prometheus_client import Counter, Histogram, Gauge

# Counters
api_requests = Counter(
    'hyperbeats_api_requests_total',
    'Total API requests',
    ['endpoint', 'method', 'status']
)

# Histograms
response_time = Histogram(
    'hyperbeats_response_time_seconds',
    'Response time in seconds',
    ['endpoint'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0]
)

# Gauges
cache_size = Gauge(
    'hyperbeats_cache_size_bytes',
    'Current cache size in bytes'
)
```

---

## INTEGRATION EXAMPLES

### Example 1: Embed in README

```markdown
# HyperKit SDK Repository

Welcome to HyperKit SDK, the multi-chain smart contract deployment platform.

## Activity Overview

![SDK Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=Hyperkit-Labs/sdk&timeframe=30d&format=svg&theme=hyperkit)

## Network Support

![Network Activity](https://beats.hyperionkit.xyz/api/v1/chart/chain-activity?chains=mantle&chains=solana&chains=sui&timeframe=7d)

## Contributing

We track all contributions. See our [activity dashboard](https://beats.hyperionkit.xyz/activity).
```

### Example 2: Dashboard Integration

```typescript
// frontend/components/ActivityWidget.tsx

import { HyperbeatsChart } from '@hyperkit/hyperbeats-sdk';

export function ActivityDashboard() {
  return (
    <div className="dashboard">
      <HyperbeatsChart
        repos={['Hyperkit-Labs/sdk', 'Hyperkit-Labs/agent']}
        timeframe="30d"
        theme="hyperkit"
        format="svg"
        width={800}
        height={400}
        autoRefresh={true}
        refreshInterval={300000}  // 5 minutes
      />
    </div>
  );
}
```

### Example 3: Real-Time Monitoring

```typescript
// backend/monitoring/hyperbeats_monitor.ts

async function monitorHyperkitMetrics() {
  const chains = ['mantle', 'solana', 'sui', 'arbitrum'];
  
  setInterval(async () => {
    for (const chain of chains) {
      const metrics = await fetch(
        `/api/v1/metrics/aggregate?chains=${chain}`
      ).then(r => r.json());
      
      // Log to monitoring system
      await prometheus.pushMetrics({
        build_count: metrics.aggregated.builds,
        tvl: metrics.aggregated.tvl,
        chain: chain,
        timestamp: Date.now()
      });
    }
  }, 60000);  // Update every minute
}
```

---

## TROUBLESHOOTING GUIDE

### Common Issues

#### Issue 1: Chart Not Loading

**Symptoms**: Broken image in README

**Solutions**:
```
1. Check repo names are valid (user/repo format)
2. Verify GitHub repo is public
3. Check API rate limits (GitHub: 60 req/hour unauthenticated)
4. Review API logs for errors
5. Try with simple query first:
   /api/v1/chart/activity?repos=owner/repo&timeframe=7d
```

#### Issue 2: Slow Response Time

**Symptoms**: Chart takes >2 seconds to load

**Solutions**:
```
1. Check cache status (X-Cache header)
2. Reduce timeframe (1d faster than 90d)
3. Reduce number of repos in query
4. Use PNG format (cached better than SVG)
5. Check Redis connection
6. Monitor database query time
```

#### Issue 3: Missing Data Points

**Symptoms**: Chart shows incomplete data

**Solutions**:
```
1. Verify repos have recent activity
2. Check data collection is running
3. Confirm GitHub API access
4. Review error logs for data import failures
5. Check time zone alignment
```

---

## FINAL NOTES

### Hyperbeats in HyperKit Ecosystem

Hyperbeats is the **visualization and monitoring backbone** of HyperKit's developer experience:

```
HyperKit Developers
        ↓
    Build dApps (HyperAgent)
        ↓
    Deploy (SDK)
        ↓
    Track Metrics (Hyperbeats) ← YOU SEE YOUR IMPACT HERE
        ↓
    Embed in README/Dashboard
        ↓
    Share with Community
        ↓
    Grow Ecosystem
```

### Getting Started

1. **Get your repos**: List GitHub repos to track
2. **Generate chart**: Use API endpoint with repos parameter
3. **Customize**: Apply theme and format preferences
4. **Embed**: Copy chart URL to README/dashboard
5. **Monitor**: Watch real-time updates of your ecosystem

### Support & Documentation

- **API Docs**: https://beats.hyperionkit.xyz/docs
- **GitHub**: https://github.com/Hyperkit-Labs/hyperbeats
- **Issues**: https://github.com/Hyperkit-Labs/hyperbeats/issues
- **Discord**: #hyperbeats-support

---

**STATUS**: Production Ready  
**VERSION**: 1.0  
**LAST UPDATED**: December 12, 2025

🚀 **Track, visualize, and celebrate your ecosystem growth with Hyperbeats.**
