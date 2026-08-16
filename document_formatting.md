---
name: document-formatting-skill
description: "Instructions for stylistically formatting Markdown documents and converting them into professional journal-ready Microsoft Word (.docx) files (e.g. MDPI, Elsevier)."
license: MIT

---

# Stylistic Document Formatting Skill Guide

This skill document defines the workflow for creating, styling, and formatting scientific manuscripts using the **text-office** and **journal_formatting** tools. 
As an AI medical writer, you should prefer drafting content in Markdown and only use these tools when a `.docx` output is requested.

---

## 1. The Two-Step Formatting Workflow

When asked to produce a formatted Word document, follow this two-step pipeline:

1. **Markdown to DOCX Conversion:** Generate the content in a Markdown file (`.md`), then convert it to a standard `.docx` document using `text-office`.
2. **Journal-Specific Formatting:** Pass the standard `.docx` through `journal_formatting` to apply target journal templates (e.g., MDPI, Elsevier).

### Step 1: text-office (Markdown to DOCX)
`text-office.py` interprets Markdown syntax (headers, lists, tables, bold/italics) and outputs a clean `.docx`.

**Command syntax:**
```bash
python d:/GitHub/Mega_Medical_writer_Noora/scripts/formatting_tools/text-office/text-office.py input.md -o temp_output.docx
```
*(You can also use `-dxopt default_figure_width=3in` for figure scaling if needed).*

### Step 2: format_journal_cli (Targeted Formatting)
`format_journal_cli.py` applies specific publisher styles (MDPI or Elsevier) to an existing `.docx` file.

**Command syntax:**
```bash
python d:/GitHub/Mega_Medical_writer_Noora/scripts/formatting_tools/format_journal_cli.py --input temp_output.docx --output final_formatted.docx --format MDPI
```
*(Available formats are typically `MDPI` or `Elsevier`)*

#### Optional Flags:
* `--ris path/to/refs.ris`: Matches citations against a `.ris` file to properly format the bibliography.
* `--zotero`: Embeds Zotero-compatible field codes.
* `--crossref`: Uses the internet to lookup unmatched references.

---

## 2. Best Practices for the Agent

* **Always draft in Markdown first.** It prevents raw XML manipulation errors and is much faster.
* Use **Heading 1 (`#`)** for main sections (e.g., Introduction, Methods) and **Heading 2 (`##`)** for subsections.
* Keep tables as standard Markdown tables; `text-office` will convert them to Word tables, and `journal_formatting` will style them (e.g., three-line tables).
* For references, use simple `[1]`, `[2]` bracket notation in your Markdown. When running `format_journal_cli`, provide an exported RIS file via `--ris` to automatically build out the bibliography in the target style.
* When executing commands, use your terminal capability to string the pipeline together automatically for the user.
