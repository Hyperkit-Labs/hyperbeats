"""
Metrics Aggregate Endpoint
Returns raw metrics data as JSON.
"""

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from backend.cache.cache_manager import cache_manager
from backend.hyperbeats.aggregator.repo_aggregator import repo_aggregator
from backend.hyperbeats.validators.input_validator import validate_repos, validate_timeframe
from backend.integrations.github_models import RepoStats

router = APIRouter()


class MetricsResponse(BaseModel):
    """Response model for aggregated metrics."""
    aggregated: dict
    per_repo: dict
    historical: Optional[List[dict]] = None
    timeframe: str
    timestamp: datetime


@router.get("/aggregate", response_model=MetricsResponse)
async def metrics_aggregate(
    repos: List[str] = Query(..., description="Repository names (owner/repo)"),
    timeframe: str = Query("7d", description="Timeframe: 1d, 7d, 30d, 90d, 1y"),
    include_historical: bool = Query(False, description="Include historical data points"),
    metrics: Optional[List[str]] = Query(
        None,
        description="Filter specific metrics: commits, prs, issues, contributors"
    ),
):
    """
    Get aggregated metrics for repositories.
    
    Returns JSON with combined metrics across all specified repositories.
    """
    # Validate inputs
    try:
        validate_repos(repos)
        validate_timeframe(timeframe)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Generate cache key
    cache_key = cache_manager.generate_cache_key(
        prefix="metrics:aggregate",
        repos=repos,
        timeframe=timeframe,
        theme="json",
        format="json",
    )

    # Try to get from cache
    cached, cache_status = await cache_manager.get(cache_key)
    if cached and isinstance(cached, dict):
        return MetricsResponse(**cached)

    # Fetch and aggregate data
    try:
        result = await repo_aggregator.aggregate_repos(repos, timeframe)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

    # Build response
    aggregated = {
        "commits": result.total_commits,
        "prs_merged": result.total_prs_merged,
        "issues_closed": result.total_issues_closed,
        "contributors": result.unique_contributors,
        "repos_count": result.repos,
    }

    # Filter metrics if specified
    if metrics:
        aggregated = {k: v for k, v in aggregated.items() if k in metrics or k == "repos_count"}

    per_repo = {}
    for repo_name, stats in result.per_repo.items():
        per_repo[repo_name] = {
            "commits": stats.commits,
            "prs_merged": stats.prs_merged,
            "issues_closed": stats.issues_closed,
            "contributors": stats.contributors,
        }
        if metrics:
            per_repo[repo_name] = {
                k: v for k, v in per_repo[repo_name].items() if k in metrics
            }

    # Get historical data if requested
    historical = None
    if include_historical:
        historical = await repo_aggregator.get_historical_data(repos, timeframe)

    response = MetricsResponse(
        aggregated=aggregated,
        per_repo=per_repo,
        historical=historical,
        timeframe=timeframe,
        timestamp=result.timestamp,
    )

    # Cache the response
    await cache_manager.set(cache_key, response.model_dump(), ttl=1800)

    return response


@router.get("/repos/{owner}/{repo}")
async def get_repo_metrics(
    owner: str,
    repo: str,
    timeframe: str = Query("7d", description="Timeframe: 1d, 7d, 30d, 90d, 1y"),
):
    """
    Get metrics for a single repository.
    """
    try:
        validate_timeframe(timeframe)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        result = await repo_aggregator.aggregate_repos([f"{owner}/{repo}"], timeframe)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")

    repo_key = f"{owner}/{repo}"
    if repo_key not in result.per_repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    stats = result.per_repo[repo_key]
    return {
        "repository": repo_key,
        "timeframe": timeframe,
        "metrics": {
            "commits": stats.commits,
            "prs_opened": stats.prs_opened,
            "prs_merged": stats.prs_merged,
            "issues_opened": stats.issues_opened,
            "issues_closed": stats.issues_closed,
            "contributors": stats.contributors,
        },
        "timestamp": result.timestamp,
    }

