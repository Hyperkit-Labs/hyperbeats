"""
Access Control
API key authentication and tier-based access.
"""

import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, Request, Depends
from fastapi.security import APIKeyHeader

from backend.cache.redis_client import redis_client
from backend.hyperbeats.config import settings


# API Key header scheme
api_key_header = APIKeyHeader(name=settings.api_key_header, auto_error=False)


class AccessControl:
    """Manages API key authentication and access tiers."""

    TIERS = {
        "public": {
            "rate_limit": settings.rate_limit_public,
            "features": ["chart_activity", "metrics_aggregate"],
        },
        "authenticated": {
            "rate_limit": settings.rate_limit_authenticated,
            "features": ["chart_activity", "metrics_aggregate", "chart_tvl", "chart_chain"],
        },
        "enterprise": {
            "rate_limit": float("inf"),
            "features": ["*"],  # All features
        },
    }

    @staticmethod
    def generate_api_key() -> str:
        """Generate a new API key."""
        return f"hb_{secrets.token_urlsafe(32)}"

    @staticmethod
    def hash_key(api_key: str) -> str:
        """Hash an API key for storage."""
        return hashlib.sha256(api_key.encode()).hexdigest()

    async def validate_api_key(self, api_key: Optional[str]) -> Optional[dict]:
        """
        Validate an API key and return its metadata.
        
        Returns None if key is invalid or not provided.
        """
        if not api_key:
            return None

        # Hash the key for lookup
        key_hash = self.hash_key(api_key)

        # Look up in Redis
        key_data = await redis_client.get_json(f"api_key:{key_hash}")

        if not key_data:
            return None

        # Check if expired
        if key_data.get("expires_at"):
            expires = datetime.fromisoformat(key_data["expires_at"])
            if datetime.utcnow() > expires:
                return None

        # Check if active
        if not key_data.get("is_active", True):
            return None

        return key_data

    async def get_access_tier(self, api_key: Optional[str]) -> str:
        """Get the access tier for an API key."""
        if not api_key:
            return "public"

        key_data = await self.validate_api_key(api_key)
        if not key_data:
            return "public"

        return key_data.get("tier", "authenticated")

    def check_feature_access(self, tier: str, feature: str) -> bool:
        """Check if a tier has access to a feature."""
        tier_config = self.TIERS.get(tier, self.TIERS["public"])
        features = tier_config.get("features", [])
        return "*" in features or feature in features

    async def create_api_key(
        self,
        name: str,
        tier: str = "authenticated",
        owner_email: Optional[str] = None,
        expires_days: Optional[int] = None,
    ) -> dict:
        """Create a new API key."""
        api_key = self.generate_api_key()
        key_hash = self.hash_key(api_key)

        expires_at = None
        if expires_days:
            expires_at = (datetime.utcnow() + timedelta(days=expires_days)).isoformat()

        key_data = {
            "name": name,
            "tier": tier,
            "owner_email": owner_email,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": expires_at,
        }

        # Store in Redis
        await redis_client.set_json(f"api_key:{key_hash}", key_data)

        return {
            "api_key": api_key,
            "name": name,
            "tier": tier,
            "expires_at": expires_at,
        }

    async def revoke_api_key(self, api_key: str) -> bool:
        """Revoke an API key."""
        key_hash = self.hash_key(api_key)
        return await redis_client.delete(f"api_key:{key_hash}") > 0


# Global access control instance
access_control = AccessControl()


async def get_api_key(
    api_key: Optional[str] = Depends(api_key_header),
) -> Optional[str]:
    """FastAPI dependency to extract API key."""
    return api_key


async def require_authenticated(
    api_key: Optional[str] = Depends(get_api_key),
) -> dict:
    """FastAPI dependency requiring authenticated access."""
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail="API key required",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    key_data = await access_control.validate_api_key(api_key)
    if not key_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired API key",
        )

    return key_data


async def require_enterprise(
    api_key: Optional[str] = Depends(get_api_key),
) -> dict:
    """FastAPI dependency requiring enterprise access."""
    key_data = await require_authenticated(api_key)

    if key_data.get("tier") != "enterprise":
        raise HTTPException(
            status_code=403,
            detail="Enterprise access required",
        )

    return key_data

