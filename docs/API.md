# Hyperbeats API Documentation

## Overview

Hyperbeats provides a RESTful API for generating real-time activity visualizations and metrics for GitHub repositories.

**Base URL**: `https://beats.hyperionkit.xyz/api/v1`

## Authentication

Most endpoints are publicly accessible with rate limits:
- **Public**: 100 requests/hour
- **Authenticated**: 1,000 requests/hour (requires API key)
- **Enterprise**: Unlimited (requires enterprise API key)

Include your API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: hb_your_key_here" https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo
```

## Endpoints

### GET /chart/activity

Generate an activity chart for repositories.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| repos | string[] | Yes | - | Repository names (owner/repo) |
| timeframe | string | No | 7d | Time period: 1d, 7d, 30d, 90d, 1y |
| format | string | No | svg | Output format: svg or png |
| theme | string | No | light | Theme: light, dark, hyperkit, mint |
| width | int | No | 800 | Chart width (200-2000px) |
| height | int | No | 400 | Chart height (100-1000px) |

**Example Request**:

```bash
curl "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=octocat/Hello-World&timeframe=30d&theme=dark"
```

**Response**: SVG or PNG image

**Response Headers**:
- `X-Cache`: Cache status (HIT_L1, HIT_L2, MISS)
- `Cache-Control`: Caching directives

### GET /metrics/aggregate

Get aggregated metrics as JSON.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| repos | string[] | Yes | - | Repository names (owner/repo) |
| timeframe | string | No | 7d | Time period: 1d, 7d, 30d, 90d, 1y |
| include_historical | bool | No | false | Include historical data points |
| metrics | string[] | No | all | Filter: commits, prs, issues, contributors |

**Example Request**:

```bash
curl "https://beats.hyperionkit.xyz/api/v1/metrics/aggregate?repos=microsoft/vscode,microsoft/typescript"
```

**Example Response**:

```json
{
  "aggregated": {
    "commits": 1250,
    "prs_merged": 85,
    "issues_closed": 230,
    "contributors": 45,
    "repos_count": 2
  },
  "per_repo": {
    "microsoft/vscode": {
      "commits": 800,
      "prs_merged": 50,
      "issues_closed": 150,
      "contributors": 30
    },
    "microsoft/typescript": {
      "commits": 450,
      "prs_merged": 35,
      "issues_closed": 80,
      "contributors": 25
    }
  },
  "timeframe": "7d",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /metrics/repos/{owner}/{repo}

Get metrics for a single repository.

**Path Parameters**:
- `owner`: Repository owner
- `repo`: Repository name

**Query Parameters**:
- `timeframe`: Time period (default: 7d)

**Example Request**:

```bash
curl "https://beats.hyperionkit.xyz/api/v1/metrics/repos/facebook/react?timeframe=30d"
```

**Example Response**:

```json
{
  "repository": "facebook/react",
  "timeframe": "30d",
  "metrics": {
    "commits": 156,
    "prs_opened": 45,
    "prs_merged": 38,
    "issues_opened": 120,
    "issues_closed": 95,
    "contributors": 28
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Responses

All errors return JSON with the following structure:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**HTTP Status Codes**:
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing or invalid API key)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Rate Limiting

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 3600
```

When rate limited, you'll receive a 429 response:

```json
{
  "error": "Rate limit exceeded",
  "limit": 100,
  "reset_in_seconds": 1800
}
```

## Themes

Available themes:
- `light`: White background with dark text
- `dark`: Dark background with light text
- `hyperkit`: HyperKit brand colors
- `mint`: Green-tinted light theme
- `sunset`: Warm orange/amber dark theme
- `ocean`: Blue teal theme
- `forest`: Green nature theme

## Embedding Charts

Charts can be embedded directly in markdown:

```markdown
![Activity Chart](https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo&theme=dark)
```

Or in HTML:

```html
<img src="https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo" alt="Activity" />
```

