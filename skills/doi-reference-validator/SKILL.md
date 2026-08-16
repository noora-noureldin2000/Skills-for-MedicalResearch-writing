---
name: doi-validator
description: >
  Validates academic references by verifying DOIs, fetching real metadata (authors, title, journal, year) from CrossRef and PubMed APIs, and correcting any errors. Use this skill whenever the user wants to add citations or references to a document, asks to "check my references", "verify a DOI", "find a real paper on X", "validate citations", or "make sure this reference is correct". Also use when Claude is about to write a reference list and needs to confirm accuracy — especially author names, journal names, and DOIs. ALWAYS use this skill before inserting any reference into a document to avoid fabricated or incorrect citations.
---

# DOI Validator Skill

This skill prevents fabricated or inaccurate references by fetching real metadata from live APIs before any citation is written into a document.

## When to use this skill

- User asks to add references to a document
- User says "find me a real paper about X"
- User asks to verify or check existing citations
- Claude is about to write a reference list (always validate first)
- User shares a DOI and wants to confirm it's correct
- After a reference error is caught (like wrong authors)

---

## Core Workflow

### Step 1 — Resolve the DOI via CrossRef

For every reference to validate or add, call the CrossRef API:

```bash
curl -s "https://api.crossref.org/works/{DOI}" \
  -H "User-Agent: DOIValidator/1.0 (mailto:research@example.com)"
```

**Parse from the response:**
- `message.author` → array of `{family, given}` objects → format as "Family, G."
- `message.title[0]` → article title
- `message.container-title[0]` → journal name
- `message.published.date-parts[0]` → year
- `message.DOI` → confirmed DOI (use this, not the user's input)
- `message.volume`, `message.issue`, `message.page` → for full citation

If CrossRef returns 404 or no result → try PubMed (Step 2).

### Step 2 — Fallback: PubMed API

If CrossRef returns "Resource not found" or empty → use PubMed. This is common for non-English journals, government publications, and some open-access repositories (e.g. German Federal Institute journals use DOIs that aren't indexed in CrossRef).

**If you have the PMID** (from a PubMed page screenshot or search result):
```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={PMID}&retmode=json"
```
Parse `result.{PMID}.authors` → array of `{name}` strings like "Butsch C"
Parse `result.{PMID}.title`, `source`, `pubdate`, `elocationid` (contains DOI)

**If you only have the DOI or title**, search first:
```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={SEARCH_TERM}&retmode=json"
```
Then use the returned PMID to fetch the full summary record above.

### Step 3 — Format the validated reference

After fetching real metadata, format in **author-year style**:

```
LastName, F., LastName2, F. and LastName3, F. (YEAR) 'Title of article', 
Journal Name, Volume(Issue), pp. StartPage–EndPage. doi: XX.XXXXX/XXXXX
```

Rules:
- List all authors up to 6; if more than 6, list first 6 then "et al."
- Use "and" before the last author (not "&")
- Title in single quotes, journal name in italics (or plain in .docx)
- En dash (–) between page numbers, not hyphen (-)
- DOI shown as plain text prefixed with "doi:"

### Step 4 — Report back clearly

Always show the user:
1. ✅ **Confirmed:** What was validated and any corrections made
2. ⚠️ **Corrected:** List any fields that differed from what was given (e.g. wrong authors)
3. ❌ **Not found:** If the DOI is invalid or paper cannot be located

---

## Searching for papers by topic (no DOI given)

When user asks to find a real open-access paper on a topic:

1. Use `web_search` to find candidate papers on PubMed/PMC:
   ```
   site:pubmed.ncbi.nlm.nih.gov OR site:pmc.ncbi.nlm.nih.gov {TOPIC} {KEYWORDS}
   ```
2. Extract the DOI or PMID from the result
3. Validate via CrossRef or PubMed API (Steps 1–2 above)
4. Confirm open access status: look for PMC free full text, PLOS, or CC licence in the CrossRef response (`message.license`)
5. Return the validated reference only after API confirmation

**Never suggest a DOI without validating it first.**

---

## Common Pitfalls to Avoid

| Mistake | Prevention |
|---|---|
| Writing author names from memory | Always parse from `message.author` array in CrossRef |
| Assuming a DOI resolves correctly | Always call the API — a 200 response confirms it |
| Truncating long author lists incorrectly | Count authors in the array; apply 6-author rule |
| Mixing up volume/issue/pages | Parse `message.volume`, `message.issue`, `message.page` separately |
| Suggesting a paper exists without checking | Search + validate before presenting any reference |

---

## Quick Reference: API Response Fields

```json
CrossRef message object:
{
  "author": [{"family": "Smith", "given": "J"}],
  "title": ["Full article title here"],
  "container-title": ["Journal of Example Studies"],
  "published": {"date-parts": [[2023, 4, 15]]},
  "volume": "12",
  "issue": "3",
  "page": "100-115",
  "DOI": "10.1234/example.doi",
  "license": [{"URL": "http://creativecommons.org/..."}]
}
```

---

## Example: Full validation run

**User says:** "Add a reference for DOI 10.1371/journal.pgph.0004997"

```bash
curl -s "https://api.crossref.org/works/10.1371/journal.pgph.0004997"
```

Parse response → extract authors, title, journal, year, pages → format reference → present to user with ✅ Confirmed label.

If authors in document differ from API response → flag as ⚠️ Corrected and show both old and new versions.
