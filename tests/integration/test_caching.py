"""
Integration Tests for Caching
"""

import pytest

from backend.cache.cache_manager import cache_manager, CacheManager


@pytest.mark.asyncio
class TestCacheManager:
    """Tests for CacheManager class."""

    async def test_generate_cache_key_deterministic(self):
        """Test that cache key generation is deterministic."""
        key1 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1", "repo2"],
            timeframe="7d",
        )
        key2 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1", "repo2"],
            timeframe="7d",
        )
        assert key1 == key2

    async def test_generate_cache_key_order_independent(self):
        """Test that repo order doesn't affect cache key."""
        key1 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1", "repo2"],
            timeframe="7d",
        )
        key2 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo2", "repo1"],
            timeframe="7d",
        )
        assert key1 == key2

    async def test_generate_cache_key_different_params(self):
        """Test that different params produce different keys."""
        key1 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1"],
            timeframe="7d",
        )
        key2 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1"],
            timeframe="30d",
        )
        assert key1 != key2

    async def test_generate_cache_key_includes_theme(self):
        """Test that theme affects cache key."""
        key1 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1"],
            timeframe="7d",
            theme="light",
        )
        key2 = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1"],
            timeframe="7d",
            theme="dark",
        )
        assert key1 != key2

    async def test_cache_key_length(self):
        """Test that cache key has consistent length."""
        key = cache_manager.generate_cache_key(
            prefix="test",
            repos=["repo1", "repo2", "repo3"],
            timeframe="7d",
        )
        assert len(key) == 32  # SHA256 truncated to 32 chars


class TestCacheOperations:
    """Tests for cache get/set operations."""

    async def test_get_returns_miss_on_empty(self):
        """Test that get returns MISS for non-existent key."""
        value, status = await cache_manager.get("nonexistent_key")
        assert value is None
        assert status == "MISS"

    async def test_get_stats(self):
        """Test getting cache statistics."""
        stats = await cache_manager.get_stats()
        assert "default_ttl" in stats
        assert stats["default_ttl"] > 0

