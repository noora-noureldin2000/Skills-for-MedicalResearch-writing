# ggplot-skills

A comprehensive guide for creating publication-quality ggplot2 visualizations in R.

## Overview

This repository contains best practices and guidelines for creating professional, publication-ready figures using ggplot2. Whether you're creating new visualizations, reviewing existing plots, or refactoring code for publication, this guide provides the principles and patterns you need.

## Contents

- **SKILL_ggplot.md** - Complete guide covering:
  - Font sizing and typography
  - Colorblind-friendly palettes
  - Professional themes
  - Handling overlapping elements
  - Label formatting
  - Export settings

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

## Usage

Use this guide when:
1. Creating new ggplot figures from scratch
2. Reviewing existing figures for publication readiness
3. Refactoring code to improve aesthetics and clarity

## Author

Wanjun Gu (wanjun.gu@ucsf.edu)

## License

MIT
