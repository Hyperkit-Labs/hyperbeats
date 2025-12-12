"""
Repository Aggregator
Combines metrics from multiple GitHub repositories.
"""

from datetime import datetime
from typing import Dict, List, Set

from backend.integrations.github_client import GitHubClient
from backend.integrations.github_models import AggregatedMetrics, RepoStats


class RepositoryAggregator:
    """Combine metrics from multiple GitHub repos."""

    def __init__(self):
        self.github_client = GitHubClient()

    async def aggregate_repos(
        self,
        repo_list: List[str],
        timeframe: str = "7d",
    ) -> AggregatedMetrics:
        """
        Aggregate activity across repos.
        
        Args:
            repo_list: List of repos in "owner/repo" format
            timeframe: Time window (1d, 7d, 30d, 90d, 1y)
            
        Returns:
            AggregatedMetrics with combined and per-repo data
        """
        per_repo: Dict[str, RepoStats] = {}
        all_contributors: Set[str] = set()
        errors: List[str] = []

        async with self.github_client as client:
            for repo in repo_list:
                try:
                    # Parse owner/repo
                    if "/" not in repo:
                        errors.append(f"Invalid repo format: {repo}")
                        continue

                    owner, name = repo.split("/", 1)

                    # Fetch stats
                    stats = await client.get_repo_stats(owner, name, timeframe)
                    per_repo[repo] = stats

                    # Track unique contributors (would need commit data for accuracy)
                    # For now, we count per-repo contributors

                except Exception as e:
                    errors.append(f"Failed to fetch {repo}: {str(e)}")
                    continue

        # Calculate aggregated totals
        total_commits = sum(s.commits for s in per_repo.values())
        total_prs_merged = sum(s.prs_merged for s in per_repo.values())
        total_issues_closed = sum(s.issues_closed for s in per_repo.values())
        unique_contributors = sum(s.contributors for s in per_repo.values())

        return AggregatedMetrics(
            repos=len(per_repo),
            total_commits=total_commits,
            total_prs_merged=total_prs_merged,
            total_issues_closed=total_issues_closed,
            unique_contributors=unique_contributors,
            per_repo=per_repo,
            timeframe=timeframe,
            timestamp=datetime.utcnow(),
        )

    async def get_historical_data(
        self,
        repo_list: List[str],
        timeframe: str = "30d",
    ) -> List[Dict]:
        """
        Get historical data points for charting.
        Returns daily aggregated metrics.
        """
        # This would query the database for stored historical data
        # For now, return empty list as placeholder
        return []


# Global aggregator instance
repo_aggregator = RepositoryAggregator()

