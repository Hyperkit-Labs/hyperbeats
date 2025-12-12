"""
Pytest Configuration and Fixtures
"""

import asyncio
from typing import AsyncGenerator

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from backend.hyperbeats.main import app
from backend.database.models import Base


# Test database URL (in-memory SQLite for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    """Create test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    await engine.dispose()


@pytest.fixture
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Get database session for tests."""
    session_factory = async_sessionmaker(
        bind=test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Get async HTTP client for API tests."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_repos():
    """Sample repository list for testing."""
    return ["octocat/Hello-World", "microsoft/vscode"]


@pytest.fixture
def sample_metrics():
    """Sample metrics data for testing."""
    return {
        "octocat/Hello-World": {
            "commits": 42,
            "prs_merged": 5,
            "issues_closed": 10,
            "contributors": 3,
        },
        "microsoft/vscode": {
            "commits": 150,
            "prs_merged": 25,
            "issues_closed": 50,
            "contributors": 20,
        },
    }


@pytest.fixture
def mock_github_response():
    """Mock GitHub API response."""
    return {
        "commits": [
            {"sha": "abc123", "commit": {"message": "Test commit", "author": {"date": "2024-01-01T00:00:00Z"}}},
        ],
        "prs": [
            {"number": 1, "state": "closed", "merged_at": "2024-01-01T00:00:00Z"},
        ],
        "issues": [
            {"number": 1, "state": "closed", "closed_at": "2024-01-01T00:00:00Z"},
        ],
    }

