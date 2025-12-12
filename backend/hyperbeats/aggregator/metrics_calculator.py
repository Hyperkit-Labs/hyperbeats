"""
Metrics Calculator
Calculates derived metrics from raw repository data.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional

from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):
    """Single data point in a time series."""
    date: datetime
    value: float
    label: Optional[str] = None


class MetricsResult(BaseModel):
    """Result of metrics calculation."""
    metric_name: str
    current_value: float
    previous_value: float
    change_percent: float
    trend: str  # up, down, stable
    time_series: List[TimeSeriesPoint]


class MetricsCalculator:
    """Calculate various metrics from repository data."""

    @staticmethod
    def calculate_activity_score(
        commits: int,
        prs_merged: int,
        issues_closed: int,
        contributors: int,
    ) -> float:
        """
        Calculate an activity score (0-100).
        Weighted formula based on different activity types.
        """
        # Weights for different metrics
        weights = {
            "commits": 0.4,
            "prs_merged": 0.3,
            "issues_closed": 0.2,
            "contributors": 0.1,
        }

        # Normalize each metric (assuming max values)
        normalized = {
            "commits": min(commits / 100, 1.0),
            "prs_merged": min(prs_merged / 20, 1.0),
            "issues_closed": min(issues_closed / 30, 1.0),
            "contributors": min(contributors / 10, 1.0),
        }

        # Calculate weighted score
        score = sum(normalized[k] * weights[k] for k in weights)
        return round(score * 100, 2)

    @staticmethod
    def calculate_velocity(
        current_commits: int,
        previous_commits: int,
    ) -> Dict[str, float]:
        """Calculate commit velocity and change."""
        if previous_commits == 0:
            change_percent = 100.0 if current_commits > 0 else 0.0
        else:
            change_percent = ((current_commits - previous_commits) / previous_commits) * 100

        return {
            "current": current_commits,
            "previous": previous_commits,
            "change_percent": round(change_percent, 2),
            "trend": "up" if change_percent > 5 else "down" if change_percent < -5 else "stable",
        }

    @staticmethod
    def generate_time_series(
        data_points: List[Dict],
        metric_key: str,
        timeframe: str = "7d",
    ) -> List[TimeSeriesPoint]:
        """Generate time series data for charting."""
        days = {"1d": 1, "7d": 7, "30d": 30, "90d": 90, "1y": 365}.get(timeframe, 7)
        
        # Generate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Create time series points
        series = []
        current_date = start_date
        
        while current_date <= end_date:
            # Find data for this date
            value = 0.0
            for point in data_points:
                point_date = point.get("date")
                if point_date and point_date.date() == current_date.date():
                    value = float(point.get(metric_key, 0))
                    break
            
            series.append(TimeSeriesPoint(
                date=current_date,
                value=value,
            ))
            current_date += timedelta(days=1)
        
        return series

    @staticmethod
    def calculate_growth_rate(
        values: List[float],
        period: str = "weekly",
    ) -> float:
        """Calculate growth rate over a period."""
        if len(values) < 2:
            return 0.0

        if period == "weekly":
            # Compare last 7 days to previous 7 days
            recent = sum(values[-7:]) if len(values) >= 7 else sum(values)
            previous = sum(values[-14:-7]) if len(values) >= 14 else 0
        else:
            # Compare last value to first
            recent = values[-1]
            previous = values[0]

        if previous == 0:
            return 100.0 if recent > 0 else 0.0

        return round(((recent - previous) / previous) * 100, 2)


# Global calculator instance
metrics_calculator = MetricsCalculator()

