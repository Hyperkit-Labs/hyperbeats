"""
Hyperbeats Configuration
Loads settings from environment variables with sensible defaults.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "hyperbeats"
    app_env: str = "development"
    debug: bool = False
    log_level: str = "INFO"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 4

    # Database
    database_url: str = "postgresql+asyncpg://hyperbeats:hyperbeats@localhost:5432/hyperbeats"
    database_pool_size: int = 20
    database_max_overflow: int = 10

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_cache_ttl: int = 3600

    # GitHub API
    github_token: str = ""
    github_api_base_url: str = "https://api.github.com"
    github_rate_limit_buffer: int = 10

    # Cloudflare R2 (FREE 10GB)
    r2_bucket: str = "hyperbeats-charts"
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_endpoint: str = ""
    cdn_base_url: str = ""
    
    # Cloudflare API
    cloudflare_api_token: str = ""
    cloudflare_zone_id: str = ""
    cloudflare_account_id: str = ""
    
    # Legacy S3 support (optional)
    s3_bucket: str = ""
    s3_region: str = "us-east-1"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""

    # Security
    secret_key: str = "change-me-in-production"
    api_key_header: str = "X-API-Key"
    cors_origins: str = "https://beats.hyperionkit.xyz,http://localhost:3000"

    # Rate Limiting
    rate_limit_public: int = 100
    rate_limit_authenticated: int = 1000
    rate_limit_window: int = 3600

    # Rendering
    puppeteer_executable_path: str = "/usr/bin/chromium-browser"
    png_default_dpi: int = 150
    svg_default_width: int = 800
    svg_default_height: int = 400

    # Monitoring
    prometheus_enabled: bool = True
    prometheus_port: int = 9090

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()

