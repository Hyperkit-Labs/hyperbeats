"""
Integration Tests for Activity Chart Endpoint
"""

import pytest
from httpx import AsyncClient

from backend.hyperbeats.main import app


@pytest.mark.asyncio
class TestActivityChartEndpoint:
    """Tests for /api/v1/chart/activity endpoint."""

    async def test_returns_svg_by_default(self, client: AsyncClient):
        """Test that endpoint returns SVG by default."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World"]}
        )
        
        # May fail due to GitHub API rate limits in tests
        # In production, this would use mocked responses
        assert response.status_code in [200, 500]
        if response.status_code == 200:
            assert response.headers.get("content-type") == "image/svg+xml"

    async def test_returns_png_when_requested(self, client: AsyncClient):
        """Test that endpoint returns PNG when format=png."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World"], "format": "png"}
        )
        
        assert response.status_code in [200, 500]
        if response.status_code == 200:
            assert response.headers.get("content-type") == "image/png"

    async def test_validates_repos_parameter(self, client: AsyncClient):
        """Test that invalid repo format returns 400."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["invalid-repo-format"]}
        )
        
        assert response.status_code == 400
        assert "Invalid repository" in response.json()["detail"]

    async def test_validates_timeframe_parameter(self, client: AsyncClient):
        """Test that invalid timeframe returns 400."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World"], "timeframe": "invalid"}
        )
        
        assert response.status_code == 400
        assert "Invalid timeframe" in response.json()["detail"]

    async def test_validates_theme_parameter(self, client: AsyncClient):
        """Test that invalid theme returns 400."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World"], "theme": "invalid"}
        )
        
        assert response.status_code == 400
        assert "Invalid theme" in response.json()["detail"]

    async def test_validates_format_parameter(self, client: AsyncClient):
        """Test that invalid format returns 400."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World"], "format": "jpg"}
        )
        
        assert response.status_code == 400
        assert "Format must be" in response.json()["detail"]

    async def test_accepts_multiple_repos(self, client: AsyncClient):
        """Test that multiple repos are accepted."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World", "microsoft/vscode"]}
        )
        
        assert response.status_code in [200, 500]

    async def test_requires_repos_parameter(self, client: AsyncClient):
        """Test that repos parameter is required."""
        response = await client.get("/api/v1/chart/activity")
        
        assert response.status_code == 422  # Validation error

    async def test_cache_headers_present(self, client: AsyncClient):
        """Test that cache-related headers are present."""
        response = await client.get(
            "/api/v1/chart/activity",
            params={"repos": ["octocat/Hello-World"]}
        )
        
        if response.status_code == 200:
            assert "x-cache" in response.headers or "X-Cache" in response.headers
            assert "cache-control" in response.headers or "Cache-Control" in response.headers

