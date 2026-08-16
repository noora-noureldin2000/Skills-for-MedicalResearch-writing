const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

// ── Constants ──
const COLORS = {
  primary: "1F4E79",   // dark blue
  accent: "2E75B6",    // medium blue
  lightBg: "DEEAF6",   // very light blue
  grayBg: "F2F2F2",
  white: "FFFFFF",
  black: "000000",
  darkGray: "404040",
  medGray: "666666",
  warning: "C00000",
};

const FONT = "Arial";
const MARGIN = 1440; // 1 inch

// ── Helpers ──
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: FONT, size: 32, color: COLORS.primary })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, font: FONT, size: 28, color: COLORS.accent })],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, font: FONT, size: 24, color: COLORS.darkGray })],
  });
}

function para(text, opts = {}) {
  const runs = [];
  if (typeof text === "string") {
    runs.push(new TextRun({ text, font: FONT, size: 22, color: COLORS.black, ...opts }));
  } else if (Array.isArray(text)) {
    text.forEach(t => {
      if (typeof t === "string") {
        runs.push(new TextRun({ text: t, font: FONT, size: 22, color: COLORS.black }));
      } else {
        runs.push(new TextRun({ font: FONT, size: 22, color: COLORS.black, ...t }));
      }
    });
  }
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: runs,
    ...opts.paraOpts,
  });
}

function boldPara(text) {
  return para([{ text, bold: true }]);
}

function bulletItem(text, ref = "main-bullets") {
  const runs = [];
  if (Array.isArray(text)) {
    text.forEach(t => {
      if (typeof t === "string") {
        runs.push(new TextRun({ text: t, font: FONT, size: 22, color: COLORS.black }));
      } else {
        runs.push(new TextRun({ font: FONT, size: 22, color: COLORS.black, ...t }));
      }
    });
  } else {
    runs.push(new TextRun({ text, font: FONT, size: 22, color: COLORS.black }));
  }
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60, line: 276 },
    children: runs,
  });
}

function numberItem(text, ref = "num-list") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60, line: 276 },
    children: [new TextRun({ text, font: FONT, size: 22, color: COLORS.black })],
  });
}

function spacer(h = 120) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}

function tipBox(title, body) {
  const inner = [
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: title, bold: true, font: FONT, size: 22, color: COLORS.primary })],
    }),
    ...(Array.isArray(body) ? body : [
      new Paragraph({
        spacing: { after: 60, line: 276 },
        children: [new TextRun({ text: body, font: FONT, size: 22, color: COLORS.black })],
      })
    ]),
  ];
  const rows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: COLORS.lightBg, type: ShadingType.CLEAR },
          borders: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.accent },
                     bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.accent },
                     left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.accent },
                     right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.accent } },
          children: inner,
        }),
      ],
    }),
  ];
  return new Table({ rows, columnWidths: [9360] });
}

function separator() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "─".repeat(60), font: FONT, size: 18, color: COLORS.medGray })],
  });
}

// ── Numbering configs ──
const numberingConfig = [
  {
    reference: "main-bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
  },
  {
    reference: "num-list",
    levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
  },
  {
    reference: "sub-bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "◦",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }],
  },
];

// ── Document content ──
const children = [];

// ═══════════════════ TITLE PAGE ═══════════════════
children.push(new Paragraph({ spacing: { before: 3000 }, children: [] }));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "Research Intern's Guide", font: FONT, size: 56, bold: true, color: COLORS.primary })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [new TextRun({ text: "to Writing Medical Discussion Sections", font: FONT, size: 44, bold: true, color: COLORS.accent })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [new TextRun({ text: "A Comprehensive Training Manual", font: FONT, size: 28, color: COLORS.medGray, italics: true })],
}));
children.push(separator());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: "From evidence discovery to polished prose", font: FONT, size: 24, color: COLORS.darkGray })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: "Incorporating best practices from:", font: FONT, size: 22, color: COLORS.medGray })],
}));
const sources = [
  "PubMed / ScienceDirect / Google Scholar research-surfer workflow",
  "Dr. Kristin Sainani's clarity methodology (5-pass audit)",
  "Systematic review tools: CitationChaser, ASReview, Rayyan, CADIMA",
  "Harvard-style citation verification protocols",
  "34 real student discussion samples — common error analysis",
  "Automated pipeline: statistical routing → narrative generation",
];
sources.forEach(s => {
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: s, font: FONT, size: 20, color: COLORS.darkGray })],
  }));
});
children.push(new Paragraph({ spacing: { before: 600 }, children: [] }));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Version 2.0 — July 2026", font: FONT, size: 22, color: COLORS.medGray, italics: true })],
}));
children.push(new PageBreak());

// ═══════════════════ TABLE OF CONTENTS ═══════════════════
children.push(heading1("Table of Contents"));

const tocItems = [
  "1. The 5-Move Inverted Funnel — Your Core Framework",
  "2. Literature Search & Evidence Discovery",
  "3. Reading, Organising & Critically Appraising Evidence",
  "4. Writing the Discussion — Step-by-Step",
  "5. Editing & Polishing (The 5-Pass Audit System)",
  "6. Verification & Integrity — Zero Hallucination Policy",
  "7. From Statistics to Discussion — Understanding Your Data",
  "8. Common Pitfalls — Lessons from 34 Real Student Drafts",
  "Appendix A: Quick Reference — Boolean Search String Builder",
  "Appendix B: The 5-Pass Editing Checklist (Printable)",
  "Appendix C: Comparative Paragraph Template with Worked Example",
  "Appendix D: Recommended Tool Stack with Use Cases",
];
tocItems.forEach(item => {
  children.push(new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: item, font: FONT, size: 22, color: COLORS.primary })],
  }));
});
children.push(new PageBreak());

// ═══════════════════ SECTION 1: 5-MOVE INVERTED FUNNEL ═══════════════════
children.push(heading1("1. The 5-Move Inverted Funnel — Your Core Framework"));
children.push(para("Every strong medical Discussion follows an inverted funnel structure: start narrow (restate your key findings), widen out (compare with literature), then narrow again (limitations, implications, conclusion). This pattern is universal across journals and theses."));
children.push(spacer());

children.push(heading2("Move 1: Key Findings (Narrow)"));
children.push(para([{ text: "Purpose: ", bold: true }, { text: "Open with a concise restatement of your principal results. Answer the question: 'What did this study find?'" }]));
children.push(para("Do not repeat your entire Results section. Select 2–3 most important findings and state them in 2–4 sentences. Use past tense. Include effect sizes and confidence intervals."));
children.push(tipBox("Example (Vitamin D Trial)", [
  para("In the present study, vitamin D supplementation significantly reduced HbA1c levels in prediabetic adults compared with placebo (mean difference −0.45%, 95% CI −0.49 to −0.42, p < 0.001). This effect was accompanied by a significant improvement in fasting plasma glucose (mean difference −0.31 mmol/L, 95% CI −0.38 to −0.24, p < 0.001)."),
]));

children.push(heading2("Move 2: Comparison with Literature (Wide)"));
children.push(para([{ text: "Purpose: ", bold: true }, { text: "Situate your findings within the existing body of evidence. Compare and contrast with similar studies." }]));
children.push(para("This is the longest move. Organise by sub-topic (e.g., primary outcome, secondary outcomes, subgroups). Use the comparative paragraph template (Appendix C). Support each comparison with 2–4 studies. Alternate between supporting and contrasting evidence."));

children.push(heading2("Move 3: Mechanisms / Explanation"));
children.push(para([{ text: "Purpose: ", bold: true }, { text: "Explain possible biological or methodological reasons for your findings. Why might vitamin D improve glycaemic control?" }]));
children.push(para("Ground explanations in established science. Cite mechanistic studies (e.g., vitamin D receptor expression in pancreatic beta cells). Avoid speculation beyond what the evidence supports."));

children.push(heading2("Move 4: Limitations"));
children.push(para([{ text: "Purpose: ", bold: true }, { text: "Acknowledge methodological constraints honestly but constructively." }]));
children.push(para("Cover 4–6 limitations spanning: generalisability (single-centre, specific population), sample size/power, design constraints (open-label, short follow-up), measurement limitations, and potential confounding. Do not apologise — explain."));

children.push(heading2("Move 5: Conclusion & Implications (Narrow)"));
children.push(para([{ text: "Purpose: ", bold: true }, { text: "End with a clear, evidence-based take-home message. What do your findings mean for clinical practice, policy, or future research?" }]));
children.push(para("Restate the main finding in one sentence. Give 2–3 specific next-step recommendations. Do not overclaim. Avoid: 'Further research is needed' without specifying what kind."));
children.push(new PageBreak());

// ═══════════════════ SECTION 2: LITERATURE SEARCH ═══════════════════
children.push(heading1("2. Literature Search & Evidence Discovery"));
children.push(para("Finding the right studies to cite is the foundation of a credible Discussion. This section covers our multi-channel search strategy."));

children.push(heading2("2.1 The Omnichannel Approach"));
children.push(para("Always use a layered strategy — do not rely on a single database or search method:"));
children.push(bulletItem([{ text: "Layer 1 — API-First (Primary): ", bold: true }, { text: "Use PubMed API (via Biopython Entrez, Entrez Direct, or rentrez R package) or ScienceDirect API. APIs do not trigger CAPTCHA and return structured metadata." }]));
children.push(bulletItem([{ text: "Layer 2 — Browser Search (Secondary): ", bold: true }, { text: "Google Scholar for broad discovery, citation tracking, and grey literature. Use incognito/headful mode to avoid bot detection." }]));
children.push(bulletItem([{ text: "Layer 3 — Citation Chaining (Tertiary): ", bold: true }, { text: "Use CitationChaser (via Lens.org API) for backward/forward citation chasing. Paperfetcher for automated handsearching via Crossref/COCI." }]));
children.push(bulletItem([{ text: "Layer 4 — Specialised Registries: ", bold: true }, { text: "Cochrane Library for systematic reviews, ClinicalTrials.gov for ongoing/registered trials, WHO ICTRP for global trial registry." }]));

children.push(heading2("2.2 Building a Boolean Search Strategy"));
children.push(para("A well-constructed Boolean string saves hours. Follow this 5-step process:"));

children.push(numberItem("Define your PICOS framework: Population, Intervention, Comparator, Outcome, Study design."));
children.push(numberItem("Generate synonyms and MeSH terms for each block. Use litsearchr (R package) for automated term extraction from seed papers."));
children.push(numberItem("Combine blocks with AND. Within each block, combine synonyms with OR. Use parentheses to group."));
children.push(numberItem("Translate between database syntaxes using SRA Polyglot (converts PubMed format to Ovid, Embase, etc.)."));
children.push(numberItem("Validate your search using PubMed Search Tester — check precision/recall against known gold-standard papers."));

children.push(tipBox("Example Boolean String (PubMed)", [
  para([{ text: '("Vitamin D" OR "cholecalciferol" OR "25-hydroxyvitamin D") ', italics: true },
        { text: "AND ", bold: true, color: COLORS.accent },
        { text: '("prediabetic state"[MeSH] OR "prediabetes" OR "impaired glucose tolerance") ', italics: true },
        { text: "AND ", bold: true, color: COLORS.accent },
        { text: '("HbA1c" OR "glycated hemoglobin" OR "glycaemic control") ', italics: true },
        { text: "AND ", bold: true, color: COLORS.accent },
        { text: '("randomized controlled trial"[pt] OR "RCT")', italics: true }]),
]));

children.push(heading2("2.3 Recommended Search Tools"));
const searchTools = [
  ["CitationChaser", "Automated forward/backward citation chasing. Free Shiny app. Use to find papers that cite or are cited by your key references."],
  ["litsearchr (R)", "Text-mining to identify important search terms from seed papers. Generates optimised Boolean strings automatically."],
  ["OpenAlex", "Fully open scholarly catalog with API. Free alternative to Scopus/Web of Science for broad literature mapping."],
  ["SRA Polyglot", "Converts PubMed search syntax to Ovid, Embase, CINAHL, Web of Science. Essential for multi-database reviews."],
  ["PubMed Search Tester", "Real-time validation of PubMed queries. Check precision/recall before running full search."],
  ["ASReview", "AI-assisted screening: upload search results, train a model on your inclusion/exclusion decisions, and let it rank remaining papers by relevance."],
  ["Rayyan", "Web-based collaborative screening platform. Track inclusion decisions, export PRISMA flow diagrams, manage team reviews."],
  ["Abstrackr", "Free ML-assisted citation screening. Useful for rapid initial triage of large result sets."],
];
const searchTableRows = [
  new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ width: { size: 2340, type: WidthType.DXA }, shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary }, bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary }, left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary }, right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary } },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tool", bold: true, font: FONT, size: 20, color: COLORS.white })] })] }),
      new TableCell({ width: { size: 7020, type: WidthType.DXA }, shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary }, bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary }, left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary }, right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.primary } },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "What It Does & When to Use It", bold: true, font: FONT, size: 20, color: COLORS.white })] })] }),
    ],
  }),
];
searchTools.forEach((tool, i) => {
  const bg = i % 2 === 0 ? COLORS.white : COLORS.grayBg;
  searchTableRows.push(new TableRow({
    children: [
      new TableCell({ width: { size: 2340, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
        children: [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: tool[0], bold: true, font: FONT, size: 20, color: COLORS.primary })] })] }),
      new TableCell({ width: { size: 7020, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
        children: [new Paragraph({ spacing: { after: 60, line: 276 }, children: [new TextRun({ text: tool[1], font: FONT, size: 20, color: COLORS.black })] })] }),
    ],
  }));
});
children.push(new Table({ columnWidths: [2340, 7020], rows: searchTableRows }));
children.push(spacer());
children.push(new PageBreak());

// ═══════════════════ SECTION 3: READING & ORGANISING ═══════════════════
children.push(heading1("3. Reading, Organising & Critically Appraising Evidence"));
children.push(para("Before you write a single word of Discussion, you must know your evidence base inside out. This section covers how to read, extract, and organise what you find."));

children.push(heading2("3.1 Systematic Note-Taking"));
children.push(para("For each paper you read, create a structured note. Here is a template based on our concept-review framework:"));
const noteTemplate = [
  ["Reference:", "Full Harvard citation + DOI/PMID + URL"],
  ["Study design:", "RCT / cohort / case-control / cross-sectional / systematic review"],
  ["Population:", "N, key inclusion/exclusion criteria, demographics"],
  ["Intervention / exposure:", "Dose, duration, comparator"],
  ["Primary outcome:", "Result with effect size, CI, p-value"],
  ["Secondary outcomes:", "List with key numbers"],
  ["Key finding relevant to your study:", "1–2 sentences"],
  ["Strengths:", "Methodological quality notes"],
  ["Limitations:", "Bias, confounding, generalisability"],
];
noteTemplate.forEach(([label, content]) => {
  children.push(bulletItem([{ text: label + " ", bold: true }, { text: content }], "sub-bullets"));
});

children.push(heading2("3.2 Screening and Data Extraction Tools"));
children.push(para("For systematic literature searches, use specialised screening tools to manage large result sets efficiently:"));
children.push(bulletItem([{ text: "ASReview: ", bold: true }, { text: "AI-powered screening. Upload your .ris/.bib file, manually include/exclude the first 20–50 papers, then let the active-learning model rank remaining papers by relevance. Cuts screening time by 60–80%." }]));
children.push(bulletItem([{ text: "Rayyan: ", bold: true }, { text: "Web-based collaborative screening. Team members can independently label decisions (include/exclude/maybe), with blinding options. Exports directly to PRISMA flow diagram." }]));
children.push(bulletItem([{ text: "RobotReviewer: ", bold: true }, { text: "Automated risk-of-bias assessment for RCTs. Extracts data on randomisation, blinding, attrition, and selective reporting." }]));
children.push(bulletItem([{ text: "WebPlotDigitizer: ", bold: true }, { text: "Extract numerical data from figures when papers report results only as graphs. Critical for meta-analyses." }]));
children.push(bulletItem([{ text: "Taguette: ", bold: true }, { text: "Open-source qualitative coding tool. Tag recurring themes across papers (e.g., 'mechanism', 'adverse events', 'adherence')." }]));

children.push(heading2("3.3 Critical Appraisal — What to Look For"));
children.push(para("When reading a paper for Discussion comparison, ask these questions:"));
children.push(bulletItem("Is the study design appropriate for the question? (RCTs for efficacy, cohorts for prognosis, etc.)"));
children.push(bulletItem("Is the sample size adequate? Check for power calculations or wide confidence intervals."));
children.push(bulletItem("Are the population, intervention, and outcomes comparable to your study?"));
children.push(bulletItem("Are the findings internally consistent? Do numbers in tables match the text?"));
children.push(bulletItem("What are the key methodological differences that could explain agreement or discrepancy with your results?"));
children.push(new PageBreak());

// ═══════════════════ SECTION 4: WRITING ═══════════════════
children.push(heading1("4. Writing the Discussion — Step-by-Step"));
children.push(para("This section takes you from your organised evidence to a polished Discussion draft. Follow these steps in order."));

children.push(heading2("4.1 Step 1: Outline Before You Draft"));
children.push(para("Create a paragraph-level outline. For each paragraph, specify: (a) the move it belongs to, (b) 1–2 key studies you will cite, and (c) the takeaway point."));
children.push(bulletItem("Move 1 (Findings): 1 paragraph — HbA1c change, FPG change"));
children.push(bulletItem("Move 2 (Comparison): 3–4 paragraphs — primary outcome, secondary outcomes, subgroup analyses"));
children.push(bulletItem("Move 3 (Mechanisms): 1 paragraph — VDR expression, insulin secretion, inflammation"));
children.push(bulletItem("Move 4 (Limitations): 1 paragraph — 4–6 limitations"));
children.push(bulletItem("Move 5 (Conclusion): 1 paragraph — summary + recommendations"));

children.push(heading2("4.2 Step 2: Write Comparative Paragraphs (The Template)"));
children.push(para("This is the most important skill for Move 2. Every comparative paragraph follows this structure:"));
children.push(bulletItem([{ text: "Opening sentence: ", bold: true }, { text: '"In agreement with our findings..." or "In contrast to our findings..."' }]));
children.push(bulletItem([{ text: "Study identification: ", bold: true }, { text: "Author (Year), study design, population, key numerical result with exact statistics." }]));
children.push(bulletItem([{ text: "Explanation: ", bold: true }, { text: "One sentence explaining why findings agree or differ (comparable design, similar population, or methodological explanation for discrepancy)." }]));
children.push(bulletItem([{ text: "Length limit: ", bold: true }, { text: "≤ 75 words per study paragraph. Be concise and specific." }]));

children.push(tipBox("Example: Agreement", [
  para("In agreement with our findings, Pittas et al. (2019) demonstrated in the D2d trial that vitamin D supplementation at 4000 IU daily reduced the incidence of diabetes among 2423 prediabetic adults (HR 0.88, 95% CI 0.75–0.996), with a number needed to treat of 30 over a median follow-up of 2.5 years, supporting a protective effect in a comparable population."),
]));
children.push(spacer(60));
children.push(tipBox("Example: Contrast", [
  para("In contrast to our findings, Kuchay et al. (2015) reported no significant change in HbA1c following 60,000 IU weekly vitamin D for 12 weeks in 91 prediabetic Indian adults (p = 0.32), a discrepancy potentially attributable to their shorter intervention duration (12 vs. 52 weeks) and lower cumulative vitamin D dose."),
]));

children.push(heading2("4.3 Step 3: Discuss Mechanisms — Ground in Evidence"));
children.push(para("When explaining mechanisms, cite mechanistic studies — not speculation:"));
children.push(bulletItem("Vitamin D receptor (VDR) is expressed on pancreatic beta cells (Maestro et al., 2003)."));
children.push(bulletItem("1,25-dihydroxyvitamin D regulates insulin gene transcription via VDR response elements (Szymczak-Pajor & Sliwinska, 2019)."));
children.push(bulletItem("Vitamin D modulates systemic inflammation by suppressing NF-κB signalling (Wobke et al., 2014)."));

children.push(heading2("4.4 Step 4: Write Limitations — Be Precise"));
children.push(para("State limitations as complete sentences. Cover at least these domains:"));
children.push(numberItem("Generalisability: single-centre, specific population (prediabetic, vitamin D deficient)"));
children.push(numberItem("Sample size: adequate for primary outcome but limited for subgroup analyses"));
children.push(numberItem("Design: open-label (if applicable), no placebo run-in"));
children.push(numberItem("Measurement: HbA1c as surrogate endpoint (not diabetes incidence)"));
children.push(numberItem("Follow-up: 52 weeks — longer outcomes unknown"));

children.push(heading2("4.5 Step 5: Conclude — Specific, Not Generic"));
children.push(para("A strong Conclusion avoids vague calls for 'more research'. Instead:"));
children.push(bulletItem("State the primary finding in one sentence."));
children.push(bulletItem("Give 2–3 specific, actionable recommendations for clinical practice or future research."));
children.push(bulletItem("Recommend specific study designs, populations, or endpoints for future work."));

children.push(tipBox("Weak vs. Strong Conclusion", [
  para([{ text: "Weak: ", bold: true, color: COLORS.warning }, { text: '"Further research is needed to confirm these findings."' }]),
  para([{ text: "Strong: ", bold: true, color: "006600" }, { text: '"A multicentre RCT with longer follow-up (≥ 3 years) is warranted to determine whether the HbA1c improvement observed here translates into reduced diabetes incidence, particularly in populations with baseline vitamin D deficiency."' }]),
]));
children.push(new PageBreak());

// ═══════════════════ SECTION 5: EDITING & POLISHING ═══════════════════
children.push(heading1("5. Editing & Polishing (The 5-Pass Audit System)"));
children.push(para("This system, based on Dr. Kristin Sainani's 'Writing in the Sciences' methodology, ensures your Discussion is clear, precise, and professional. Apply these 5 passes sequentially."));

children.push(heading2("Pass 1: Clutter Extraction"));
children.push(para("Strip every sentence to its cleanest components. Flag and fix:"));
const clutterPairs = [
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
];
const clutterHeader = new TableRow({
  tableHeader: true,
  children: [
    new TableCell({ width: { size: 4680, type: WidthType.DXA }, shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Remove This", bold: true, font: FONT, size: 20, color: COLORS.white })] })] }),
    new TableCell({ width: { size: 4680, type: WidthType.DXA }, shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Replace With", bold: true, font: FONT, size: 20, color: COLORS.white })] })] }),
  ],
});
const clutterRows = [clutterHeader];
clutterPairs.forEach(([oldPhrase, newPhrase], i) => {
  const bg = i % 2 === 0 ? COLORS.white : COLORS.grayBg;
  clutterRows.push(new TableRow({
    children: [
      new TableCell({ width: { size: 4680, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
        children: [new Paragraph({ children: [new TextRun({ text: oldPhrase, font: FONT, size: 20, color: COLORS.warning, strike: true })] })] }),
      new TableCell({ width: { size: 4680, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR },
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
        children: [new Paragraph({ children: [new TextRun({ text: newPhrase, font: FONT, size: 20, color: "006600" })] })] }),
    ],
  }));
});
children.push(new Table({ columnWidths: [4680, 4680], rows: clutterRows }));
children.push(spacer());

children.push(heading2("Pass 2: Active Voice & Verb Vitality"));
children.push(para("Scientific transparency requires accountability. Identify who did what:"));
children.push(bulletItem([{ text: "Passive (weak): ", bold: true }, { text: '"HbA1c levels were significantly reduced by vitamin D supplementation."' }]));
children.push(bulletItem([{ text: "Active (strong): ", bold: true }, { text: '"Vitamin D supplementation significantly reduced HbA1c levels."' }]));
children.push(para("Exceptions: Use passive when the actor is genuinely unknown or irrelevant ('The sample was collected in 2019'), or when Methods section style requires it."));

children.push(heading2("Pass 3: Sentence Architecture"));
children.push(para([{ text: "Buried predicate audit: ", bold: true }, { text: "Count words between subject and main verb. If more than ~12, restructure." }]));
children.push(bulletItem([{ text: "Buried: ", bold: true }, { text: '"One study of 930 adults with prediabetes receiving care in two managed care settings found that..."' }]));
children.push(bulletItem([{ text: "Fixed: ", bold: true }, { text: '"One study found that, among 930 adults with prediabetes in managed care, ..."' }]));
children.push(para([{ text: "Sentence length variation: ", bold: true }, { text: "Mix short (≤15 words), medium (15–30), and long (30–50) sentences to create natural rhythm." }]));

children.push(heading2("Pass 4: Keyword Consistency"));
children.push(para([{ text: "The Banana Rule: ", bold: true }, { text: "Do not call a 'banana' an 'elongated yellow fruit' to avoid repetition. If your Methods say 'prediabetic adults', your Discussion must not switch to 'individuals with glucose dysregulation' — this confuses the reader." }]));
children.push(para("Extract all key terms from Methods and verify they appear unchanged in Discussion. Check: group names, variable names, abbreviations."));

children.push(heading2("Pass 5: Numerical & Citation Integrity"));
children.push(para("Final sanity check before submission:"));
children.push(bulletItem("Do the effect sizes in your Discussion match those in your Results section?"));
children.push(bulletItem("Are all cited statistics traceable to the original source (not a review that cites a review)?"));
children.push(bulletItem("Are significant figures consistent throughout? (If HbA1c is reported to 2 decimal places in Results, do the same in Discussion.)"));
children.push(new PageBreak());

// ═══════════════════ SECTION 6: VERIFICATION ═══════════════════
children.push(heading1("6. Verification & Integrity — Zero Hallucination Policy"));
children.push(para("This is the most important section in this guide. Every reference you cite must be real, accessible, and accurately represented. Fabricated or inaccurate citations damage your credibility and could lead to rejection or retraction."));

children.push(heading2("6.1 The Zero Hallucination Rule"));
children.push(para("Never invent or estimate: prevalence rates, effect sizes, p-values, cutoffs, outcomes, or any numerical value. If a statement cannot be directly verified, label it:"));
children.push(bulletItem("[Unverified] — if you cannot confirm a claim"));
children.push(bulletItem("[Inference] — if you are drawing a logical conclusion not stated in the source"));
children.push(bulletItem("[Speculation] — if you are hypothesising beyond the evidence"));

children.push(heading2("6.2 Open-Access Requirement"));
children.push(para("Use only open-access full-text articles you can actually access and verify. If full text cannot be verified, explicitly state: 'I cannot verify full-text access' and do not rely on that source."));

children.push(heading2("6.3 Verification Workflow"));
children.push(para("For every reference in your Discussion, perform these steps:"));
children.push(numberItem("Check DOI and PMID against PubMed/CrossRef. Confirm author names, journal, year, volume, pages."));
children.push(numberItem("Open the full text (PDF or HTML). Verify that the numbers you cite are actually present in the results/tables."));
children.push(numberItem("Check that the study population and design are genuinely comparable to your study."));
children.push(numberItem("Ensure the citation supports the specific claim you are making — not a tangential point."));
children.push(numberItem("Record the verification in your notes: 'Full text verified Yes/No' + direct link."));

children.push(tipBox("Pro Tip: The Telephone Game Audit", [
  para("Flag any statistic presented as established fact but cited only through secondary sources (reviews, textbooks). Trace it back to the primary source. Common trap: 'According to [Review, 2020], the prevalence is 15–62%...' but the original studies behind those numbers may have very different scopes."),
]));

children.push(heading2("6.4 Harvard Citation Requirements"));
children.push(para("All citations must follow Harvard style:"));
children.push(bulletItem("In-text: (Author, Year) — place after every sentence that draws from a source."));
children.push(bulletItem("Multiple sources: (Author1, Year; Author2, Year) — variety is essential."));
children.push(bulletItem("Reference list: Authors. (Year). Title. Journal. Volume(Issue), pages. DOI. Available at: URL (Accessed: Day Month Year)."));
children.push(bulletItem("Page numbers: Include if available, especially for direct quotes: (Author, Year, p. X). Never fabricate."));
children.push(new PageBreak());

// ═══════════════════ SECTION 7: STATISTICS TO DISCUSSION ═══════════════════
children.push(heading1("7. From Statistics to Discussion — Understanding Your Data"));
children.push(para("Your Discussion must interpret the numbers from your Results section. You cannot write a credible Discussion without understanding what your statistical output actually means."));

children.push(heading2("7.1 The Pipeline: Data → Test → Narrative"));
children.push(para("Our automated pipeline processes data through these stages, which mirror what you should do manually:"));
children.push(bulletItem([{ text: "Step 1 — Load & Clean: ", bold: true }, { text: "Import raw data. Handle missing values (listwise deletion, imputation). Classify variable types (continuous, categorical, binary)." }]));
children.push(bulletItem([{ text: "Step 2 — Assumption Gates: ", bold: true }, { text: "Test normality (Shapiro-Wilk). Test equal variance (Levene's). Test expected cell frequencies for categorical data (Fisher vs. chi-square). The test selection depends on these results." }]));
children.push(bulletItem([{ text: "Step 3 — Test Selection: ", bold: true }, { text: "Parametric (t-test, ANOVA, Pearson) if normal + equal variance. Non-parametric (Mann-Whitney, Kruskal-Wallis, Spearman) if violated. Categorical (chi-square, Fisher's exact) for proportions." }]));
children.push(bulletItem([{ text: "Step 4 — Effect Size Interpretation: ", bold: true }, { text: "Cohen's d (negligible < 0.2, small < 0.5, medium < 0.8, large ≥ 0.8). Eta-squared (small < 0.06, medium < 0.14, large ≥ 0.14). Odds ratio (small < 1.5, medium < 2.5, large ≥ 2.5)." }]));
children.push(bulletItem([{ text: "Step 5 — Narrative Generation: ", bold: true }, { text: "The pipeline writes an APA-style narrative. You must then interpret this narrative in the Discussion context." }]));

children.push(heading2("7.2 What to Discuss from Your Statistics"));
children.push(para("For each statistical result, your Discussion should address:"));
children.push(bulletItem([{ text: "Clinical significance: ", bold: true }, { text: "Is the effect size clinically meaningful? A statistically significant result (p < 0.05) may be clinically trivial—and vice versa." }]));
children.push(bulletItem([{ text: "Precision: ", bold: true }, { text: "Are the confidence intervals narrow (precise) or wide (imprecise)? Wide CIs suggest the estimate is unreliable." }]));
children.push(bulletItem([{ text: "Consistency: ", bold: true }, { text: "Do the results across different outcomes, subgroups, and sensitivity analyses tell a coherent story?" }]));
children.push(bulletItem([{ text: "Comparison: ", bold: true }, { text: "How does your effect size compare with those reported in similar studies? Is the magnitude of effect plausible given the intervention dose and duration?" }]));

children.push(tipBox("Worked Example — Interpreting HbA1c Results", [
  para([{ text: "Result: ", bold: true }, { text: "Mean difference −0.45% (95% CI −0.49 to −0.42), p < 0.001, Cohen's d = 0.72" }]),
  para([{ text: "Clinical significance: ", bold: true }, { text: "A −0.45% reduction in HbA1c among prediabetic adults (baseline mean 5.9%) is clinically relevant. The UKPDS demonstrated that each 1% reduction in HbA1c reduces microvascular risk by 37% (Stratton et al., 2000). Our reduction of approximately 0.5% would therefore reduce risk by ~18%." }]),
  para([{ text: "Precision: ", bold: true }, { text: "The 95% CI is narrow (−0.49 to −0.42), indicating high precision and adequate sample size." }]),
  para([{ text: "Effect size: ", bold: true }, { text: "Cohen's d = 0.72 represents a medium-to-large effect, suggesting the intervention has meaningful biological impact." }]),
]));
children.push(new PageBreak());

// ═══════════════════ SECTION 8: COMMON PITFALLS ═══════════════════
children.push(heading1("8. Common Pitfalls — Lessons from 34 Real Student Drafts"));
children.push(para("Analysis of real student Discussion drafts reveals recurring problems. Here are the most common issues and how to avoid them."));

children.push(heading2("Pitfall 1: The Background-Only Introduction"));
children.push(para([{ text: "Error: ", bold: true, color: COLORS.warning }, { text: "Opening the Discussion with 3–5 paragraphs of background information that belongs in the Introduction. The reader already knows this." }]));
children.push(para([{ text: "Fix: ", bold: true, color: "006600" }, { text: "Your Discussion should open with your findings (Move 1), not re-introduce the disease. One sentence of context maximum — then directly state your results." }]));

children.push(heading2("Pitfall 2: No Move Structure"));
children.push(para([{ text: "Error: ", bold: true, color: COLORS.warning }, { text: "A rambling narrative that jumps between findings, literature, limitations, and mechanisms without clear paragraph organisation." }]));
children.push(para([{ text: "Fix: ", bold: true, color: "006600" }, { text: "Use the 5-Move Inverted Funnel. Each paragraph should serve one clear purpose. Write a one-sentence topic sentence for each paragraph before you draft it." }]));

children.push(heading2("Pitfall 3: Weak Comparisons ('Agreeing without Evidence')"));
children.push(para([{ text: "Error: ", bold: true, color: COLORS.warning }, { text: '"Our findings are consistent with the literature" — without naming specific studies, statistics, or populations.' }]));
children.push(para([{ text: "Fix: ", bold: true, color: "006600" }, { text: "Every comparison must name the study, state the specific numerical finding, and explain why agreement or discrepancy exists. Use the comparative paragraph template (Appendix C)." }]));

children.push(heading2("Pitfall 4: Tense Confusion"));
children.push(para([{ text: "Error: ", bold: true, color: COLORS.warning }, { text: "Mixing past and present tense inconsistently within the same paragraph." }]));
children.push(para([{ text: "Rule: ", bold: true, color: "006600" }, { text: "Your study findings → past tense (showed, demonstrated, revealed). Established knowledge → present tense (vitamin D is known to, the VDR receptor mediates). Your conclusions → present or modal (these findings suggest, our results indicate)." }]));

children.push(heading2("Pitfall 5: Overcitation Without Synthesis"));
children.push(para([{ text: "Error: ", bold: true, color: COLORS.warning }, { text: "Stringing together 5–10 citations in one sentence without explaining how each one relates to your findings." }]));
children.push(para([{ text: "Fix: ", bold: true, color: "006600" }, { text: "Each citation must be accompanied by a specific point of comparison. Group studies by whether they support or contrast your findings. For related studies, synthesise: 'Three trials have consistently shown... (A, B, C), while two others found no effect (D, E), possibly due to shorter follow-up durations.'" }]));

children.push(heading2("Pitfall 6: Overclaiming in the Conclusion"));
children.push(para([{ text: "Error: ", bold: true, color: COLORS.warning }, { text: '"Vitamin D supplementation prevents diabetes." From a single RCT with HbA1c as a surrogate endpoint.' }]));
children.push(para([{ text: "Fix: ", bold: true, color: "006600" }, { text: "Match your claims to your evidence. Use hedging appropriately: 'may reduce', 'suggests a potential benefit', 'warrants further investigation'. Let the evidence speak — do not exaggerate." }]));

children.push(tipBox("Summary: Before Submitting, Ask Yourself", [
  para([{ text: "✓ ", bold: true, color: "006600" }, { text: "Does my opening sentence state my key finding (not background)?" }]),
  para([{ text: "✓ ", bold: true, color: "006600" }, { text: "Does each Move have at least one dedicated paragraph?" }]),
  para([{ text: "✓ ", bold: true, color: "006600" }, { text: "Are all cited studies named and compared specifically?" }]),
  para([{ text: "✓ ", bold: true, color: "006600" }, { text: "Are all references verified (full-text check)?" }]),
  para([{ text: "✓ ", bold: true, color: "006600" }, { text: "Is tense usage consistent?" }]),
  para([{ text: "✓ ", bold: true, color: "006600" }, { text: "Are my conclusions proportional to my evidence?" }]),
]));
children.push(new PageBreak());

// ═══════════════════ APPENDIX A ═══════════════════
children.push(heading1("Appendix A: Quick Reference — Boolean Search String Builder"));
children.push(para("Use this template to build your own Boolean search strings for PubMed."));
children.push(spacer());

children.push(boldPara("Template"));
children.push(para('( "[Population terms]" OR "synonym 1" OR "synonym 2" )'));
children.push(para('AND ( "[Intervention terms]" OR "synonym 1" OR "abbreviation" )'));
children.push(para('AND ( "[Comparator terms]" OR "control" OR "standard care" )'));
children.push(para('AND ( "[Outcome terms]" OR "synonym 1" )'));
children.push(para('AND ( "[Study design filter]" OR "RCT" OR "clinical trial" )'));
children.push(spacer());

children.push(boldPara("Filters to Add"));
children.push(bulletItem("Date range: AND (\"2020\"[Date - Publication] : \"3000\"[Date - Publication])"));
children.push(bulletItem("Humans: AND (\"humans\"[MeSH Terms])"));
children.push(bulletItem("English: AND (\"english\"[Language])"));
children.push(bulletItem("Full text: AND (\"free full text\"[Filter] OR \"full text\"[Filter])"));
children.push(spacer());

children.push(boldPara("Database Translation Tools"));
children.push(para("Use SRA Polyglot (https://iebh.github.io/sra-polyglot/) to convert your PubMed string to: Ovid MEDLINE, Embase, CINAHL, Web of Science, Scopus, Cochrane Library. Paste the PubMed string and select the target database."));
children.push(new PageBreak());

// ═══════════════════ APPENDIX B ═══════════════════
children.push(heading1("Appendix B: The 5-Pass Editing Checklist (Printable)"));
children.push(para("Print this page or keep it open while editing your Discussion draft."));
children.push(spacer());

const checkItems = [
  ["Pass 1: Clutter", [
    "Flag and replace dead-weight phrases (see table in Section 5)",
    "Delete unnecessary introductory phrases ('It is worth noting that...')",
    "Remove redundant adjectives ('completely eliminate' → 'eliminate')",
  ]],
  ["Pass 2: Voice & Verbs", [
    "Convert passive → active where actor is known",
    "Fix nominalisations ('provides a review of' → 'reviews')",
    "Accept passive only in Methods or where actor is irrelevant",
  ]],
  ["Pass 3: Sentences", [
    "Buried predicate check: ≤12 words between subject and verb",
    "Vary sentence length: short, medium, long",
    "Use colons for lists, dashes for emphasis, semicolons for linked clauses",
  ]],
  ["Pass 4: Terminology", [
    "Key terms from Methods appear unchanged in Discussion (Banana Rule)",
    "No synonym substitution for defined terms",
    "Every acronym defined at first use in text AND each table/figure",
  ]],
  ["Pass 5: Numbers & Citations", [
    "All effect sizes match Results section exactly",
    "All citations verified against primary source (telephone game check)",
    "Significant figures consistent",
  ]],
];

checkItems.forEach(([title, items]) => {
  children.push(heading3(title));
  items.forEach(item => {
    children.push(new Paragraph({
      spacing: { after: 60, line: 276 },
      indent: { left: 720 },
      children: [new TextRun({ text: "☐  ", font: FONT, size: 22, color: COLORS.medGray }),
                 new TextRun({ text: item, font: FONT, size: 22, color: COLORS.black })],
    }));
  });
  children.push(spacer(80));
});
children.push(new PageBreak());

// ═══════════════════ APPENDIX C ═══════════════════
children.push(heading1("Appendix C: Comparative Paragraph Template with Worked Example"));
children.push(spacer());

children.push(boldPara("Template Structure (≤ 75 words per study paragraph):"));
children.push(spacer());
children.push(para([{ text: "[In agreement with / In contrast to] our findings, ", italics: true },
                    { text: "Author (Year) " },
                    { text: "[study design] comparing [intervention vs. comparator] in [N] [population] has reported "
                           + "[key outcome: numerical result with effect size, CI, p-value], ", italics: true },
                    { text: "demonstrating [alignment/discrepancy] potentially due to [methodological explanation]." }]));
children.push(spacer());

children.push(boldPara("Worked Example: Comparing HbA1c Findings"));
children.push(spacer());

children.push(tipBox("Supporting Study (Agreement)", [
  para("In agreement with our findings, Niroomand et al. (2019) demonstrated in a double-blind RCT of 94 prediabetic adults receiving 50,000 IU vitamin D weekly that HbA1c was significantly reduced compared with placebo (mean difference −0.29%, 95% CI −0.48 to −0.11, p = 0.003), supporting a consistent effect across Middle Eastern populations with comparable baseline vitamin D status."),
]));
children.push(spacer(60));
children.push(tipBox("Contrasting Study (Discrepancy)", [
  para("In contrast to our findings, Kuchay et al. (2015) found no significant change in HbA1c following 60,000 IU weekly vitamin D for 12 weeks in 91 prediabetic Indian adults (mean change −0.07%, p = 0.32), a discrepancy potentially attributable to their shorter intervention duration (12 vs. 52 weeks) and lower cumulative dose."),
]));
children.push(new PageBreak());

// ═══════════════════ APPENDIX D ═══════════════════
children.push(heading1("Appendix D: Recommended Tool Stack with Use Cases"));
children.push(para("Organised by workflow stage. Start here when building your own evidence-synthesis toolkit."));
children.push(spacer());

const toolStack = [
  ["Literature Search", "PubMed (via Entrez Direct or Biopython)", "Primary biomedical search — always API-first"],
  ["Literature Search", "OpenAlex", "Broader scholarly discovery across all disciplines"],
  ["Literature Search", "CitationChaser", "Forward/backward citation chasing from 1–2 seed papers"],
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
  ["Writing", "Pandoc", "Convert between document formats (MD → DOCX for draft output)"],
  ["Integrity", "statcheck (R)", "Verify reported p-values match test statistics and dfs"],
];

const stackHeader = new TableRow({
  tableHeader: true,
  children: [
    new TableCell({ width: { size: 2160, type: WidthType.DXA },
      shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Stage", bold: true, font: FONT, size: 18, color: COLORS.white })] })] }),
    new TableCell({ width: { size: 3240, type: WidthType.DXA },
      shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tool", bold: true, font: FONT, size: 18, color: COLORS.white })] })] }),
    new TableCell({ width: { size: 3960, type: WidthType.DXA },
      shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Primary Use Case", bold: true, font: FONT, size: 18, color: COLORS.white })] })] }),
  ],
});
const stackRows = [stackHeader];
toolStack.forEach(([stage, tool, use], i) => {
  const bg = i % 2 === 0 ? COLORS.white : COLORS.grayBg;
  const borderProps = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: borderProps, bottom: borderProps, left: borderProps, right: borderProps };
  stackRows.push(new TableRow({
    children: [
      new TableCell({ width: { size: 2160, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR }, borders,
        children: [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: stage, font: FONT, size: 18, color: COLORS.primary })] })] }),
      new TableCell({ width: { size: 3240, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR }, borders,
        children: [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: tool, bold: true, font: FONT, size: 18, color: COLORS.black })] })] }),
      new TableCell({ width: { size: 3960, type: WidthType.DXA }, shading: { fill: bg, type: ShadingType.CLEAR }, borders,
        children: [new Paragraph({ spacing: { after: 40, line: 260 }, children: [new TextRun({ text: use, font: FONT, size: 18, color: COLORS.black })] })] }),
    ],
  }));
});
children.push(new Table({ columnWidths: [2160, 3240, 3960], rows: stackRows }));
children.push(spacer(200));

// Final note
children.push(separator());
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200 },
  children: [new TextRun({ text: "End of Guide. Good luck with your Discussion section!", font: FONT, size: 22, color: COLORS.medGray, italics: true })],
}));

// ── Build document ──
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: COLORS.primary, font: FONT },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: COLORS.primary, font: FONT },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: COLORS.accent, font: FONT },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: COLORS.darkGray, font: FONT },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: numberingConfig },
  sections: [{
    properties: {
      page: {
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        pageNumbers: { start: 1 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "Research Intern's Guide — Discussion Writing", font: FONT, size: 16, color: COLORS.medGray, italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Page ", font: FONT, size: 16, color: COLORS.medGray }),
                     new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: COLORS.medGray })],
        })],
      }),
    },
    children,
  }],
});

// ── Save ──
const outPath = "D:\\Academic Writing course\\Lecture 6 Supplementary\\discussion-tips.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Created: " + outPath);
});
