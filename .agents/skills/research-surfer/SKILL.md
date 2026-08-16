---
name: research-surfer
description: "Writes academic searches and literature reviews using a hybrid pipeline of PubMed/ScienceDirect APIs and Playwright-stealth Google Scholar browsing, with human-like delays, semantic DOM compression, and anti-bot evasion."
---

# Scientific Research Surfing & Literature Review Protocol

This skill enables the agent to search databases, download full-text papers, parse dynamic pages, and conduct deep academic literature reviews.

## Core Behavioral Guidelines

### 1. Paced Operations (Evasion & Stealth)
- **Wait Times**: Never click elements or type characters back-to-back in under 1.5 seconds.
- **Human typing delay**: Type search queries character-by-character with 50-200ms delay per key.
- **Enter over Click**: Submit search queries by pressing 'Enter' on the keyboard rather than clicking the search button directly.
- **Headful Mode**: Scholar surfing uses headful mode (`headless: false`) under the hood to bypass token checks and allow manual CAPTCHA solving if needed.

### 2. Omnichannel Strategy
- **API-First**: Always check PubMed (`search_pubmed_api`) or ScienceDirect (`search_sciencedirect_api`) first for biomedical and scientific queries, as APIs do not trigger Cloudflare or CAPTCHA limits.
- **Browser-Fallback**: Use Google Scholar Playwright surfing (`refs scholar-search` or `refs deep-search`) for broad searches, citation network tracking, or when APIs yield insufficient results.
- **Deduplication**: Automatically deduplicate retrieved papers by DOI or Jaccard title similarity (>0.85).

### 3. Mapped DOM Navigation
- When navigating web pages manually:
  1. Retrieve the compressed accessibility tree (`node cli.js navigate <url>`).
  2. Locate the target elements (inputs, links, buttons) and identify their `data-agent-id`.
  3. Issue page interactions using the mapped `data-agent-id` value (`node cli.js click <url> <id>`).
  4. Allow the page to settle for 2-3 seconds after any click.

### 4. PDF Recovery & Verification
- Check for direct PDF links (`pdfLink` or Unpaywall `pdf_url`) or PMC IDs (`PMCxxxx`).
- Download open-access papers to `outputs/downloaded_papers/` using `refs download`.
- Verify any scraped citation metadata (e.g., DOI, PMID) against CrossRef or NCBI databases.

## CLI Command Reference

- **Deep Search (Combined APIs + Browser)**:
  `python -m agent_core.main refs deep-search "your query string" --limit 5`
  
- **Scholar Direct Browser Search**:
  `python -m agent_core.main refs scholar-search "your query string" --limit 5`
  
- **Paper Deep Dive (Abstracts + OA check + PMCID)**:
  `python -m agent_core.main refs deep-dive "doi_or_pmid_or_json"`

- **Download Open-Access PDF**:
  `python -m agent_core.main refs download "{\"title\": \"Paper Title\", \"pdf_url\": \"https://example.com/paper.pdf\"}"`
