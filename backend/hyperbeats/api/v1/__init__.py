"""
API v1 Router
Combines all v1 endpoints.
"""

from fastapi import APIRouter

from backend.hyperbeats.api.v1.chart_activity import router as chart_activity_router
from backend.hyperbeats.api.v1.metrics_aggregate import router as metrics_router

router = APIRouter()

# Include sub-routers
router.include_router(chart_activity_router, prefix="/chart", tags=["Charts"])
router.include_router(metrics_router, prefix="/metrics", tags=["Metrics"])

