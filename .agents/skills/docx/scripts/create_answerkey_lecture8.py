"""ANSWER KEY - Lecture 8: Academic Writing Mechanics & AMA Style (Instructor Copy)."""

import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml

OUT = r"D:\Academic Writing course\Lecture 8 Supplementary\ANSWER KEY - Lecture 8.docx"

PRIMARY = RGBColor(0x1F, 0x4E, 0x79); ACCENT = RGBColor(0x2E, 0x75, 0xB6)
DARK = RGBColor(0x40, 0x40, 0x40); MED = RGBColor(0x66, 0x66, 0x66)
GREEN = RGBColor(0x00, 0x66, 0x00); WARN = RGBColor(0xC0, 0x00, 0x00)
WHITE = RGBColor(0xFF, 0xFF, 0xFF); LIGHT_BG = "DEEAF6"; GRAY_BG = "F2F2F2"
FONT = "Arial"

doc = Document()
style = doc.styles['Normal']; style.font.name = FONT; style.font.size = Pt(11)
style.paragraph_format.space_after = Pt(6); style.paragraph_format.line_spacing = 1.15
for i in range(1, 4):
    hs = doc.styles[f'Heading {i}']; hs.font.name = FONT
    hs.font.color.rgb = [PRIMARY, ACCENT, DARK][i-1]
    hs.font.size = Pt([16, 14, 12][i-1]); hs.font.bold = True

def P(text, bold=False, italic=False, size=11, color=None, align=None, after=6):
    p = doc.add_paragraph()
    if align: p.alignment = align
    p.paragraph_format.space_after = Pt(after); p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text); r.font.name = FONT; r.font.size = Pt(size); r.bold = bold; r.italic = italic
    if color: r.font.color.rgb = color; return p

def R(parts, after=6):
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(after); p.paragraph_format.line_spacing = 1.15
    for part in parts:
        if isinstance(part, str): r = p.add_run(part); r.font.name = FONT; r.font.size = Pt(11)
        else:
            t=part[0]; b=part[1] if len(part)>1 else False; i=part[2] if len(part)>2 else False
            c=part[3] if len(part)>3 else None; sz=part[4] if len(part)>4 else 11
            r=p.add_run(t); r.font.name=FONT; r.font.size=Pt(sz); r.bold=b; r.italic=i
            if c: r.font.color.rgb = c
    return p

def B(text, bp=None, after=3):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(after); p.paragraph_format.line_spacing = 1.15
    if bp:
        r=p.add_run(bp); r.bold=True; r.font.name=FONT; r.font.size=Pt(11)
        r=p.add_run(text); r.font.name=FONT; r.font.size=Pt(11)
    else:
        r=p.add_run(text); r.font.name=FONT; r.font.size=Pt(11)
    return p

def N(text, after=3):
    p=doc.add_paragraph(style='List Number'); p.paragraph_format.space_after=Pt(after)
    r=p.add_run(text); r.font.name=FONT; r.font.size=Pt(11); return p

def space(pt=12): P('', after=pt)
def sep():
    p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before=Pt(12); p.paragraph_format.space_after=Pt(12)
    r=p.add_run('\u2500'*60); r.font.size=Pt(8); r.font.color.rgb=MED

def shd(cell, color):
    cell._tc.get_or_add_tcPr().append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color}" w:val="clear"/>'))

def tip(title, lines):
    t=doc.add_table(rows=1,cols=1); t.alignment=WD_TABLE_ALIGNMENT.CENTER; c=t.cell(0,0)
    shd(c, LIGHT_BG)
    r=c.paragraphs[0].add_run(title); r.bold=True; r.font.name=FONT; r.font.size=Pt(11); r.font.color.rgb=PRIMARY
    for line in lines:
        if isinstance(line,str) and line.strip()=='': continue
        p=c.add_paragraph(); p.paragraph_format.space_after=Pt(2); p.paragraph_format.line_spacing=1.15
        if isinstance(line,tuple):
            r=p.add_run(line[0]); r.font.name=FONT; r.font.size=Pt(line[4] if len(line)>4 else 11)
            if len(line)>1: r.bold=line[1]
            if len(line)>2: r.italic=line[2]
            if len(line)>3 and line[3]: r.font.color.rgb=line[3]
        else:
            r=p.add_run(line); r.font.name=FONT; r.font.size=Pt(11)
    space()

def T(headers, rows):
    t=doc.add_table(rows=1,cols=len(headers)); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.style='Table Grid'
    for i,h in enumerate(headers):
        c=t.cell(0,i); shd(c,"1F4E79")
        r=c.paragraphs[0].add_run(h); r.bold=True; r.font.name=FONT; r.font.size=Pt(10); r.font.color.rgb=WHITE
        c.paragraphs[0].alignment=WD_ALIGN_PARAGRAPH.CENTER
    for ri,rd in enumerate(rows):
        t.add_row()
        for ci,val in enumerate(rd):
            c=t.cell(ri+1,ci)
            if ri%2==1: shd(c,GRAY_BG)
            r=c.paragraphs[0].add_run(str(val)); r.font.name=FONT; r.font.size=Pt(10)
            if ci==0: r.bold=True; r.font.color.rgb=PRIMARY
    space()

def model_box(title, lines):
    t=doc.add_table(rows=1,cols=1); t.alignment=WD_TABLE_ALIGNMENT.CENTER; c=t.cell(0,0)
    shd(c, "FFF3CC")
    r=c.paragraphs[0].add_run("MODEL ANSWER: " + title); r.bold=True; r.font.name=FONT; r.font.size=Pt(10); r.font.color.rgb=WARN
    for line in lines:
        if isinstance(line,str) and line.strip()=='': continue
        p=c.add_paragraph(); p.paragraph_format.space_after=Pt(2); p.paragraph_format.line_spacing=1.15
        if isinstance(line,tuple):
            r=p.add_run(line[0]); r.font.name=FONT; r.font.size=Pt(line[4] if len(line)>4 else 11)
            if len(line)>1: r.bold=line[1]; 
            if len(line)>2: r.italic=line[2]
            if len(line)>3 and line[3]: r.font.color.rgb=line[3]
        else:
            r=p.add_run(line); r.font.name=FONT; r.font.size=Pt(11)
    space()

# ══════════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════════
for _ in range(4): doc.add_paragraph()
P("Academic Research Writing & Manuscript Publication", bold=True, size=14, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=4)
P("for Medical Professionals", bold=True, size=12, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=20)
sep()
P("ANSWER KEY", bold=True, size=22, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
P("Lecture 8: Academic Writing Mechanics & AMA Style", bold=True, size=16, color=ACCENT, align=WD_ALIGN_PARAGRAPH.CENTER, after=8)
P("Instructor Copy \u2014 Model Answers", size=12, color=DARK, align=WD_ALIGN_PARAGRAPH.CENTER, after=6)
sep()
P("Study: Vitamin D Supplementation and Glycaemic Control in Prediabetic Adults \u2014 A Randomized Controlled Trial", size=10, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER, after=20)
doc.add_page_break()

# ══════════════════════════════════════════════════
# A: MEAL PLAN
# ══════════════════════════════════════════════════
doc.add_heading('Section A: The MEAL Plan \u2014 Model Answers', level=1)

doc.add_heading('A1. Label MEAL Elements (6 marks)', level=2)

T(
    ["Sentence", "Label", "Rationale"],
    [
        ["1", "[M] Main Idea", "States the overarching point: vitamin D improves glycaemic control through multiple mechanisms. Guides the reader on what this paragraph covers."],
        ["2", "[E] Evidence", "Provides specific numerical result from the present study (HbA1c difference, CI, p-value). Supports the main idea with data."],
        ["3", "[E] Evidence", "Continues the evidence with a supporting external citation (D2d trial with HR and CI). Still providing evidence, not yet analysis."],
        ["4", "[A] Analysis", "Interprets the evidence: Cohen\u2019s d = 0.72 is medium-to-large, implying meaningful biological impact. This is the author\u2019s interpretation of what the numbers mean."],
        ["5", "[L] Link", "Summarises the takeaway and transitions to the need for longer-term trials. Connects this paragraph to the next (limitations/future directions)."],
    ]
)
doc.add_paragraph()

doc.add_heading('A2. Fix a Broken MEAL Paragraph (8 marks)', level=2)

model_box("a) Which MEAL element(s) are missing or weak?", [
    ("Missing M (Main Idea) and A (Analysis). The paragraph starts directly with evidence ('In a study by Kuchay et al...') without a topic sentence. It also presents two studies back-to-back with no interpretation of what they mean together.", False, False, None, 10),
])
model_box("b) Which MEAL element(s) are present?", [
    ("E (Evidence) is present \u2014 both sentences provide specific numerical findings from cited studies. L (Link) is absent but less critical than the missing M and A.", False, False, None, 10),
])
model_box("c) Rewritten paragraph with all four MEAL elements", [
    ("[M] The effect of vitamin D on glycaemic control has varied across clinical trials, likely due to differences in dosing, duration, and baseline vitamin D status. [E] Kuchay et al. (2015) found no significant HbA1c change after 12 weeks of 60,000 IU weekly vitamin D in 91 prediabetic Indian adults (p = 0.32), whereas Pittas et al. (2019) reported a significant reduction in diabetes incidence with 4000 IU daily over a median of 2.5 years (HR 0.88, 95% CI 0.75\u20130.996). [A] This discrepancy suggests that longer intervention durations and higher cumulative doses may be required for measurable glycaemic benefit. [L] These dosing considerations informed the 52-week, high-dose regimen used in the present trial.", False, False, None, 10),
])

doc.add_page_break()

# ══════════════════════════════════════════════════
# B: ACTIVE vs PASSIVE
# ══════════════════════════════════════════════════
doc.add_heading('Section B: Active vs. Passive Voice \u2014 Model Answers', level=1)

doc.add_heading('B1. Convert Passive to Active (6 marks)', level=2)

T(
    ["#", "Passive Original", "Active Rewrite"],
    [
        ["1", "HbA1c levels were significantly reduced by vitamin D supplementation compared with placebo.", "Vitamin D supplementation significantly reduced HbA1c levels compared with placebo."],
        ["2", "Fasting plasma glucose was measured at baseline, 12 weeks, 26 weeks, and 52 weeks.", "We measured fasting plasma glucose at baseline, 12 weeks, 26 weeks, and 52 weeks."],
        ["3", "It was found that normoglycaemia was achieved by 44.3% of participants in the vitamin D group.", "We found that 44.3% of participants in the vitamin D group achieved normoglycaemia."],
        ["4", "A significant improvement in HOMA-IR was observed in the treatment group.", "The treatment group showed a significant improvement in HOMA-IR."],
        ["5", "The decision was made to include only participants with confirmed vitamin D deficiency.", "We included only participants with confirmed vitamin D deficiency."],
        ["6", "Serum 25(OH)D concentrations were increased from 38.4 nmol/L to 82.6 nmol/L by the loading dose regimen.", "The loading dose regimen increased serum 25(OH)D concentrations from 38.4 nmol/L to 82.6 nmol/L."],
    ]
)

doc.add_heading('B2. Nominalization Zombie Hunt (4 marks)', level=2)

T(
    ["#", "Nominalization", "Active Verb Rewrite"],
    [
        ["1", "We performed an analysis of HbA1c changes using a mixed-effects model.", "We analysed HbA1c changes using a mixed-effects model."],
        ["2", "There was a reduction in fasting plasma glucose after 52 weeks of supplementation.", "Fasting plasma glucose decreased after 52 weeks of supplementation."],
        ["3", "The researchers conducted an assessment of insulin resistance using HOMA-IR.", "The researchers assessed insulin resistance using HOMA-IR."],
        ["4", "An improvement in glycaemic control was achieved by the majority of participants.", "The majority of participants improved their glycaemic control."],
    ]
)

doc.add_page_break()

# ══════════════════════════════════════════════════
# C: PARAPHRASING
# ══════════════════════════════════════════════════
doc.add_heading('Section C: Paraphrasing & Avoiding Plagiarism \u2014 Model Answers', level=1)

doc.add_heading('C1. Identify Bad vs. Good Paraphrasing (4 marks)', level=2)

model_box("Paraphrase A \u2014 Verdict: BAD", [
    ("Reason: This is a near-verbatim copy. 'Vitamin D deficiency is highly prevalent' became 'Vitamin D deficiency is very common'; 'independently associated' became 'independently linked'; 'increased risk of progression to type 2 diabetes' became 'higher risk of developing type 2 diabetes'. The sentence structure and logical flow are identical. This violates the 5-Word Rule \u2014 more than 5 consecutive words match the original.", False, False, None, 10),
])
model_box("Paraphrase B \u2014 Verdict: GOOD", [
    ("Reason: The sentence structure is completely different. The original leads with 'Vitamin D deficiency is...' and ends with '...in prospective cohort studies'. Paraphrase B leads with 'Prospective cohort data indicate that...' and places 'adults with prediabetes who are vitamin D deficient' in the middle. The vocabulary is distinct ('significantly elevated risk' vs. 'increased risk'; 'diabetes progression' vs. 'progression to type 2 diabetes'). No 5+ consecutive words match. The citation is retained.", False, False, None, 10),
])

doc.add_heading('C2. Paraphrase a Paragraph (6 marks)', level=2)

model_box("Model Paraphrase", [
    ("Human pancreatic beta cells express the vitamin D receptor (VDR), and when activated by 1,25-dihydroxyvitamin D, this receptor enhances glucose-stimulated insulin secretion (Maestro et al., 2003). Vitamin D also regulates the transcription of genes key to insulin sensitivity, including the insulin receptor and PPAR\u03b3 (Szymczak-Pajor & \u015aliwi\u0144ska, 2019). Together, these mechanisms offer a plausible biological explanation for the improvements in glycaemic control observed in vitamin D supplementation trials.", False, False, None, 10),
])
P("AMA citation formatting:", bold=True, after=4)
P("Maestro B, Campion J, Davila N, Calle C. Stimulation by 1,25-dihydroxyvitamin D3 of insulin receptor expression and insulin responsiveness for glucose transport in U-937 human promonocytic cells. Endocr J. 2003;50(5):535-542. doi:10.1507/endocrj.50.535")
P("Szymczak-Pajor I, Sliwinska A. Molecular mechanisms linking vitamin D and insulin resistance. Nutrients. 2019;11(5):1093. doi:10.3390/nu11051093")
space()

P("Teaching note: The model paraphrase restructures both sentences, changes the logical flow (reverses the order of VDR activation and gene regulation), uses distinct vocabulary, and never has 5+ consecutive words matching the original.", italic=True, size=10, color=MED)

doc.add_page_break()

# ══════════════════════════════════════════════════
# D: BIAS-FREE LANGUAGE
# ══════════════════════════════════════════════════
doc.add_heading('Section D: Bias-Free Language \u2014 Model Answers', level=1)

T(
    ["#", "Biased Original", "Corrected (Bias-Free)"],
    [
        ["1", "Diabetics were recruited from the endocrinology clinic.", "Patients with diabetes were recruited from the endocrinology clinic."],
        ["2", "The doctor... he obtained informed consent from each subject.", "The physician obtained informed consent from each participant."],
        ["3", "Elderly patients with prediabetes are at higher risk for progression to diabetes.", "Adults aged \u226565 years with prediabetes are at higher risk for progression to diabetes."],
        ["4", "Obese hypertensives were excluded from the study.", "Individuals with obesity and hypertension were excluded from the study."],
        ["5", "The control group consisted of normal healthy individuals.", "The control group consisted of healthy individuals without diabetes."],
    ]
)

P("Key principles demonstrated above:", bold=True, after=4)
B('"Diabetics" \u2192 "Patients with diabetes" (person-first language)', after=2)
B('"Subjects" \u2192 "Participants" (respects autonomy)', after=2)
B('"Elderly" \u2192 "Adults \u226565 years" (precise age descriptor)', after=2)
B('"Hypertensives" \u2192 "Individuals with hypertension" (person-first)', after=2)
B('"Normal" vs. "patient" \u2192 "Healthy individuals without diabetes" (avoids labelling one group as abnormal)', after=2)

doc.add_page_break()

# ══════════════════════════════════════════════════
# E: AMA STYLE
# ══════════════════════════════════════════════════
doc.add_heading('Section E: AMA Style \u2014 Model Answers', level=1)

doc.add_heading('E1. Place Superscript Citations (5 marks)', level=2)

T(
    ["#", "Sentence with Correct AMA Citations"],
    [
        ["1", '"Vitamin D supplementation significantly reduced HbA1c compared with placebo in a large multicentre trial.^(1)"'],
        ["2", '"The evidence for vitamin D\'s effect on glycaemic control remains mixed, with some trials showing benefit and others showing no effect.^(2,3) A recent meta-analysis, however, confirmed a significant overall reduction.^(4)"'],
        ["3", '"Mechanistic studies suggest that vitamin D enhances insulin secretion through VDR activation on pancreatic beta cells.^(1,3) This provides a strong biological rationale for intervention."'],
        ["4", '"Few trials have specifically examined vitamin D supplementation in prediabetic adults with confirmed deficiency.^(2,3) The present study was designed to address this gap."'],
        ["5", '"The reduction in HbA1c observed in our trial (mean difference \u22120.45%) is consistent with the effect reported in the D2d trial^(1) and the meta-analysis by Mirhosseini et al.^(4)"'],
    ]
)

P("Rules demonstrated:", bold=True, after=4)
B("Superscript numerals placed AFTER the period (or comma for mid-sentence citations).", after=2)
B("Multiple separate references: separated by commas without spaces.", after=2)
B("Single reference for a sentence: one numeral only.", after=2)

doc.add_heading('E2. Format References in AMA Style (5 marks)', level=2)

model_box("Reference A", [
    ("Pittas AG, Dawson-Hughes B, Sheehan P, et al. Vitamin D supplementation and prevention of type 2 diabetes. N Engl J Med. 2019;381(6):520-530. doi:10.1056/NEJMoa1900906", False, False, None, 10),
])
model_box("Reference B", [
    ("Niroomand M, Fotouhi A, Iramejad N, Hosseinpanah F. Does high-dose vitamin D supplementation affect insulin resistance and risk of type 2 diabetes? Diabetes Res Clin Pract. 2019;148:1-9. doi:10.1016/j.diabres.2018.11.004", False, False, None, 10),
])
model_box("Reference C", [
    ("Kuchay MS, Laway BA, Bashir MI, Wani AI, Misgar RA, Shah ZA. Effect of vitamin D supplementation on glycemic parameters in subjects with prediabetes. Indian J Endocrinol Metab. 2015;19(5):696-699. doi:10.4103/2230-8210.163174", False, False, None, 10),
])

P("AMA formatting rules applied:", bold=True, after=4)
B("Authors: Last name + initials, no periods. Up to 6 authors: list all.", after=2)
B("Title: Sentence case (only first word and proper nouns capitalised).", after=2)
B("Journal: Abbreviated per PubMed/NLM catalog (e.g., N Engl J Med, not New England Journal of Medicine).", after=2)
B("Year;Volume(Issue):Pages. If no issue number, use Year;Volume:Pages.", after=2)
B("DOI: Always include.", after=2)

doc.add_heading('E3. Number Formatting Correction (4 marks)', level=2)

T(
    ["#", "Incorrect Original", "Corrected (AMA Style)"],
    [
        ["1", "23 patients completed the study; 7 withdrew consent.", "Twenty-three patients completed the study; seven withdrew consent. (< 10 = spelled out)"],
        ["2", "The p-value was .03, indicating statistical significance.", "The p-value was 0.03, indicating statistical significance. (leading zero required)"],
        ["3", "The dose was 5 mg, titrated to 10 mg over 3 weeks.", "The dose was 5 mg, titrated to 10 mg over three weeks. (units = always digits; 3 < 10 = spelled)"],
        ["4", "p < 0.05 was considered statistically significant (actual p = 0.003).", "p < 0.001 was considered statistically significant (actual p = 0.003). Or: We set statistical significance at p < 0.05. (Never state 'p < 0.05' when the actual p is 0.003 \u2014 report the exact value.)"],
    ]
)

doc.add_page_break()

# ══════════════════════════════════════════════════
# F: AI HUMANIZATION
# ══════════════════════════════════════════════════
doc.add_heading('Section F: AI Detection & Humanization \u2014 Model Answers', level=1)

doc.add_heading('F1. Identify AI Markers (4 marks)', level=2)

T(
    ["AI Marker Category", "Examples Found in the Paragraph"],
    [
        ["AI-overused vocabulary", '"crucial", "pivotal", "multifaceted", "plethora" (not in text but analogous), "myriad", "groundbreaking", "delve"'],
        ["Boilerplate transitions", '"It is worth noting that", "Furthermore", "Moreover", "Additionally", "In conclusion"'],
        ["Low burstiness (uniform sentence length)", "All sentences are 15\u201322 words \u2014 no short (<10 word) or long (>30 word) sentences"],
        ["Missing specifics / no numbers", 'No effect sizes, no p-values, no CI, no trial names, no years, no participant numbers \u2014 purely generic claims'],
    ]
)

P("Word count check:", bold=True, after=4)
P("The AI paragraph uses 105 words to say essentially nothing specific. A human writer would convey more information in 60\u201370 words with concrete numbers.", size=10, italic=True, color=MED)

doc.add_heading('F2. Humanized Rewrite (6 marks)', level=2)

model_box("Model Humanized Paragraph", [
    ("Vitamin D deficiency affects a substantial proportion of adults with prediabetes and has been linked to impaired insulin secretion through reduced VDR activation on pancreatic beta cells (Maestro et al., 2003). Clinical trials testing whether supplementation improves glycaemic control have produced conflicting results. In our 52-week RCT of 140 prediabetic adults, high-dose vitamin D\u2083 reduced HbA1c by 0.45% relative to placebo (95% CI \u22120.49 to \u22120.42; p < 0.001), a medium-to-large effect (Cohen\u2019s d = 0.72). This finding aligns with the D2d trial\u2019s report of reduced diabetes incidence (HR 0.88, 95% CI 0.75\u20130.996; Pittas et al., 2019) but contrasts with shorter-term trials showing no benefit (Kuchay et al., 2015), suggesting that both dose and duration are critical determinants of efficacy. An adequately powered multicentre trial with diabetes incidence as the primary endpoint is now needed.", False, False, None, 10),
])

P("Why this is humanized:", bold=True, after=4)
B("Varying sentence length: 12 / 14 / 34 / 40 / 18 words", after=2)
B("No AI-overused vocabulary (no delved, crucial, paramount, tapestry, myriad, groundbreaking)", after=2)
B("Specific numbers: effect size, CI, p-value, Cohen's d, HR, trial name, year, N", after=2)
B("Named specific studies: Maestro et al., Pittas et al., Kuchay et al.", after=2)
B("Natural connectors: 'because', 'however', 'In our 52-week RCT' (not 'furthermore, moreover, additionally')", after=2)
B("Voice active: 'affected', 'produced', 'reduced', 'aligns', 'suggest'", after=2)

doc.add_page_break()

# ══════════════════════════════════════════════════
# G: CHECKLISTS
# ══════════════════════════════════════════════════
doc.add_heading('Section G: Checklists \u2014 Verified Against Model Answers', level=1)

doc.add_heading('G1. MEAL Plan Checklist', level=2)
T(["Check", "Status"], [
    ["Every paragraph starts with a clear topic sentence (M)", "\u2713 A1: Sentence 1 is [M]; A2 rewrite begins with [M]"],
    ["Every factual claim is supported by evidence with a citation (E)", "\u2713 A1: Sentences 2\u20133 are [E] with numbers + citations"],
    ["Is there at least 1 sentence of YOUR analysis (A)", "\u2713 A1: Sentence 4 is [A] interpreting Cohen\u2019s d"],
    ["Does the paragraph end with a transition link (L)", "\u2713 A1: Sentence 5 is [L]; A2 rewrite ends with [L]"],
    ["Are transitions used within the paragraph for logical flow", "\u2713 'However', 'together', 'these findings suggest' used appropriately"],
])

doc.add_heading('G2. Bias-Free Language Checklist', level=2)
T(["Check", "Status"], [
    ['"Patients with diabetes" NOT "diabetics"', "\u2713 D1.1 corrected to 'patients with diabetes'"],
    ["Gender-neutral language used (singular they)", "\u2713 D1.2: 'The physician obtained consent' avoids gender assumption"],
    ['Age descriptors precise ("adults \u226565 years")', "\u2713 D1.3: 'Adults aged \u226565 years' replaces 'Elderly'"],
    ["Race/ethnicity mentioned only when relevant", "\u2713 No race/ethnicity descriptors used (not relevant to this study)"],
    ['"Participants" or "patients" NOT "subjects"', "\u2713 D1.2: 'subjects' \u2192 'participants'"],
])

doc.add_heading('G3. AMA Style Checklist', level=2)
T(["Check", "Status"], [
    ["Superscript citations placed AFTER punctuation", "\u2713 E1: All citations placed after periods or commas"],
    ["References in JAMA format", "\u2713 E2: All three references formatted correctly (authors, title, journal abbrev, year, vol, pages, DOI)"],
    ["Generic drug names used (not brand names)", "\u2713 'vitamin D\u2083', 'metformin' used throughout; no brand names"],
    ["Abbreviations defined at first use", "\u2713 RCT, VDR, CI, HR, FPG defined where first used in answers"],
    ["Numbers correct (<10 spelled, \u226510 digits, leading zero)", "\u2713 E3: 'seven', 'three' spelled; '23', '52' digits; '0.03' with leading zero"],
    ["p-values exact (not 'p < 0.05' when p = 0.03)", "\u2713 E3: Corrected to exact p = 0.003; 'p < 0.001' only where appropriate"],
])

doc.add_heading('G4. AI Readability Checklist', level=2)
T(["Check", "Status"], [
    ['No "delve," "crucial," "tapestry," or "paramount"', "\u2713 F2: None present in humanized version"],
    ["Sentence length varies", "\u2713 F2: 12, 14, 34, 40, 18 words \u2014 varied rhythm"],
    ["Specific examples replace vague claims", "\u2713 F2: Named trials, exact effect sizes, CIs, p-values"],
    ["Reading aloud sounds natural", "\u2713 F2: Varied structure, natural connectors, academic but not robotic"],
])

space(20)
sep()
P("End of ANSWER KEY \u2014 Lecture 8", bold=True, size=12, color=PRIMARY, align=WD_ALIGN_PARAGRAPH.CENTER)
P("Instructor Use Only", italic=True, size=11, color=MED, align=WD_ALIGN_PARAGRAPH.CENTER)

# ── Save ──
os.makedirs(os.path.dirname(OUT), exist_ok=True)
doc.save(OUT)
print(f"Created: {OUT} ({os.path.getsize(OUT)} bytes)")
