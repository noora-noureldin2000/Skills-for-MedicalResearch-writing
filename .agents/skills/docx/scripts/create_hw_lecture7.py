"""Homework - Lecture 7: Titles, Abstracts, and Keywords (Student Sheet)."""

import os
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

OUT = r"D:\Academic Writing course\Lecture 7 Supplementary\Homework - Lecture 7.docx"

PRIMARY = RGBColor(0x1F, 0x4E, 0x79)
ACCENT = RGBColor(0x2E, 0x75, 0xB6)
DARK = RGBColor(0x40, 0x40, 0x40)
MED = RGBColor(0x66, 0x66, 0x66)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_BG = "DEEAF6"
GRAY_BG = "F2F2F2"
FONT = "Arial"

doc = Document()

# ── Styles ──
style = doc.styles['Normal']
style.font.name = FONT
style.font.size = Pt(11)
style.paragraph_format.space_after = Pt(6)
style.paragraph_format.line_spacing = 1.15

for i in range(1, 4):
    hs = doc.styles[f'Heading {i}']
    hs.font.name = FONT
    hs.font.color.rgb = [PRIMARY, ACCENT, DARK][i - 1]
    hs.font.size = Pt([16, 14, 12][i - 1])
    hs.font.bold = True

def add_para(text, bold=False, italic=False, size=11, color=None, align=None, after=6):
    p = doc.add_paragraph()
    if align: p.alignment = align
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text)
    r.font.name = FONT; r.font.size = Pt(size); r.bold = bold; r.italic = italic
    if color: r.font.color.rgb = color
    return p

def add_rich(parts, after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.15
    for part in parts:
        if isinstance(part, str):
            r = p.add_run(part); r.font.name = FONT; r.font.size = Pt(11)
        else:
            text = part[0]; bold = part[1] if len(part)>1 else False
            italic = part[2] if len(part)>2 else False
            color = part[3] if len(part)>3 else None; sz = part[4] if len(part)>4 else 11
            r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(sz)
            r.bold = bold; r.italic = italic
            if color: r.font.color.rgb = color
    return p

def add_bullet(text, bold_prefix=None, after=3):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r = p.add_run(bold_prefix); r.bold = True; r.font.name = FONT; r.font.size = Pt(11)
        r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(11)
    else:
        r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(11)
    return p

def add_number(text, after=3):
    p = doc.add_paragraph(style='List Number')
    p.paragraph_format.space_after = Pt(after)
    r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(11)
    return p

def spacer(pt=12):
    add_para('', after=pt)

def sep():
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12); p.paragraph_format.space_after = Pt(12)
    r = p.add_run('\u2500' * 60); r.font.size = Pt(8); r.font.color.rgb = MED

def set_shading(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    el = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color}" w:val="clear"/>')
    tcPr.append(el)

def set_borders(cell, c="CCCCCC"):
    tcPr = cell._tc.get_or_add_tcPr()
    el = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:color="{c}"/>'
                   f'<w:bottom w:val="single" w:sz="4" w:color="{c}"/>'
                   f'<w:left w:val="single" w:sz="4" w:color="{c}"/>'
                   f'<w:right w:val="single" w:sz="4" w:color="{c}"/></w:tcBorders>')
    tcPr.append(el)

def add_tip(title, lines):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t.cell(0, 0)
    set_shading(c, LIGHT_BG); set_borders(c, "2E75B6")
    r = c.paragraphs[0].add_run(title); r.bold = True; r.font.name = FONT; r.font.size = Pt(11); r.font.color.rgb = PRIMARY
    for line in lines:
        if isinstance(line, str) and line.strip() == '': continue
        p = c.add_paragraph(); p.paragraph_format.space_after = Pt(2); p.paragraph_format.line_spacing = 1.15
        if isinstance(line, tuple):
            r = p.add_run(line[0]); r.font.name = FONT; r.font.size = Pt(line[4] if len(line)>4 else 11)
            if len(line)>1: r.bold = line[1]
            if len(line)>2: r.italic = line[2]
            if len(line)>3 and line[3]: r.font.color.rgb = line[3]
        else:
            r = p.add_run(line); r.font.name = FONT; r.font.size = Pt(11)
    spacer()

def blank_line():
    return add_para('_' * 80, after=6)

def answer_box(height_cm=2):
    for _ in range(4):
        add_para('', after=6)

# ══════════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════════
for _ in range(4):
    doc.add_paragraph()

add_para("Academic Research Writing & Manuscript Publication", bold=True, size=14, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)
add_para("for Medical Professionals", bold=True, size=12, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=20)
sep()
add_para("Lecture 7: Homework", bold=True, size=20, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
add_para("Titles, Abstracts, and Keywords", bold=True, size=16, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
add_para("Student Worksheet", size=12, color=DARK, align=WD_ALIGN_PARAGRAPH.CENTER, after=6)
sep()

add_para("Study Information", bold=True, size=12, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)
add_para("All questions in this homework refer to the same Vitamin D / prediabetes trial used in Lectures 4\u20136.", size=10, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER, after=2)
add_para("Refer to your Lecture 4+5 Protocol and Model Discussion for study details.", size=10, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER, after=2)

add_rich([
    ("Name: ", True, False, DARK),
    ("_" * 50, False, False, MED),
], after=2)
add_rich([
    ("Date: ", True, False, DARK),
    ("_" * 50, False, False, MED),
], after=2)
add_rich([
    ("Prerequisite reading: ", True, False, DARK),
    ("Gastel & Day (2022) Ch. 7, Ch. 9; L\u00f6vei (2021) Ch. 5, Ch. 8", False, False, MED),
], after=20)

doc.add_page_break()

# ══════════════════════════════════════════════════
# STUDY SUMMARY (for student reference)
# ══════════════════════════════════════════════════
doc.add_heading('Study Reference Summary', level=1)
add_para("Use the following summary of the Vitamin D trial to complete all sections of this homework. Where specific numerical results are needed, use the data provided below.")

add_tip("Vitamin D and Prediabetes: Trial Summary", [
    ("Design: ", True), ("Randomized, double-blind, placebo-controlled, parallel-group", False),
    ("",),
    ("Setting: ", True), ("Single-centre, endocrinology clinic, Saudi Arabia", False),
    ("",),
    ("Participants: ", True), ("N = 140 adults (70 per group), aged 30\u201365 years, with prediabetes (HbA1c 5.7\u20136.4%) and vitamin D deficiency (serum 25(OH)D < 50 nmol/L)", False),
    ("",),
    ("Intervention: ", True), ("Vitamin D\u2083 (cholecalciferol): loading dose 50,000 IU weekly \u00d7 8 weeks, then 2,000 IU daily \u00d7 44 weeks vs. matching placebo", False),
    ("",),
    ("Duration: ", True), ("52 weeks total follow-up", False),
    ("",),
    ("Primary outcome: ", True), ("Change in HbA1c from baseline to 52 weeks", False),
    ("",),
    ("Secondary outcomes: ", True), ("Fasting plasma glucose (FPG), HOMA-IR, 25(OH)D levels, proportion achieving HbA1c < 5.7% (normoglycaemia)", False),
    ("",),
    ("Key result (primary): ", True), ("Mean HbA1c change: vitamin D group \u22120.52% (SD 0.18) vs. placebo \u22120.07% (SD 0.21); mean difference \u22120.45% (95% CI \u22120.49 to \u22120.42); p < 0.001; Cohen's d = 0.72", False),
    ("",),
    ("Key result (secondary): ", True), ("FPG: mean difference \u22120.31 mmol/L (95% CI \u22120.38 to \u22120.24), p < 0.001. HOMA-IR: mean difference \u22120.62 (95% CI \u22120.88 to \u22120.36), p < 0.001. Normoglycaemia at 52 weeks: 31/70 (44.3%) vs. 12/70 (17.1%), p < 0.001", False),
    ("",),
    ("Adverse events: ", True), ("Mild GI upset: 8/70 (11.4%) vs. 5/70 (7.1%), p = 0.38. No serious adverse events related to study drug.", False),
])

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION A: TITLE ENGINEERING
# ══════════════════════════════════════════════════
doc.add_heading('Section A: Title Engineering', level=1)
add_para("Refer to Section 1 of the lecture notes. Remember: be specific, avoid waste words, check syntax, avoid abbreviations, keep \u2264 15\u201320 words, use declarative language, and include the study design.")

doc.add_heading('A1. Informative Title', level=2)
add_para("Write an informative title that states the main finding. It should clearly convey: population, intervention, comparator, primary outcome, study design, and direction of effect.")
add_para("Requirements: 10\u201315 words, no waste words, no abbreviations, declarative.")
spacer()
blank_line()
answer_box()

doc.add_heading('A2. Compound Title (with colon)', level=2)
add_para("Write a compound title with a colon. The left side should state a broader theme; the right side should specify the finding.")
add_para("Requirements: General concept before colon, specific finding after colon, \u2264 20 words total.")
spacer()
blank_line()
answer_box()

doc.add_heading('A3. Title Self-Evaluation', level=2)
add_para("Evaluate your informative title against the Seven Rules. Tick each rule your title satisfies:")
rules = [
    "Rule 1: Specific \u2014 population, intervention, outcome clear",
    "Rule 2: No waste words \u2014 no 'study on', 'investigation of'",
    "Rule 3: Syntax correct \u2014 read aloud, does it parse?",
    "Rule 4: No abbreviations \u2014 unless universally recognized (AIDS, DNA, MRI)",
    "Rule 5: Concise \u2014 10\u201315 words (max 20)",
    "Rule 6: Declarative \u2014 states the finding, not just the topic",
    "Rule 7: Design included \u2014 'Randomized Controlled Trial' or equivalent",
]
for r in rules:
    add_bullet(r + "  \u2610", after=4)
spacer()

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION B: STRUCTURED ABSTRACT
# ══════════════════════════════════════════════════
doc.add_heading('Section B: Structured Abstract', level=1)
add_para("Write a structured abstract (Background, Methods, Results, Conclusion) within 250\u2013350 words based on the Vitamin D trial.")

doc.add_heading('B1. Background (2\u20133 sentences; ~50\u201380 words)', level=2)
add_para("Content: Problem + gap + purpose. Use present tense for established facts; past tense for the study purpose.")
spacer()
blank_line()
answer_box()

doc.add_heading('B2. Methods (3\u20135 sentences; ~80\u2013120 words)', level=2)
add_para("Content: Design, setting, population (N), intervention, comparator, primary outcome, secondary outcomes, statistical analysis.")
add_para("Use simple past tense: 'were randomized', 'was conducted', 'was analysed'.")
spacer()
blank_line()
answer_box()

doc.add_heading('B3. Results (3\u20135 sentences; ~100\u2013150 words)', level=2)
add_para("Content: Participant flow, primary outcome with exact numbers, key secondary outcomes with exact numbers, adverse events.")
add_para("CRITICAL: Every sentence must contain a numerical result (effect size, CI, p-value). No 'significantly better' without numbers.")
spacer()
blank_line()
answer_box()

doc.add_heading('B4. Conclusion (2\u20133 sentences; ~50\u201370 words)', level=2)
add_para("Content: Main finding (restate), implication for practice, direction for future research.")
add_para("Use present tense for conclusions. Do not overclaim. Do not cite references.")
spacer()
blank_line()
answer_box()

doc.add_heading('B5. Word Count', level=2)
add_para("Count the total words of your abstract (Background + Methods + Results + Conclusion).")
add_rich([("Total word count: ", True), ("_________ words", False)], after=4)
add_para("Target: 250\u2013350 words.", after=4)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION C: KEYWORD SELECTION
# ══════════════════════════════════════════════════
doc.add_heading('Section C: Keyword Selection & MeSH Verification', level=1)
add_para("Select 8 keywords for the Vitamin D trial. For each keyword: provide the term, verify it against the MeSH database (https://www.ncbi.nlm.nih.gov/mesh/), note the official MeSH term, and explain its relevance.")

# Keywords table
t = doc.add_table(rows=9, cols=4)
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.style = 'Table Grid'

headers = ["#", "Your Keyword", "Official MeSH Term (if different)", "Relevance"]
for i, h in enumerate(headers):
    c = t.cell(0, i)
    set_shading(c, "1F4E79")
    r = c.paragraphs[0].add_run(h); r.bold = True; r.font.name = FONT; r.font.size = Pt(9); r.font.color.rgb = WHITE
    c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

for row_i in range(1, 9):
    for col_i in range(4):
        c = t.cell(row_i, col_i)
        if row_i % 2 == 0:
            set_shading(c, GRAY_BG)
        if col_i == 0:
            r = c.paragraphs[0].add_run(str(row_i)); r.font.name = FONT; r.font.size = Pt(9)
            c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

# Set column widths
for row in t.rows:
    row.cells[0].width = Cm(1.0)
    row.cells[1].width = Cm(4.5)
    row.cells[2].width = Cm(5.0)
    row.cells[3].width = Cm(6.0)

spacer(8)

doc.add_heading('C1. Keyword Ordering', level=2)
add_para("List your 8 keywords in the order they should appear (most specific / most important first):")
for i in range(1, 9):
    add_rich([(f"{i}. ", True, False, DARK), ("_" * 80, False, False, MED)], after=4)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION D: VISUAL ABSTRACT
# ══════════════════════════════════════════════════
doc.add_heading('Section D: Visual Abstract (Description)', level=1)
add_para("Describe how you would design a visual abstract for the Vitamin D trial. Specify the layout, icons, key numbers, and how each element (design label, population, intervention, main result, conclusion) would be represented.")

doc.add_heading('D1. Layout & Elements', level=2)
add_para("Describe the visual arrangement. Example: 'A horizontal 5-panel layout reading left to right: study design label, population icon, intervention icons, main result with arrow, conclusion box.'")
spacer()
blank_line()
answer_box()

doc.add_heading('D2. Icons and Visuals', level=2)
add_para("List the icons or symbols you would use for each element, and which tool you would use to create them (Canva, BioRender, PowerPoint).")
spacer()
blank_line()
answer_box()

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION E: SELF-EVALUATION CHECKLISTS
# ══════════════════════════════════════════════════
doc.add_heading('Section E: Self-Evaluation Checklists', level=1)
add_para("Complete all three checklists below by ticking each item your submitted work satisfies.")

doc.add_heading('E1. Title Checklist', level=2)
title_checks = [
    "10\u201315 words (max 20)",
    "No waste words ('Study on', 'Investigation of')",
    "Specific: population, intervention, outcome all clear",
    "Syntax correct (read it aloud \u2014 does it parse?)",
    "No abbreviations (unless universally recognized)",
    "Study design included",
    "Declarative (informative) if finding is clear",
]
for ck in title_checks:
    add_bullet(ck + "  \u2610", after=4)

doc.add_heading('E2. Abstract Checklist', level=2)
abstract_checks = [
    "Written LAST (after full paper complete)",
    "Structured format: Background, Methods, Results, Conclusion",
    "Within 250\u2013350 word limit",
    "Background: problem + gap + purpose (2\u20133 sentences)",
    "Methods: design, setting, population, intervention, outcome, analysis",
    "Results: numbers in EVERY sentence (effect size, CI, p-value)",
    "Conclusion: main finding + implication + future direction",
    "No references cited",
    "Abbreviations defined at first use",
    "Every claim matches the full text",
    "No data not in the paper",
]
for ck in abstract_checks:
    add_bullet(ck + "  \u2610", after=4)

doc.add_heading('E3. Keyword Checklist', level=2)
kw_checks = [
    "5\u201310 keywords (check journal limit)",
    "MeSH terms used (verify at nlm.nih.gov/mesh)",
    "Synonyms included for important concepts",
    "Study type included",
    "Population terms included",
    "Ordered by importance (most specific first)",
    "No non-standard abbreviations as primary keywords",
]
for ck in kw_checks:
    add_bullet(ck + "  \u2610", after=4)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION F: PUBMED TEST
# ══════════════════════════════════════════════════
doc.add_heading('Section F: The PubMed Test', level=1)
add_para("Before finalising your title, run the PubMed test described in Section 8 of the lecture notes.")

add_rich([("Step 1: ", True), ("Go to PubMed (https://pubmed.ncbi.nlm.nih.gov)", False)], after=4)
add_rich([("Step 2: ", True), ("Search using the key terms from your title", False)], after=4)
add_rich([("Step 3: ", True), ("Do similar papers appear?", False)], after=4)

add_para("", after=4)
add_rich([("Search terms used: ", True), ("_" * 70, False, False, MED)], after=4)
add_rich([("Number of results returned: ", True), ("_________", False, False, MED)], after=4)
add_rich([("Are similar papers on this topic found? ", True), ("YES \u2610  NO \u2610", False, False, MED)], after=4)
add_rich([("If NO, what terms would you adjust? ", True), ("_" * 60, False, False, MED)], after=4)

spacer(20)
sep()
add_para("End of Homework. Submit all sections.", italic=True, size=11, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER)

# ── Save ──
os.makedirs(os.path.dirname(OUT), exist_ok=True)
doc.save(OUT)
print(f"Created: {OUT} ({os.path.getsize(OUT)} bytes)")
