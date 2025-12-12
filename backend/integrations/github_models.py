"""
GitHub Data Models
Pydantic models for GitHub API responses.
"""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class Commit(BaseModel):
    """Git commit data."""
    sha: str
    message: str
    author: Optional[str] = None
    author_email: Optional[str] = None
    date: Optional[datetime] = None
    url: Optional[str] = None

    @classmethod
    def from_api(cls, data: Dict[str, Any]) -> "Commit":
        """Create from GitHub API response."""
        commit_data = data.get("commit", {})
        author_data = commit_data.get("author", {})
        return cls(
            sha=data.get("sha", ""),
            message=commit_data.get("message", ""),
            author=data.get("author", {}).get("login") if data.get("author") else None,
            author_email=author_data.get("email"),
            date=datetime.fromisoformat(author_data["date"].replace("Z", "+00:00"))
            if author_data.get("date") else None,
            url=data.get("html_url"),
        )


class PullRequest(BaseModel):
    """Pull request data."""
    number: int
    title: str
    state: str  # open, closed
    merged: bool = False
    author: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    merged_at: Optional[datetime] = None
    url: Optional[str] = None

    @classmethod
    def from_api(cls, data: Dict[str, Any]) -> "PullRequest":
        """Create from GitHub API response."""
        return cls(
            number=data.get("number", 0),
            title=data.get("title", ""),
            state=data.get("state", ""),
            merged=data.get("merged_at") is not None,
            author=data.get("user", {}).get("login") if data.get("user") else None,
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
            if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00"))
            if data.get("updated_at") else None,
            merged_at=datetime.fromisoformat(data["merged_at"].replace("Z", "+00:00"))
            if data.get("merged_at") else None,
            url=data.get("html_url"),
        )


class Issue(BaseModel):
    """Issue data."""
    number: int
    title: str
    state: str  # open, closed
    author: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    labels: list[str] = Field(default_factory=list)
    url: Optional[str] = None

    @classmethod
    def from_api(cls, data: Dict[str, Any]) -> "Issue":
        """Create from GitHub API response."""
        return cls(
            number=data.get("number", 0),
            title=data.get("title", ""),
            state=data.get("state", ""),
            author=data.get("user", {}).get("login") if data.get("user") else None,
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
            if data.get("created_at") else None,
            updated_at=datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00"))
            if data.get("updated_at") else None,
            closed_at=datetime.fromisoformat(data["closed_at"].replace("Z", "+00:00"))
            if data.get("closed_at") else None,
            labels=[l.get("name", "") for l in data.get("labels", [])],
            url=data.get("html_url"),
        )


class RepoStats(BaseModel):
    """Aggregated repository statistics."""
    commits: int = 0
    prs_opened: int = 0
    prs_merged: int = 0
    prs_closed: int = 0
    issues_opened: int = 0
    issues_closed: int = 0
    contributors: int = 0
    timeframe: str = "7d"
    stars: int = 0
    forks: int = 0
    watchers: int = 0


class AggregatedMetrics(BaseModel):
    """Aggregated metrics across multiple repositories."""
    repos: int = 0
    total_commits: int = 0
    total_prs_merged: int = 0
    total_issues_closed: int = 0
    unique_contributors: int = 0
    per_repo: Dict[str, RepoStats] = Field(default_factory=dict)
    timeframe: str = "7d"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

