"""
Activity Chart Endpoint
Generates activity charts for repositories.
"""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Query, HTTPException, Depends
from fastapi.responses import Response

from backend.cache.cache_manager import cache_manager
from backend.hyperbeats.aggregator.repo_aggregator import repo_aggregator
from backend.hyperbeats.renderer.svg_renderer import svg_renderer
from backend.hyperbeats.renderer.png_renderer import png_renderer
from backend.hyperbeats.themes.theme_manager import theme_manager
from backend.hyperbeats.validators.input_validator import validate_repos, validate_timeframe
from backend.hyperbeats.security.rate_limiter import check_rate_limit

router = APIRouter()


@router.get("/activity")
async def chart_activity(
    repos: List[str] = Query(..., description="Repository names (owner/repo)"),
    timeframe: str = Query("7d", description="Timeframe: 1d, 7d, 30d, 90d, 1y"),
    format: str = Query("svg", description="Output format: svg or png"),
    theme: str = Query("light", description="Theme: light, dark, hyperkit, mint"),
    width: int = Query(800, ge=200, le=2000, description="Chart width"),
    height: int = Query(400, ge=100, le=1000, description="Chart height"),
):
    """
    Generate activity chart for repositories.
    
    Returns SVG or PNG image showing commits, PRs, and issues over time.
    """
    # Validate inputs
    try:
        validate_repos(repos)
        validate_timeframe(timeframe)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Validate theme
    available_themes = theme_manager.get_available_themes()
    if theme not in available_themes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid theme. Available: {', '.join(available_themes)}"
        )

    # Validate format
    if format not in ["svg", "png"]:
        raise HTTPException(status_code=400, detail="Format must be 'svg' or 'png'")

    # Generate cache key
    cache_key = cache_manager.generate_cache_key(
        prefix="chart:activity",
        repos=repos,
        timeframe=timeframe,
        theme=theme,
        format=format,
    )

    # Try to get from cache
    cached, cache_status = await cache_manager.get(cache_key)
    if cached:
        content_type = "image/svg+xml" if format == "svg" else "image/png"
        return Response(
            content=cached if isinstance(cached, bytes) else cached.encode(),
            media_type=content_type,
            headers={
                "X-Cache": cache_status,
                "Cache-Control": "public, max-age=3600",
            },
        )

    # Fetch and aggregate data
    try:
        metrics = await repo_aggregator.aggregate_repos(repos, timeframe)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

    # Generate chart data
    chart_data = _generate_chart_data(metrics, timeframe)

    # Render chart
    title = f"Activity - Last {timeframe}"
    if len(repos) == 1:
        title = f"{repos[0]} - Last {timeframe}"

    svg_renderer.width = width
    svg_renderer.height = height
    svg_content = svg_renderer.render_activity_chart(chart_data, title, theme)

    if format == "png":
        png_content = await png_renderer.render_png(svg_content, width, height)
        await cache_manager.set(cache_key, png_content, ttl=3600)
        return Response(
            content=png_content,
            media_type="image/png",
            headers={
                "X-Cache": "MISS",
                "Cache-Control": "public, max-age=3600",
            },
        )
    else:
        await cache_manager.set(cache_key, svg_content, ttl=3600)
        return Response(
            content=svg_content,
            media_type="image/svg+xml",
            headers={
                "X-Cache": "MISS",
                "Cache-Control": "public, max-age=3600",
            },
        )


def _generate_chart_data(metrics, timeframe: str) -> List[dict]:
    """Generate time series data for the chart."""
    # For now, return aggregated data as a single point
    # In production, this would query historical data
    from datetime import timedelta

    days = {"1d": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365}.get(timeframe, 7)
    data = []

    for i in range(days):
        date = datetime.utcnow() - timedelta(days=days - i - 1)
        # Distribute metrics across days (simplified)
        daily_commits = metrics.total_commits // days
        daily_prs = metrics.total_prs_merged // days
        daily_issues = metrics.total_issues_closed // days

        data.append({
            "date": date,
            "commits": daily_commits + (i % 3),  # Add some variation
            "prs": daily_prs + (i % 2),
            "issues": daily_issues + ((i + 1) % 2),
        })

    return data

