"""
Predefined Themes
Color schemes for chart rendering.
"""

from typing import Dict

from pydantic import BaseModel


class ThemeColors(BaseModel):
    """Theme color configuration."""
    background: str
    text: str
    primary: str
    secondary: str
    accent: str
    grid: str
    border: str
    muted: str


THEMES: Dict[str, ThemeColors] = {
    "light": ThemeColors(
        background="#ffffff",
        text="#1f2937",
        primary="#3182ce",
        secondary="#48bb78",
        accent="#ed8936",
        grid="#e2e8f0",
        border="#d1d5db",
        muted="#9ca3af",
    ),
    "dark": ThemeColors(
        background="#1a202c",
        text="#e2e8f0",
        primary="#63b3ed",
        secondary="#68d391",
        accent="#f6ad55",
        grid="#4a5568",
        border="#4a5568",
        muted="#718096",
    ),
    "hyperkit": ThemeColors(
        background="#0f1419",
        text="#e8f0f7",
        primary="#2186b5",
        secondary="#8bcf7f",
        accent="#f59e0b",
        grid="#2d3748",
        border="#374151",
        muted="#6b7280",
    ),
    "mint": ThemeColors(
        background="#f0fdf4",
        text="#1e4e2c",
        primary="#10b981",
        secondary="#34d399",
        accent="#6ee7b7",
        grid="#d1fae5",
        border="#a7f3d0",
        muted="#6ee7b7",
    ),
    "sunset": ThemeColors(
        background="#1f1f1f",
        text="#fef3c7",
        primary="#f97316",
        secondary="#fb923c",
        accent="#fbbf24",
        grid="#374151",
        border="#4b5563",
        muted="#9ca3af",
    ),
    "ocean": ThemeColors(
        background="#0c4a6e",
        text="#f0f9ff",
        primary="#38bdf8",
        secondary="#7dd3fc",
        accent="#0ea5e9",
        grid="#164e63",
        border="#155e75",
        muted="#67e8f9",
    ),
    "forest": ThemeColors(
        background="#14532d",
        text="#f0fdf4",
        primary="#22c55e",
        secondary="#4ade80",
        accent="#86efac",
        grid="#166534",
        border="#15803d",
        muted="#6ee7b7",
    ),
}

