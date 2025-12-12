"""
Hyperbeats Database Models
Time-series metrics storage for repository activity.
"""

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    Text,
    Index,
    ForeignKey,
    JSON,
    Boolean,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


class Repository(Base):
    """Repository being tracked."""
    __tablename__ = "repositories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    owner = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    full_name = Column(String(201), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    default_branch = Column(String(100), default="main")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    metrics = relationship("DailyMetric", back_populates="repository", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_repo_full_name", "full_name"),
        Index("idx_repo_owner", "owner"),
    )


class DailyMetric(Base):
    """Daily aggregated metrics for a repository."""
    __tablename__ = "daily_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    repository_id = Column(UUID(as_uuid=True), ForeignKey("repositories.id"), nullable=False)
    date = Column(DateTime, nullable=False)

    # Activity metrics
    commits = Column(Integer, default=0)
    prs_opened = Column(Integer, default=0)
    prs_merged = Column(Integer, default=0)
    prs_closed = Column(Integer, default=0)
    issues_opened = Column(Integer, default=0)
    issues_closed = Column(Integer, default=0)
    contributors = Column(Integer, default=0)

    # Engagement metrics
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    watchers = Column(Integer, default=0)

    # Additional data
    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    repository = relationship("Repository", back_populates="metrics")

    __table_args__ = (
        Index("idx_metrics_repo_date", "repository_id", "date"),
        Index("idx_metrics_date", "date"),
    )


class APIKey(Base):
    """API keys for authentication and rate limiting."""
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    key_hash = Column(String(256), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    tier = Column(String(20), default="public")  # public, authenticated, enterprise
    owner_email = Column(String(255), nullable=True)
    
    # Usage tracking
    requests_today = Column(Integer, default=0)
    last_request_at = Column(DateTime, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("idx_api_key_hash", "key_hash"),
        Index("idx_api_key_tier", "tier"),
    )


class CachedChart(Base):
    """Cached chart metadata for tracking."""
    __tablename__ = "cached_charts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    cache_key = Column(String(500), nullable=False, unique=True)
    chart_type = Column(String(50), nullable=False)  # activity, tvl, chain, leaderboard
    repos = Column(JSON, nullable=False)
    timeframe = Column(String(10), nullable=False)
    theme = Column(String(20), nullable=False)
    format = Column(String(10), nullable=False)  # svg, png

    # Cache metadata
    hit_count = Column(Integer, default=0)
    size_bytes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    __table_args__ = (
        Index("idx_cache_key", "cache_key"),
        Index("idx_cache_expires", "expires_at"),
    )

