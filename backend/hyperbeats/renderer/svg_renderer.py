"""
SVG Renderer
Generates SVG charts from metrics data.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from backend.hyperbeats.themes.theme_manager import theme_manager


class SVGRenderer:
    """Generate SVG charts from metrics data."""

    def __init__(self, width: int = 800, height: int = 400):
        self.width = width
        self.height = height
        self.padding = {"top": 60, "right": 40, "bottom": 60, "left": 70}

    @property
    def chart_width(self) -> int:
        return self.width - self.padding["left"] - self.padding["right"]

    @property
    def chart_height(self) -> int:
        return self.height - self.padding["top"] - self.padding["bottom"]

    def render_activity_chart(
        self,
        data: List[Dict[str, Any]],
        title: str = "Repository Activity",
        theme: str = "light",
    ) -> str:
        """Render an activity line chart."""
        colors = theme_manager.get_theme(theme)

        # Calculate scales
        if not data:
            data = [{"date": datetime.now(), "commits": 0, "prs": 0, "issues": 0}]

        max_value = max(
            max(d.get("commits", 0) for d in data),
            max(d.get("prs", 0) for d in data),
            max(d.get("issues", 0) for d in data),
            1,
        )

        # Generate paths for each metric
        commits_path = self._generate_line_path(data, "commits", max_value)
        prs_path = self._generate_line_path(data, "prs", max_value)
        issues_path = self._generate_line_path(data, "issues", max_value)

        svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.width} {self.height}" width="{self.width}" height="{self.height}">
  <defs>
    <style>
      .chart-title {{ font-family: system-ui, -apple-system, sans-serif; font-size: 18px; font-weight: 600; }}
      .axis-label {{ font-family: system-ui, sans-serif; font-size: 11px; }}
      .legend-text {{ font-family: system-ui, sans-serif; font-size: 12px; }}
      .grid-line {{ stroke: {colors.grid}; stroke-width: 1; opacity: 0.5; }}
      .axis-line {{ stroke: {colors.border}; stroke-width: 1; }}
    </style>
  </defs>

  <!-- Background -->
  <rect width="{self.width}" height="{self.height}" fill="{colors.background}"/>

  <!-- Title -->
  <text x="{self.width // 2}" y="30" class="chart-title" text-anchor="middle" fill="{colors.text}">
    {title}
  </text>

  <!-- Grid -->
  {self._generate_grid(colors)}

  <!-- Data lines -->
  <g transform="translate({self.padding['left']}, {self.padding['top']})">
    <path d="{commits_path}" fill="none" stroke="{colors.primary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="{prs_path}" fill="none" stroke="{colors.secondary}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="{issues_path}" fill="none" stroke="{colors.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Axes -->
  {self._generate_axes(data, max_value, colors)}

  <!-- Legend -->
  {self._generate_legend(colors)}

  <!-- Timestamp -->
  <text x="{self.width - 10}" y="{self.height - 10}" class="axis-label" text-anchor="end" fill="{colors.muted}">
    Updated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC
  </text>
</svg>"""

        return svg

    def render_bar_chart(
        self,
        data: Dict[str, float],
        title: str = "Metrics Comparison",
        theme: str = "light",
    ) -> str:
        """Render a bar chart."""
        colors = theme_manager.get_theme(theme)

        if not data:
            data = {"No Data": 0}

        max_value = max(data.values()) or 1
        bar_width = self.chart_width // (len(data) * 2)
        bar_spacing = self.chart_width // len(data)

        bars = []
        labels = []
        for i, (label, value) in enumerate(data.items()):
            x = self.padding["left"] + (i * bar_spacing) + bar_spacing // 4
            bar_height = (value / max_value) * self.chart_height
            y = self.padding["top"] + self.chart_height - bar_height

            bars.append(
                f'<rect x="{x}" y="{y}" width="{bar_width}" height="{bar_height}" '
                f'fill="{colors.primary}" rx="4"/>'
            )
            labels.append(
                f'<text x="{x + bar_width // 2}" y="{self.height - 25}" '
                f'class="axis-label" text-anchor="middle" fill="{colors.text}">{label}</text>'
            )
            labels.append(
                f'<text x="{x + bar_width // 2}" y="{y - 8}" '
                f'class="axis-label" text-anchor="middle" fill="{colors.text}">{int(value)}</text>'
            )

        svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.width} {self.height}" width="{self.width}" height="{self.height}">
  <defs>
    <style>
      .chart-title {{ font-family: system-ui, sans-serif; font-size: 18px; font-weight: 600; }}
      .axis-label {{ font-family: system-ui, sans-serif; font-size: 11px; }}
    </style>
  </defs>

  <rect width="{self.width}" height="{self.height}" fill="{colors.background}"/>

  <text x="{self.width // 2}" y="30" class="chart-title" text-anchor="middle" fill="{colors.text}">
    {title}
  </text>

  {chr(10).join(bars)}
  {chr(10).join(labels)}

  <text x="{self.width - 10}" y="{self.height - 10}" class="axis-label" text-anchor="end" fill="{colors.muted}">
    Updated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC
  </text>
</svg>"""

        return svg

    def _generate_line_path(
        self,
        data: List[Dict],
        key: str,
        max_value: float,
    ) -> str:
        """Generate SVG path for a line chart."""
        if not data:
            return ""

        points = []
        x_step = self.chart_width / max(len(data) - 1, 1)

        for i, point in enumerate(data):
            x = i * x_step
            value = point.get(key, 0)
            y = self.chart_height - (value / max_value) * self.chart_height
            points.append(f"{x:.1f},{y:.1f}")

        if not points:
            return ""

        return f"M {points[0]} L " + " L ".join(points[1:]) if len(points) > 1 else f"M {points[0]}"

    def _generate_grid(self, colors) -> str:
        """Generate grid lines."""
        lines = []
        
        # Horizontal grid lines
        for i in range(5):
            y = self.padding["top"] + (i * self.chart_height // 4)
            lines.append(
                f'<line x1="{self.padding["left"]}" y1="{y}" '
                f'x2="{self.width - self.padding["right"]}" y2="{y}" class="grid-line"/>'
            )

        return "\n  ".join(lines)

    def _generate_axes(self, data: List[Dict], max_value: float, colors) -> str:
        """Generate axis lines and labels."""
        axes = []
        
        # Y-axis
        axes.append(
            f'<line x1="{self.padding["left"]}" y1="{self.padding["top"]}" '
            f'x2="{self.padding["left"]}" y2="{self.height - self.padding["bottom"]}" class="axis-line"/>'
        )

        # X-axis
        axes.append(
            f'<line x1="{self.padding["left"]}" y1="{self.height - self.padding["bottom"]}" '
            f'x2="{self.width - self.padding["right"]}" y2="{self.height - self.padding["bottom"]}" class="axis-line"/>'
        )

        # Y-axis labels
        for i in range(5):
            y = self.padding["top"] + (i * self.chart_height // 4)
            value = int(max_value - (i * max_value / 4))
            axes.append(
                f'<text x="{self.padding["left"] - 10}" y="{y + 4}" '
                f'class="axis-label" text-anchor="end" fill="{colors.muted}">{value}</text>'
            )

        return "\n  ".join(axes)

    def _generate_legend(self, colors) -> str:
        """Generate chart legend."""
        legend_x = self.width - 150
        legend_y = 50

        return f"""
  <g transform="translate({legend_x}, {legend_y})">
    <rect width="140" height="80" fill="{colors.background}" stroke="{colors.border}" rx="4"/>
    <circle cx="15" cy="20" r="5" fill="{colors.primary}"/>
    <text x="30" y="24" class="legend-text" fill="{colors.text}">Commits</text>
    <circle cx="15" cy="45" r="5" fill="{colors.secondary}"/>
    <text x="30" y="49" class="legend-text" fill="{colors.text}">PRs Merged</text>
    <circle cx="15" cy="70" r="5" fill="{colors.accent}"/>
    <text x="30" y="74" class="legend-text" fill="{colors.text}">Issues Closed</text>
  </g>"""


# Global renderer instance
svg_renderer = SVGRenderer()

