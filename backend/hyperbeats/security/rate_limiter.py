"""
Rate Limiter
Implements tiered rate limiting for API requests.
"""

from datetime import datetime, timedelta
from typing import Optional, Tuple

from fastapi import HTTPException, Request

from backend.cache.redis_client import redis_client
from backend.hyperbeats.config import settings


class RateLimiter:
    """Tiered rate limiter using Redis."""

    TIERS = {
        "public": {
            "limit": settings.rate_limit_public,
            "window": settings.rate_limit_window,
        },
        "authenticated": {
            "limit": settings.rate_limit_authenticated,
            "window": settings.rate_limit_window,
        },
        "enterprise": {
            "limit": float("inf"),  # Unlimited
            "window": settings.rate_limit_window,
        },
    }

    async def get_tier(self, api_key: Optional[str]) -> str:
        """Determine rate limit tier from API key."""
        if not api_key:
            return "public"

        # Check API key in database/cache
        key_data = await redis_client.get(f"api_key:{api_key}")
        if key_data:
            # In production, this would be stored as JSON with tier info
            return "authenticated"

        return "public"

    async def check_limit(
        self,
        identifier: str,
        tier: str = "public",
    ) -> Tuple[bool, dict]:
        """
        Check if request is within rate limit.
        
        Args:
            identifier: Unique identifier (IP or API key)
            tier: Rate limit tier
            
        Returns:
            (allowed, metadata) tuple
        """
        tier_config = self.TIERS.get(tier, self.TIERS["public"])
        limit = tier_config["limit"]
        window = tier_config["window"]

        if limit == float("inf"):
            return True, {"limit": -1, "remaining": -1, "reset": 0}

        # Build Redis key
        redis_key = f"rate_limit:{tier}:{identifier}"

        # Get current count
        current = await redis_client.get(redis_key)
        count = int(current) if current else 0

        # Check limit
        if count >= limit:
            ttl = await redis_client.ttl(redis_key)
            return False, {
                "limit": int(limit),
                "remaining": 0,
                "reset": ttl if ttl > 0 else window,
            }

        # Increment counter
        new_count = await redis_client.incr(redis_key)

        # Set expiration on first request
        if new_count == 1:
            await redis_client.expire(redis_key, window)

        ttl = await redis_client.ttl(redis_key)

        return True, {
            "limit": int(limit),
            "remaining": max(0, int(limit) - new_count),
            "reset": ttl if ttl > 0 else window,
        }

    def get_rate_limit_headers(self, metadata: dict) -> dict:
        """Generate rate limit headers."""
        return {
            "X-RateLimit-Limit": str(metadata["limit"]),
            "X-RateLimit-Remaining": str(metadata["remaining"]),
            "X-RateLimit-Reset": str(metadata["reset"]),
        }


# Global rate limiter instance
rate_limiter = RateLimiter()


async def check_rate_limit(request: Request) -> dict:
    """
    FastAPI dependency to check rate limits.
    
    Raises HTTPException if rate limit exceeded.
    """
    # Get identifier
    api_key = request.headers.get(settings.api_key_header)
    identifier = api_key or request.client.host if request.client else "unknown"

    # Get tier
    tier = await rate_limiter.get_tier(api_key)

    # Check limit
    allowed, metadata = await rate_limiter.check_limit(identifier, tier)

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "limit": metadata["limit"],
                "reset_in_seconds": metadata["reset"],
            },
            headers=rate_limiter.get_rate_limit_headers(metadata),
        )

    return metadata

