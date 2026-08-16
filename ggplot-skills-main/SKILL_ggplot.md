---
name: ggplot
author: Wanjun Gu
email: wanjun.gu@ucsf.edu
description: "Publication-quality ggplot2 visualization guide for R. Use when creating new ggplot figures, reviewing existing plots for publication readiness, or refactoring code to improve aesthetics. Covers font sizing, color palettes, themes, label handling, and export settings."
license: MIT
---

# ggplot2 Publication-Quality Visualization Guide

## Overview

This skill provides guidance for creating publication-quality ggplot2 visualizations in R. Use this guide when:

1. **Creating new ggplot figures** - Follow these principles from the start
2. **Reviewing existing figures** - Identify issues and suggest improvements
3. **Refactoring code** - Transform basic plots into publication-ready visualizations

## Quick Reference

| Issue | Solution |
|-------|----------|
| Text too small | Increase `base_size` to 14+ in theme |
| Default gray theme | Use `theme_minimal()` or `theme_bw()` |
| Overlapping labels | Use `geom_text_repel()` from ggrepel |
| High contrast colors | Use `scale_color_brewer()` or viridis |
| Programmatic names | Use `labs()` with natural language |
| Points too small | Set `size = 2.5` or higher |
| Lines too thin | Set `linewidth = 0.8` or higher |

## Core Principles

A publication-quality ggplot figure must have:

1. **Readable fonts** - Text appropriately sized relative to figure (base_size 14+)
2. **Thoughtful colors** - Muted, colorblind-friendly palettes; avoid high contrast primaries
3. **Professional themes** - Never use `theme_gray()` (default); use cleaner alternatives
4. **Non-overlapping elements** - Use `ggrepel` or position adjustments
5. **Consistent typography** - Limit font size variation to 2-3 sizes maximum
6. **Natural language labels** - Replace `Sepal.Length` with `Sepal Length`

---

## Font Sizing

**Problem indicators:**
- Text appears tiny relative to plot area
- Axis labels illegible at publication size
- Legend text difficult to read

**Solution:**

```r
theme_minimal(base_size = 14) +
theme(
  plot.title = element_text(size = 16, face = "bold"),
  plot.subtitle = element_text(size = 12),
  axis.title = element_text(size = 13),
  axis.text = element_text(size = 11),
  legend.title = element_text(size = 12),
  legend.text = element_text(size = 10),
  strip.text = element_text(size = 11, face = "bold")
)
```

**Size hierarchy:**
- Plot title: 16-18pt
- Axis titles: 12-14pt
- Axis text/Legend: 10-12pt
- Annotations: 9-11pt

---

## Color Palettes

**Avoid:** High-contrast primary colors (pure red, green, blue), colorblind-unfriendly combinations

**Recommended palettes:**

```r
# Colorblind-friendly viridis
scale_color_viridis_d(option = "D")
scale_fill_viridis_c(option = "plasma")

# ColorBrewer palettes
scale_color_brewer(palette = "Set2")   # qualitative
scale_fill_brewer(palette = "Blues")   # sequential
scale_color_brewer(palette = "RdBu")   # diverging

# Manual muted palette (colorblind-safe)
scale_color_manual(values = c(
  "#E69F00", "#56B4E9", "#009E73", "#F0E442",
  "#0072B2", "#D55E00", "#CC79A7"
))

# Scientific journal palettes
library(ggsci)
scale_color_npg()      # Nature
scale_color_lancet()   # Lancet
scale_color_jama()     # JAMA
```

**Color rules:**
- Use `alpha` for overlapping points: `geom_point(alpha = 0.6)`
- Test with `colorBlindness` package
- For diverging data, center palette at meaningful midpoint

---

## Themes

**Never use:** `theme_gray()` (default)

**Recommended:**

```r
# Clean built-in themes
theme_minimal()
theme_bw()
theme_classic()
theme_light()

# Publication themes
library(ggthemes)
theme_few()
theme_tufte()
theme_clean()
```

**Custom publication theme:**

```r
theme_publication <- function(base_size = 14) {
  theme_minimal(base_size = base_size) %+replace%
    theme(
      panel.background = element_rect(fill = "white", color = NA),
      plot.background = element_rect(fill = "white", color = NA),
      panel.grid.major = element_line(color = "grey90", linewidth = 0.3),
      panel.grid.minor = element_blank(),
      axis.line = element_line(color = "grey30", linewidth = 0.4),
      axis.ticks = element_line(color = "grey30", linewidth = 0.3),
      plot.margin = margin(10, 10, 10, 10),
      legend.position = "top",
      legend.background = element_rect(fill = "white", color = NA),
      legend.key = element_rect(fill = "white", color = NA)
    )
}
```

---

## Handling Overlapping Elements

**Problem:** Labels overlap with points or each other

**Solution with ggrepel:**

```r
library(ggrepel)

ggplot(data, aes(x, y, label = label)) +
  geom_point(size = 3) +
  geom_text_repel(
    size = 3.5,
    max.overlaps = 20,
    segment.color = "grey50",
    segment.size = 0.3,
    segment.alpha = 0.6,
    box.padding = 0.5,
    point.padding = 0.3,
    force = 2,
    min.segment.length = 0.1
  )
```

**For grouped data:**

```r
# Dodge bars
geom_bar(position = position_dodge(width = 0.8))

# Dodge error bars
geom_errorbar(position = position_dodge(width = 0.8), width = 0.2)

# Jitter + dodge points
geom_point(position = position_jitterdodge(
  jitter.width = 0.2,
  dodge.width = 0.8
))
```

---

## Label Formatting

**Problem:** Programmatic names like `Sepal.Length`, `gene_expression`

**Solution:**

```r
# Method 1: labs() function
labs(
  title = "Iris Flower Measurements",
  x = "Sepal Length (cm)",
  y = "Petal Width (cm)",
  color = "Species"
)

# Method 2: scale labels
scale_x_discrete(labels = c(
  "Sepal.Length" = "Sepal Length",
  "Sepal.Width" = "Sepal Width"
))

# Method 3: facet labeller
facet_wrap(~variable, labeller = labeller(variable = c(
  "var1" = "Variable One",
  "var2" = "Variable Two"
)))
```

**Conventions:**
- Title case for axis labels: "Gene Expression Level"
- Units in parentheses: "Temperature (°C)"
- Remove underscores and dots from names
- Sentence case for titles and captions

---

## Point and Line Sizing

**Problem:** Points too small, lines too thin at publication resolution

**Recommended sizes:**

```r
# Points
geom_point(size = 2.5)           # Standard
geom_point(size = 3.5)           # Emphasis/sparse data
geom_point(size = 1.5, alpha = 0.6)  # Dense data

# Lines
geom_line(linewidth = 0.8)       # Standard
geom_smooth(linewidth = 1.2)     # Fitted lines
geom_segment(linewidth = 0.5)    # Connectors

# Error bars
geom_errorbar(linewidth = 0.6, width = 0.2)
```

---

## Common Plot Templates

### Scatter Plot with Labels

```r
library(ggplot2)
library(ggrepel)

ggplot(data, aes(x = x_var, y = y_var, color = group)) +
  geom_point(size = 3, alpha = 0.8) +
  geom_text_repel(
    aes(label = label),
    size = 3.5,
    max.overlaps = 15,
    segment.color = "grey60"
  ) +
  scale_color_brewer(palette = "Set2") +
  labs(
    title = "Descriptive Title",
    x = "X Variable (units)",
    y = "Y Variable (units)",
    color = "Group"
  ) +
  theme_minimal(base_size = 14) +
  theme(
    legend.position = "top",
    panel.grid.minor = element_blank()
  )
```

### Bar Chart with Error Bars

```r
ggplot(data, aes(x = category, y = value, fill = group)) +
  geom_col(position = position_dodge(width = 0.8), width = 0.7) +
  geom_errorbar(
    aes(ymin = value - se, ymax = value + se),
    position = position_dodge(width = 0.8),
    width = 0.2, linewidth = 0.5
  ) +
  scale_fill_brewer(palette = "Set2") +
  labs(title = "Comparison", x = "Category", y = "Value (units)") +
  theme_minimal(base_size = 14) +
  theme(
    legend.position = "top",
    panel.grid.major.x = element_blank()
  )
```

### Box Plot with Points

```r
ggplot(data, aes(x = group, y = value, fill = subgroup)) +
  geom_boxplot(outlier.shape = NA, alpha = 0.7) +
  geom_point(
    aes(color = subgroup),
    position = position_jitterdodge(jitter.width = 0.15, dodge.width = 0.75),
    size = 2, alpha = 0.6
  ) +
  scale_fill_brewer(palette = "Pastel1") +
  scale_color_brewer(palette = "Set1") +
  theme_minimal(base_size = 14)
```

### Heatmap

```r
ggplot(data, aes(x = x_var, y = y_var, fill = value)) +
  geom_tile(color = "white", linewidth = 0.3) +
  scale_fill_gradient2(
    low = "#2166AC", mid = "white", high = "#B2182B",
    midpoint = 0, name = "Correlation"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    panel.grid = element_blank()
  ) +
  coord_fixed()
```

---

## Figure Review Checklist

### Typography
- [ ] All text readable at print size
- [ ] Font sizes consistent (2-3 sizes max)
- [ ] Labels use natural language
- [ ] Units included where appropriate

### Colors
- [ ] Muted, not high-contrast primaries
- [ ] Colorblind-friendly palette
- [ ] Alpha used for overlapping elements

### Layout
- [ ] Labels don't overlap data or each other
- [ ] Legend appropriately positioned
- [ ] Adequate margins

### Theme
- [ ] Not using default `theme_gray()`
- [ ] Grid lines subtle or removed
- [ ] Clean white background

### Data
- [ ] Point sizes appropriate for density
- [ ] Line widths visible at publication size
- [ ] Error bars included where relevant

---

## Export Settings

**CRITICAL: Use 800 DPI minimum for publication-quality output.**

```r
# High-resolution PNG (publication quality)
ggsave(
  "figure.png",
  width = 8,
  height = 6,
  dpi = 800,
  units = "in"
)

# Vector formats (infinitely scalable)
ggsave("figure.pdf", width = 8, height = 6)
ggsave("figure.svg", width = 8, height = 6)

# TIFF for journal submission
ggsave(
  "figure.tiff",
  width = 8,
  height = 6,
  dpi = 800,
  compression = "lzw"
)
```

**Common publication sizes:**
- Single column: 3.5" wide
- 1.5 column: 5" wide
- Full page: 7" wide

**Aspect ratio control:**

```r
coord_fixed(ratio = 1)  # 1:1 aspect ratio
```

---

## Dependencies

```r
# Core
library(ggplot2)

# Label handling
library(ggrepel)

# Color palettes
library(viridis)
library(RColorBrewer)
library(ggsci)

# Themes
library(ggthemes)

# Network plots
library(ggraph)
library(tidygraph)

# Combining plots
library(patchwork)
library(cowplot)
```

---

## Summary

When creating or reviewing ggplot figures:

1. **Start with a clean theme** - `theme_minimal()` or `theme_bw()`
2. **Set appropriate base size** - 14pt for most uses
3. **Choose muted, accessible colors** - viridis, ColorBrewer, or ggsci
4. **Make labels human-readable** - Use `labs()` liberally
5. **Prevent overlaps** - Use ggrepel for text, position_dodge for groups
6. **Size elements appropriately** - Points ≥2.5, lines ≥0.8
7. **Export at high resolution** - 800 DPI minimum for print
