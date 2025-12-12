"""
Input Validator
Validates and sanitizes user inputs.
"""

import re
from typing import List


# Valid repository name pattern
REPO_PATTERN = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?/[a-zA-Z0-9._-]+$")

# Valid timeframes
VALID_TIMEFRAMES = {"1d", "7d", "30d", "90d", "1y"}

# Valid themes
VALID_THEMES = {"light", "dark", "hyperkit", "mint", "sunset", "ocean", "forest"}

# Valid formats
VALID_FORMATS = {"svg", "png"}


def validate_repos(repos: List[str]) -> bool:
    """
    Validate repository names.
    
    Args:
        repos: List of repository names in "owner/repo" format
        
    Returns:
        True if all repos are valid
        
    Raises:
        ValueError: If any repo is invalid
    """
    if not repos:
        raise ValueError("At least one repository is required")

    if len(repos) > 10:
        raise ValueError("Maximum 10 repositories allowed per request")

    for repo in repos:
        if not repo:
            raise ValueError("Repository name cannot be empty")

        if len(repo) > 100:
            raise ValueError(f"Repository name too long: {repo[:20]}...")

        if not REPO_PATTERN.match(repo):
            raise ValueError(
                f"Invalid repository format: {repo}. Expected 'owner/repo'"
            )

        # Check for path traversal attempts
        if ".." in repo or repo.startswith("/") or repo.endswith("/"):
            raise ValueError(f"Invalid repository name: {repo}")

    return True


def validate_timeframe(timeframe: str) -> bool:
    """
    Validate timeframe parameter.
    
    Args:
        timeframe: Timeframe string (1d, 7d, 30d, 90d, 1y)
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If timeframe is invalid
    """
    if timeframe not in VALID_TIMEFRAMES:
        raise ValueError(
            f"Invalid timeframe: {timeframe}. "
            f"Valid options: {', '.join(sorted(VALID_TIMEFRAMES))}"
        )
    return True


def validate_theme(theme: str) -> bool:
    """
    Validate theme parameter.
    
    Args:
        theme: Theme name
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If theme is invalid
    """
    if theme not in VALID_THEMES:
        raise ValueError(
            f"Invalid theme: {theme}. "
            f"Valid options: {', '.join(sorted(VALID_THEMES))}"
        )
    return True


def validate_format(format: str) -> bool:
    """
    Validate output format.
    
    Args:
        format: Output format (svg, png)
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If format is invalid
    """
    if format not in VALID_FORMATS:
        raise ValueError(
            f"Invalid format: {format}. "
            f"Valid options: {', '.join(sorted(VALID_FORMATS))}"
        )
    return True


def sanitize_string(value: str, max_length: int = 100) -> str:
    """
    Sanitize a string input.
    
    Args:
        value: Input string
        max_length: Maximum allowed length
        
    Returns:
        Sanitized string
    """
    if not value:
        return ""

    # Truncate if too long
    value = value[:max_length]

    # Remove potentially dangerous characters
    value = re.sub(r'[<>"\']', '', value)

    return value.strip()


def validate_dimensions(width: int, height: int) -> bool:
    """
    Validate chart dimensions.
    
    Args:
        width: Chart width in pixels
        height: Chart height in pixels
        
    Returns:
        True if valid
        
    Raises:
        ValueError: If dimensions are invalid
    """
    if width < 200 or width > 2000:
        raise ValueError("Width must be between 200 and 2000 pixels")

    if height < 100 or height > 1000:
        raise ValueError("Height must be between 100 and 1000 pixels")

    return True

