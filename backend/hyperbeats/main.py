"""
Hyperbeats API - Main Application Entry Point
Real-time activity monitoring and visualization for blockchain ecosystems.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from backend.hyperbeats.config import settings
from backend.hyperbeats.api.v1 import router as api_v1_router
from backend.hyperbeats.dependencies import (
    init_database,
    close_database,
    init_redis,
    close_redis,
)
from backend.hyperbeats.middleware.metrics_middleware import PrometheusMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Application lifespan handler for startup/shutdown events."""
    # Startup
    await init_database()
    await init_redis()
    yield
    # Shutdown
    await close_redis()
    await close_database()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Hyperbeats",
        description="Real-time activity monitoring and visualization for blockchain ecosystems",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        default_response_class=ORJSONResponse,
        lifespan=lifespan,
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Prometheus Metrics Middleware
    if settings.prometheus_enabled:
        app.add_middleware(PrometheusMiddleware)

    # Include API routers
    app.include_router(api_v1_router, prefix="/api/v1")

    # Health endpoints
    @app.get("/health", tags=["Health"])
    async def health_check():
        """Basic health check endpoint."""
        return {"status": "healthy", "service": "hyperbeats"}

    @app.get("/ready", tags=["Health"])
    async def readiness_check():
        """Readiness check verifying all dependencies."""
        from backend.hyperbeats.dependencies import check_dependencies

        deps = await check_dependencies()
        all_ready = all(deps.values())
        return {
            "status": "ready" if all_ready else "not_ready",
            "dependencies": deps,
        }

    @app.get("/", tags=["Root"])
    async def root():
        """Root endpoint with API information."""
        return {
            "service": "Hyperbeats",
            "version": "1.0.0",
            "docs": "/docs",
            "health": "/health",
        }

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.hyperbeats.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        workers=1 if settings.debug else settings.workers,
    )

