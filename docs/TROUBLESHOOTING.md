# Hyperbeats Troubleshooting Guide

This guide helps you diagnose and fix common issues with Hyperbeats.

## Common Issues

### 1. API Returns 400 Bad Request

**Problem**: The API returns a 400 status code with an error message.

**Causes and Solutions**:

| Error Message | Cause | Solution |
|---|---|---|
| "Invalid repository format" | Wrong repo format | Use `owner/repo` format |
| "Invalid timeframe" | Unknown timeframe | Use 1d, 7d, 30d, 90d, or 1y |
| "Invalid theme" | Unknown theme | Use light, dark, hyperkit, mint |
| "Maximum 10 repositories" | Too many repos | Reduce to 10 or fewer |

**Example**:
```bash
# Wrong
?repos=my-repo

# Correct
?repos=owner/my-repo
```

### 2. API Returns 429 Too Many Requests

**Problem**: Rate limit exceeded.

**Solution**:
1. Wait for rate limit reset (check `X-RateLimit-Reset` header)
2. Use an API key for higher limits
3. Implement caching in your application

```bash
# Check rate limit status
curl -I "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo"
# Look for:
# X-RateLimit-Remaining: 50
# X-RateLimit-Reset: 1800
```

### 3. Charts Show Zero Data

**Problem**: Chart renders but shows no activity.

**Causes**:
1. Repository has no recent activity
2. Repository is private (API can't access)
3. Wrong timeframe for activity

**Solutions**:
1. Try a longer timeframe: `?timeframe=90d`
2. Verify repository is public
3. Check repository activity on GitHub

### 4. PNG Generation Fails

**Problem**: PNG format returns error or empty image.

**Causes**:
1. Server-side rendering issues
2. Complex SVG not supported

**Solutions**:
1. Use SVG format instead (better quality anyway)
2. If PNG is required, reduce chart complexity
3. Use smaller dimensions

### 5. Cache Not Working

**Problem**: Charts don't update or always show "MISS".

**Diagnosis**:
```bash
# Check cache status
curl -I "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo"
# Look for: X-Cache: HIT_L1 or MISS
```

**Solutions**:
1. Wait for cache population (first request is always MISS)
2. Ensure Redis is running (for self-hosted)
3. Check cache configuration

### 6. GitHub API Rate Limits

**Problem**: Hyperbeats returns 500 errors due to GitHub rate limits.

**Diagnosis**: Check server logs for "rate limit" messages.

**Solutions**:
1. Configure a GitHub token in Hyperbeats
2. Wait for GitHub rate limit reset
3. Reduce frequency of requests

```bash
# Set GitHub token
export GITHUB_TOKEN=ghp_your_token_here
```

## Self-Hosted Issues

### Docker Container Won't Start

**Check logs**:
```bash
docker logs hyperbeats
```

**Common issues**:
1. Database not ready: Wait for PostgreSQL health check
2. Redis not available: Check Redis connection
3. Port already in use: Change port mapping

```bash
# Check container health
docker-compose ps
docker-compose logs -f hyperbeats
```

### Database Connection Failed

**Error**: `connection refused` or `database does not exist`

**Solutions**:
1. Verify PostgreSQL is running
2. Check DATABASE_URL environment variable
3. Create database if needed

```bash
# Test database connection
docker-compose exec postgres psql -U hyperbeats -d hyperbeats -c "SELECT 1"
```

### Redis Connection Issues

**Error**: `Redis connection refused`

**Solutions**:
1. Verify Redis is running
2. Check REDIS_URL environment variable
3. Test Redis connectivity

```bash
# Test Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

## Performance Issues

### Slow Response Times

**Diagnosis**:
1. Check if request is cache hit or miss
2. Monitor database queries
3. Check GitHub API latency

**Solutions**:
1. Increase cache TTL
2. Add database indexes
3. Use connection pooling
4. Deploy closer to users

### High Memory Usage

**Causes**:
1. Large cache size
2. Memory leaks
3. Too many concurrent requests

**Solutions**:
1. Reduce Redis memory limit
2. Restart containers periodically
3. Implement request queuing

## Getting Help

### Collect Debug Information

When reporting issues, include:

1. **Request details**:
```bash
curl -v "https://beats.hyperionkit.xyz/api/v1/chart/activity?repos=owner/repo"
```

2. **Response headers**:
```
HTTP/2 200
x-cache: MISS
cache-control: public, max-age=3600
```

3. **Error messages** (from response body or logs)

4. **Environment info**:
- Hyperbeats version
- Docker version (if self-hosted)
- Operating system

### Report Issues

- GitHub Issues: [github.com/hyperkit-labs/hyperbeats/issues](https://github.com/hyperkit-labs/hyperbeats/issues)
- Include debug information above
- Describe expected vs actual behavior

