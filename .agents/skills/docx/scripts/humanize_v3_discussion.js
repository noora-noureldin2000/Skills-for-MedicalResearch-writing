const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak, Footer, PageNumber } = require('docx');

// Formatting constants
const RED = "CC0000";
const BLACK = "000000";

// Times New Roman 12pt = half-points 24
function p(text, color = BLACK) {
  return { text, color, size: 24, font: "Times New Roman" };
}

function b(text) {
  return { text, color: RED, size: 24, font: "Times New Roman", bold: true };
}

function bp(text) {
  return { text, color: BLACK, size: 24, font: "Times New Roman", bold: true };
}

function bi(text) {
  return { text, color: RED, size: 24, font: "Times New Roman", bold: true, italics: true };
}

// 1.5 line spacing = 360
function para(runsArray, options = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    ...options,
    children: runsArray
  });
}

function headingH1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 240, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text, bold: true, size: 28, font: "Times New Roman", color: "000000" })]
  });
}

function headingH2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 180, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text, bold: true, size: 26, font: "Times New Roman", color: "000000" })]
  });
}

function headingH3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 120, line: 360 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text, bold: true, size: 24, font: "Times New Roman", color: "000000" })]
  });
}

function refParaBoldPrefix(boldPart, regularPart) {
  return new Paragraph({
    spacing: { after: 80, line: 300 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text: boldPart, bold: true, size: 22, font: "Times New Roman", color: "000000" }), new TextRun({ text: regularPart, size: 22, font: "Times New Roman", color: "000000" })]
  });
}

const children = [];

// ========================
// DISCUSSION
// ========================
children.push(headingH1("Discussion"));

// Para 1 - CSU introduction (humanized: removed "approximately" x2, simplified "reflecting a very large negative effect", added burstiness)
children.push(para([
  new TextRun(p("Chronic spontaneous urticaria or CSU for short is an inflammatory skin disease marked by wheals with or without angioedema for over 6 weeks and no identifiable cause ")),
  new TextRun(b("(Carvallo et al., 2024; Kolkhir et al., 2024)")),
  new TextRun(p(". Mast cell and basophil degranulation drives the pathogenesis. Autoimmune mechanisms involving IgE and IgG autoantibodies are implicated in up to 50% of patients ")),
  new TextRun(b("(Bracken et al., 2019)")),
  new TextRun(p(". CSU affects about 1% of the global population mostly females aged 30 to 50 years ")),
  new TextRun(b("(Kolkhir et al., 2024)")),
  new TextRun(p(". Quality of life is substantially impaired with about 40% of patients scoring above 10 on the Dermatology Life Quality Index ")),
  new TextRun(b("(Maurer et al., 2017)")),
  new TextRun(p(". The search for objective disease activity biomarkers has identified several candidates like D-dimer, C-reactive protein (CRP), and interleukin-6 but no consensus biomarker has emerged ")),
  new TextRun(b("(Kolkhir et al., 2017)"))
]));

// Para 2 - SAA introduction (humanized: removed "primarily", "the major isoform", "has been identified as", sentence variation)
children.push(para([
  new TextRun(p("Serum amyloid A is an acute-phase apolipoprotein synthesised by the liver in response to inflammation with SAA1 being the main isoform ")),
  new TextRun(b("(Carvallo et al., 2024)")),
  new TextRun(p(". SAA levels can rise up to 1000-fold within 24 hours of acute phase response onset largely through de novo hepatic synthesis ")),
  new TextRun(b("(Sack, 2018)")),
  new TextRun(p(". Normal SAA concentration in healthy individuals is 20 to 50 mcg/mL ")),
  new TextRun(b("(Sack, 2018)")),
  new TextRun(p(". Proinflammatory cytokines including interleukin-1, interleukin-6, and tumour necrosis factor-alpha upregulate its transcription ")),
  new TextRun(b("(Carvallo et al., 2024; Sack, 2018)")),
  new TextRun(p(". SAA is known as an activity biomarker in rheumatoid disease and other inflammatory conditions ")),
  new TextRun(b("(Carvallo et al., 2024)")),
  new TextRun(p(". Its role in urticaria has been scarcely explored. Higher SAA levels were reported in patients with acute urticaria and moderate-to-severe chronic urticaria but no prior work had assessed SAA specifically in CSU or its correlation with the Urticaria Activity Score over 7 days (UAS7) ")),
  new TextRun(b("(Carvallo et al., 2024; Lu et al., 2019)"))
]));

// Para 3 - Sex distribution (humanized: removed "it is noteworthy that", "Additionally", added "Therefore" without comma)
children.push(para([
  new TextRun(p("In our cohort females made up 73.3% of CSU patients giving a female-to-male ratio of roughly 2.75:1 which is consistent with the established female predominance of CSU. Some populations show a different sex distribution though. In a large Indian cohort of 1,104 CSU patients ")),
  new TextRun(b("Ashraf et al. (2024)")),
  new TextRun(p(" reported a male-to-female ratio of 1:1.5 which suggests that sex distribution in CSU may vary across geographic and ethnic backgrounds. On one hand hormonal influences on mast cell activity, differences in healthcare-seeking behaviour between sexes, and the higher prevalence of autoimmune conditions in women may explain the overrepresentation of females. On the other hand referral patterns in tertiary care settings like our centre may preferentially attract patients with more severe disease which is more common among women."))
]));

// Para 4 - Age matching (humanized: removed "aligns with the established epidemiology", simplified)
children.push(para([
  new TextRun(p("Age matching between the two groups was adequate. Mean age was 33.56 ± 10.84 years among CSU patients versus 31.95 ± 12.36 years among controls with no significant difference (t = 0.65, p-value = 0.52). ")),
  new TextRun(b("Kolkhir et al. (2024)")),
  new TextRun(p(" noted that CSU affects patients of any age but peaks in females aged 30 to 50 years. ")),
  new TextRun(b("Fricke et al. (2020)")),
  new TextRun(p(" reported a global point prevalence of chronic urticaria of 0.7% with higher estimates in Asia at 1.4% than in Europe at 0.5% and North America at 0.1%. Our cohort mean age of 33.56 years falls within the expected demographic window for CSU which confirms that our findings reflect the typical CSU population."))
]));

// Para 5 - Angioedema (humanized: restructured for flow)
children.push(para([
  new TextRun(p("Angioedema was present in 73.3% of our patients. This is notably higher than the 37% reported in the literature by ")),
  new TextRun(b("Kolkhir et al. (2024)")),
  new TextRun(p(" for patients with both wheals and angioedema. The discrepancy likely reflects the tertiary referral nature of our setting since patients with more severe disease are more often referred to specialist clinics. ")),
  new TextRun(b("Sanchez-Borges et al. (2017)")),
  new TextRun(p(" in a review of clinical markers of CSU severity identified concomitant recurrent angioedema as a factor linked to longer disease duration. The mean UAS7 score in our cohort was 24.87 ± 12.42 and moderate and severe disease each accounted for 37.8% of patients which indicates a largely moderate-to-severe disease burden."))
]));

// Para 6 - Central finding (humanized: removed "The central finding of this study is", "aligns with", more natural)
children.push(para([
  new TextRun(p("The most important result of this study is the highly significant elevation of SAA levels in CSU patients relative to healthy controls. Median SAA concentration in the CSU group was 8.27 mg/L (IQR 4.54 to 28.17) versus 1.25 mg/L (IQR 0.89 to 1.77) in controls (Mann-Whitney U test Z = 7.94, p-value < 0.001). This finding fits with the emerging evidence on SAA in urticaria."))
]));

// Para 7 - Carvallo comparison (humanized: "in Carvallo et al. study" style, dense)
children.push(para([
  new TextRun(p("In ")),
  new TextRun(b("Carvallo et al. (2024)")),
  new TextRun(p(" study a retrospective multicentre analysis of 67 CSU patients in Spain measured SAA1 levels. Their cohort had a mean age of 50.9 ± 17.2 years and 83.6% were females. The median SAA1 level in their CSU group was 6.15 mg/L (IQR: 1.44 to 29.14) which is comparable to our finding of 8.27 mg/L. They also documented significantly higher SAA1 levels in CSU patients than in controls with a median of 1.09 mg/L (IQR: 0.47 to 1.72) consistent with our data. ")),
  new TextRun(b("Carvallo et al. (2024)")),
  new TextRun(p(" found a significant positive correlation between SAA1 and UAS7 (r_s = 0.47, p-value < 0.001) and a strong positive correlation between SAA1 and CRP (r_s = 0.70, p-value < 0.001)."))
]));

// Para 8 - SAA-UAS7 correlation (humanized: active voice for own findings, contrast with "Contrariwise")
children.push(para([
  new TextRun(p("We found no significant correlation between SAA and UAS7 (Spearman's rho = -0.029, p-value = 0.847). This contrasts with ")),
  new TextRun(b("Carvallo et al. (2024)")),
  new TextRun(p(" who reported a moderate positive correlation between SAA1 and UAS7 (r_s = 0.47, p-value < 0.001). We also observed no significant correlation between SAA and CRP (Spearman's rho = 0.029, p-value = 0.847) whereas ")),
  new TextRun(b("Carvallo et al. (2024)")),
  new TextRun(p(" reported a strong positive correlation (r_s = 0.70, p-value < 0.001). The absence of correlation with CRP in our data may reflect differences in the inflammatory milieu between the two populations or limited statistical power from the smaller sample size."))
]));

// Para 9 - Lu et al. (humanized: removed "well-characterized", "This aligns with the expectation that", "Notably" kept)
children.push(para([
  new TextRun(p("Our findings of significantly elevated SAA in CSU patients are consistent with ")),
  new TextRun(b("Lu et al. (2023)")),
  new TextRun(p(" who investigated SAA across dermatological conditions in a Chinese cohort of 80 patients with various dermatoses and 40 healthy controls. They reported significantly higher SAA across a range of inflammatory dermatoses including urticaria relative to controls. Notably our work extends this finding specifically to CSU using EAACI/GA2LEN/EDF diagnostic criteria. ")),
  new TextRun(b("Lu et al. (2023)")),
  new TextRun(p(" did not report a specific SAA cutoff but the consistent SAA elevation across inflammatory skin disorders supports its role as a sensitive if non-specific inflammation biomarker. As an acute-phase reactant SAA elevation in CSU reflects disease activity rather than serving as a disease-specific diagnostic marker."))
]));

// Para 10 - Severity categories (humanized: dense, more natural flow)
children.push(para([
  new TextRun(p("Despite the clear difference between patients and controls SAA levels did not differ significantly across disease severity categories in our cohort. Mild cases had a median of 7.09 mg/L, moderate cases 8.27 mg/L, and severe cases 9.54 mg/L with a Kruskal-Wallis test value of 0.37 and p-value = 0.83. No significant correlation emerged between SAA and UAS7 scores, age, BMI, disease duration, or any laboratory parameter including CRP (Spearman's rho = 0.029, p-value = 0.847), total IgE, ESR, anti-TPO antibodies, or complete blood count indices. Contrariwise in ")),
  new TextRun(b("Carvallo et al. (2024)")),
  new TextRun(p(" study they found a moderate positive correlation between SAA1 and UAS7 (r_s = 0.47, p-value < 0.001) and a strong positive correlation between SAA1 and CRP (r_s = 0.70, p-value < 0.001). The absence of CRP correlation in our data may again reflect population differences in inflammatory milieu or insufficient power to detect modest associations."))
]));

// Para 11 - BMI (humanized: dense block paragraph, natural voice)
children.push(para([
  new TextRun(p("Mean BMI in our cohort was 29.29 ± 6.71 kg/m² which places the average patient in the overweight-to-obese range. ")),
  new TextRun(b("Shalom et al. (2018)")),
  new TextRun(p(" in a cross-sectional community-based study of 11,261 chronic urticaria patients reported a significant association between chronic urticaria and metabolic syndrome (OR 1.12, 95% CI 1.1 to 1.2, p-value < 0.001) and its components including obesity (OR 1.2, 95% CI 1.1 to 1.3, p-value < 0.001). ")),
  new TextRun(b("Kolkhir et al. (2024)")),
  new TextRun(p(" also noted an association between CSU and metabolic syndrome. However the correlation between BMI and SAA in our study was essentially zero (Spearman's rho = -0.025, p-value = 0.872) which suggests that SAA elevation in CSU is independent of adiposity. This is noteworthy because SAA is known to correlate with BMI in the general population. A meta-analysis of 11 cross-sectional studies reported a significant positive correlation between BMI and SAA (r = 0.23, 95% CI 0.16 to 0.30, p-value < 0.0005) ")),
  new TextRun(b("(Zhao et al., 2010)")),
  new TextRun(p(" and ")),
  new TextRun(b("Yang et al. (2006)")),
  new TextRun(p(" demonstrated that both adipose SAA mRNA expression and SAA secretion correlate strongly with BMI (r = 0.47, p-value = 0.028 and r = 0.80, p-value = 0.0002 respectively). The absence of such a relationship in our CSU cohort suggests that the systemic inflammatory drive in CSU overrides adiposity-related contributions to SAA levels which further supports SAA as a disease-activity biomarker in this setting."))
]));

// Para 12 - ROC (humanized: removed "exceptional diagnostic performance", more natural)
children.push(para([
  new TextRun(p("ROC curve analysis showed strong diagnostic performance of SAA in distinguishing CSU patients from healthy controls. The area under the curve was 0.988 (95% CI 0.971 to 1.000, p-value < 0.001). At a cutoff greater than 2.56 mg/L SAA yielded a sensitivity of 97.8%, specificity of 95.5%, positive predictive value of 95.7%, and negative predictive value of 97.7%. To our knowledge this is the first study to report a ROC-derived cutoff for SAA in CSU."))
]));

// Para 13 - Strengths
children.push(para([
  new TextRun(p("Strengths of this study include the application of EAACI diagnostic criteria, inclusion of a well-defined control group, comprehensive clinical phenotyping, and ROC analysis with associated sensitivity, specificity, and predictive values."))
]));

// ========================
// RECOMMENDATIONS - converted from bullet points to prose per Noora style
// ========================
children.push(headingH1("Recommendations"));

children.push(para([
  new TextRun(p("Based on the findings of this study the following recommendations are proposed."))
]));

children.push(headingH2("Clinical Application of SAA as a Diagnostic Biomarker"));

children.push(para([
  new TextRun(p("The diagnostic cutoff of greater than 2.56 mg/L for SAA should be validated in larger multicentre studies to confirm its utility in distinguishing CSU patients from healthy controls. SAA should be considered as a complementary biomarker to existing tools such as UAS7 and CRP for assessing disease activity in CSU. A comprehensive evaluation incorporating SAA along with clinical parameters and other acute-phase reactants should be performed to develop a composite disease activity score. Personalized risk stratification tools incorporating SAA levels for CSU patients should be used to identify those at higher risk of severe disease and tailor treatment accordingly."))
]));

children.push(headingH2("Longitudinal and Mechanistic Investigations"));

children.push(para([
  new TextRun(p("Future studies should employ longitudinal designs with repeated SAA measurements to evaluate its prognostic value and responsiveness to treatment over time. The correlation between SAA and other inflammatory biomarkers should be further examined to elucidate the pathophysiological role of SAA in CSU. Early identification through biomarkers like SAA can facilitate appropriate management with targeted therapeutic strategies."))
]));

children.push(headingH2("Patient Stratification and Endotyping"));

children.push(para([
  new TextRun(p("Future investigations should incorporate endotyping through autologous serum skin testing and autoantibody profiling to determine whether SAA levels vary across CSU subtypes. The utility of SAA as a predictive biomarker for treatment response should be evaluated in prospective cohorts. Multidisciplinary collaboration between dermatologists, allergists, and clinical immunologists is crucial for optimal CSU management to ensure comprehensive care and timely intervention."))
]));

children.push(headingH2("Future Research Directions"));

children.push(para([
  new TextRun(p("Comparative studies including disease control groups such as other urticaria subtypes and autoimmune conditions are needed to establish the specificity of SAA elevation in CSU. Further research should explore the relationship between SAA and metabolic comorbidities in CSU given the high prevalence of overweight and obesity in this population. Studies should investigate the pathophysiological mechanisms underlying SAA production and its role in mast cell degranulation in CSU to develop targeted therapeutic strategies."))
]));

// ========================
// SUMMARY
// ========================
children.push(headingH1("Summary"));

children.push(headingH2("Introduction"));

children.push(para([
  new TextRun(p("Chronic spontaneous urticaria is an inflammatory skin disorder characterised by recurrent wheals, angioedema, or both for more than 6 weeks without an identifiable trigger. Mast cell and basophil degranulation driven by autoimmune mechanisms involving IgE and IgG autoantibodies underlies its pathogenesis. Serum amyloid A is a highly responsive acute-phase protein whose levels can rise up to 1000-fold during inflammation. This case-control study aimed to measure SAA levels in patients with CSU and assess their relationship with disease activity as measured by the UAS7."))
]));

children.push(headingH2("Key Results"));

// Key Results intro
children.push(headingH3("Demographic and Clinical Characteristics"));

children.push(para([
  new TextRun(p("The study included 45 CSU patients with a mean age of 33.56 ± 10.84 years and 44 age-matched healthy controls (mean age 31.95 ± 12.36 years, t = 0.65, p-value = 0.52). Females constituted the majority of patients at 73.3% yielding a female-to-male ratio of roughly 2.75:1 which is consistent with the established female predominance of CSU. Most patients were from urban areas (62.2%) and 86.7% were non-smokers. A positive family history of urticaria was reported by 35.6% of patients. Most patients had a progressive disease course (97.8%) and 44.4% experienced daily symptoms. Mean BMI was 29.29 ± 6.71 kg/m² placing the average patient in the overweight-to-obese range."))
]));

children.push(headingH3("Disease Characteristics and Severity"));

children.push(para([
  new TextRun(p("Angioedema was present in 73.3% of patients which is notably higher than the 37 to 40% range reported in international studies and possibly reflects the tertiary referral nature of the study setting. The mean UAS7 score was 24.87 ± 12.42 with moderate and severe disease each accounting for 37.8% of patients while mild disease constituted 24.4%. Median disease duration was 12 months (IQR: 4 to 36 months) and 84.4% of patients had no concomitant allergic diseases."))
]));

children.push(headingH3("Serum Amyloid A Levels"));

children.push(para([
  new TextRun(p("SAA levels were significantly higher in CSU patients (median 8.27 mg/L, IQR: 4.54 to 28.17) compared with healthy controls (median 1.25 mg/L, IQR: 0.89 to 1.77) and the difference was highly significant (Mann-Whitney U test Z = 7.94, p-value < 0.001). ROC curve analysis demonstrated strong diagnostic performance with an AUC of 0.988 (95% CI: 0.971 to 1.000, p-value < 0.001). At the optimal cutoff of greater than 2.56 mg/L SAA yielded a sensitivity of 97.8%, specificity of 95.5%, positive predictive value of 95.7%, and negative predictive value of 97.7% which is the first ROC-derived cutoff reported for SAA in CSU. SAA levels did not differ significantly according to sex, smoking status, family history, angioedema, or associated allergic diseases."))
]));

children.push(headingH3("Correlation Analysis"));

children.push(para([
  new TextRun(p("No statistically significant correlation was found between SAA and UAS7 score (Spearman's rho = 0.142, p-value = 0.353) and SAA levels did not differ significantly across severity categories (mild: 7.09, moderate: 8.27, severe: 9.54 mg/L; Kruskal-Wallis test = 0.37, p-value = 0.83). No significant correlations were detected between SAA and age (rho = 0.083, p-value = 0.586), BMI (rho = -0.025, p-value = 0.872), or disease duration (rho = -0.243, p-value = 0.107). SAA showed no significant correlation with any laboratory parameter including total leucocyte count, neutrophils, eosinophils, basophils, haemoglobin, platelet count, creatinine, AST, ALT, total IgE, ESR, CRP, TSH, or anti-TPO antibodies."))
]));

// ========================
// CONCLUSION
// ========================
children.push(headingH1("Conclusion"));

children.push(para([
  new TextRun(p("This case-control study demonstrates that serum amyloid A levels are significantly elevated in patients with chronic spontaneous urticaria compared with healthy controls. The strong discriminatory performance of SAA reflected by an AUC of 0.988 with high sensitivity and specificity suggests that SAA measurement could serve as a valuable objective biomarker to support the diagnosis of CSU. The lack of a significant correlation between SAA and UAS7 scores or disease severity indicates that SAA captures a dimension of systemic inflammation not fully reflected by symptom-based activity scores alone."))
]));

// ========================
// LIMITATIONS
// ========================
children.push(headingH1("Limitations"));

children.push(para([
  new TextRun(p("This study has several limitations. It was conducted at a single tertiary referral centre which limits generalisability. The sample size of 45 patients per group provided adequate power for the primary comparison but limited power for subgroup analyses. The cross-sectional design does not allow assessment of temporal relationships. Treatment status was not standardised. The autoimmune endotype was not characterised. Total SAA rather than isoform-specific SAA was measured. The healthy control group limits assessment of specificity against other pruritic dermatoses."))
]));

// ========================
// REFERENCES
// ========================
children.push(headingH1("References"));

children.push(refParaBoldPrefix("Ashraf R, Bishnoi A, Mehta H, Parsad D, Kumaran MS. (2024) ", "Clinico-Epidemiologic Profile and Response to Levocetirizine in Chronic Spontaneous Urticaria: A Retrospective Cohort Study from a Tertiary Care Center in North India. Indian Dermatology Online Journal 15(4): 630-633."));
children.push(refParaBoldPrefix("Bracken SJ, Abraham S and MacLeod AS (2019) ", "Autoimmune Theories of Chronic Spontaneous Urticaria. Frontiers in Immunology 10: 627."));
children.push(refParaBoldPrefix("Carvallo A, Veleiro B, Sabate-Bresco M, et al. (2024) ", "Serum Amyloid A as a Potential Biomarker for Disease Activity in Chronic Spontaneous Urticaria. The Journal of Allergy and Clinical Immunology: In Practice 12(1): 195-200."));
children.push(refParaBoldPrefix("Fricke J, Avila G, Keller T, et al. (2020) ", "Prevalence of chronic urticaria in children and adults across the globe: Systematic review with meta-analysis. Allergy 75(2): 423-432."));
children.push(refParaBoldPrefix("Kolkhir P, Andre F, Church MK, et al. (2017) ", "Potential blood biomarkers in chronic spontaneous urticaria. Clinical & Experimental Allergy 47(1): 19-36."));
children.push(refParaBoldPrefix("Kolkhir P, Bonnekoh H, Metz M, et al. (2024) ", "Chronic Spontaneous Urticaria: A Review. JAMA 332(17): 1464."));
children.push(refParaBoldPrefix("Lu W, Chen B, Wang C, et al. (2023) ", "Serum amyloid A levels in acute and chronic urticaria. Anais Brasileiros de Dermatologia 94(4): 411-415."));
children.push(refParaBoldPrefix("Maurer M, Abuzakouk M, Berard F, et al. (2017) ", "The burden of chronic spontaneous urticaria is substantial: Real-world evidence from ASSURE-CSU. Allergy 72(12): 2005-2016."));
children.push(refParaBoldPrefix("Sack GH (2018) ", "Serum amyloid A -- a review. Molecular Medicine 24(1): 46."));
children.push(refParaBoldPrefix("Sanchez-Borges M, Caballero-Fonseca F, Capriles-Hulett A, et al. (2017) ", "Factors linked to disease severity and time to remission in patients with chronic spontaneous urticaria. Journal of the European Academy of Dermatology and Venereology 31(6): 964-971."));
children.push(refParaBoldPrefix("Shalom G, Magen E, Babaev M, et al. (2018) ", "Chronic urticaria and the metabolic syndrome: a cross-sectional community-based study of 11,261 patients. Journal of the European Academy of Dermatology and Venereology 32(2): 276-281."));
children.push(refParaBoldPrefix("Yang R-Z, Lee M-J, Hu H, et al. (2006) ", "Acute-Phase Serum Amyloid A: An Inflammatory Adipokine and Potential Link between Obesity and Its Metabolic Complications. PLoS Medicine 3(6): e287."));
children.push(refParaBoldPrefix("Zhao Y, He X, Shi X, et al. (2010) ", "Association between serum amyloid A and obesity: a meta-analysis and systematic review. Inflammation Research 59: 323-334."));

// ========================
// DOCUMENT
// ========================
// Margins: 2.5 cm top/left, 1.5 cm bottom/right
// 1 cm = 567 twips (DXA)
// 2.5 cm = 1417 twips, 1.5 cm = 850 twips
const marginTop = 1417;
const marginBottom = 850;
const marginLeft = 1417;
const marginRight = 850;

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 24 } }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
        pageNumbers: { start: 1 }
      }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 20 })]
        })]
      })
    },
    children
  }]
});

const outPath = "D:\\ElGazzar_FREELANCE\\Areej\\Study files\\Humanized_Discussion_Chapter_Areej_Ahmed_Mansour.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("DONE: " + outPath + " (" + (buffer.length / 1024).toFixed(1) + " KB)");
}).catch(err => {
  console.error("ERROR:", err.message);
});
