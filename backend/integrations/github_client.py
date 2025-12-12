"""
GitHub API Client
Fetches repository activity data from GitHub.
"""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from backend.hyperbeats.config import settings
from backend.integrations.github_models import (
    Commit,
    PullRequest,
    Issue,
    RepoStats,
)


class GitHubClient:
    """Async GitHub API client with rate limiting support."""

    BASE_URL = "https://api.github.com"

    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.github_token
        self._client: Optional[httpx.AsyncClient] = None
        self._rate_limit_remaining = 5000
        self._rate_limit_reset: Optional[datetime] = None

    @property
    def headers(self) -> Dict[str, str]:
        """Request headers with authentication."""
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    async def __aenter__(self):
        """Async context manager entry."""
        self._client = httpx.AsyncClient(
            base_url=self.BASE_URL,
            headers=self.headers,
            timeout=30.0,
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self._client:
            await self._client.aclose()

    def _update_rate_limit(self, response: httpx.Response) -> None:
        """Update rate limit tracking from response headers."""
        if "X-RateLimit-Remaining" in response.headers:
            self._rate_limit_remaining = int(response.headers["X-RateLimit-Remaining"])
        if "X-RateLimit-Reset" in response.headers:
            self._rate_limit_reset = datetime.fromtimestamp(
                int(response.headers["X-RateLimit-Reset"])
            )

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
    ) -> Any:
        """Make an API request with retry logic."""
        if self._client is None:
            raise RuntimeError("Client not initialized. Use async context manager.")

        # Check rate limit
        if self._rate_limit_remaining <= settings.github_rate_limit_buffer:
            if self._rate_limit_reset and datetime.now() < self._rate_limit_reset:
                wait_seconds = (self._rate_limit_reset - datetime.now()).seconds
                raise Exception(f"Rate limited. Reset in {wait_seconds} seconds.")

        response = await self._client.request(method, endpoint, params=params)
        self._update_rate_limit(response)
        response.raise_for_status()
        return response.json()

    async def get_repo(self, owner: str, repo: str) -> Dict:
        """Get repository information."""
        return await self._request("GET", f"/repos/{owner}/{repo}")

    async def get_commits(
        self,
        owner: str,
        repo: str,
        since: Optional[datetime] = None,
        until: Optional[datetime] = None,
        per_page: int = 100,
    ) -> List[Commit]:
        """Get commits for a repository."""
        params = {"per_page": per_page}
        if since:
            params["since"] = since.isoformat()
        if until:
            params["until"] = until.isoformat()

        data = await self._request("GET", f"/repos/{owner}/{repo}/commits", params)
        return [Commit.from_api(c) for c in data]

    async def get_pull_requests(
        self,
        owner: str,
        repo: str,
        state: str = "all",
        per_page: int = 100,
    ) -> List[PullRequest]:
        """Get pull requests for a repository."""
        params = {"state": state, "per_page": per_page, "sort": "updated"}
        data = await self._request("GET", f"/repos/{owner}/{repo}/pulls", params)
        return [PullRequest.from_api(pr) for pr in data]

    async def get_issues(
        self,
        owner: str,
        repo: str,
        state: str = "all",
        per_page: int = 100,
    ) -> List[Issue]:
        """Get issues for a repository (excluding PRs)."""
        params = {"state": state, "per_page": per_page, "sort": "updated"}
        data = await self._request("GET", f"/repos/{owner}/{repo}/issues", params)
        # Filter out pull requests (they also appear in issues endpoint)
        issues = [Issue.from_api(i) for i in data if "pull_request" not in i]
        return issues

    async def get_repo_stats(
        self,
        owner: str,
        repo: str,
        timeframe: str = "7d",
    ) -> RepoStats:
        """Get aggregated stats for a repository within a timeframe."""
        # Calculate date range
        days = {"1d": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365}.get(timeframe, 7)
        since = datetime.utcnow() - timedelta(days=days)

        # Fetch data
        commits = await self.get_commits(owner, repo, since=since)
        prs = await self.get_pull_requests(owner, repo)
        issues = await self.get_issues(owner, repo)

        # Filter by date
        prs_in_range = [
            pr for pr in prs
            if pr.created_at and pr.created_at >= since
        ]
        issues_in_range = [
            i for i in issues
            if i.created_at and i.created_at >= since
        ]

        return RepoStats(
            commits=len(commits),
            prs_opened=len([pr for pr in prs_in_range if pr.state == "open"]),
            prs_merged=len([pr for pr in prs_in_range if pr.merged]),
            prs_closed=len([pr for pr in prs_in_range if pr.state == "closed" and not pr.merged]),
            issues_opened=len([i for i in issues_in_range if i.state == "open"]),
            issues_closed=len([i for i in issues_in_range if i.state == "closed"]),
            contributors=len(set(c.author for c in commits if c.author)),
            timeframe=timeframe,
        )


# Convenience function
async def get_github_client() -> GitHubClient:
    """Get a configured GitHub client."""
    return GitHubClient()

