# Hyperbeats

Real-time activity monitoring and visualization for blockchain ecosystems.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![Status](https://img.shields.io/badge/status-Integration%20Ready-blue)

## Overview

Hyperbeats is a lightweight analytics visualization service. It aggregates activity metrics from multiple blockchain repositories and exposes them as embeddable SVG/PNG widgets for README files, dashboards, and documentation.

## Features

- Multi-repository aggregation from GitHub
- Real-time metric updates
- Customizable themes (light, dark, hyperkit, mint)
- SVG and PNG output formats
- Embeddable widgets for READMEs
- Multi-layer caching for performance
- WebSocket support for live dashboards

## Quick Start

### Embed in Your README

```markdown
![Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/repo&timeframe=30d&theme=hyperkit)
```

### API Usage

```bash
# Get activity chart
curl "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&timeframe=7d&format=svg"

# Get raw metrics
curl "https://beats.hyperionkit.xyz/api/v1/metrics/aggregate?repos=owner/repo&timeframe=30d"
```

## Data Flow

```
Input (Repos/APIs)
       |
Aggregation Engine
       |
Metric Calculation
       |
SVG/PNG Rendering
       |
HTTP Endpoint
       |
Embed in README/Dashboard
       |
Real-time Display
```

## Use Cases

**GitHub Repository Activity**
- Input: Repository name
- Output: Contributions chart
- Use: Show ecosystem activity in README

**Multi-Repo Aggregation**
- Input: Multiple repositories
- Output: Combined activity heatmap
- Use: Organization-wide metrics

**Blockchain dApp Metrics**
- Input: TVL data from deployed dApps
- Output: Growth chart over time
- Use: Project documentation

**Points/Rewards Tracker**
- Input: User points from smart contract
- Output: Community leaderboard
- Use: Gamify contributions

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/v1/chart/activity` | Generate activity chart |
| `/api/v1/chart/chain-activity` | Multi-chain comparison |
| `/api/v1/chart/tvl` | TVL tracker |
| `/api/v1/chart/points-leaderboard` | Points leaderboard |
| `/api/v1/metrics/aggregate` | Raw metrics data |

## Parameters

| Parameter | Values | Default |
|-----------|--------|---------|
| `repos` | Repository names | Required |
| `timeframe` | 1d, 7d, 30d, 90d, 1y | 7d |
| `format` | svg, png | svg |
| `theme` | light, dark, hyperkit, mint | light |
| `width` | Number | 800 |
| `height` | Number | 400 |

## Themes

| Theme | Background | Primary | Use Case |
|-------|------------|---------|----------|
| light | #ffffff | #3182ce | Light mode READMEs |
| dark | #1a202c | #63b3ed | Dark mode READMEs |
| hyperkit | #0f1419 | #2186b5 | HyperKit branded |
| mint | #f0fdf4 | #10b981 | Fresh green aesthetic |

## Performance

| Metric | Target |
|--------|--------|
| First request | under 2s |
| Cached request (Redis) | under 50ms |
| Cached request (CDN) | under 100ms |
| Cache hit rate | above 85% |
| API uptime | 99.5%+ |

## Tech Stack

**Backend**
- Python 3.11+
- FastAPI
- PostgreSQL
- Redis
- Puppeteer (PNG rendering)

**Frontend**
- Next.js 14
- TypeScript
- Tailwind CSS
- D3.js / Plotly

**Infrastructure**
- Vercel (frontend)
- Render (backend)
- Cloudflare CDN
- Prometheus / Grafana

## Documentation

- [Technical Guide](./docs/Hyperbeats-Technical-Guide.md)
- [API Reference](https://beats.hyperionkit.xyz/docs)
- [Commit Guide](./version/scripts/COMMIT_GUIDE.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Support

- GitHub Issues: [hyperbeats/issues](https://github.com/Hyperkit-Labs/hyperbeats/issues)
- Discord: #hyperbeats-support
