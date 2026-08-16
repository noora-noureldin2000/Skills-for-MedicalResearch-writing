"""Homework - Lecture 8: Academic Writing Mechanics & AMA Style (Student Sheet)."""

import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml

OUT = r"D:\Academic Writing course\Lecture 8 Supplementary\Homework - Lecture 8.docx"

PRIMARY = RGBColor(0x1F, 0x4E, 0x79)
ACCENT = RGBColor(0x2E, 0x75, 0xB6)
DARK = RGBColor(0x40, 0x40, 0x40)
MED = RGBColor(0x66, 0x66, 0x66)
GREEN = RGBColor(0x00, 0x66, 0x00)
WARN = RGBColor(0xC0, 0x00, 0x00)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_BG = "DEEAF6"
GRAY_BG = "F2F2F2"
YELLOW_BG = "FFF3CC"
FONT = "Arial"

doc = Document()

# ── Styles ──
style = doc.styles['Normal']
style.font.name = FONT; style.font.size = Pt(11)
style.paragraph_format.space_after = Pt(6); style.paragraph_format.line_spacing = 1.15
for i in range(1, 4):
    hs = doc.styles[f'Heading {i}']
    hs.font.name = FONT; hs.font.color.rgb = [PRIMARY, ACCENT, DARK][i-1]
    hs.font.size = Pt([16, 14, 12][i-1]); hs.font.bold = True

def add_para(text, bold=False, italic=False, size=11, color=None, align=None, after=6):
    p = doc.add_paragraph()
    if align: p.alignment = align
    p.paragraph_format.space_after = Pt(after); p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(size); r.bold = bold; r.italic = italic
    if color: r.font.color.rgb = color
    return p

def add_rich(parts, after=6):
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(after); p.paragraph_format.line_spacing = 1.15
    for part in parts:
        if isinstance(part, str):
            r = p.add_run(part); r.font.name = FONT; r.font.size = Pt(11)
        else:
            t = part[0]; b = part[1] if len(part)>1 else False; i = part[2] if len(part)>2 else False
            c = part[3] if len(part)>3 else None; sz = part[4] if len(part)>4 else 11
            r = p.add_run(t); r.font.name = FONT; r.font.size = Pt(sz); r.bold = b; r.italic = i
            if c: r.font.color.rgb = c
    return p

def add_bullet(text, bp=None, after=3):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(after); p.paragraph_format.line_spacing = 1.15
    if bp:
        r = p.add_run(bp); r.bold = True; r.font.name = FONT; r.font.size = Pt(11)
        r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(11)
    else:
        r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(11)
    return p

def add_number(text, after=3):
    p = doc.add_paragraph(style='List Number')
    p.paragraph_format.space_after = Pt(after)
    r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(11)
    return p

def spacer(pt=12): add_para('', after=pt)

def sep():
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12); p.paragraph_format.space_after = Pt(12)
    r = p.add_run('\u2500'*60); r.font.size = Pt(8); r.font.color.rgb = MED

def shd(cell, color):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color}" w:val="clear"/>'))

def bord(cell, c="CCCCCC"):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:color="{c}"/>'
                          f'<w:bottom w:val="single" w:sz="4" w:color="{c}"/>'
                          f'<w:left w:val="single" w:sz="4" w:color="{c}"/>'
                          f'<w:right w:val="single" w:sz="4" w:color="{c}"/></w:tcBorders>'))

def tip(title, lines):
    t = doc.add_table(rows=1, cols=1); t.alignment = WD_TABLE_ALIGNMENT.CENTER; c = t.cell(0,0)
    shd(c, LIGHT_BG); bord(c, "2E75B6")
    r = c.paragraphs[0].add_run(title); r.bold = True; r.font.name = FONT; r.font.size = Pt(11); r.font.color.rgb = PRIMARY
    for line in lines:
        if isinstance(line,str) and line.strip()=='': continue
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
    t = doc.add_table(rows=1, cols=len(headers)); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.style = 'Table Grid'
    for i,h in enumerate(headers):
        c = t.cell(0,i); shd(c,"1F4E79")
        r = c.paragraphs[0].add_run(h); r.bold=True; r.font.name=FONT; r.font.size=Pt(10); r.font.color.rgb=WHITE
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for ri,rd in enumerate(rows):
        t.add_row()
        for ci,val in enumerate(rd):
            c = t.cell(ri+1,ci)
            if ri%2==1: shd(c,GRAY_BG)
            r = c.paragraphs[0].add_run(str(val)); r.font.name=FONT; r.font.size=Pt(10)
            if ci==0: r.bold=True; r.font.color.rgb=PRIMARY
    spacer()

def blank(n=70): return '_'*n

# ══════════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════════
for _ in range(4): doc.add_paragraph()
add_para("Academic Research Writing & Manuscript Publication", bold=True, size=14, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)
add_para("for Medical Professionals", bold=True, size=12, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=20)
sep()
add_para("Lecture 8: Homework", bold=True, size=20, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
add_para("Academic Writing Mechanics & AMA Style", bold=True, size=16, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
add_para("Student Worksheet", size=12, color=DARK, align=WD_ALIGN_PARAGRAPH.CENTER, after=6)
sep()
add_para("All exercises refer to the Vitamin D / prediabetes trial from Lectures 4\u20137.", size=10, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER, after=2)
add_para("Refer to your Lecture 4+5 Protocol for study details.", size=10, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER, after=2)
add_rich([("Name: ", True,False,DARK), (blank(50), False,False,MED)], after=2)
add_rich([("Date: ", True,False,DARK), (blank(50), False,False,MED)], after=2)
add_rich([("Prerequisite: ", True,False,DARK), ("Lecture 8: Student Notes \u2014 Quick Reference Card", False,False,MED)], after=20)
doc.add_page_break()

# ══════════════════════════════════════════════════
# STUDY REFERENCE
# ══════════════════════════════════════════════════
doc.add_heading('Study Reference Summary', level=1)
add_para("Vitamin D and Prediabetes Trial \u2014 Key Facts Used in This Homework:", after=4)

add_bullet("Design: Randomized, double-blind, placebo-controlled, parallel-group RCT", after=2)
add_bullet("Setting: Single-centre endocrinology clinic, Saudi Arabia", after=2)
add_bullet("Participants: N = 140 adults (70 per group), 30\u201365 years, prediabetes (HbA1c 5.7\u20136.4%), vitamin D deficiency (25(OH)D < 50 nmol/L)", after=2)
add_bullet("Intervention: Vitamin D\u2083 50,000 IU weekly \u00d7 8 weeks then 2,000 IU daily \u00d7 44 weeks vs. placebo", after=2)
add_bullet("Primary outcome: HbA1c change at 52 weeks", after=2)
add_bullet("Key result: Mean difference \u22120.45% (95% CI \u22120.49 to \u22120.42; p < 0.001; Cohen's d = 0.72)", after=2)
add_bullet("Key secondary result: FPG mean diff \u22120.31 mmol/L (95% CI \u22120.38 to \u22120.24; p < 0.001)", after=2)
add_bullet("Normoglycaemia at 52 weeks: 44.3% vs. 17.1% (p < 0.001)", after=2)
spacer()
doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION A: MEAL PLAN
# ══════════════════════════════════════════════════
doc.add_heading('Section A: The MEAL Plan', level=1)
add_para("For each paragraph in a scientific manuscript, you need: Main idea + Evidence + Analysis + Link.")

doc.add_heading('A1. Label MEAL Elements (6 marks)', level=2)
add_para("Read the paragraph below about the Vitamin D trial. In the spaces provided, label each sentence as [M], [E], [A], or [L]. Some elements may span more than one sentence, and some may be missing.", after=4)

meal_para = [
    ('(1) "', 'Sentence 1: ', 'Vitamin D supplementation has been shown to improve glycaemic control through multiple mechanisms, including upregulation of insulin receptor expression and modulation of systemic inflammation."'),
    ('(2) "', 'Sentence 2: ', 'In the present study, 52 weeks of high-dose vitamin D\u2083 supplementation significantly reduced HbA1c compared with placebo (mean difference \u22120.45%, 95% CI \u22120.49 to \u22120.42; p < 0.001)."'),
    ('(3) "', 'Sentence 3: ', 'This finding is consistent with the D2d trial, in which vitamin D reduced diabetes incidence among prediabetic adults (HR 0.88, 95% CI 0.75\u20130.996)."'),
    ('(4) "', 'Sentence 4: ', 'The magnitude of HbA1c reduction observed in our trial (Cohen\u2019s d = 0.72) represents a medium-to-large effect, suggesting the intervention has meaningful biological impact beyond statistical significance."'),
    ('(5) "', 'Sentence 5: ', 'Together, these findings support the clinical utility of vitamin D optimisation as a preventive strategy in prediabetes, though longer-term trials are needed to confirm durability."'),
]
for prefix, label, text in meal_para:
    add_rich([(prefix + label, True, False, DARK), (text, False, False, None, 10)], after=4)

add_para("", after=2)
add_para("Labels: [M] Main Idea   [E] Evidence   [A] Analysis   [L] Link")
add_para("If an element is missing, write MISSING.", italic=True, color=WARN, after=8)

for i in range(1, 6):
    add_rich([(f"Sentence {i}: [", False, False, None, 11), ("______", False, False, MED, 11), ("]", False, False, None, 11)], after=4)
spacer()

doc.add_heading('A2. Fix a Broken MEAL Paragraph (8 marks)', level=2)
add_para("The following paragraph about the Vitamin D trial has two MEAL errors. Identify which MEAL elements are missing or weak, then rewrite the paragraph correctly.", after=4)

tip("Defective Paragraph", [
    ('"In a study by Kuchay et al. (2015), 91 prediabetic adults received 60,000 IU vitamin D weekly for 12 weeks and showed no significant change in HbA1c (p = 0.32). In the D2d trial by Pittas et al. (2019), 2423 prediabetic adults received 4000 IU daily and diabetes incidence was reduced (HR 0.88, 95% CI 0.75\u20130.996)."', False, False, None, 10),
])

add_rich([("a) Which MEAL element(s) are missing or weak? ", True), (blank(30), False, False, MED)], after=6)
add_rich([("b) Which MEAL element(s) are present? ", True), (blank(30), False, False, MED)], after=6)
add_rich([("c) Rewrite the paragraph with all four MEAL elements:", True)], after=6)
spacer(24)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION B: ACTIVE vs PASSIVE VOICE
# ══════════════════════════════════════════════════
doc.add_heading('Section B: Active vs. Passive Voice', level=1)
add_para("Refer to Table 4 in the Lecture 8 notes: use active voice in Introduction, Results, and Discussion; passive is traditional for Methods but active is also accepted.")

doc.add_heading('B1. Convert Passive to Active (6 marks)', level=2)
add_para("Rewrite each passive sentence in active voice. Identify the actor (who did it?) and make that actor the subject.", after=4)

passive_sentences = [
    "HbA1c levels were significantly reduced by vitamin D supplementation compared with placebo.",
    "Fasting plasma glucose was measured at baseline, 12 weeks, 26 weeks, and 52 weeks.",
    "It was found that normoglycaemia was achieved by 44.3% of participants in the vitamin D group.",
    "A significant improvement in HOMA-IR was observed in the treatment group.",
    "The decision was made to include only participants with confirmed vitamin D deficiency.",
    "Serum 25(OH)D concentrations were increased from 38.4 nmol/L to 82.6 nmol/L by the loading dose regimen.",
]
for i, s in enumerate(passive_sentences, 1):
    add_rich([(f"{i}. ", True, False, DARK), (s, False, True, MED, 10)], after=2)
    add_rich([("Active: ", False, False, GREEN), (blank(70), False, False, MED)], after=8)

doc.add_heading('B2. Nominalization Zombie Hunt (4 marks)', level=2)
add_para("Each sentence below contains a nominalization (a verb hidden inside a noun ending in -tion, -ment, -ance). Replace it with the active verb form.", after=4)

nominalizations = [
    "We performed an analysis of HbA1c changes using a mixed-effects model.",
    "There was a reduction in fasting plasma glucose after 52 weeks of supplementation.",
    "The researchers conducted an assessment of insulin resistance using HOMA-IR.",
    "An improvement in glycaemic control was achieved by the majority of participants.",
]
for i, s in enumerate(nominalizations, 1):
    add_rich([(f"{i}. ", True, False, DARK), (s, False, False, None, 10)], after=2)
    add_rich([("Rewritten: ", False, False, GREEN), (blank(60), False, False, MED)], after=8)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION C: PARAPHRASING
# ══════════════════════════════════════════════════
doc.add_heading('Section C: Paraphrasing & Avoiding Plagiarism', level=1)
add_para("Remember the 5-Step Process: Read \u2192 Close source \u2192 Write in own words \u2192 Check against original \u2192 Cite. Also: the 5-Word Rule.")

doc.add_heading('C1. Identify Bad vs. Good Paraphrasing (4 marks)', level=2)
add_para("Below is an original sentence from a published paper. Two student paraphrases are shown. For each, state whether it is a GOOD or BAD paraphrase and explain your reasoning.", after=4)

tip("Original Source", [
    ('"Vitamin D deficiency is highly prevalent among adults with prediabetes and has been independently associated with increased risk of progression to type 2 diabetes in prospective cohort studies (Al-Daghri, 2018)."', False, True, None, 10),
])
spacer(4)

add_rich([("Paraphrase A: ", True, False, DARK), ('"Vitamin D deficiency is very common in adults with prediabetes and has been independently linked to a higher risk of developing type 2 diabetes in cohort studies (Al-Daghri, 2018)."', False, False, None, 10)], after=2)
add_rich([("Verdict: _________   Reason: ", True, False, DARK), (blank(40), False, False, MED)], after=8)
add_rich([("Paraphrase B: ", True, False, DARK), ('"Prospective cohort data indicate that adults with prediabetes who are vitamin D deficient face a significantly elevated risk of diabetes progression (Al-Daghri, 2018)."', False, False, None, 10)], after=2)
add_rich([("Verdict: _________   Reason: ", True, False, DARK), (blank(40), False, False, MED)], after=8)

doc.add_heading('C2. Paraphrase a Paragraph (6 marks)', level=2)
add_para("Read the paragraph below, close the source, and rewrite it entirely in your own words while preserving the meaning. Then add the correct AMA citation.", after=4)

tip("Original Paragraph to Paraphrase", [
    ('"Vitamin D receptor (VDR) is expressed on human pancreatic beta cells, and its activation by 1,25-dihydroxyvitamin D has been shown to enhance insulin secretion in response to glucose stimulation. Furthermore, vitamin D modulates the expression of several genes involved in insulin sensitivity, including the insulin receptor and peroxisome proliferator-activated receptor gamma (PPAR\u03b3). These mechanisms provide a plausible biological basis for the glycaemic improvements observed in vitamin D supplementation trials (Maestro et al., 2003; Szymczak-Pajor & \u015aliwi\u0144ska, 2019)."', False, False, None, 10),
])

spacer(4)
add_para("Your paraphrase (write below):", bold=True, after=4)
for _ in range(8):
    add_rich([(blank(85), False, False, MED)], after=2)
add_rich([("AMA citation: ", True, False, DARK), (blank(50), False, False, MED)], after=4)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION D: BIAS-FREE LANGUAGE
# ══════════════════════════════════════════════════
doc.add_heading('Section D: Bias-Free Language', level=1)
add_para("Refer to Section 5 of the Lecture 8 notes. Apply person-first language, gender-neutral terms, and inclusive terminology.")

doc.add_heading('D1. Correct Biased Sentences (5 marks)', level=2)
add_para("Rewrite each sentence using bias-free language.", after=4)

biased = [
    "Diabetics were recruited from the endocrinology clinic.",
    "The doctor... he obtained informed consent from each subject.",
    "Elderly patients with prediabetes are at higher risk for progression to diabetes.",
    "Obese hypertensives were excluded from the study.",
    "The control group consisted of normal healthy individuals.",
]
for i, s in enumerate(biased, 1):
    add_rich([(f"{i}. ", True, False, DARK), (s, False, True, MED, 10)], after=2)
    add_rich([("Corrected: ", False, False, GREEN), (blank(65), False, False, MED)], after=6)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION E: AMA STYLE
# ══════════════════════════════════════════════════
doc.add_heading('Section E: AMA Style', level=1)
add_para("Refer to Section 6 of the Lecture 8 notes. Apply superscript citation rules, reference list format, number formatting, and drug name conventions.")

doc.add_heading('E1. Place Superscript Citations (5 marks)', level=2)
add_para("Insert AMA superscript citations in the correct position (AFTER punctuation). The references are numbered as follows:", after=4)

add_rich([("Ref 1: ", True), ("Pittas et al. (2019) \u2014 N Engl J Med", False)], after=2)
add_rich([("Ref 2: ", True), ("Niroomand et al. (2019) \u2014 Diabetes Res Clin Pract", False)], after=2)
add_rich([("Ref 3: ", True), ("Kuchay et al. (2015) \u2014 Indian J Endocrinol Metab", False)], after=2)
add_rich([("Ref 4: ", True), ("Mirhosseini et al. (2018) \u2014 J Endocr Soc", False)], after=2)

spacer(4)
add_para("Add superscript reference numbers to the following sentences. Place them AFTER the period or comma.", after=4)

citation_exercises = [
    '"Vitamin D supplementation significantly reduced HbA1c compared with placebo in a large multicentre trial."',
    '"The evidence for vitamin D\'s effect on glycaemic control remains mixed, with some trials showing benefit and others showing no effect. A recent meta-analysis, however, confirmed a significant overall reduction."',
    '"Mechanistic studies suggest that vitamin D enhances insulin secretion through VDR activation on pancreatic beta cells. This provides a strong biological rationale for intervention."',
    '"Few trials have specifically examined vitamin D supplementation in prediabetic adults with confirmed deficiency. The present study was designed to address this gap."',
    '"The reduction in HbA1c observed in our trial (mean difference \u22120.45%) is consistent with the effect reported in the D2d trial and the meta-analysis by Mirhosseini et al."',
]
for i, s in enumerate(citation_exercises, 1):
    add_rich([(f"{i}. ", True, False, DARK), (s, False, True, MED, 10)], after=2)
    add_rich([("With citations: ", False, False, GREEN), (blank(55), False, False, MED)], after=8)

doc.add_heading('E2. Format References in AMA Style (5 marks)', level=2)
add_para("Convert the following bibliographic details into proper AMA reference format. Use the format: Author(s). Title. Journal Abbreviation. Year;Volume(Issue):Pages. doi:XXX", after=4)

refs_to_format = [
    ["Reference A", "Authors: Pittas AG, Dawson-Hughes B, Sheehan P, et al. Title: Vitamin D supplementation and prevention of type 2 diabetes. Journal: New England Journal of Medicine. Year: 2019. Volume: 381. Issue: 6. Pages: 520-530. DOI: 10.1056/NEJMoa1900906"],
    ["Reference B", "Authors: Niroomand M, Fotouhi A, Iramejad N, Hosseinpanah F. Title: Does high-dose vitamin D supplementation affect insulin resistance and risk of type 2 diabetes? Journal: Diabetes Research and Clinical Practice. Year: 2019. Volume: 148. Pages: 1-9. DOI: 10.1016/j.diabres.2018.11.004"],
    ["Reference C", "Authors: Kuchay MS, Laway BA, Bashir MI, Wani AI, Misgar RA, Shah ZA. Title: Effect of vitamin D supplementation on glycemic parameters in subjects with prediabetes. Journal: Indian Journal of Endocrinology and Metabolism. Year: 2015. Volume: 19. Issue: 5. Pages: 696-699. DOI: 10.4103/2230-8210.163174"],
]
for label, info in refs_to_format:
    add_rich([(f"{label}: ", True, False, DARK), (info, False, False, None, 9)], after=2)
    add_rich([("AMA format: ", False, False, GREEN), (blank(60), False, False, MED)], after=10)

doc.add_heading('E3. Number Formatting Correction (4 marks)', level=2)
add_para("The following sentences contain number formatting errors per AMA style (Table 5). Correct each one.", after=4)

number_errors = [
    "23 patients completed the study; 7 withdrew consent.",
    "The p-value was .03, indicating statistical significance.",
    "The dose was 5 mg, titrated to 10 mg over 3 weeks.",
    "p < 0.05 was considered statistically significant (actual p = 0.003).",
]
for i, s in enumerate(number_errors, 1):
    add_rich([(f"{i}. ", True, False, DARK), (s, False, True, MED, 10)], after=2)
    add_rich([("Corrected: ", False, False, GREEN), (blank(60), False, False, MED)], after=6)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION F: AI HUMANIZATION
# ══════════════════════════════════════════════════
doc.add_heading('Section F: AI Detection & Humanization', level=1)
add_para("Refer to Section 7 of the Lecture 8 notes. Avoid AI-overused vocabulary, vary sentence length, and add specific details.")

doc.add_heading('F1. Identify AI Markers (4 marks)', level=2)
add_para("Read the AI-generated paragraph below. Circle/underline all AI markers you find: AI-overused vocabulary, boilerplate transitions, low burstiness (uniform sentence length), missing specifics.", after=4)

tip("AI-Generated Paragraph", [
    ('"Vitamin D is a crucial nutrient that plays a pivotal role in multifaceted physiological processes. It is worth noting that vitamin D deficiency is a prevalent concern among individuals with prediabetes. Furthermore, supplementation with vitamin D has the potential to improve glycaemic control through a myriad of mechanisms. Moreover, clinical trials have delved into the effect of vitamin D on diabetes risk. However, the results have been heterogeneous and nuanced. Additionally, further research is paramount to elucidate the precise role of this groundbreaking intervention. In conclusion, vitamin D supplementation represents a promising avenue for diabetes prevention."', False, False, None, 10),
])

add_rich([("List AI markers found: ", True), (blank(50), False, False, MED)], after=4)
spacer(6)
add_rich([("AI-overused vocabulary: ", True), (blank(50), False, False, MED)], after=4)
add_rich([("Low burstiness indicator: ", True), (blank(50), False, False, MED)], after=4)
add_rich([("Missing specifics: ", True), (blank(50), False, False, MED)], after=4)

doc.add_heading('F2. Humanize the Paragraph (6 marks)', level=2)
add_para("Rewrite the AI-generated paragraph from F1 as a human academic writer would write it. Requirements:", after=4)
add_bullet("Vary sentence length (some \u226415 words, some >30 words)", after=2)
add_bullet("Replace all AI-overused vocabulary with natural alternatives", after=2)
add_bullet("Add specific numbers and citations from the Vitamin D trial", after=2)
add_bullet("No 'delve', 'crucial', 'tapestry', 'paramount', 'myriad', 'groundbreaking', 'it is worth noting'", after=2)
add_bullet("Write in active voice", after=4)

for _ in range(8):
    add_rich([(blank(85), False, False, MED)], after=2)

doc.add_page_break()

# ══════════════════════════════════════════════════
# SECTION G: CHECKLISTS
# ══════════════════════════════════════════════════
doc.add_heading('Section G: Self-Evaluation Checklists', level=1)
add_para("Complete all four checklists based on your work above.")

doc.add_heading('G1. MEAL Plan Checklist', level=2)
meal_checks = [
    "Every paragraph starts with a clear topic sentence (M)?",
    "Every factual claim is supported by evidence with a citation (E)?",
    "Is there at least 1 sentence of YOUR analysis (A)?",
    "Does the paragraph end with a transition link (L)?",
    "Are transitions used within the paragraph for logical flow?",
]
for ck in meal_checks:
    add_bullet(ck + "  \u2610", after=3)

doc.add_heading('G2. Bias-Free Language Checklist', level=2)
bias_checks = [
    '"Patients with diabetes" NOT "diabetics"?',
    "Gender-neutral language used (singular they)?",
    'Age descriptors precise ("adults \u226565 years")?',
    "Race/ethnicity mentioned only when relevant?",
    '"Participants" or "patients" NOT "subjects"?',
]
for ck in bias_checks:
    add_bullet(ck + "  \u2610", after=3)

doc.add_heading('G3. AMA Style Checklist', level=2)
ama_checks = [
    "Superscript citations placed AFTER punctuation?",
    "References in JAMA format (authors, title, journal, year, vol, pages, DOI)?",
    "Generic drug names used (not brand names)?",
    "Abbreviations defined at first use?",
    "Numbers correct (<10 spelled, \u226510 digits, leading zero)?",
    "p-values exact (not 'p < 0.05' when p = 0.03)?",
]
for ck in ama_checks:
    add_bullet(ck + "  \u2610", after=3)

doc.add_heading('G4. AI Readability Checklist', level=2)
ai_checks = [
    'No "delve," "crucial," "tapestry," or "paramount"?',
    "Sentence length varies (not all 15\u201320 words)?",
    "Specific examples replace vague claims?",
    "First draft written by ME, AI only for refining?",
    "AI use disclosed if applicable?",
    "Reading aloud sounds natural, not robotic?",
]
for ck in ai_checks:
    add_bullet(ck + "  \u2610", after=3)

spacer(20)
sep()
add_para("End of Homework. Submit all sections.", italic=True, size=11, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER)

# ── Save ──
os.makedirs(os.path.dirname(OUT), exist_ok=True)
doc.save(OUT)
print(f"Created: {OUT} ({os.path.getsize(OUT)} bytes)")
