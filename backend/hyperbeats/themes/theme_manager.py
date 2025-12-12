"""
Theme Manager
Manages SVG/PNG color themes for chart rendering.
"""

from typing import Dict, Optional

from backend.hyperbeats.themes.predefined import THEMES, ThemeColors


class ThemeManager:
    """Manage SVG/PNG color themes."""

    def __init__(self):
        self.themes = THEMES

    def get_theme(self, theme_name: str) -> ThemeColors:
        """Get theme colors by name."""
        return self.themes.get(theme_name, self.themes["light"])

    def get_available_themes(self) -> list[str]:
        """Get list of available theme names."""
        return list(self.themes.keys())

    def apply_theme(
        self,
        svg_content: str,
        theme: str = "light",
    ) -> str:
        """Apply theme colors to SVG content."""
        colors = self.get_theme(theme)

        # Replace CSS variables with actual colors
        replacements = {
            "var(--color-background)": colors.background,
            "var(--color-text)": colors.text,
            "var(--color-primary)": colors.primary,
            "var(--color-secondary)": colors.secondary,
            "var(--color-accent)": colors.accent,
            "var(--color-grid)": colors.grid,
            "var(--color-border)": colors.border,
            "var(--color-muted)": colors.muted,
        }

        for var, color in replacements.items():
            svg_content = svg_content.replace(var, color)

        return svg_content

    def create_custom_theme(
        self,
        background: Optional[str] = None,
        text: Optional[str] = None,
        primary: Optional[str] = None,
        secondary: Optional[str] = None,
        accent: Optional[str] = None,
    ) -> ThemeColors:
        """Create a custom theme from URL parameters."""
        base = self.themes["light"]
        return ThemeColors(
            background=background or base.background,
            text=text or base.text,
            primary=primary or base.primary,
            secondary=secondary or base.secondary,
            accent=accent or base.accent,
            grid=base.grid,
            border=base.border,
            muted=base.muted,
        )

    def get_css_variables(self, theme: str = "light") -> str:
        """Generate CSS variables for a theme."""
        colors = self.get_theme(theme)
        return f"""
:root {{
    --color-background: {colors.background};
    --color-text: {colors.text};
    --color-primary: {colors.primary};
    --color-secondary: {colors.secondary};
    --color-accent: {colors.accent};
    --color-grid: {colors.grid};
    --color-border: {colors.border};
    --color-muted: {colors.muted};
}}
"""


# Global theme manager instance
theme_manager = ThemeManager()

