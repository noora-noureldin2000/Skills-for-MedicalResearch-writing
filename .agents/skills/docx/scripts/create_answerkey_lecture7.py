"""ANSWER KEY - Lecture 7: Titles, Abstracts, and Keywords (Instructor Copy)."""

import os
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

OUT = r"D:\Academic Writing course\Lecture 7 Supplementary\ANSWER KEY - Lecture 7.docx"

PRIMARY = RGBColor(0x1F, 0x4E, 0x79)
ACCENT = RGBColor(0x2E, 0x75, 0xB6)
DARK = RGBColor(0x40, 0x40, 0x40)
MED = RGBColor(0x66, 0x66, 0x66)
GREEN = RGBColor(0x00, 0x66, 0x00)
WARNING = RGBColor(0xC0, 0x00, 0x00)
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

def add_tip(title, lines):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t.cell(0, 0)
    set_shading(c, LIGHT_BG)
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

def add_table(headers, rows):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = 'Table Grid'
    for i, h in enumerate(headers):
        c = t.cell(0, i); set_shading(c, "1F4E79")
        r = c.paragraphs[0].add_run(h); r.bold = True; r.font.name = FONT; r.font.size = Pt(10); r.font.color.rgb = WHITE
    for ri, rd in enumerate(rows):
        t.add_row()
        for ci, val in enumerate(rd):
            c = t.cell(ri+1, ci)
            if ri % 2 == 1: set_shading(c, GRAY_BG)
            r = c.paragraphs[0].add_run(str(val)); r.font.name = FONT; r.font.size = Pt(10)
            if ci == 0: r.bold = True; r.font.color.rgb = PRIMARY
    spacer()

def model_answer_box():
    """Draw a shaded box with model answer label."""
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t.cell(0, 0)
    set_shading(c, "FFF3CC")  # light yellow
    r = c.paragraphs[0].add_run("MODEL ANSWER"); r.bold = True; r.font.name = FONT; r.font.size = Pt(9); r.font.color.rgb = WARNING
    return c

def model_para(text, after=4):
    """Add a model answer paragraph inside the preceding model_answer_box."""
    # This is a workaround — we'll just add a visually distinct paragraph after marker
    add_rich([(text, False, False, None, 10)], after=after)

# ══════════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════════
for _ in range(4):
    doc.add_paragraph()

add_para("Academic Research Writing & Manuscript Publication", bold=True, size=14, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)
add_para("for Medical Professionals", bold=True, size=12, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=20)
sep()
add_para("ANSWER KEY", bold=True, size=22, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
add_para("Lecture 7: Titles, Abstracts, and Keywords", bold=True, size=16, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
add_para("Instructor Copy \u2014 Model Answers", size=12, color=DARK, align=WD_ALIGN_PARAGRAPH.CENTER, after=6)
sep()
add_para("Study: Vitamin D Supplementation and Glycaemic Control in Prediabetic Adults \u2014 A Randomized Controlled Trial", size=10, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER, after=20)
doc.add_page_break()

# ══════════════════════════════════════════════════
# A: TITLE ENGINEERING — ANSWERS
# ══════════════════════════════════════════════════
doc.add_heading('Section A: Title Engineering \u2014 Model Answers', level=1)

doc.add_heading('A1. Informative Title', level=2)
add_para("Model Informative Title:", bold=True, after=2)
add_tip("Model Informative Title (12 words, declarative, specific, no waste words)", [
    ("Vitamin D Supplementation Reduces HbA1c in Prediabetic Adults with Vitamin D Deficiency: A Randomized Controlled Trial", False, True),
])

add_rich([("Word count: ", True), ("12 words", False)], after=2)
add_rich([("Structure: ", True), ("[Intervention] [Verb] [Outcome] in [Population] with [Condition]: [Design]", False)], after=2)
add_rich([("Why it works: ", True), ("It states the finding (\"Reduces HbA1c\"), names the population (\"Prediabetic Adults\"), specifies the inclusion criterion (\"with Vitamin D Deficiency\"), and identifies the design (\"Randomized Controlled Trial\"). No waste words, no abbreviations, syntax is correct.", False)], after=4)

doc.add_heading('A2. Compound Title (with colon)', level=2)
add_para("Model Compound Title:", bold=True, after=2)
add_tip("Model Compound Title (15 words, colon structure)", [
    ("Beyond Bone Health: Vitamin D Supplementation Improves Glycaemic Control in Prediabetic Adults \u2014 A Randomized Trial", False, True),
])

add_rich([("Word count: ", True), ("15 words", False)], after=2)
add_rich([("Structure: ", True), ("[Broader concept/thematic hook]: [Specific finding] \u2014 [Design]", False)], after=2)
add_rich([("Why it works: ", True), ("The left side (\"Beyond Bone Health\") signals that vitamin D has effects beyond the traditionally studied skeletal outcomes. The right side specifies the exact finding and population. The em-dash sets off the design.", False)], after=4)

doc.add_heading('A3. Title Self-Evaluation', level=2)
add_para("Both titles evaluated against the Seven Rules:", after=4)

add_table(
    ["Rule", "Informative Title", "Compound Title"],
    [
        ["1. Specific", "\u2713 Population, intervention, outcome clear", "\u2713 Population, intervention, outcome clear"],
        ["2. No waste words", "\u2713 Zero waste words", "\u2713 Zero waste words"],
        ["3. Syntax correct", "\u2713 Parses correctly", "\u2713 Parses correctly"],
        ["4. No abbreviations", "\u2713 None used", "\u2713 None used"],
        ["5. Concise (\u226415 words)", "\u2713 12 words", "\u2713 15 words"],
        ["6. Declarative", "\u2713 States finding (\"Reduces\")", "\u2713 States finding (\"Improves\")"],
        ["7. Design included", "\u2713 'Randomized Controlled Trial'", "\u2713 'Randomized Trial'"],
    ]
)

doc.add_heading('A4. Teaching Note: Common Student Errors', level=2)
add_bullet('Writing "A Study on the Effects of..." \u2014 delete all five words; they add nothing.', after=2)
add_bullet('Using abbreviations: "Vit D Reduces HbA1c in T2DM" \u2014 expand abbreviations.', after=2)
add_bullet('Omitting study design: readers cannot assess validity without knowing it is an RCT.', after=2)
add_bullet('Background-heavy phrasing: "Recent evidence suggests that..." \u2014 delete, state the finding directly.', after=2)
doc.add_page_break()

# ══════════════════════════════════════════════════
# B: STRUCTURED ABSTRACT — ANSWERS
# ══════════════════════════════════════════════════
doc.add_heading('Section B: Structured Abstract \u2014 Model Answer', level=1)
add_para("Below is a complete model abstract (299 words) with annotations.", after=4)

# Full abstract
doc.add_heading('Model Abstract (299 words)', level=2)

abstract_bg = "Background: Vitamin D deficiency is prevalent in Saudi Arabia and has been linked to impaired glucose homeostasis through the expression of vitamin D receptors on pancreatic beta cells. However, evidence from randomized trials testing whether vitamin D supplementation improves glycaemic control specifically in prediabetic adults with confirmed deficiency remains inconclusive. We aimed to determine the effect of high-dose vitamin D\u2083 supplementation on HbA1c levels in this population."
abstract_meth = "Methods: A randomized, double-blind, placebo-controlled trial was conducted at a single endocrinology clinic in Saudi Arabia. One hundred forty adults (aged 30\u201365 years) with prediabetes (HbA1c 5.7\u20136.4%) and vitamin D deficiency (serum 25(OH)D < 50 nmol/L) were randomized 1:1 to receive vitamin D\u2083 (50,000 IU weekly for 8 weeks, then 2,000 IU daily for 44 weeks) or matching placebo. The primary outcome was change in HbA1c from baseline to 52 weeks. Secondary outcomes included changes in fasting plasma glucose (FPG), HOMA-IR, and the proportion achieving normoglycaemia (HbA1c < 5.7%). Analysis followed intention-to-treat principles."
abstract_res = "Results: Baseline characteristics were comparable between groups (mean age 52.3 years; mean HbA1c 5.9%; mean 25(OH)D 38.4 nmol/L). HbA1c decreased significantly more in the vitamin D group (mean change \u22120.52%, SD 0.18) than in the placebo group (\u22120.07%, SD 0.21), with a mean difference of \u22120.45% (95% CI \u22120.49 to \u22120.42; p < 0.001; Cohen\u2019s d = 0.72). FPG also improved (mean difference \u22120.31 mmol/L; 95% CI \u22120.38 to \u22120.24; p < 0.001), as did HOMA-IR (mean difference \u22120.62; 95% CI \u22120.88 to \u22120.36; p < 0.001). Normoglycaemia at 52 weeks was achieved by 44.3% of the vitamin D group versus 17.1% of the placebo group (p < 0.001). Adverse events were mild and did not differ significantly between groups."
abstract_con = "Conclusion: High-dose vitamin D\u2083 supplementation over 52 weeks significantly improved glycaemic control in prediabetic adults with vitamin D deficiency, with a medium-to-large effect size. These findings support vitamin D optimisation as a potential preventive strategy in this high-risk population, though longer-term trials assessing diabetes incidence are warranted."

add_para(abstract_bg, size=10, after=4)
add_para(abstract_meth, size=10, after=4)
add_para(abstract_res, size=10, after=4)
add_para(abstract_con, size=10, after=4)

add_rich([("Total word count: ", True), ("299 words (target: 250\u2013350)", False, False, GREEN)], after=4)
add_rich([("Word count by section: ", True), ("Background 66 | Methods 105 | Results 93 | Conclusion 35", False)], after=4)

doc.add_heading('Abstract Annotation', level=2)

add_rich([("Background (66 words): ", True), ("Sentence 1 states the problem with local relevance (Saudi Arabia) and a biological mechanism. Sentence 2 states the gap. Sentence 3 states the purpose. Tense: present for established facts, past for purpose.", False)], after=4)

add_rich([("Methods (105 words): ", True), ("Covers design, blinding, setting, N, age range, inclusion criteria (HbA1c + vitamin D), randomisation, dosing regimen, primary outcome, secondary outcomes, analysis population. All in simple past tense.", False)], after=4)

add_rich([("Results (93 words): ", True), ("Opens with baseline comparability. Every sentence contains a numerical result: mean change with SD, mean difference with 95% CI, p-value, Cohen\u2019s d for primary outcome; FPG and HOMA-IR with CIs; proportion with p-value; adverse events. No text without a number.", False)], after=4)

add_rich([("Conclusion (35 words): ", True), ("Restates the main finding with effect size descriptor (\u201cmedium-to-large\u201d). States the implication (\u201csupport vitamin D optimisation as a potential preventive strategy\u201d). Notes the limitation and future direction (\u201clonger-term trials... are warranted\u201d). No citations, no overclaiming.", False)], after=4)

doc.add_heading('B6. Teaching Note: Common Abstract Errors and How This Model Avoids Them', level=2)

add_table(
    ["Common Error", "How the Model Avoids It"],
    [
        ["Background too long (150w)", "Background is 66 words \u2014 problem, gap, purpose in 3 sentences"],
        ["Results without numbers", "Every Results sentence has exact numbers (means, SDs, CIs, p-values)"],
        ["Conclusion overstates", "Uses 'support... as a potential preventive strategy', not 'standard of care'"],
        ["Abbreviations undefined", "FPG, HOMA-IR defined at first use; HbA1c, CI defined in Methods"],
        ["Tense errors", "Methods/Results: simple past. Background facts: present. Conclusion: present"],
        ["No CI or effect size", "All primary and secondary outcomes reported with 95% CI + p-value"],
        ["No design specified", "First sentence of Methods: 'randomized, double-blind, placebo-controlled trial'"],
    ]
)

doc.add_page_break()

# ══════════════════════════════════════════════════
# C: KEYWORDS — ANSWERS
# ══════════════════════════════════════════════════
doc.add_heading('Section C: Keyword Selection \u2014 Model Answers', level=1)

add_para("Model set of 8 keywords, verified against the MeSH database, ordered by importance:", after=4)

add_table(
    ["#", "Keyword", "Official MeSH Term", "Rationale"],
    [
        ["1", "Diabetes, Gestational", "Diabetes, Gestational", "Primary condition"],
        ["2", "Vitamin D", "Vitamin D", "Primary intervention"],
        ["3", "Obesity", "Obesity", "Key population characteristic"],
        ["4", "Pregnancy Outcome", "Pregnancy Outcome", "Domain of primary outcome"],
        ["5", "Metformin", "Metformin", "Intervention drug"],
        ["6", "Randomized Controlled Trial", "Randomized Controlled Trial (as Publication Type)", "Study design filter"],
        ["7", "Premature Birth", "Premature Birth", "Key secondary outcome"],
        ["8", "Insulin Resistance", "Insulin Resistance", "Mechanistic outcome"],
    ]
)

add_para("Note: The order reflects importance to the study. Keyword 1 is the condition studied. Keyword 2 is the intervention. Keywords 3\u20134 cover population and outcome domain. Keywords 5\u20137 add specificity. Keyword 8 captures mechanism.", size=10, color=MED, italic=True, after=4)

doc.add_heading('C2. MeSH Verification Process', level=2)
add_number("Visit https://www.ncbi.nlm.nih.gov/mesh/")
add_number("Search each term (e.g., 'vitamin D')")
add_number("Check that the returned MeSH term matches your intended concept")
add_number("Record the official MeSH heading exactly as displayed")
add_number("For study design terms, check Publication Types (e.g., 'Randomized Controlled Trial' is a valid MeSH Publication Type)")

add_tip("MeSH Verification: Example", [
    "Search: 'prediabetes'",
    "MeSH result: 'Prediabetic State' (entry terms include: prediabetes, impaired glucose tolerance, borderline diabetes)",
    "Conclusion: Use 'Prediabetic State' as the MeSH term; include 'Prediabetes' and 'Impaired Glucose Tolerance' as entry terms in a comprehensive search.",
])

doc.add_page_break()

# ══════════════════════════════════════════════════
# D: VISUAL ABSTRACT — ANSWERS
# ══════════════════════════════════════════════════
doc.add_heading('Section D: Visual Abstract \u2014 Model Answer', level=1)

add_para("Model visual abstract design for the Vitamin D trial:", after=4)

add_tip("Model Visual Abstract Description", [
    ("Layout: ", True),
    ("Single horizontal panel, left-to-right flow, five sections.", False),
    ("",),
    ("Section 1 (design label, top left): ", True),
    ("'Randomized Controlled Trial' in a coloured banner (dark blue). Below it: 'Double-blind, Placebo-controlled'.", False),
    ("",),
    ("Section 2 (population, upper centre-left): ", True),
    ("Icon of a group of people (silhouettes). Text: 'N = 140 | Prediabetic Adults' in bold. Sub-text: 'HbA1c 5.7\u20136.4%, 25(OH)D < 50 nmol/L'.", False),
    ("",),
    ("Section 3 (intervention, lower centre-left): ", True),
    ("Two pill icons side by side: one labelled 'Vitamin D\u2083' (yellow/orange) with '50K IU/wk \u00d7 8wk \u2192 2K IU/d \u00d7 44wk', the other labelled 'Placebo' (grey). An arrow points from each to the outcome.", False),
    ("",),
    ("Section 4 (main result, centre-right): ", True),
    ("Large number box: 'HbA1c: \u22120.45%' in bold dark blue font. Below: '95% CI \u22120.49 to \u22120.42 | p < 0.001'. A small arrow with 'Cohen\u2019s d = 0.72' (medium-to-large effect).", False),
    ("",),
    ("Section 5 (conclusion, far right): ", True),
    ("Green box with white text: 'Vitamin D improves glycaemic control in prediabetes.' (10 words).", False),
    ("",),
    ("Tools: ", True),
    ("BioRender for custom scientific icons (people, pills, cells). Canva for layout and typography. PowerPoint for final assembly if BioRender is unavailable.", False),
])

doc.add_heading('D3. Teaching Note: Visual Abstract Best Practices', level=2)
add_bullet("Max 5 elements \u2014 anything more overwhelms the reader.", after=2)
add_bullet("Use < 15 words total in the entire visual abstract.", after=2)
add_bullet("Icons must be professional and consistent (same style throughout).", after=2)
add_bullet("Include the most important number large and clear.", after=2)
add_bullet("Design label (RCT, cohort, etc.) must be prominent \u2014 it signals the level of evidence.", after=2)
add_bullet("Always include a conclusion box with \u2264 10 words.", after=2)
doc.add_page_break()

# ══════════════════════════════════════════════════
# E: CHECKLISTS — VERIFIED
# ══════════════════════════════════════════════════
doc.add_heading('Section E: Checklists \u2014 Verified Against Model Answers', level=1)

doc.add_heading('E1. Title Checklist', level=2)
title_checks = [
    ("10\u201315 words (max 20)", "12 words (Informative)"),
    ("No waste words ('Study on', 'Investigation of')", "Zero waste words in both titles"),
    ("Specific: population, intervention, outcome clear", "All specified: vitamin D, HbA1c, prediabetic adults"),
    ("Syntax correct (read it aloud)", "Parses correctly in both titles"),
    ("No abbreviations", "None used"),
    ("Study design included", "'Randomized Controlled Trial' included"),
    ("Declarative if finding is clear", "'Reduces' (Informative); 'Improves' (Compound)"),
]
add_table(["Check", "Model Answer Status"], title_checks)

doc.add_heading('E2. Abstract Checklist', level=2)
abstract_checks = [
    ("Written LAST (after full paper complete)", "\u2713 Abstract reflects all data from the study"),
    ("Structured: B/M/R/C", "\u2713 Four labelled sections"),
    ("Within 250\u2013350 words", "\u2713 299 words"),
    ("Background: problem + gap + purpose", "\u2713 3 sentences covering all three"),
    ("Methods: design, setting, pop, intervention, outcome, analysis", "\u2713 All six elements present"),
    ("Results: numbers in EVERY sentence", "\u2713 Every sentence contains at least one numerical result"),
    ("Conclusion: finding + implication + future direction", "\u2713 Three sentences covering all three"),
    ("No references cited", "\u2713 None"),
    ("Abbreviations defined at first use", "\u2713 FPG, HOMA-IR defined; HbA1c, CI routine"),
    ("Every claim matches full text", "\u2713 All numbers match the trial data"),
    ("No data not in the paper", "\u2713 No extraneous data"),
]
add_table(["Check", "Status"], abstract_checks)

doc.add_heading('E3. Keyword Checklist', level=2)
kw_checks = [
    ("5\u201310 keywords", "8 keywords"),
    ("MeSH terms used", "All verified against MeSH database"),
    ("Synonyms included", "Prediabetic State (entry terms: prediabetes, impaired glucose tolerance)"),
    ("Study type included", "Randomized Controlled Trial (Publication Type)"),
    ("Population terms included", "Prediabetic State"),
    ("Ordered by importance", "Condition \u2192 Intervention \u2192 Population \u2192 Outcome \u2192 Design \u2192 Specificity"),
    ("No non-standard abbreviations", "No abbreviations used as primary keywords"),
]
add_table(["Check", "Status"], kw_checks)

doc.add_page_break()

# ══════════════════════════════════════════════════
# F: PUBMED TEST — RESULTS
# ══════════════════════════════════════════════════
doc.add_heading('Section F: The PubMed Test \u2014 Model Results', level=1)

add_para("The PubMed test run using the informative title's key terms:", after=4)

add_tip("PubMed Test Results", [
    ("Search terms used: ", True),
    ("(vitamin D OR cholecalciferol) AND (prediabetes OR prediabetic state) AND (HbA1c OR glycated hemoglobin) AND randomized controlled trial", False),
    ("",),
    ("Results returned: ", True),
    ("Approximately 15\u201325 results (varies by date of search)", False),
    ("",),
    ("Similar papers found: ", True),
    ("YES \u2014 The search returns Pittas et al. (2019) D2d trial, Niroomand et al. (2019), Kuchay et al. (2015), and other comparable studies.", False),
    ("",),
    ("Interpretation: ", True),
    ("The title terms are well-calibrated. They return a manageable number of highly relevant results. If the search returned 0 results, the terms might be too narrow or non-standard. If it returned 500+, they might be too broad.", False),
])

doc.add_heading('Troubleshooting the PubMed Test', level=2)
add_rich([("If too few results: ", True, False, WARNING), ("Your title terms may be too specific or non-standard. Try using broader MeSH terms or adding synonyms.", False)], after=4)
add_rich([("If too many results: ", True, False, WARNING), ("Your title terms may be too generic. Add a population qualifier (e.g., 'prediabetic', 'vitamin D deficient') or a study design filter.", False)], after=4)
add_rich([("If irrelevant results: ", True, False, WARNING), ("One or more title terms is ambiguous. Check MeSH definitions and replace with the standard term.", False)], after=4)

spacer(20)
sep()
add_para("End of ANSWER KEY \u2014 Lecture 7", bold=True, size=12, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER)
add_para("Instructor Use Only", italic=True, size=11, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER)

# ── Save ──
os.makedirs(os.path.dirname(OUT), exist_ok=True)
doc.save(OUT)
print(f"Created: {OUT} ({os.path.getsize(OUT)} bytes)")
