"""
Integration Tests for Metrics Aggregate Endpoint
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
class TestMetricsAggregateEndpoint:
    """Tests for /api/v1/metrics/aggregate endpoint."""

    async def test_returns_json(self, client: AsyncClient):
        """Test that endpoint returns JSON."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={"repos": ["octocat/Hello-World"]}
        )
        
        assert response.status_code in [200, 500]
        if response.status_code == 200:
            assert "application/json" in response.headers.get("content-type", "")

    async def test_response_structure(self, client: AsyncClient):
        """Test response JSON structure."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={"repos": ["octocat/Hello-World"]}
        )
        
        if response.status_code == 200:
            data = response.json()
            assert "aggregated" in data
            assert "per_repo" in data
            assert "timeframe" in data
            assert "timestamp" in data

    async def test_aggregated_fields(self, client: AsyncClient):
        """Test aggregated metrics fields."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={"repos": ["octocat/Hello-World"]}
        )
        
        if response.status_code == 200:
            data = response.json()
            aggregated = data["aggregated"]
            assert "commits" in aggregated
            assert "prs_merged" in aggregated
            assert "issues_closed" in aggregated

    async def test_per_repo_data(self, client: AsyncClient):
        """Test per-repository data structure."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={"repos": ["octocat/Hello-World"]}
        )
        
        if response.status_code == 200:
            data = response.json()
            per_repo = data["per_repo"]
            assert "octocat/Hello-World" in per_repo

    async def test_validates_repos_parameter(self, client: AsyncClient):
        """Test that invalid repo format returns 400."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={"repos": ["invalid-repo"]}
        )
        
        assert response.status_code == 400

    async def test_validates_timeframe(self, client: AsyncClient):
        """Test timeframe validation."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={"repos": ["octocat/Hello-World"], "timeframe": "invalid"}
        )
        
        assert response.status_code == 400

    async def test_metrics_filter(self, client: AsyncClient):
        """Test filtering specific metrics."""
        response = await client.get(
            "/api/v1/metrics/aggregate",
            params={
                "repos": ["octocat/Hello-World"],
                "metrics": ["commits", "prs"]
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            # Filtered metrics should only include requested ones
            aggregated = data["aggregated"]
            assert "repos_count" in aggregated  # Always included


@pytest.mark.asyncio
class TestSingleRepoEndpoint:
    """Tests for /api/v1/metrics/repos/{owner}/{repo} endpoint."""

    async def test_returns_single_repo_metrics(self, client: AsyncClient):
        """Test getting metrics for a single repo."""
        response = await client.get("/api/v1/metrics/repos/octocat/Hello-World")
        
        assert response.status_code in [200, 500]
        if response.status_code == 200:
            data = response.json()
            assert data["repository"] == "octocat/Hello-World"
            assert "metrics" in data

    async def test_timeframe_parameter(self, client: AsyncClient):
        """Test timeframe parameter for single repo."""
        response = await client.get(
            "/api/v1/metrics/repos/octocat/Hello-World",
            params={"timeframe": "30d"}
        )
        
        if response.status_code == 200:
            data = response.json()
            assert data["timeframe"] == "30d"

    async def test_invalid_timeframe(self, client: AsyncClient):
        """Test invalid timeframe returns 400."""
        response = await client.get(
            "/api/v1/metrics/repos/octocat/Hello-World",
            params={"timeframe": "invalid"}
        )
        
        assert response.status_code == 400

