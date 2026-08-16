# Skills for Medical Research Writing

A curated collection of **reusable AI-agent skills** for medical and scientific research: manuscript writing & formatting, biostatistics, data analysis, literature surfing, reference validation, and document automation. Each skill is a self-contained `SKILL.md` that any AI agent — **OpenCode, Claude Code, Cursor, Windsurf, or any other agent-skill-compatible tool** — can load on demand.

The skills are **drop-in folders**: copy them into your agent's skill directory (or keep this repo and point your agent at it), and the agent automatically discovers them and loads the right behavior when you ask for it.

---

## 📂 What's Inside

Skills live in two places:

| Location | Contents | When to use it |
|---|---|---|
| `.agents/skills/<name>/` | Modern **folder-based** skills (`SKILL.md` + scripts + references) | Recommended. Works with OpenCode, Claude Code, Cursor, and most agent frameworks out of the box. |
| `skills/` | Standalone `.md` skill guides + classic skill folders | Works well when pasted directly into a prompt or as reference docs. |

> All folder-based skills use the standard SKILL.md convention: YAML frontmatter (`name`, `description`, optional `license`) followed by Markdown instructions. Agents auto-discover them — no build step required.

---

### 🧬 Core Medical Research Writing Skills

| Skill | Location | What it does |
|---|---|---|
| **`academic-writing`** | `.agents/skills/academic-writing/` | Formats and writes academic medical manuscripts: IMRAD sections, tense architecture, MEAL paragraphs, AMA citations, ICMJE authorship/ethics statements, CONSORT/STROBE/PRISMA/CARE reporting checklists, number formatting, titles, structured abstracts, MeSH keywords, cover letters, and reviewer responses. |
| **`research-surfer`** | `.agents/skills/research-surfer/` | Searches PubMed/ScienceDirect APIs and Google Scholar (via Playwright stealth browsing), deep-combs citation networks, downloads open-access PDFs, and deduplicates hits — used for literature reviews and deep-search. |
| **`sciwrite`** | `skills/sciwrite/` | Scientific manuscript editing & review. Applies Dr. Kristin Sainani's "Writing in the Sciences" method (5 audit passes: clutter, voice, word choice, sentence structure, precision) to transform cluttered academic prose into clean, journal-ready text. |
| **`biostatistician_expert`** | `skills/biostatistician_expert/` | Biostatistical methodology guide: study-design classification (cross-sectional, case-control, cohort, RCT), statistical test selection matrix, parametric/nonparametric decision trees, assumption verification, and diagnostic/survival analysis formulas. |
| **`data_analyst`** | `skills/data_analyst/` | Senior medical statistician pipeline: clean Excel data, detect variable types, build a statistical analysis plan (SAP), run descriptive / bivariate / multivariable analysis, produce publication-quality APA figures and full APA-formatted Word reports. |
| **`doi-reference-validator`** | `skills/doi-reference-validator/` | Validates every reference against **CrossRef** and **PubMed** live APIs before it enters a document — fetches real authors, title, journal, year, DOI. Prevents fabricated or wrong citations. |
| **`file-organizer`** | `.agents/skills/file-organizer/` | Analyzes folders, finds duplicates, suggests clean structures, organizes/renames/archives files with your approval. |

### 📄 Document & Office Automation Skills

| Skill | Location | What it does |
|---|---|---|
| **`docx`** | `.agents/skills/docx/` | Create, edit, analyze, and **redline** Word documents: tracked changes, comments, formatting preservation, text extraction, OOXML-level manipulation, journal-formatted manuscripts (MDPI/Elsevier). |
| **`pdf`** | `.agents/skills/pdf/` | Extract text/tables, merge/split/rotate, create PDFs, fill and analyze forms, OCR scanned PDFs, watermark, encrypt/decrypt, extract images. |
| **`pptx`** | `.agents/skills/pptx/` | Create, edit, and analyze PowerPoint decks: html2pptx creation pipeline, theme/typography extraction, speaker notes, comments, layout & design guidance. |
| **`xlsx`** | `.agents/skills/xlsx/` | Create, edit, analyze spreadsheets: formulas, formatting, pandas analysis, preserve templates, recalculate formulas (LibreOffice), color/number standards. |

### 🇸🇦 Arabic Marketing & Content Skills

| Skill | Location | What it does |
|---|---|---|
| **`ads-copy-ar`** | `.agents/skills/ads-copy-ar/` | High-converting **Arabic** ad copy for Meta/TikTok/Google/landing pages — 5 ad versions per brief, 10 headlines, 5 CTAs, multiple angles and test variants. |
| **`content-creator-ar`** | `.agents/skills/content-creator-ar/` | Professional **Arabic** content by platform, audience & goal — tone-matched hooks, 3 angles, final + short versions, CTA, hashtags. |

### 🧾 Standalone Skill Guides (`skills/*.md`)

These are single-file references you can paste into a prompt or agent config:

| File | What it does |
|---|---|---|
| `humanizer_general.md` | Rewrites AI-sounding text into natural, human-written prose (based on Wikipedia's "Signs of AI writing" guide) — for academic/technical text. |
| `proofreading.md` | Proofreading & copy-editing skill guide for manuscripts and reports. |
| `SKILL_advanced_biostatistics.md` | MICE imputation, Propensity Score Matching (PSM), and Meta-Analysis (forest/funnel plots, SROC) in R/ggplot2. |
| `SKILL_spss_apa_reporting.md` | Read SPSS `.sav` files, run descriptive/inferential analysis, export APA 7th documents with tables and figures. |
| `SKILL_document_formatting.md` | Style Markdown → journal-ready `.docx` (MDPI, Elsevier) via `text-office` / `journal_formatting`. |
| `SKILL_endnote_cwyw.md` | EndNote Cite-While-You-Write integration in Word, converting plain-text citations back to editable fields. |
| `SKILL_excel_data_cleaning.md` | Clean/standardize raw Excel/CSV research data before statistical analysis. |
| `SKILL_pdf_processing.md` | General PDF read/extract/merge/split/OCR/forms guide (Python- and CLI-based). |
| `SKILL_ollama_vision_local.md` | Local image/figure analysis with Qwen 2.5 VL 3B via Ollama (no cloud vision needed). |
| `SKILL_data_analyst.md` | The ~1.6 MB master Data Analyst / APA-bio-statistical mega-guide. |
| `SKILL_ads_copy_ar.md` / `SKILL_content_creator_ar.md` | Classic single-file versions of the Arabic skills. |

> This repository contains **only the skills** as standalone reusable assets. These skills are also consumed by the companion **Mega Medical Writer engine** (20 specialist agents, RAG pipeline, Streamlit apps) — see that repo's own documentation for the full engine. Running the CLI examples below requires the engine companion repo cloned alongside this one.

---

## 🚀 Quick Start

### 1. Prerequisites (core)

The skills themselves are plain `SKILL.md` files and need **no installation** to be read by an agent. Only skills that *invoke tools* need dependencies — see [Per-Skill Prerequisites](#️-per-skill-prerequisites) below.

Base toolchains used across skills:

- **Python 3.8+** and **Node.js 16+**
- Common Python scientific/document stack:
  ```bash
  pip install pandas numpy scipy statsmodels scikit-learn matplotlib seaborn openpyxl python-docx python-pptx pypdf pdfplumber reportlab pillow
  ```
- Common Node stack for doc/office/browser tooling:
  ```bash
  npm install
  ```

### 2. Make the skills discoverable by your agent

All folder-based skills under `.agents/skills/*/SKILL.md` are already in the format that agents scan. Two options:

- **Option A — use them in place:** point your agent at this repo (or copy `.agents/skills/` into your project). OpenCode, Claude Code, and Cursor will discover them automatically.
- **Option B — install globally:** copy `skills/*` into `~/.agents/skills/`, `~/.claude/skills/`, or `~/.config/opencode/skills/`.

Then just ask in natural language, e.g.:

> "Please write/draft the manuscript Methods section following STROBE, citing real references — use the academic-writing and doi-reference-validator skills."

---

## 🤖 Integrating Skills with Your AI Agent

### How skill discovery works

Every modern agent reads a folder of `SKILL.md` files. Each file starts with YAML frontmatter:

```markdown
---
name: my-skill
description: One or two sentences that let the agent decide when to load this skill.
license: MIT
metadata:
  category: writing
---
```

**Name rules (important):** lowercase, alphanumeric, single hyphens only (`^[a-z0-9]+(-[a-z0-9]+)*$`), must match the folder name.

### OpenCode

OpenCode discovers skills from these locations (v6+):

```
.opencode/skills/<name>/SKILL.md      # project
~/.config/opencode/skills/<name>/SKILL.md  # global
.claude/skills/<name>/SKILL.md        # project (Claude-compatible)
.agents/skills/<name>/SKILL.md        # project (agent-compatible — used here)
```

The skills in this repo are already in `.agents/skills/`, so OpenCode picks them up automatically. Skill permission can be controlled in `opencode.json`:

```json
{
  "permission": { "skill": { "*": "allow" } }
}
```

Ask the agent to load one explicitly when you want to force it, or describe your task and let the agent self-select.

### Claude Code

Claude Code scans `.claude/skills/<name>/SKILL.md` (project) and `~/.claude/skills/<name>/SKILL.md` (global). To use these skills with Claude Code:

```bash
# from repo root
cp -r .agents/skills/* ~/.claude/skills/        # global install
# or
mkdir -p .claude/skills && cp -r .agents/skills/* .claude/skills/   # project install
```

Then in a conversation: *"Use the proof-reading / writing review skill to clean this manuscript."*

### Cursor / Windsurf / Other agent frameworks

Most tools that support agent "rules/skills" accept the same folder convention. Common locations:

- Cursor: `.cursor/rules/` (rules) or `.cursor/skills/` for skill-based setup
- Windsurf: `.windsurf/rules/`
- Aider/other: paste the whole `skills/*.md` content into your rules file, or reference the repo path.

If a tool only accepts rules text (not auto-discovered skills), simply paste the body of the relevant `SKILL.md` into your custom instructions.

### Using skills inside the Mega Medical Writer engine (CLI)

> Requires the companion **Mega Medical Writer engine** repo (this repo ships skills only). With the engine cloned, build the skill registry first so the router can map queries to skills:

```bash
python agent_core/main.py registry
python agent_core/main.py compile          # optional: lean context brain
python agent_core/main.py route "write a manuscript discussion on ..."
python agent_core/main.py execute "clean my references with doi-reference-validator"
```

---

## ⚙️ Per-Skill Prerequisites

Some skills need extra tools installed to work smoothly. Install them only if you plan to use that skill.

### 🔎 `research-surfer` — Playwright stealth browsing (NOT optional for Scholar search)

This is the most dependency-heavy skill. It needs the **Python** deps for search APIs/orchestration **plus** the **Node stealth-browser engine**:

```bash
# Python side (APIs + orchestration)
pip install requests httpx scholarly habanero arxiv rispy bibtexparser beautifulsoup4

# Node side — browser engine (PubMed + Google Scholar surfing, downloaded PDFs)
# (from the companion engine repo, or recreate this folder locally)
cd agent_core/browser_engine
npm install
npm run build            # compiles TypeScript -> dist/cli.js
npm run install-browsers # npx playwright install chromium
```

Optional `.env` tweaks used by the browser engine (in repo root or `agent_core/browser_engine`):

| Env var | Purpose |
|---|---|
| `BROWSER_HEADLESS` | Set `"false"` to run headed mode (helps with CAPTCHA/token checks) |
| `PROXY_SERVER`, `PROXY_USERNAME`, `PROXY_PASSWORD` | Route the browser through a proxy to avoid IP blocks |
| `CAPTCHASONIC_PATH` | Path to a CAPTCHA-solving browser extension |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` | Used by the optional speech-to-text reCAPTCHA solver |

Verify the engine works (requires the companion engine repo):

```bash
python -m agent_core.main refs scholar-search "CRISPR gene editing" --limit 5
python -m agent_core.main refs deep-search "SGLT2 inhibitors meta-analysis" --limit 5
```

### 🧠 ChromaDB / RAG pipeline (for the `agent_core` engine, optional)

The RAG approach (`main.py index`) uses **ChromaDB** + **sentence-transformers**:

```bash
pip install chromadb sentence-transformers
python agent_core/main.py index      # chunk & index the workspace into chroma_db/
python agent_core/main.py query "zero-hallucination policy rules"
```

> This is only needed if you use the engine's RAG mode. The folder-based skills themselves need no ChromaDB.

### 📝 `docx` skill

- **`pandoc`** — convert .docx ⇄ markdown with tracked changes (`--track-changes=all`). Install via [pandoc.org](https://pandoc.org) or `winget install pandoc` (Windows).
- **Node.js** + `docx` npm package for creating new documents (docx-js):
  ```bash
  npm install docx
  ```
- Python `python-docx` and `lxml` for the OOXML editing library:
  ```bash
  pip install python-docx lxml
  ```

### 📊 `xlsx` skill

- **pandas** + `openpyxl` for analysis:
  ```bash
  pip install pandas openpyxl
  ```
- **LibreOffice** — required to *recalculate formula values* via `scripts/recalc.py`. Install LibreOffice from [libreoffice.org](https://www.libreoffice.org); the script auto-configures on first run.

### PPTX (both `pptx` and `skills/pptx-generator`)

- **Node.js** + `pptxgenjs` for creating decks from scratch:
  ```bash
  npm install pptxgenjs
  ```
- **`markitdown`** (installed via pip) to read an existing deck's text: `python -m markitdown deck.pptx`.
- Python `python-pptx` for XML-level editing:
  ```bash
  pip install python-pptx
  ```

### 🗂️ `pdf` skill

- Python `pypdf`, `pdfplumber`, `reportlab`, `Pillow`:
  ```bash
  pip install pypdf pdfplumber reportlab Pillow
  ```
- **OCR of scanned PDFs:** install **Tesseract OCR** → [tesseract-ocr](https://github.com/tesseract-ocr/tesseract) (Windows installer: `tesseract-ocr-w64-setup-*.exe`) + `pytesseract` and optionally **Docling** (`pip install docling>=2.0.0`) for high-fidelity extraction.

### 📈 Biostatistics skills (`biostatistician_expert`, `data_analyst`, `SKILL_advanced_biostatistics.md`, `SKILL_spss_apa_reporting.md`)

- Python scientific stack:
  ```bash
  pip install pandas numpy scipy statsmodels scikit-learn pingouin lifelines seaborn matplotlib pyreadstat
  ```
- **R + packages** for the R-based workflows (MICE, PSM, meta-analysis):
  ```r
  install.packages(c("dplyr", "tidyr", "mice", "MatchIt", "meta", "metafor", "ggplot2", "survival", "survminer", "forestplot"))
  ```
  Corresponding scripts live in the companion engine repo under `scripts/` (`advanced_imputation_mice.R`, `propensity_score_matching.R`, `meta_analysis_forest.R`).

### 👁️ `SKILL_ollama_vision_local.md` (local vision)

- **Ollama** installed and running on `http://localhost:11434`
- Pull the vision model: `ollama pull qwen2.5vl:3b`
- (Optional) a `VISION_BASE_URL` / key if you prefer a cloud vision provider.

---

## 🧭 How to Ask Your Agent to Use Each Skill

| Task | Example prompt |
|---|---|
| Manuscript section | *"Write the Results section for this RCT. Use academic-writing. Numbers formatted per AMA, STROBE where applicable."* |
| Edit/review prose | *"Review my manuscript's writing quality with the sciwrite skill — full review mode."* |
| Verify references | *"Use doi-reference-validator to check every reference before writing the bibliography."* |
| Literature search | *"Use research-surfer to search PubMed for the last 5 years on [topic] and download open-access PDFs."* |
| Statistics | *"Use the data_analyst skill: clean this Excel file, build the SAP, run the analysis, and give me an APA Word report."* |
| Test selection | *"My outcome is continuous across 3 groups, non-normal. Which test? (biostatistician_expert)"* |
| Word document | *"Create a .docx manuscript from this markdown with tracked changes for review (docx skill)."* |
| Spreadsheet | *"Clean this SPSS/Excel dataset and give formulas-ready tables (xlsx skill)."* |
| Slides | *"Make a 15-slide presentation on [topic] (pptx skill)."* |
| PDF work | *"Extract the tables from this PDF (pdf skill)."* |
| Organize files | *"Organize my Downloads folder and remove duplicates (file-organizer)."* |
| Arabic ad | *"اكتب ٥ صيغ إعلان عربي لـ[المنتج] (ads-copy-ar)."* |
| Arabic content | *"اكتب منشور لينكد إن بالعربي لـ[الغرض] (content-creator-ar)."* |

---

## 🛡️ Quality Policy

Authoring skills enforce a **zero-hallucination** policy: all numbers anchor to source evidence, all references are verified against CrossRef/PubMed, and AI use is disclosed per ICMJE. Never let an agent insert a citation without running `doi-reference-validator` first.

---

## 📄 Author & License

### Author — المؤلف
**Dr. Noora Noureldin** — Medical Writer and Research Methodology Specialist
X handle: [@NooraMh_](https://x.com/NooraMh_)

### License — الترخيص
Licensed under the [MIT License](LICENSE). Copyright © 2026 Dr. Noora Noureldin. All rights reserved.