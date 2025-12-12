# Embedding Hyperbeats Charts

This guide explains how to embed Hyperbeats charts in various platforms.

## GitHub README

The most common use case is embedding activity charts in your repository's README.md.

### Basic Embed

```markdown
![Repository Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/your-repo)
```

### With Options

```markdown
![Repository Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/your-repo&timeframe=30d&theme=dark)
```

### Multiple Repositories

```markdown
![Ecosystem Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=your-org/repo1,your-org/repo2,your-org/repo3)
```

## HTML Embedding

For websites and dashboards:

```html
<!-- Basic embed -->
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo" 
  alt="Repository Activity"
  width="800"
  height="400"
/>

<!-- With custom dimensions -->
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&width=600&height=300" 
  alt="Repository Activity"
/>

<!-- PNG format for better compatibility -->
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&format=png" 
  alt="Repository Activity"
/>
```

## Notion

In Notion, use the `/embed` command and paste the chart URL:

```
https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&theme=dark
```

## Slack

Share the direct URL in Slack. SVG charts will unfurl automatically:

```
https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo
```

## Discord

Use markdown image syntax in Discord:

```
![Activity](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&format=png)
```

## Confluence

Use the Image macro with the chart URL:

1. Insert > Image
2. Paste URL: `https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo`

## Best Practices

### 1. Use Appropriate Timeframes

- **1d**: Real-time dashboards
- **7d**: Weekly reports
- **30d**: Monthly reviews
- **90d**: Quarterly summaries

### 2. Choose the Right Theme

- **light**: Light-mode websites and documents
- **dark**: Dark-mode interfaces and GitHub dark mode
- **hyperkit**: HyperKit branded content

### 3. Consider Caching

Charts are cached for 1 hour. For real-time updates, consider:
- Using the JSON API and rendering client-side
- Implementing a refresh mechanism in your dashboard

### 4. PNG vs SVG

| Format | Use Case |
|---|---|
| SVG | Web, GitHub, interactive dashboards |
| PNG | Email, PDF exports, Slack/Discord |

### 5. Responsive Design

For responsive websites:

```html
<img 
  src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo" 
  alt="Activity"
  style="max-width: 100%; height: auto;"
/>
```

## Troubleshooting

### Chart Not Loading

1. Check the repository name format: `owner/repo`
2. Verify the repository is public
3. Check rate limits (100 requests/hour for public)

### Stale Data

Charts are cached for 1 hour. Force a refresh by:
- Waiting for cache expiration
- Using a cache-busting parameter: `&_t=timestamp`

### Wrong Colors

Ensure you're specifying a valid theme:
- light, dark, hyperkit, mint, sunset, ocean, forest

