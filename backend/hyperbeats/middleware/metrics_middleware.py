"""
Prometheus Metrics Middleware
Collects API request metrics.
"""

import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST


# Prometheus metrics
REQUEST_COUNT = Counter(
    "hyperbeats_requests_total",
    "Total API requests",
    ["method", "endpoint", "status"],
)

REQUEST_LATENCY = Histogram(
    "hyperbeats_request_latency_seconds",
    "Request latency in seconds",
    ["method", "endpoint"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
)

ACTIVE_REQUESTS = Gauge(
    "hyperbeats_active_requests",
    "Number of active requests",
)

CACHE_HITS = Counter(
    "hyperbeats_cache_hits_total",
    "Total cache hits",
    ["cache_layer"],
)

CACHE_MISSES = Counter(
    "hyperbeats_cache_misses_total",
    "Total cache misses",
)


class PrometheusMiddleware(BaseHTTPMiddleware):
    """Middleware to collect Prometheus metrics."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request and collect metrics."""
        # Skip metrics endpoint to avoid recursion
        if request.url.path == "/metrics":
            return await call_next(request)

        # Track active requests
        ACTIVE_REQUESTS.inc()

        # Record start time
        start_time = time.time()

        try:
            # Process request
            response = await call_next(request)

            # Calculate latency
            latency = time.time() - start_time

            # Get endpoint (simplified path)
            endpoint = self._get_endpoint_label(request.url.path)

            # Record metrics
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=endpoint,
                status=response.status_code,
            ).inc()

            REQUEST_LATENCY.labels(
                method=request.method,
                endpoint=endpoint,
            ).observe(latency)

            # Track cache hits/misses from response headers
            cache_status = response.headers.get("X-Cache", "")
            if cache_status.startswith("HIT"):
                cache_layer = cache_status.replace("HIT_", "").lower() or "unknown"
                CACHE_HITS.labels(cache_layer=cache_layer).inc()
            elif cache_status == "MISS":
                CACHE_MISSES.inc()

            return response

        finally:
            ACTIVE_REQUESTS.dec()

    @staticmethod
    def _get_endpoint_label(path: str) -> str:
        """Convert path to a metrics-friendly label."""
        # Remove IDs and normalize path
        parts = path.strip("/").split("/")

        # Simplify path for metrics
        if len(parts) >= 3 and parts[0] == "api":
            # /api/v1/chart/activity -> /api/v1/chart/activity
            return "/" + "/".join(parts[:4]) if len(parts) >= 4 else "/" + "/".join(parts)

        return path if len(path) < 50 else path[:50]


async def metrics_endpoint(request: Request) -> Response:
    """Prometheus metrics endpoint."""
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )


def record_cache_hit(layer: str = "redis") -> None:
    """Record a cache hit."""
    CACHE_HITS.labels(cache_layer=layer).inc()


def record_cache_miss() -> None:
    """Record a cache miss."""
    CACHE_MISSES.inc()

