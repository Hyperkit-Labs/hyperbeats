"""
Unit Tests for Input Validators
"""

import pytest

from backend.hyperbeats.validators.input_validator import (
    validate_repos,
    validate_timeframe,
    validate_theme,
    validate_format,
    validate_dimensions,
    sanitize_string,
)


class TestValidateRepos:
    """Tests for repository validation."""

    def test_valid_single_repo(self):
        """Test validation of a single valid repo."""
        assert validate_repos(["octocat/Hello-World"]) is True

    def test_valid_multiple_repos(self):
        """Test validation of multiple valid repos."""
        repos = ["octocat/Hello-World", "microsoft/vscode", "facebook/react"]
        assert validate_repos(repos) is True

    def test_empty_list_raises(self):
        """Test that empty list raises ValueError."""
        with pytest.raises(ValueError, match="At least one repository"):
            validate_repos([])

    def test_too_many_repos_raises(self):
        """Test that more than 10 repos raises ValueError."""
        repos = [f"owner/repo{i}" for i in range(11)]
        with pytest.raises(ValueError, match="Maximum 10 repositories"):
            validate_repos(repos)

    def test_invalid_format_raises(self):
        """Test that invalid format raises ValueError."""
        with pytest.raises(ValueError, match="Invalid repository format"):
            validate_repos(["invalid-repo"])

    def test_empty_repo_name_raises(self):
        """Test that empty repo name raises ValueError."""
        with pytest.raises(ValueError, match="cannot be empty"):
            validate_repos([""])

    def test_repo_name_too_long_raises(self):
        """Test that very long repo name raises ValueError."""
        long_name = "a" * 101
        with pytest.raises(ValueError, match="too long"):
            validate_repos([long_name])

    def test_path_traversal_blocked(self):
        """Test that path traversal attempts are blocked."""
        with pytest.raises(ValueError, match="Invalid repository"):
            validate_repos(["owner/../repo"])


class TestValidateTimeframe:
    """Tests for timeframe validation."""

    @pytest.mark.parametrize("timeframe", ["1d", "7d", "30d", "90d", "1y"])
    def test_valid_timeframes(self, timeframe):
        """Test all valid timeframes."""
        assert validate_timeframe(timeframe) is True

    def test_invalid_timeframe_raises(self):
        """Test that invalid timeframe raises ValueError."""
        with pytest.raises(ValueError, match="Invalid timeframe"):
            validate_timeframe("invalid")

    def test_numeric_only_raises(self):
        """Test that numeric-only value raises ValueError."""
        with pytest.raises(ValueError, match="Invalid timeframe"):
            validate_timeframe("7")


class TestValidateTheme:
    """Tests for theme validation."""

    @pytest.mark.parametrize("theme", ["light", "dark", "hyperkit", "mint"])
    def test_valid_themes(self, theme):
        """Test valid themes."""
        assert validate_theme(theme) is True

    def test_invalid_theme_raises(self):
        """Test that invalid theme raises ValueError."""
        with pytest.raises(ValueError, match="Invalid theme"):
            validate_theme("invalid-theme")


class TestValidateFormat:
    """Tests for format validation."""

    @pytest.mark.parametrize("format", ["svg", "png"])
    def test_valid_formats(self, format):
        """Test valid formats."""
        assert validate_format(format) is True

    def test_invalid_format_raises(self):
        """Test that invalid format raises ValueError."""
        with pytest.raises(ValueError, match="Invalid format"):
            validate_format("jpg")


class TestValidateDimensions:
    """Tests for dimension validation."""

    def test_valid_dimensions(self):
        """Test valid dimensions."""
        assert validate_dimensions(800, 400) is True
        assert validate_dimensions(200, 100) is True
        assert validate_dimensions(2000, 1000) is True

    def test_width_too_small_raises(self):
        """Test that small width raises ValueError."""
        with pytest.raises(ValueError, match="Width must be"):
            validate_dimensions(100, 400)

    def test_width_too_large_raises(self):
        """Test that large width raises ValueError."""
        with pytest.raises(ValueError, match="Width must be"):
            validate_dimensions(3000, 400)

    def test_height_too_small_raises(self):
        """Test that small height raises ValueError."""
        with pytest.raises(ValueError, match="Height must be"):
            validate_dimensions(800, 50)


class TestSanitizeString:
    """Tests for string sanitization."""

    def test_basic_sanitization(self):
        """Test basic string sanitization."""
        assert sanitize_string("hello world") == "hello world"

    def test_removes_dangerous_chars(self):
        """Test removal of dangerous characters."""
        assert sanitize_string("<script>alert('xss')</script>") == "scriptalert(xss)/script"

    def test_truncates_long_strings(self):
        """Test truncation of long strings."""
        long_string = "a" * 200
        result = sanitize_string(long_string, max_length=50)
        assert len(result) == 50

    def test_empty_string(self):
        """Test empty string handling."""
        assert sanitize_string("") == ""
        assert sanitize_string(None) == ""

    def test_strips_whitespace(self):
        """Test whitespace stripping."""
        assert sanitize_string("  hello  ") == "hello"

