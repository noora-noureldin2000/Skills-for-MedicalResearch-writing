---
name: endnote-cwyw-integration
description: "Expert guide on handling Endnote Cite While You Write (CWYW) in Microsoft Word, converting plain-text citations back to editable ones, and automating publication fetching."
license: MIT

---

# Endnote Cite While You Write (CWYW) Skill Guide

This skill document defines the theoretical concepts and workflows for integrating citations within Microsoft Word using the **Endnote Cite While You Write (CWYW)** feature. It additionally covers handling unformatted references, reverse-engineering plain-text citations back to Endnote fields, and fetching metadata programmatically.

---

## 1. Endnote CWYW Fundamentals

Endnote CWYW links references from an Endnote library directly into Microsoft Word fields. To process citations efficiently without performance drops, and to troubleshoot corrupted fields, it's often necessary to turn off automatic formatting and use **Unformatted Citations**.

### Unformatted Citations
Unformatted citations act as placeholders before Endnote renders them in the chosen style (e.g., APA, Vancouver). The default temporary citation delimiters are curly braces `{}`.

*   **Standard Unformatted Format:** `{Author, Year #RecordNumber}`
    *   Example: `{Smith, 2020 #42}`
*   **Sequential Numbering:** If a new library is built explicitly for a document where references appear sequentially as superscript numbers (e.g., 1, 2, 3), the unformatted citations can just reference the Endnote record ID:
    *   Example: `{#1}`, `{#2}`, `{#3}`

---

## 2. Converting Plain-Text References back to CWYW

A common issue in medical writing is receiving an old manuscript where Endnote fields have been stripped (converted to plain text), leaving superscript numbers like <sup>1, 2, 3</sup> that can no longer be updated automatically.

### The Conversion Workflow

You can reverse-engineer this to restore Endnote linkage:

1.  **Extract the Bibliography:** Copy the plain-text bibliography from the end of the document into a clean text file (`refs.txt`), ensuring one reference per line.
2.  **Fetch Reference Metadata:** Scrape PubMed or Crossref for these references to generate an NLM, XML, or RIS file. *(See Section 3 for fetching logic).*
3.  **Build a Sequential Endnote Library:** Import the fetched references into a **brand new, empty Endnote library**. Endnote will assign record numbers sequentially (1, 2, 3...) matching the order in the document.
4.  **Replace Citations in Word:**
    *   Convert all occurrences of `1, 2, 3` into `{#1}{#2}{#3}`.
    *   *Technical Tip:* Using a Python script to manipulate the `.docx` XML or saving the document as an HTML file, executing a Regex replace, and opening it back in Word is highly effective.
        *   Regex Example: `re.sub(r'<sup>([\d,\s-]+)</sup>', replacement_function, html_content)`
5.  **Format Citations:** Open the document in Word, ensure "Temporary citation delimiters" in Endnote settings are `{` and `}`, and click **Update Citations and Bibliography**.

---

## 3. Automated Publication Fetching

To support the workflow above, or simply build reference libraries efficiently, references must be fetched programmatically from identifiers (PubMed IDs, DOIs) or raw text.

### Fetching Strategies
When acting as an automated assistant, you can utilize APIs to pull reference metadata:

*   **PubMed (NCBI E-utilities API):**
    *   Use the `esearch` endpoint to search by citation string.
    *   Use the `efetch` endpoint to retrieve metadata in NLM or XML formats compatible with Endnote.
*   **Crossref API (for DOIs):**
    *   Endpoint: `https://api.crossref.org/works/{DOI}`
    *   Returns JSON metadata that can be parsed into standard citation formats (BibTeX, RIS).

*Example Python snippet for PubMed Fetching:*
```python
import requests

def fetch_pubmed_nlm(pmid):
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pmid}&rettype=medline&retmode=text"
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    return None
```

---

## 4. Web-Based Rendering (HTML/JS)

If you are rendering manuscript drafts dynamically in a web view prior to Word export, citations can be managed using inline metadata spans and JavaScript to assemble the bibliography dynamically.

*   **Inline Citation Markup:** `<span class="endnote">Author, Title, Journal, Year</span>`
*   **JS Rendering:** Scripts collect all `.endnote` nodes, replace them with sequential `[1], [2]` links, and append the compiled list to a `<ol id="endnote-reference-list">` at the end of the document.

---

## 5. Summary & Best Practices for the Agent
*   Always ask users if they want their Endnote library formatted dynamically or converted to unformatted citations for safe editing.
*   When rebuilding lost CWYW links, ensure the generated Endnote library exactly matches the numerical order of the text citations.
*   Advise users against manually typing inside Endnote `{}` delimiters to prevent field corruption.
