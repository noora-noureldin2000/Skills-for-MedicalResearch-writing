"""Create comprehensive discussion-tips.docx for intern training."""

import os
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

OUT = r"D:\Academic Writing course\Lecture 6 Supplementary\discussion-tips.docx"
PRIMARY = RGBColor(0x1F, 0x4E, 0x79)
ACCENT = RGBColor(0x2E, 0x75, 0xB6)
DARK_GRAY = RGBColor(0x40, 0x40, 0x40)
MED_GRAY = RGBColor(0x66, 0x66, 0x66)
WARNING = RGBColor(0xC0, 0x00, 0x00)
GREEN = RGBColor(0x00, 0x66, 0x00)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_BG = "DEEAF6"
GRAY_BG = "F2F2F2"
FONT_NAME = "Arial"

doc = Document()

# ── Styles ──
style = doc.styles['Normal']
style.font.name = FONT_NAME
style.font.size = Pt(11)
style.paragraph_format.space_after = Pt(6)
style.paragraph_format.line_spacing = 1.15

for i in range(1, 4):
    hs = doc.styles[f'Heading {i}']
    hs.font.name = FONT_NAME
    hs.font.color.rgb = [PRIMARY, ACCENT, DARK_GRAY][i - 1]
    hs.font.size = Pt([16, 14, 12][i - 1])
    hs.font.bold = True

def add_para(text, bold=False, italic=False, size=11, color=None, alignment=None, space_after=6):
    p = doc.add_paragraph()
    if alignment:
        p.alignment = alignment
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = FONT_NAME
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = color
    return p

def add_rich_para(parts, space_after=6, alignment=None):
    """parts = list of (text, bold, italic, color, size)"""
    p = doc.add_paragraph()
    if alignment:
        p.alignment = alignment
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    for part in parts:
        if isinstance(part, str):
            text = part
            bold = False; italic = False; color = None; size = 11
        else:
            text = part[0]
            bold = part[1] if len(part) > 1 else False
            italic = part[2] if len(part) > 2 else False
            color = part[3] if len(part) > 3 else None
            size = part[4] if len(part) > 4 else 11
        run = p.add_run(text)
        run.font.name = FONT_NAME
        run.font.size = Pt(size)
        run.bold = bold
        run.italic = italic
        if color:
            run.font.color.rgb = color
    return p

def add_bullet(text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r = p.add_run(bold_prefix)
        r.bold = True
        r.font.name = FONT_NAME
        r.font.size = Pt(11)
        r = p.add_run(text)
        r.font.name = FONT_NAME
        r.font.size = Pt(11)
    else:
        r = p.add_run(text)
        r.font.name = FONT_NAME
        r.font.size = Pt(11)
    return p

def add_number(text, num_list=None):
    p = doc.add_paragraph(style='List Number')
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(text)
    r.font.name = FONT_NAME
    r.font.size = Pt(11)
    return p

def spacer(pt=12):
    return add_para('', space_after=pt)

def separator():
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run('\u2500' * 60)
    r.font.size = Pt(8)
    r.font.color.rgb = MED_GRAY

def set_cell_shading(cell, color):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color}" w:val="clear"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def set_cell_borders(cell, color="CCCCCC"):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="4" w:color="{color}"/>'
        f'  <w:bottom w:val="single" w:sz="4" w:color="{color}"/>'
        f'  <w:left w:val="single" w:sz="4" w:color="{color}"/>'
        f'  <w:right w:val="single" w:sz="4" w:color="{color}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def make_cell(text, bold=False, size=11, color=None, align=None, bg=None, width=None):
    cell = doc.add_cell(1, 1)  # dummy, will be replaced
    # Actually we'll build cells for tables manually
    pass

def add_tip_box(title, body_lines):
    """A tip box using a single-cell table with colored background."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_shading(cell, LIGHT_BG)
    set_cell_borders(cell, "2E75B6")
    
    # Title
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(title)
    r.bold = True
    r.font.name = FONT_NAME
    r.font.size = Pt(11)
    r.font.color.rgb = PRIMARY
    
    # Body lines
    for line in body_lines:
        if isinstance(line, str) and line.strip() == "":
            continue  # skip empty strings used as spacers
        p = cell.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        if isinstance(line, tuple):
            r = p.add_run(line[0])
            r.font.name = FONT_NAME
            r.font.size = Pt(11)
            if len(line) > 1:
                r.bold = line[1]
            if len(line) > 2:
                r.italic = line[2]
            if len(line) > 3:
                r.font.color.rgb = line[3]
        else:
            r = p.add_run(line)
            r.font.name = FONT_NAME
            r.font.size = Pt(11)
    
    doc.add_paragraph()  # spacer after table
    return table

def add_table(headers, rows, col_widths=None):
    """Create a formatted table."""
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Table Grid'
    
    # Header row
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        set_cell_shading(cell, "1F4E79")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        r.bold = True
        r.font.name = FONT_NAME
        r.font.size = Pt(10)
        r.font.color.rgb = WHITE
    
    # Data rows
    for ri, row_data in enumerate(rows):
        table.add_row()
        for ci, val in enumerate(row_data):
            cell = table.cell(ri + 1, ci)
            if ri % 2 == 1:
                set_cell_shading(cell, GRAY_BG)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(str(val))
            r.font.name = FONT_NAME
            r.font.size = Pt(10)
            if ci == 0:
                r.bold = True
                r.font.color.rgb = PRIMARY
    
    spacer()
    return table

# ══════════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════════
for _ in range(6):
    doc.add_paragraph()

add_para("Research Intern's Guide", bold=True, size=28, color=PRIMARY, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
add_para("to Writing Medical Discussion Sections", bold=True, size=22, color=ACCENT, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_after=20)
add_para("A Comprehensive Training Manual", italic=True, size=14, color=MED_GRAY, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
separator()
add_para("From evidence discovery to polished prose", size=12, color=DARK_GRAY, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
add_para("Incorporating best practices from:", size=11, color=MED_GRAY, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)

sources = [
    "PubMed / ScienceDirect / Google Scholar research-surfer workflow",
    "Dr. Kristin Sainani\u2019s clarity methodology (5-pass audit)",
    "Systematic review tools: CitationChaser, ASReview, Rayyan, CADIMA",
    "Harvard-style citation verification protocols",
    "34 real student discussion samples \u2014 common error analysis",
    "Automated pipeline: statistical routing \u2192 narrative generation",
]
for s in sources:
    add_para(s, size=10, color=DARK_GRAY, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_after=2)

for _ in range(4):
    doc.add_paragraph()

add_para("Version 2.0 \u2014 July 2026", italic=True, size=11, color=MED_GRAY, alignment=WD_ALIGN_PARAGRAPH.CENTER)
doc.add_page_break()

# ══════════════════════════════════════════════════
# TABLE OF CONTENTS
# ══════════════════════════════════════════════════
doc.add_heading('Table of Contents', level=1)

toc_items = [
    "1. The 5-Move Inverted Funnel \u2014 Your Core Framework",
    "2. Literature Search & Evidence Discovery",
    "3. Reading, Organising & Critically Appraising Evidence",
    "4. Writing the Discussion \u2014 Step-by-Step",
    "5. Editing & Polishing (The 5-Pass Audit System)",
    "6. Verification & Integrity \u2014 Zero Hallucination Policy",
    "7. From Statistics to Discussion \u2014 Understanding Your Data",
    "8. Common Pitfalls \u2014 Lessons from 34 Real Student Drafts",
    "Appendix A: Quick Reference \u2014 Boolean Search String Builder",
    "Appendix B: The 5-Pass Editing Checklist (Printable)",
    "Appendix C: Comparative Paragraph Template with Worked Example",
    "Appendix D: Recommended Tool Stack with Use Cases",
]
for item in toc_items:
    add_para(item, size=11, color=PRIMARY, space_after=4)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 1: 5-MOVE INVERTED FUNNEL
# ══════════════════════════════════════════════════
doc.add_heading('1. The 5-Move Inverted Funnel \u2014 Your Core Framework', level=1)
add_para("Every strong medical Discussion follows an inverted funnel structure: start narrow (restate your key findings), widen out (compare with literature), then narrow again (limitations, implications, conclusion). This pattern is universal across journals and theses.")

doc.add_heading('Move 1: Key Findings (Narrow)', level=2)
add_rich_para([("Purpose: ", True), ("Open with a concise restatement of your principal results. Answer the question: 'What did this study find?'")])
add_para("Do not repeat your entire Results section. Select 2\u20133 most important findings and state them in 2\u20134 sentences. Use past tense. Include effect sizes and confidence intervals.")
add_tip_box("Example (Vitamin D Trial)", [
    "In the present study, vitamin D supplementation significantly reduced HbA1c levels in prediabetic adults compared with placebo (mean difference \u22120.45%, 95% CI \u22120.49 to \u22120.42, p < 0.001). This effect was accompanied by a significant improvement in fasting plasma glucose (mean difference \u22120.31 mmol/L, 95% CI \u22120.38 to \u22120.24, p < 0.001).",
])

doc.add_heading('Move 2: Comparison with Literature (Wide)', level=2)
add_rich_para([("Purpose: ", True), ("Situate your findings within the existing body of evidence. Compare and contrast with similar studies.")])
add_para("This is the longest move. Organise by sub-topic (e.g., primary outcome, secondary outcomes, subgroups). Use the comparative paragraph template (Appendix C). Support each comparison with 2\u20134 studies. Alternate between supporting and contrasting evidence.")

doc.add_heading('Move 3: Mechanisms / Explanation', level=2)
add_rich_para([("Purpose: ", True), ("Explain possible biological or methodological reasons for your findings. Why might vitamin D improve glycaemic control?")])
add_para("Ground explanations in established science. Cite mechanistic studies (e.g., vitamin D receptor expression in pancreatic beta cells). Avoid speculation beyond what the evidence supports.")

doc.add_heading('Move 4: Limitations', level=2)
add_rich_para([("Purpose: ", True), ("Acknowledge methodological constraints honestly but constructively.")])
add_para("Cover 4\u20136 limitations spanning: generalisability (single-centre, specific population), sample size/power, design constraints (open-label, short follow-up), measurement limitations, and potential confounding. Do not apologise \u2014 explain.")

doc.add_heading('Move 5: Conclusion & Implications (Narrow)', level=2)
add_rich_para([("Purpose: ", True), ("End with a clear, evidence-based take-home message. What do your findings mean for clinical practice, policy, or future research?")])
add_para("Restate the main finding in one sentence. Give 2\u20133 specific next-step recommendations. Do not overclaim. Avoid: 'Further research is needed' without specifying what kind.")
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 2: LITERATURE SEARCH
# ══════════════════════════════════════════════════
doc.add_heading('2. Literature Search & Evidence Discovery', level=1)
add_para("Finding the right studies to cite is the foundation of a credible Discussion. This section covers our multi-channel search strategy.")

doc.add_heading('2.1 The Omnichannel Approach', level=2)
add_para("Always use a layered strategy \u2014 do not rely on a single database or search method:")
add_bullet("Use PubMed API (via Biopython Entrez, Entrez Direct, or rentrez R package) or ScienceDirect API. APIs do not trigger CAPTCHA and return structured metadata.", bold_prefix="Layer 1 \u2014 API-First (Primary): ")
add_bullet("Google Scholar for broad discovery, citation tracking, and grey literature. Use incognito/headful mode to avoid bot detection.", bold_prefix="Layer 2 \u2014 Browser Search (Secondary): ")
add_bullet("Use CitationChaser (via Lens.org API) for backward/forward citation chasing. Paperfetcher for automated handsearching via Crossref/COCI.", bold_prefix="Layer 3 \u2014 Citation Chaining (Tertiary): ")
add_bullet("Cochrane Library for systematic reviews, ClinicalTrials.gov for ongoing/registered trials, WHO ICTRP for global trial registry.", bold_prefix="Layer 4 \u2014 Specialised Registries: ")

doc.add_heading('2.2 Building a Boolean Search Strategy', level=2)
add_para("A well-constructed Boolean string saves hours. Follow this 5-step process:")
add_number("Define your PICOS framework: Population, Intervention, Comparator, Outcome, Study design.")
add_number("Generate synonyms and MeSH terms for each block. Use litsearchr (R package) for automated term extraction from seed papers.")
add_number("Combine blocks with AND. Within each block, combine synonyms with OR. Use parentheses to group.")
add_number("Translate between database syntaxes using SRA Polyglot (converts PubMed format to Ovid, Embase, etc.).")
add_number("Validate your search using PubMed Search Tester \u2014 check precision/recall against known gold-standard papers.")

add_tip_box("Example Boolean String (PubMed)", [
    ('("Vitamin D" OR "cholecalciferol" OR "25-hydroxyvitamin D") ', False, True),
    ('AND ', True, False, ACCENT),
    ('("prediabetic state"[MeSH] OR "prediabetes" OR "impaired glucose tolerance") ', False, True),
    ('AND ', True, False, ACCENT),
    ('("HbA1c" OR "glycated hemoglobin" OR "glycaemic control") ', False, True),
    ('AND ', True, False, ACCENT),
    ('("randomized controlled trial"[pt] OR "RCT")', False, True),
])

doc.add_heading('2.3 Recommended Search Tools', level=2)
add_table(
    ["Tool", "What It Does & When to Use It"],
    [
        ["CitationChaser", "Automated forward/backward citation chasing. Free Shiny app. Use to find papers that cite or are cited by your key references."],
        ["litsearchr (R)", "Text-mining to identify important search terms from seed papers. Generates optimised Boolean strings automatically."],
        ["OpenAlex", "Fully open scholarly catalog with API. Free alternative to Scopus/Web of Science for broad literature mapping."],
        ["SRA Polyglot", "Converts PubMed search syntax to Ovid, Embase, CINAHL, Web of Science. Essential for multi-database reviews."],
        ["PubMed Search Tester", "Real-time validation of PubMed queries. Check precision/recall before running full search."],
        ["ASReview", "AI-assisted screening: upload search results, train a model on your inclusion/exclusion decisions, and let it rank remaining papers by relevance."],
        ["Rayyan", "Web-based collaborative screening platform. Track inclusion decisions, export PRISMA flow diagrams, manage team reviews."],
        ["Abstrackr", "Free ML-assisted citation screening. Useful for rapid initial triage of large result sets."],
    ]
)
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 3: READING & ORGANISING
# ══════════════════════════════════════════════════
doc.add_heading('3. Reading, Organising & Critically Appraising Evidence', level=1)
add_para("Before you write a single word of Discussion, you must know your evidence base inside out. This section covers how to read, extract, and organise what you find.")

doc.add_heading('3.1 Systematic Note-Taking', level=2)
add_para("For each paper you read, create a structured note. Here is a template:")
add_table(
    ["Field", "Content"],
    [
        ["Reference", "Full Harvard citation + DOI/PMID + URL"],
        ["Study design", "RCT / cohort / case-control / cross-sectional / systematic review"],
        ["Population", "N, key inclusion/exclusion criteria, demographics"],
        ["Intervention / exposure", "Dose, duration, comparator"],
        ["Primary outcome", "Result with effect size, CI, p-value"],
        ["Secondary outcomes", "List with key numbers"],
        ["Key finding relevant to your study", "1\u20132 sentences"],
        ["Strengths", "Methodological quality notes"],
        ["Limitations", "Bias, confounding, generalisability"],
    ]
)

doc.add_heading('3.2 Screening and Data Extraction Tools', level=2)
add_para("For systematic literature searches, use specialised screening tools to manage large result sets efficiently:")
add_bullet("AI-powered screening. Upload your .ris/.bib file, manually include/exclude the first 20\u201350 papers, then let the active-learning model rank remaining papers by relevance. Cuts screening time by 60\u201380%.", bold_prefix="ASReview: ")
add_bullet("Web-based collaborative screening. Team members can independently label decisions (include/exclude/maybe), with blinding options. Exports directly to PRISMA flow diagram.", bold_prefix="Rayyan: ")
add_bullet("Automated risk-of-bias assessment for RCTs. Extracts data on randomisation, blinding, attrition, and selective reporting.", bold_prefix="RobotReviewer: ")
add_bullet("Extract numerical data from figures when papers report results only as graphs. Critical for meta-analyses.", bold_prefix="WebPlotDigitizer: ")
add_bullet("Open-source qualitative coding tool. Tag recurring themes across papers (e.g., 'mechanism', 'adverse events', 'adherence').", bold_prefix="Taguette: ")

doc.add_heading('3.3 Critical Appraisal \u2014 What to Look For', level=2)
add_para("When reading a paper for Discussion comparison, ask these questions:")
add_bullet("Is the study design appropriate for the question? (RCTs for efficacy, cohorts for prognosis, etc.)")
add_bullet("Is the sample size adequate? Check for power calculations or wide confidence intervals.")
add_bullet("Are the population, intervention, and outcomes comparable to your study?")
add_bullet("Are the findings internally consistent? Do numbers in tables match the text?")
add_bullet("What are the key methodological differences that could explain agreement or discrepancy with your results?")
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 4: WRITING
# ══════════════════════════════════════════════════
doc.add_heading('4. Writing the Discussion \u2014 Step-by-Step', level=1)
add_para("This section takes you from your organised evidence to a polished Discussion draft. Follow these steps in order.")

doc.add_heading('4.1 Step 1: Outline Before You Draft', level=2)
add_para("Create a paragraph-level outline. For each paragraph, specify: (a) the move it belongs to, (b) 1\u20132 key studies you will cite, and (c) the takeaway point.")
add_bullet("Move 1 (Findings): 1 paragraph \u2014 HbA1c change, FPG change")
add_bullet("Move 2 (Comparison): 3\u20134 paragraphs \u2014 primary outcome, secondary outcomes, subgroup analyses")
add_bullet("Move 3 (Mechanisms): 1 paragraph \u2014 VDR expression, insulin secretion, inflammation")
add_bullet("Move 4 (Limitations): 1 paragraph \u2014 4\u20136 limitations")
add_bullet("Move 5 (Conclusion): 1 paragraph \u2014 summary + recommendations")

doc.add_heading('4.2 Step 2: Write Comparative Paragraphs (The Template)', level=2)
add_para("This is the most important skill for Move 2. Every comparative paragraph follows this structure:")
add_bullet('Opening sentence: "In agreement with our findings..." or "In contrast to our findings..."', bold_prefix="")
add_bullet("Study identification: Author (Year), study design, population, key numerical result with exact statistics.", bold_prefix="")
add_bullet("Explanation: One sentence explaining why findings agree or differ (comparable design, similar population, or methodological explanation for discrepancy).", bold_prefix="")
add_bullet("Length limit: \u2264 75 words per study paragraph. Be concise and specific.", bold_prefix="")

add_tip_box("Example: Agreement", [
    ("In agreement with our findings, Pittas et al. (2019) demonstrated in the D2d trial that vitamin D supplementation at 4000 IU daily reduced the incidence of diabetes among 2423 prediabetic adults (HR 0.88, 95% CI 0.75\u20130.996), with a number needed to treat of 30 over a median follow-up of 2.5 years, supporting a protective effect in a comparable population.", False, False, None, 10),
])
add_tip_box("Example: Contrast", [
    ("In contrast to our findings, Kuchay et al. (2015) reported no significant change in HbA1c following 60,000 IU weekly vitamin D for 12 weeks in 91 prediabetic Indian adults (p = 0.32), a discrepancy potentially attributable to their shorter intervention duration (12 vs. 52 weeks) and lower cumulative vitamin D dose.", False, False, None, 10),
])

doc.add_heading('4.3 Step 3: Discuss Mechanisms \u2014 Ground in Evidence', level=2)
add_para("When explaining mechanisms, cite mechanistic studies \u2014 not speculation:")
add_bullet("Vitamin D receptor (VDR) is expressed on pancreatic beta cells (Maestro et al., 2003).")
add_bullet("1,25-dihydroxyvitamin D regulates insulin gene transcription via VDR response elements (Szymczak-Pajor & Sliwinska, 2019).")
add_bullet("Vitamin D modulates systemic inflammation by suppressing NF-\u03baB signalling (Wobke et al., 2014).")

doc.add_heading('4.4 Step 4: Write Limitations \u2014 Be Precise', level=2)
add_para("State limitations as complete sentences. Cover at least these domains:")
add_number("Generalisability: single-centre, specific population (prediabetic, vitamin D deficient)")
add_number("Sample size: adequate for primary outcome but limited for subgroup analyses")
add_number("Design: open-label (if applicable), no placebo run-in")
add_number("Measurement: HbA1c as surrogate endpoint (not diabetes incidence)")
add_number("Follow-up: 52 weeks \u2014 longer outcomes unknown")

doc.add_heading('4.5 Step 5: Conclude \u2014 Specific, Not Generic', level=2)
add_para("A strong Conclusion avoids vague calls for 'more research'. Instead:")
add_bullet("State the primary finding in one sentence.")
add_bullet("Give 2\u20133 specific, actionable recommendations for clinical practice or future research.")
add_bullet("Recommend specific study designs, populations, or endpoints for future work.")
add_tip_box("Weak vs. Strong Conclusion", [
    ("Weak: ", True, False, WARNING),
    ("\"Further research is needed to confirm these findings.\"", False, True),
    "",
    ("Strong: ", True, False, GREEN),
    ("\"A multicentre RCT with longer follow-up (\u2265 3 years) is warranted to determine whether the HbA1c improvement observed here translates into reduced diabetes incidence, particularly in populations with baseline vitamin D deficiency.\"", False, True),
])
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 5: EDITING & POLISHING
# ══════════════════════════════════════════════════
doc.add_heading('5. Editing & Polishing (The 5-Pass Audit System)', level=1)
add_para("This system, based on Dr. Kristin Sainani's 'Writing in the Sciences' methodology, ensures your Discussion is clear, precise, and professional. Apply these 5 passes sequentially.")

doc.add_heading('Pass 1: Clutter Extraction', level=2)
add_para("Strip every sentence to its cleanest components. Flag and fix:")
add_table(
    ["Remove This", "Replace With"],
    [
        ["Due to the fact that", "Because"],
        ["A majority of", "Most"],
        ["In the event that", "If"],
        ["At the present time", "Now / Currently"],
        ["In order to", "To"],
        ["A number of", "Several / Many"],
        ["It is worth noting that", "(delete)"],
        ["It is important to note that", "(delete)"],
        ["It can be regarded that", "(delete)"],
        ["As it is well known...", "(replace with citation)"],
    ]
)
spacer()

doc.add_heading('Pass 2: Active Voice & Verb Vitality', level=2)
add_para("Scientific transparency requires accountability. Identify who did what:")
add_bullet('"HbA1c levels were significantly reduced by vitamin D supplementation."', bold_prefix="Passive (weak): ")
add_bullet('"Vitamin D supplementation significantly reduced HbA1c levels."', bold_prefix="Active (strong): ")
add_para("Exceptions: Use passive when the actor is genuinely unknown or irrelevant ('The sample was collected in 2019'), or when Methods section style requires it.")

doc.add_heading('Pass 3: Sentence Architecture', level=2)
add_rich_para([("Buried predicate audit: ", True), ("Count words between subject and main verb. If more than ~12, restructure.")])
add_bullet('"One study of 930 adults with prediabetes receiving care in two managed care settings found that..."', bold_prefix="Buried: ")
add_bullet('"One study found that, among 930 adults with prediabetes in managed care, ..."', bold_prefix="Fixed: ")
add_rich_para([("Sentence length variation: ", True), ("Mix short (\u226415 words), medium (15\u201330), and long (30\u201350) sentences to create natural rhythm.")])

doc.add_heading('Pass 4: Keyword Consistency', level=2)
add_rich_para([("The Banana Rule: ", True), ("Do not call a 'banana' an 'elongated yellow fruit' to avoid repetition. If your Methods say 'prediabetic adults', your Discussion must not switch to 'individuals with glucose dysregulation' \u2014 this confuses the reader.")])
add_para("Extract all key terms from Methods and verify they appear unchanged in Discussion. Check: group names, variable names, abbreviations.")

doc.add_heading('Pass 5: Numerical & Citation Integrity', level=2)
add_para("Final sanity check before submission:")
add_bullet("Do the effect sizes in your Discussion match those in your Results section?")
add_bullet("Are all cited statistics traceable to the original source (not a review that cites a review)?")
add_bullet("Are significant figures consistent throughout? (If HbA1c is reported to 2 decimal places in Results, do the same in Discussion.)")
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 6: VERIFICATION
# ══════════════════════════════════════════════════
doc.add_heading('6. Verification & Integrity \u2014 Zero Hallucination Policy', level=1)
add_para("This is the most important section in this guide. Every reference you cite must be real, accessible, and accurately represented. Fabricated or inaccurate citations damage your credibility and could lead to rejection or retraction.")

doc.add_heading('6.1 The Zero Hallucination Rule', level=2)
add_para("Never invent or estimate: prevalence rates, effect sizes, p-values, cutoffs, outcomes, or any numerical value. If a statement cannot be directly verified, label it:")
add_bullet("[Unverified] \u2014 if you cannot confirm a claim")
add_bullet("[Inference] \u2014 if you are drawing a logical conclusion not stated in the source")
add_bullet("[Speculation] \u2014 if you are hypothesising beyond the evidence")

doc.add_heading('6.2 Open-Access Requirement', level=2)
add_para("Use only open-access full-text articles you can actually access and verify. If full text cannot be verified, explicitly state: 'I cannot verify full-text access' and do not rely on that source.")

doc.add_heading('6.3 Verification Workflow', level=2)
add_para("For every reference in your Discussion, perform these steps:")
add_number("Check DOI and PMID against PubMed/CrossRef. Confirm author names, journal, year, volume, pages.")
add_number("Open the full text (PDF or HTML). Verify that the numbers you cite are actually present in the results/tables.")
add_number("Check that the study population and design are genuinely comparable to your study.")
add_number("Ensure the citation supports the specific claim you are making \u2014 not a tangential point.")
add_number("Record the verification in your notes: 'Full text verified Yes/No' + direct link.")

add_tip_box("Pro Tip: The Telephone Game Audit", [
    "Flag any statistic presented as established fact but cited only through secondary sources (reviews, textbooks). Trace it back to the primary source. Common trap: 'According to [Review, 2020], the prevalence is 15\u201362%...' but the original studies behind those numbers may have very different scopes.",
])

doc.add_heading('6.4 Harvard Citation Requirements', level=2)
add_para("All citations must follow Harvard style:")
add_bullet("In-text: (Author, Year) \u2014 place after every sentence that draws from a source.")
add_bullet("Multiple sources: (Author1, Year; Author2, Year) \u2014 variety is essential.")
add_bullet("Reference list: Authors. (Year). Title. Journal. Volume(Issue), pages. DOI. Available at: URL (Accessed: Day Month Year).")
add_bullet("Page numbers: Include if available, especially for direct quotes: (Author, Year, p. X). Never fabricate.")
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 7: STATISTICS TO DISCUSSION
# ══════════════════════════════════════════════════
doc.add_heading('7. From Statistics to Discussion \u2014 Understanding Your Data', level=1)
add_para("Your Discussion must interpret the numbers from your Results section. You cannot write a credible Discussion without understanding what your statistical output actually means.")

doc.add_heading('7.1 The Pipeline: Data \u2192 Test \u2192 Narrative', level=2)
add_para("Our automated pipeline processes data through these stages, which mirror what you should do manually:")
add_bullet("Import raw data. Handle missing values (listwise deletion, imputation). Classify variable types (continuous, categorical, binary).", bold_prefix="Step 1 \u2014 Load & Clean: ")
add_bullet("Test normality (Shapiro-Wilk). Test equal variance (Levene's). Test expected cell frequencies for categorical data (Fisher vs. chi-square). The test selection depends on these results.", bold_prefix="Step 2 \u2014 Assumption Gates: ")
add_bullet("Parametric (t-test, ANOVA, Pearson) if normal + equal variance. Non-parametric (Mann-Whitney, Kruskal-Wallis, Spearman) if violated. Categorical (chi-square, Fisher's exact) for proportions.", bold_prefix="Step 3 \u2014 Test Selection: ")
add_bullet("Cohen's d (negligible < 0.2, small < 0.5, medium < 0.8, large \u2265 0.8). Eta-squared (small < 0.06, medium < 0.14, large \u2265 0.14). Odds ratio (small < 1.5, medium < 2.5, large \u2265 2.5).", bold_prefix="Step 4 \u2014 Effect Size Interpretation: ")
add_bullet("The pipeline writes an APA-style narrative. You must then interpret this narrative in the Discussion context.", bold_prefix="Step 5 \u2014 Narrative Generation: ")

doc.add_heading('7.2 What to Discuss from Your Statistics', level=2)
add_para("For each statistical result, your Discussion should address:")
add_bullet("Is the effect size clinically meaningful? A statistically significant result (p < 0.05) may be clinically trivial \u2014 and vice versa.", bold_prefix="Clinical significance: ")
add_bullet("Are the confidence intervals narrow (precise) or wide (imprecise)? Wide CIs suggest the estimate is unreliable.", bold_prefix="Precision: ")
add_bullet("Do the results across different outcomes, subgroups, and sensitivity analyses tell a coherent story?", bold_prefix="Consistency: ")
add_bullet("How does your effect size compare with those reported in similar studies? Is the magnitude of effect plausible given the intervention dose and duration?", bold_prefix="Comparison: ")

add_tip_box("Worked Example \u2014 Interpreting HbA1c Results", [
    ("Result: ", True),
    ("Mean difference \u22120.45% (95% CI \u22120.49 to \u22120.42), p < 0.001, Cohen's d = 0.72", False, False, None, 10),
    "",
    ("Clinical significance: ", True),
    ("A \u22120.45% reduction in HbA1c among prediabetic adults (baseline mean 5.9%) is clinically relevant. The UKPDS demonstrated that each 1% reduction in HbA1c reduces microvascular risk by 37% (Stratton et al., 2000). Our reduction of approximately 0.5% would therefore reduce risk by ~18%.", False, False, None, 10),
    "",
    ("Precision: ", True),
    ("The 95% CI is narrow (\u22120.49 to \u22120.42), indicating high precision and adequate sample size.", False, False, None, 10),
    "",
    ("Effect size: ", True),
    ("Cohen's d = 0.72 represents a medium-to-large effect, suggesting the intervention has meaningful biological impact.", False, False, None, 10),
])
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION 8: COMMON PITFALLS
# ══════════════════════════════════════════════════
doc.add_heading('8. Common Pitfalls \u2014 Lessons from 34 Real Student Drafts', level=1)
add_para("Analysis of real student Discussion drafts reveals recurring problems. Here are the most common issues and how to avoid them.")

doc.add_heading('Pitfall 1: The Background-Only Introduction', level=2)
add_rich_para([("Error: ", True, False, WARNING), ("Opening the Discussion with 3\u20135 paragraphs of background information that belongs in the Introduction. The reader already knows this.")])
add_rich_para([("Fix: ", True, False, GREEN), ("Your Discussion should open with your findings (Move 1), not re-introduce the disease. One sentence of context maximum \u2014 then directly state your results.")])

doc.add_heading('Pitfall 2: No Move Structure', level=2)
add_rich_para([("Error: ", True, False, WARNING), ("A rambling narrative that jumps between findings, literature, limitations, and mechanisms without clear paragraph organisation.")])
add_rich_para([("Fix: ", True, False, GREEN), ("Use the 5-Move Inverted Funnel. Each paragraph should serve one clear purpose. Write a one-sentence topic sentence for each paragraph before you draft it.")])

doc.add_heading("Pitfall 3: Weak Comparisons ('Agreeing without Evidence')", level=2)
add_rich_para([("Error: ", True, False, WARNING), ('"Our findings are consistent with the literature" \u2014 without naming specific studies, statistics, or populations.')])
add_rich_para([("Fix: ", True, False, GREEN), ("Every comparison must name the study, state the specific numerical finding, and explain why agreement or discrepancy exists. Use the comparative paragraph template (Appendix C).")])

doc.add_heading('Pitfall 4: Tense Confusion', level=2)
add_rich_para([("Error: ", True, False, WARNING), ("Mixing past and present tense inconsistently within the same paragraph.")])
add_rich_para([("Rule: ", True, False, GREEN), ("Your study findings \u2192 past tense (showed, demonstrated, revealed). Established knowledge \u2192 present tense (vitamin D is known to, the VDR receptor mediates). Your conclusions \u2192 present or modal (these findings suggest, our results indicate).")])

doc.add_heading('Pitfall 5: Overcitation Without Synthesis', level=2)
add_rich_para([("Error: ", True, False, WARNING), ("Stringing together 5\u201310 citations in one sentence without explaining how each one relates to your findings.")])
add_rich_para([("Fix: ", True, False, GREEN), ("Each citation must be accompanied by a specific point of comparison. Group studies by whether they support or contrast your findings. For related studies, synthesise: 'Three trials have consistently shown... (A, B, C), while two others found no effect (D, E), possibly due to shorter follow-up durations.'")])

doc.add_heading('Pitfall 6: Overclaiming in the Conclusion', level=2)
add_rich_para([("Error: ", True, False, WARNING), ('"Vitamin D supplementation prevents diabetes." From a single RCT with HbA1c as a surrogate endpoint.')])
add_rich_para([("Fix: ", True, False, GREEN), ("Match your claims to your evidence. Use hedging appropriately: 'may reduce', 'suggests a potential benefit', 'warrants further investigation'. Let the evidence speak \u2014 do not exaggerate.")])

add_tip_box("Summary: Before Submitting, Ask Yourself", [
    ("\u2713  Does my opening sentence state my key finding (not background)?", True, False, GREEN),
    ("\u2713  Does each Move have at least one dedicated paragraph?", True, False, GREEN),
    ("\u2713  Are all cited studies named and compared specifically?", True, False, GREEN),
    ("\u2713  Are all references verified (full-text check)?", True, False, GREEN),
    ("\u2713  Is tense usage consistent?", True, False, GREEN),
    ("\u2713  Are my conclusions proportional to my evidence?", True, False, GREEN),
])
doc.add_page_break()

# ══════════════════════════════════════════════════
# APPENDIX A
# ══════════════════════════════════════════════════
doc.add_heading('Appendix A: Quick Reference \u2014 Boolean Search String Builder', level=1)
add_para("Use this template to build your own Boolean search strings for PubMed.")
spacer()
add_rich_para([("Template", True, False, PRIMARY)], space_after=8)
add_para('( "[Population terms]" OR "synonym 1" OR "synonym 2" )')
add_para('AND ( "[Intervention terms]" OR "synonym 1" OR "abbreviation" )')
add_para('AND ( "[Comparator terms]" OR "control" OR "standard care" )')
add_para('AND ( "[Outcome terms]" OR "synonym 1" )')
add_para('AND ( "[Study design filter]" OR "RCT" OR "clinical trial" )')
spacer()
add_rich_para([("Filters to Add", True, False, PRIMARY)], space_after=8)
add_bullet('Date range: AND ("2020"[Date - Publication] : "3000"[Date - Publication])')
add_bullet('Humans: AND ("humans"[MeSH Terms])')
add_bullet('English: AND ("english"[Language])')
add_bullet('Full text: AND ("free full text"[Filter] OR "full text"[Filter])')
spacer()
add_rich_para([("Database Translation Tools", True, False, PRIMARY)], space_after=8)
add_para("Use SRA Polyglot (https://iebh.github.io/sra-polyglot/) to convert your PubMed string to: Ovid MEDLINE, Embase, CINAHL, Web of Science, Scopus, Cochrane Library. Paste the PubMed string and select the target database.")
doc.add_page_break()

# ══════════════════════════════════════════════════
# APPENDIX B
# ══════════════════════════════════════════════════
doc.add_heading('Appendix B: The 5-Pass Editing Checklist (Printable)', level=1)
add_para("Print this page or keep it open while editing your Discussion draft.")
spacer()

checklist = [
    ("Pass 1: Clutter", [
        "Flag and replace dead-weight phrases (see table in Section 5)",
        "Delete unnecessary introductory phrases ('It is worth noting that...')",
        "Remove redundant adjectives ('completely eliminate' \u2192 'eliminate')",
    ]),
    ("Pass 2: Voice & Verbs", [
        "Convert passive \u2192 active where actor is known",
        "Fix nominalisations ('provides a review of' \u2192 'reviews')",
        "Accept passive only in Methods or where actor is irrelevant",
    ]),
    ("Pass 3: Sentences", [
        "Buried predicate check: \u226412 words between subject and verb",
        "Vary sentence length: short, medium, long",
        "Use colons for lists, dashes for emphasis, semicolons for linked clauses",
    ]),
    ("Pass 4: Terminology", [
        "Key terms from Methods appear unchanged in Discussion (Banana Rule)",
        "No synonym substitution for defined terms",
        "Every acronym defined at first use in text AND each table/figure",
    ]),
    ("Pass 5: Numbers & Citations", [
        "All effect sizes match Results section exactly",
        "All citations verified against primary source (telephone game check)",
        "Significant figures consistent",
    ]),
]

for title, items in checklist:
    doc.add_heading(title, level=2)
    for item in items:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.left_indent = Cm(1)
        r = p.add_run("\u2610  " + item)
        r.font.name = FONT_NAME
        r.font.size = Pt(11)
    spacer()

doc.add_page_break()

# ══════════════════════════════════════════════════
# APPENDIX C
# ══════════════════════════════════════════════════
doc.add_heading('Appendix C: Comparative Paragraph Template with Worked Example', level=1)
spacer()
add_rich_para([("Template Structure (\u2264 75 words per study paragraph):", True, False, PRIMARY)], space_after=8)
spacer()

# Template with parts
p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(6)
parts = [
    ("[In agreement with / In contrast to] our findings, ", False, True),
    ("Author (Year) ", True, False),
    ("[study design] comparing [intervention vs. comparator] in [N] [population] has reported ", False, True),
    ("[key outcome: numerical result with effect size, CI, p-value], ", False, True),
    ("demonstrating [alignment/discrepancy] potentially due to [methodological explanation].", False, True),
]
for text, bold, italic in parts:
    r = p.add_run(text)
    r.font.name = FONT_NAME
    r.font.size = Pt(11)
    r.bold = bold
    r.italic = italic

spacer(8)
add_rich_para([("Worked Example: Comparing HbA1c Findings", True, False, PRIMARY)], space_after=8)

add_tip_box("Supporting Study (Agreement)", [
    ("In agreement with our findings, Niroomand et al. (2019) demonstrated in a double-blind RCT of 94 prediabetic adults receiving 50,000 IU vitamin D weekly that HbA1c was significantly reduced compared with placebo (mean difference \u22120.29%, 95% CI \u22120.48 to \u22120.11, p = 0.003), supporting a consistent effect across Middle Eastern populations with comparable baseline vitamin D status.", False, False, None, 10),
])
add_tip_box("Contrasting Study (Discrepancy)", [
    ("In contrast to our findings, Kuchay et al. (2015) found no significant change in HbA1c following 60,000 IU weekly vitamin D for 12 weeks in 91 prediabetic Indian adults (mean change \u22120.07%, p = 0.32), a discrepancy potentially attributable to their shorter intervention duration (12 vs. 52 weeks) and lower cumulative dose.", False, False, None, 10),
])
doc.add_page_break()

# ══════════════════════════════════════════════════
# APPENDIX D
# ══════════════════════════════════════════════════
doc.add_heading('Appendix D: Recommended Tool Stack with Use Cases', level=1)
add_para("Organised by workflow stage. Start here when building your own evidence-synthesis toolkit.")
spacer()

add_table(
    ["Stage", "Tool", "Primary Use Case"],
    [
        ["Literature Search", "PubMed (via Entrez Direct or Biopython)", "Primary biomedical search \u2014 always API-first"],
        ["Literature Search", "OpenAlex", "Broader scholarly discovery across all disciplines"],
        ["Literature Search", "CitationChaser", "Forward/backward citation chasing from 1\u20132 seed papers"],
        ["Search Strategy", "litsearchr (R)", "Automated term extraction and Boolean string optimisation"],
        ["Search Strategy", "SRA Polyglot", "Convert PubMed syntax to Ovid/Embase/CINAHL format"],
        ["Search Validation", "PubMed Search Tester", "Real-time precision/recall testing of query strings"],
        ["Screening", "ASReview", "AI-assisted screening of large result sets (500+ records)"],
        ["Screening", "Rayyan", "Collaborative team screening with blinding options"],
        ["Risk of Bias", "RobotReviewer", "Automated RoB assessment for RCTs"],
        ["Risk of Bias", "robvis (R)", "Generate publication-ready RoB plots (traffic light, summary)"],
        ["Data Extraction", "WebPlotDigitizer", "Extract numbers from figures when text tables unavailable"],
        ["Data Extraction", "Taguette", "Qualitative coding of themes across papers"],
        ["Reference Mgmt", "Zotero", "Collect, organise, cite, and share references. Free and open-source."],
        ["Reference Mgmt", "ASySD", "Deduplicate search results from multiple databases"],
        ["Data Analysis", "R (metafor, meta, netmeta)", "Meta-analysis and network meta-analysis"],
        ["Data Analysis", "JASP / Jamovi", "User-friendly GUI for meta-analysis and standard statistics"],
        ["Visualisation", "VOSviewer", "Bibliometric network visualisation (co-citation, co-authorship)"],
        ["Visualisation", "PRISMA 2020 Generator", "Create PRISMA flow diagrams (Shiny app + R package)"],
        ["Writing", "Pandoc", "Convert between document formats (MD \u2192 DOCX for draft output)"],
        ["Integrity", "statcheck (R)", "Verify reported p-values match test statistics and dfs"],
    ]
)
spacer()

separator()
add_para("End of Guide. Good luck with your Discussion section!", italic=True, size=12, color=MED_GRAY, alignment=WD_ALIGN_PARAGRAPH.CENTER)

# ── Save ──
os.makedirs(os.path.dirname(OUT), exist_ok=True)
doc.save(OUT)
print(f"Created: {OUT} ({os.path.getsize(OUT)} bytes)")
