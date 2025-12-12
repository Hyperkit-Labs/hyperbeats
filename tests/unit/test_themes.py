"""
Unit Tests for Theme Management
"""

import pytest

from backend.hyperbeats.themes.theme_manager import theme_manager, ThemeManager
from backend.hyperbeats.themes.predefined import THEMES, ThemeColors


class TestThemeColors:
    """Tests for ThemeColors model."""

    def test_theme_colors_creation(self):
        """Test ThemeColors creation."""
        colors = ThemeColors(
            background="#ffffff",
            text="#000000",
            primary="#3182ce",
            secondary="#48bb78",
            accent="#ed8936",
            grid="#e2e8f0",
            border="#d1d5db",
            muted="#9ca3af",
        )
        assert colors.background == "#ffffff"
        assert colors.primary == "#3182ce"


class TestPredefinedThemes:
    """Tests for predefined themes."""

    def test_all_required_themes_exist(self):
        """Test that all required themes are defined."""
        required = ["light", "dark", "hyperkit", "mint"]
        for theme in required:
            assert theme in THEMES

    def test_theme_has_all_colors(self):
        """Test that each theme has all required colors."""
        required_colors = [
            "background", "text", "primary", "secondary",
            "accent", "grid", "border", "muted"
        ]
        for theme_name, theme in THEMES.items():
            for color in required_colors:
                assert hasattr(theme, color), f"{theme_name} missing {color}"

    def test_colors_are_valid_hex(self):
        """Test that all colors are valid hex codes."""
        import re
        hex_pattern = re.compile(r"^#[0-9a-fA-F]{6}$")
        
        for theme_name, theme in THEMES.items():
            for color_name in ["background", "text", "primary", "secondary", "accent", "grid"]:
                color = getattr(theme, color_name)
                assert hex_pattern.match(color), f"{theme_name}.{color_name} invalid: {color}"


class TestThemeManager:
    """Tests for ThemeManager class."""

    def test_get_theme_returns_colors(self):
        """Test getting theme colors."""
        colors = theme_manager.get_theme("light")
        assert isinstance(colors, ThemeColors)
        assert colors.background == "#ffffff"

    def test_get_theme_unknown_returns_light(self):
        """Test that unknown theme returns light theme."""
        colors = theme_manager.get_theme("nonexistent")
        assert colors == THEMES["light"]

    def test_get_available_themes(self):
        """Test getting list of available themes."""
        themes = theme_manager.get_available_themes()
        assert "light" in themes
        assert "dark" in themes
        assert "hyperkit" in themes

    def test_apply_theme_replaces_variables(self):
        """Test that apply_theme replaces CSS variables."""
        svg = """<svg>
            <rect fill="var(--color-background)"/>
            <text fill="var(--color-text)">Test</text>
        </svg>"""
        
        result = theme_manager.apply_theme(svg, "light")
        
        assert "var(--color-background)" not in result
        assert "#ffffff" in result
        assert "#1f2937" in result

    def test_apply_theme_dark_mode(self):
        """Test applying dark theme."""
        svg = '<rect fill="var(--color-background)"/>'
        result = theme_manager.apply_theme(svg, "dark")
        
        assert "#1a202c" in result

    def test_create_custom_theme(self):
        """Test creating custom theme."""
        custom = theme_manager.create_custom_theme(
            background="#ff0000",
            primary="#00ff00",
        )
        
        assert custom.background == "#ff0000"
        assert custom.primary == "#00ff00"
        # Non-specified values should use light theme defaults
        assert custom.text == THEMES["light"].text

    def test_get_css_variables(self):
        """Test CSS variables generation."""
        css = theme_manager.get_css_variables("light")
        
        assert "--color-background:" in css
        assert "--color-primary:" in css
        assert "#ffffff" in css


class TestThemeContrast:
    """Tests for theme accessibility and contrast."""

    def test_light_theme_contrast(self):
        """Test that light theme has good contrast."""
        light = THEMES["light"]
        # Text should be dark on light background
        assert light.background.lower() > "#aaaaaa"
        assert light.text.lower() < "#555555"

    def test_dark_theme_contrast(self):
        """Test that dark theme has good contrast."""
        dark = THEMES["dark"]
        # Text should be light on dark background
        assert dark.background.lower() < "#555555"
        assert dark.text.lower() > "#aaaaaa"

