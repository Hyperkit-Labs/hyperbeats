"""
Hyperbeats Dependencies
Database, Redis, and other service connections.
"""

from typing import Dict, Optional

import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from backend.hyperbeats.config import settings

# Global instances
_engine = None
_session_factory = None
_redis_client: Optional[redis.Redis] = None


async def init_database() -> None:
    """Initialize database connection pool."""
    global _engine, _session_factory

    _engine = create_async_engine(
        settings.database_url,
        pool_size=settings.database_pool_size,
        max_overflow=settings.database_max_overflow,
        echo=settings.debug,
    )

    _session_factory = async_sessionmaker(
        bind=_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def close_database() -> None:
    """Close database connection pool."""
    global _engine
    if _engine:
        await _engine.dispose()
        _engine = None


async def get_db() -> AsyncSession:
    """Get database session dependency."""
    if _session_factory is None:
        raise RuntimeError("Database not initialized")

    async with _session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_redis() -> None:
    """Initialize Redis connection."""
    global _redis_client
    _redis_client = redis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )


async def close_redis() -> None:
    """Close Redis connection."""
    global _redis_client
    if _redis_client:
        await _redis_client.close()
        _redis_client = None


def get_redis() -> redis.Redis:
    """Get Redis client dependency."""
    if _redis_client is None:
        raise RuntimeError("Redis not initialized")
    return _redis_client


async def check_dependencies() -> Dict[str, bool]:
    """Check all dependency connections."""
    results = {}

    # Check database
    try:
        if _engine:
            async with _engine.connect() as conn:
                await conn.execute("SELECT 1")
            results["database"] = True
        else:
            results["database"] = False
    except Exception:
        results["database"] = False

    # Check Redis
    try:
        if _redis_client:
            await _redis_client.ping()
            results["redis"] = True
        else:
            results["redis"] = False
    except Exception:
        results["redis"] = False

    return results

