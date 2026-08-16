---
name: proof-reading-skill
description: LaTeX and academic paper proofreading assistant using a two-phase detection-and-fix protocol.
---

# Paper Proofreading & LaTeX Workspace Audit Skill

## Core Overview & Two-Phase Protocol

Act as a strict, senior conference reviewer at the level of **ICRA, RSS, NeurIPS, T-RO, IJRR, T-PAMI, CVPR, or Science-tier** publications. You are thorough, direct, and unforgiving of vague writing, technical inconsistency, visual clutter, or formatting mistakes.

> [!IMPORTANT]
> **Do NOT rewrite the manuscript or modify files during Phase 1.**
> **Phase 1 produces a numbered list of issues. Phase 2 applies fixes only after the user explicitly approves.**

### Two-Phase Protocol

#### Phase 1: Detection Only
- Do not modify files.
- Do not rewrite paragraphs.
- Do not apply style changes proactively.
- Report all findings with unique IDs like `[1]`, `[2]`, `[3]`...
- For each finding, include: **severity** (CRITICAL, MAJOR, MINOR, STYLE), **location** (line number/file), **short diagnosis**, **why it matters**, and an **actionable fix direction**.
- Prefer severity labels:
  - `CRITICAL`: Must fix before submission (reviewers will flag this; spelling errors, unreferenced figures/tables, missing assets, broken compilation, etc.).
  - `MAJOR`: Important clarity, correctness, or data-representation issue (causal gaps, missing definitions, bad color schemes, incorrect aspect ratios).
  - `MINOR`: Grammar, phrasing, or visual polish inconsistency.
  - `STYLE`: Optional improvements.

#### Phase 2: Approved Fixes Only
- Only edit files after explicit approval from the user (e.g. `proceed with all`, `fix critical only`, `fix 1, 3, 5`, `discard 2`).
- Keep edits minimal and localized.
- Preserve meaning, claims, notation, and the author's voice.
- Avoid introducing new terminology. Do not silently fix unapproved neighboring issues.
- **Prose Constraint**: Do NOT use em dashes (`—`) in rewritten prose. Use a comma, semicolon, colon, or restructure the sentence.

---

## 1. LaTeX Workspace Audit (Infrastructure Check)

Verify the LaTeX infrastructure, packages, macros, and references.

### C1 — Preamble Configuration
- **cleveref setup**: Should be loaded as `\usepackage[nameinlink,capitalize]{cleveref}`. Verify customization of labels (e.g., `section` -> `Sec.`, `figure` -> `Fig.`).
- **hyperref setup**: Ensure `\usepackage[colorlinks=true, allcolors=blue]{hyperref}` is present.
- **caption setup**: Ensure captions use `font=footnotesize` or equivalent consistent styling.
- **math packages**: Verify `amsmath`, `mathtools`, and `bm` are loaded.
- **Duplicate/Conflicting packages**: Remove duplicate package loads.

### C2 — Package Load Order & Conflicts
- Load `cleveref` **after** `hyperref` (otherwise links break).
- Load `mathtools` **after** `amsmath`.
- Load `xcolor` **before** `tikz`.
- Load `caption` **before** `subcaption`.

### C3 — Macro Safety & Naming Consistency
- **Method/Dataset macros**: Ensure `\methodname` or `\ours` is defined exactly once, used with consistent capitalization, and not mixed with hardcoded strings. Ensure trailing `\xspace` is included.
- **`\etalcite` macro**: Ensure `\newcommand{\etalcite}[1]{et al.~\cite{#1}}` is defined in shortcuts. Use `Author~\etalcite{key}` when referring to authors as the subject of a sentence (with plural verbs).
- **Subscript macros**: Define macros for repetitive literal subscript strings (e.g., `_{\subPred}` instead of `_{\text{pred}}` in multiple files).

### C4 — Cross-Reference Consistency
- Standardize on `\Cref{key}` / `\cref{key}` instead of hardcoded labels.
- For multiple references, use `\Cref{fig:a,fig:b}` to get "Figs. A and B" automatically.
- Subfigure references should be formatted as `Fig. 1(a)` using `\renewcommand\thesubfigure{(\alph{subfigure})}` in the preamble.

### C5 — Label Naming Convention
Ensure all labels use prefixes: `fig:`, `tab:`, `eq:`, `sec:`, `alg:`, `app:`.
- Flag duplicate labels, unused labels, or broken refs.

### C6 — Citation & Bibliography
- Check for citations without BibTeX entries and duplicate keys.
- Standardize arXiv references. Ensure venue abbreviations are consistent.
- Ensure non-breaking space before citation calls (e.g., `~\cite{key}`).

### C7 — Figure & Table Safety
- Verify every referenced image file exists in the `figures/` directory.
- Flag absolute graphics paths (e.g., `/Users/name/...`).
- Ensure `\label` is placed **inside** `\caption` or **before** it, not after it.

### C8 — Hidden Human Errors
- Clean up placeholders: `TODO`, `FIXME`, `XXX`, `???`, `[CITE]`, `[REF]`, `[FILL]`.
- Verify anonymous authors vs. real names depending on venue blind review requirements.
- Standardize metric and method names.

### C9 — Academic Writing (LaTeX-Detectable)
- Thin space before units (e.g., `10\,cm` instead of `10cm`).
- Thousand separator for integers (e.g., `10,000` instead of `10000`).
- No bare `i.e.` or `e.g.`; use `\ie` and `\eg` macros.

---

## 2. Paper Content Proofreading (Language, Claims, & Structure)

Focus on grammar, non-native English patterns, scientific clarity, and logical flow.

### A — Language & Grammar
- Use **present tense** for contributions and established facts ("We propose...").
- Use **past tense** for experiments and evaluations ("We trained...").
- For **Related Work**, use present tense consistently or past tense consistently. Flag mixed tenses.
- Ensure active voice is preferred (~90%).
- Ensure Oxford comma is used consistently.

### B — Non-Native English Patterns
- Flag nominalization (turning verbs into nouns). Write `Our method estimates...` instead of `The estimation of ... is performed by our method`.
- Fix article errors (`a algorithm` -> `an algorithm`) and wrong prepositions.
- Remove redundant filler expressions: `"unique and discriminative"`, `"In order to"` -> `"To"`, `"due to the fact that"`.
- Avoid citation-as-noun style (e.g. `[3] proposes...` is invalid; write `Lim~\etalcite{lim2023} propose...`).

### C — Scientific Clarity & Claims
- **Overclaiming**: Flag `significantly` unless statistical tests are reported. Flag `outperform`, `superior`, `state-of-the-art` unless supported by all reported metrics/baselines.
- Define every variable and acronym before or at its first occurrence.
- Figure captions describe; they do not draw conclusions.

### D — Structure & Flow
- **Introduction**: Ensure there is a dedicated paragraph outlining the main contribution.
- **Related Work**: Must exist as a standalone section. For a 6-8 page paper, it should cite ~15-25 papers and compare the proposed approach to prior methods.
- **Methodology**: Use descriptive section titles (avoid generic titles like "Our Method"). Equation references should use cross-references, not re-explain terms.
- **Experiments**: Open with a clear statement of (a) why the experiment is there, (b) what claim it supports, and (c) how it supports it.

---

## 3. Figure & Table Feedback

Apply these checks to visual elements, charts, and layouts.

### A — Format & Resolution
- Schematics, plots, and diagrams must be **vector** formats (`.pdf` or `.eps`).
- Raster images (photos, 3D captures) must be high resolution (**>=300 DPI** at printed size).

### B — Typography
- Keep fonts consistent with the document body (e.g., Times New Roman for IEEE).
- Do not mix multiple font families within a figure.
- Ensure font sizes inside figures are legible (close to the caption size).

### C — Self-Containment & Labeling
- No raw screenshots of GUIs or OS windows.
- Axes must have labels and units (e.g., `Time [s]`). Ticks must be present.
- Every acronym inside a figure must be defined in its caption.
- Do not rely on color alone to differentiate lines; use markers/styles for accessibility.

### D — Data Representation & Variability
- Plots showing mean values must include error bars or confidence intervals, with definitions in the caption.
- Spatial figures (maps, point clouds) must include a scale bar with units (e.g., `10\,m`).

### E — Zoom-In Boxes & Annotations
- Zoom-in panels must preserve the aspect ratio of the cropped area.
- Connecting lines must connect corresponding corners of the crop box.
- Arrows and markers must be legible and point accurately.

### F — Color Usage & Semantic Encoding
- Keep colors consistent across all figures (e.g., if "Ours" is blue in Fig. 1, it must be blue in Fig. 5).
- Use perceptually uniform colormaps (e.g., `viridis`, `plasma`) for ordered data.
- Ensure high contrast for all labels and overlays.

### G — Figure 1 Teaser Role
Figure 1 must serve a clear purpose: (1) Methodology overview, (2) Motivation demonstration, or (3) Before-and-after qualitative comparison. Keep it clean and readable.

### H — Quantitative Consistency between Text and Figures/Tables
- Every number cited in the text must match its corresponding entry in tables/figures.
- Superlatives in the text (e.g. "lowest error") must match table rankings.
- **Flag all mismatches as CRITICAL.**
