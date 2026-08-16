const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak, Footer, PageNumber } = require('docx');

const RED = "CC0000";
const BLACK = "000000";

function p(text, color = BLACK) {
  return { text, color, size: 24, font: "Times New Roman" };
}
function b(text) {
  return { text, color: RED, size: 24, font: "Times New Roman", bold: true };
}
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

// ======================== DISCUSSION ========================
children.push(headingH1("Discussion"));

// Para 1 - Hypothyroidism intro (humanized)
children.push(para([
  new TextRun(p("Hypothyroidism is one of the most common endocrine disorders encountered in clinical practice with a prevalence ranging from 0.2% to 5.3% of the global population depending on diagnostic criteria and regional iodine sufficiency ")),
  new TextRun(b("(Lai et al., 2024)")),
  new TextRun(p(". The condition results from insufficient thyroid hormone production leading to a generalised slowing of metabolic processes that goes beyond the classic symptoms of fatigue and cold intolerance. Over the past two decades evidence has increasingly framed hypothyroidism as a systemic pro-inflammatory state closely tied to accelerated atherogenesis, dyslipidaemia, and ectopic fat deposition ")),
  new TextRun(b("(Hak et al., 2000; Nagasaki et al., 2007)")),
  new TextRun(p(". Thyroid hormones regulate nuclear receptors that control genes governing lipid metabolism, mitochondrial biogenesis, and inflammatory cytokine production ")),
  new TextRun(b("(Ritter et al., 2020)")),
  new TextRun(p(". When thyroid hormone levels fall the consequences include reduced hepatic LDL receptor expression, impaired beta-oxidation of fatty acids, and increased circulating pro-inflammatory cytokines such as interleukin-6 and tumour necrosis factor-alpha which in turn stimulate hepatic synthesis of C-reactive protein ")),
  new TextRun(b("(Uppu and Gupta, 2018)")),
  new TextRun(p(". Mendelian randomization studies have recently provided causal evidence that hypothyroidism induces a systemic inflammatory response involving multiple cytokines including TNF-alpha, IL-6, IL-13, and IL-16 rather than these cytokines being simple bystander markers of autoimmune activity ")),
  new TextRun(b("(Lai et al., 2024)")),
  new TextRun(p(". At the same time non-alcoholic fatty pancreas disease has emerged as a clinically relevant entity that shares risk factors with metabolic syndrome and non-alcoholic fatty liver disease while contributing independently to pancreatic dysfunction and cardiovascular risk ")),
  new TextRun(b("(Díte et al., 2019; Pagkali et al., 2024)"))
]));

// ======================== 1.1 General Characteristics ========================
children.push(headingH2("1.1 General Characteristics and Demographic Profile"));

children.push(para([
  new TextRun(p("Our cohort showed a strong female predominance with women constituting 75.5% of controls, 91.8% of the subclinical hypothyroidism group, and 89.8% of the overt hypothyroidism group (p-value = 0.042). This pattern fits the known epidemiology of thyroid disorders which affect women at much higher rates than men a disparity attributed to the autoimmune aetiology of Hashimoto thyroiditis and the immunomodulatory effects of oestrogen. In ")),
  new TextRun(b("Bayyigit et al. (2024)")),
  new TextRun(p(" study which first established the association between hypothyroidism and NAFPD women represented 70% of the hypothyroid group and 63.3% of the subclinical hypothyroid group. Our cohort shows an even higher female representation likely reflecting the demographic composition of the Egyptian outpatient endocrine clinic population. Body mass index also differed significantly among the groups (p-value = 0.003) with mean values of 25.1 ± 2.9 kg/m² in controls, 26.6 ± 2.5 in subclinical hypothyroidism, and 26.8 ± 2.3 in overt hypothyroidism. The modest but significant BMI gradient reflects the known metabolic consequences of thyroid hormone deficiency including reduced resting energy expenditure, decreased thermogenesis, and impaired lipolysis ")),
  new TextRun(b("(Ritter et al., 2020)")),
  new TextRun(p(". No significant intergroup differences were observed for age or waist circumference which supports the overall comparability of the three groups."))
]));

// ======================== 1.2 Lipid Profile ========================
children.push(headingH2("1.2 Lipid Profile and Metabolic Parameters"));

children.push(para([
  new TextRun(p("The lipid profile results were consistent with the known link between hypothyroidism and atherogenic dyslipidaemia. Total cholesterol, LDL cholesterol, and triglycerides were significantly higher in the overt hypothyroidism group compared with controls (p-value = 0.033, 0.008, and 0.020 respectively). The mechanism involves reduced expression of LDL receptors on hepatocyte surfaces, diminished clearance of LDL particles from the circulation, and decreased lipoprotein lipase activity leading to impaired triglyceride metabolism ")),
  new TextRun(b("(Duntas, 2002)")),
  new TextRun(p(". In ")),
  new TextRun(b("Mantovani et al. (2018)")),
  new TextRun(p(" meta-analysis encompassing over 44,000 individuals across 15 studies hypothyroidism was significantly associated with both the presence and the histological severity of NAFLD with the relationship partially mediated by the adverse lipid profile. In ")),
  new TextRun(b("Xiang et al. (2024)")),
  new TextRun(p(" dose-response meta-analysis involving 38,425 individuals each 1 ng/dL increase in free T4 reduced the risk of NAFLD by 10.56% and individuals with high TSH levels had significantly higher degrees of liver fibrosis. The stepwise increase in lipid parameters from controls through subclinical to overt hypothyroidism in our cohort reinforces the concept that even mild thyroid hormone deficiency carries metabolic repercussions that merit clinical attention."))
]));

// ======================== 1.3 Inflammatory Markers ========================
children.push(headingH2("1.3 Inflammatory Markers"));

children.push(para([
  new TextRun(p("The analysis of inflammatory markers produced findings that need to be interpreted with some caution. TNF-alpha was the only cytokine that showed a statistically significant difference among the three groups (p-value = 0.029) with higher levels in overt hypothyroidism compared with subclinical hypothyroidism while neither hypothyroid group differed significantly from controls. CRP and IL-6 showed no significant intergroup differences (p-value = 0.533 and 0.244 respectively). These results differ partly from several earlier reports. ")),
  new TextRun(b("Al-Hindawi (2019)")),
  new TextRun(p(" study has reported elevated IL-6 and CRP levels in autoimmune hypothyroidism among Iraqi women. ")),
  new TextRun(b("Uppu and Gupta (2018)")),
  new TextRun(p(" study found that subclinical hypothyroidism was associated with increased inflammatory markers and dyslipidaemia. ")),
  new TextRun(b("Ghosh et al. (2025)")),
  new TextRun(p(" demonstrated that hypothyroidism is associated with elevated circulating inflammatory markers and adhesion proteins with specific profiles distinguishing subclinical from overt hypothyroidism. ")),
  new TextRun(b("Marchiori et al. (2015)")),
  new TextRun(p(" study showed that levothyroxine treatment significantly improved blood inflammatory marker levels in hypothyroid patients which suggests that the inflammatory state is at least partially reversible with thyroid hormone replacement. A key difference between our study and these earlier reports is our exclusion criteria we excluded patients with BMI of 30 kg/m² or greater thus removing a major source of adipose tissue-derived IL-6 and CRP. Adipose tissue contributes significantly to circulating IL-6 accounting for roughly 30% of total levels ")),
  new TextRun(b("(Silveira Rossi et al., 2022)")),
  new TextRun(p(" and excluding obese individuals may have attenuated the expected inflammatory differences. In ")),
  new TextRun(b("Lai et al. (2024)")),
  new TextRun(p(" Mendelian randomization analysis hypothyroidism causally increases TNF-alpha and IL-6 but the effect sizes are modest and may be difficult to detect in moderately sized cohorts with restricted BMI ranges. The absence of significant CRP elevation aligns with ")),
  new TextRun(b("Nagasaki et al. (2007)")),
  new TextRun(p(" who noted that CRP changes in hypothyroidism are more pronounced in patients with higher cardiovascular risk profiles."))
]));

// ======================== 1.4 Ultrasonographic Findings ========================
children.push(headingH2("1.4 Ultrasonographic Findings"));

// 1.4.1 Pancreatic Steatosis
children.push(headingH3("1.4.1 Pancreatic Steatosis"));

children.push(para([
  new TextRun(p("The ultrasonographic findings represent the most novel contribution of this study. Fatty pancreas was present in 16.3% of controls, 42.9% of patients with subclinical hypothyroidism, and 55.1% of those with overt hypothyroidism (p-value < 0.001). This progressive increase in pancreatic steatosis with declining thyroid function is a noteworthy observation. ")),
  new TextRun(b("Bayyigit et al. (2024)")),
  new TextRun(p(" in the only prior study to examine this relationship reported pancreatic steatosis in 24.2% of controls, 60% of the subclinical group, and 63.3% of the overt hypothyroidism group. The somewhat higher prevalence in their hypothyroid groups may reflect differences in study populations, ultrasonographic grading criteria, or the inclusion of patients with BMI up to 30 kg/m² or higher. Despite these numerical differences the overall pattern is remarkably consistent across both studies and provides converging evidence that hypothyroidism is a risk factor for NAFPD. The biological rationale rests on the regulatory role of thyroid hormones in lipid metabolism. In the hypothyroid state reduced thyroid hormone signalling impairs PPAR-alpha-mediated fatty acid oxidation, increases expression of SREBP-1c, and upregulates de novo lipogenesis in both the liver and pancreas ")),
  new TextRun(b("(Ritter et al., 2020)")),
  new TextRun(p(". In ")),
  new TextRun(b("Pagkali et al. (2024)")),
  new TextRun(p(" study the NAFPD spectrum encompasses not only passive lipid accumulation but also active inflammatory processes driven by free fatty acid-induced lipotoxicity, endoplasmic reticulum stress, and NLRP3 inflammasome activation all of which may be amplified in the setting of thyroid hormone deficiency. ")),
  new TextRun(b("Onohuean et al. (2025)")),
  new TextRun(p(" review has highlighted that NAFPD creates a pro-inflammatory microenvironment characterised by palmitate-induced ER stress, mitochondrial dysfunction, and adipokine dysregulation that may promote pancreatic ductal adenocarcinoma in susceptible individuals."))
]));

// 1.4.2 Hepatic Steatosis
children.push(headingH3("1.4.2 Hepatic Steatosis"));

children.push(para([
  new TextRun(p("Hepatic steatosis showed a parallel distribution with fatty liver detected in 32.7% of controls, 61.2% of the subclinical hypothyroidism group, and 73.5% of the overt hypothyroidism group (p-value < 0.001). This finding is consistent with the extensive literature linking hypothyroidism to NAFLD. In ")),
  new TextRun(b("He et al. (2017)")),
  new TextRun(p(" meta-analysis of 13 studies a significant association was found between hypothyroidism and NAFLD (OR 1.52, 95% CI 1.24 to 1.87) with both overt and subclinical hypothyroidism independently correlated with fatty liver. ")),
  new TextRun(b("Zeng et al. (2021)")),
  new TextRun(p(" confirmed these findings in a meta-analysis of 51,407 patients demonstrating that increased TSH and decreased free T4 were significantly associated with NAFLD risk. ")),
  new TextRun(b("Pourseyedi et al. (2025)")),
  new TextRun(p(" systematic review encompassing 29 observational studies published up to January 2024 provided updated evidence that hypothyroid patients are more likely to develop NAFLD and that thyroid hormones regulate energy metabolism in ways directly relevant to hepatic steatosis. The largest meta-analysis to date including approximately 39 million individuals confirmed a reciprocal relationship between NAFLD and hypothyroidism with hypothyroidism increasing the odds of NAFLD by 96% (OR 1.96, 95% CI 1.34 to 2.87) ")),
  new TextRun(b("(Ayati Firoozabadi et al., 2025)")),
  new TextRun(p(". Notably this study found that the risk was more pronounced for subclinical hypothyroidism (OR 1.59, 95% CI 1.08 to 2.35) than for overt hypothyroidism a finding that diverges somewhat from our observation of a stepwise increase. The parallel increase in both hepatic and pancreatic steatosis in our cohort suggests shared pathogenic mechanisms involving TSH-driven hepatic lipogenesis and reduced thyroid hormone-mediated fatty acid oxidation consistent with the concept that the liver and pancreas are both targets of ectopic fat deposition in the metabolic syndrome."))
]));

// 1.4.3 Abdominal Fat and Portal Vein Diameter
children.push(headingH3("1.4.3 Abdominal Fat and Portal Vein Diameter"));

children.push(para([
  new TextRun(p("Abdominal fat thickness was significantly greater in both hypothyroid groups compared with controls (p-value < 0.001). ")),
  new TextRun(b("Tsou (2021)")),
  new TextRun(p(" demonstrated that subclinical hypothyroidism is associated with increased visceral adipose depots including thoracic periaortic adipose tissue and the body roundness index particularly in women. In that study the adjusted odds ratios for subclinical hypothyroidism in women were 2.61 (95% CI 1.03 to 6.97) for TAT and 2.04 (95% CI 1.07 to 3.92) for BRI. The mechanistic link between hypothyroidism and visceral adiposity involves reduced thermogenesis and metabolic rate leading to a net positive energy balance and preferential storage of fat in visceral depots ")),
  new TextRun(b("(Silveira Rossi et al., 2022)")),
  new TextRun(p(". Visceral adipose tissue is itself a metabolically active organ that secretes pro-inflammatory adipokines including IL-6 and TNF-alpha thereby perpetuating a cycle of inflammation and metabolic dysfunction."))
]));

children.push(para([
  new TextRun(p("Portal vein diameter did not differ significantly among the groups (p-value = 0.190). This suggests that the haemodynamic alterations associated with hepatic steatosis in our cohort had not yet progressed to portal venous changes which typically accompany more advanced fibrotic liver disease. From a clinical perspective this is reassuring as it implies that the hepatic fat accumulation seen in hypothyroid patients in this study represents early-stage potentially reversible NAFLD rather than advanced fibrotic disease."))
]));

// ======================== 1.5 Correlation and ROC ========================
children.push(headingH2("1.5 Correlation and ROC Curve Analyses"));

children.push(para([
  new TextRun(p("Within the overt hypothyroidism group IL-6 showed a significant negative correlation with abdominal fat thickness (r = -0.322, p-value = 0.024). This inverse relationship is unexpected and runs counter to the established positive association between adiposity and IL-6 in the general population. Several explanations might account for this. In the overtly hypothyroid state the relationship between adiposity and inflammation may be modified by the direct effects of thyroid hormone deficiency on cytokine production and clearance. Another possibility is that the negative correlation reflects a compensatory anti-inflammatory response that becomes more pronounced as abdominal fat increases in the context of severe hypothyroidism. The absence of significant correlations between the remaining inflammatory markers and the assessed parameters in both hypothyroid groups suggests that the relationship between thyroid dysfunction, inflammation, and ectopic fat is complex and likely modulated by multiple confounders including the duration of hypothyroidism, autoimmune activity, and individual genetic susceptibility."))
]));

children.push(para([
  new TextRun(p("These correlation findings can be compared with ")),
  new TextRun(b("Nagasaki et al. (2007)")),
  new TextRun(p(" who examined Spearman rank correlations between serum CRP and various clinical parameters in a cohort of hypothyroid patients. In their study CRP was significantly correlated with carotid arterial stiffness (CCA stiffness beta, rho = 0.683, p-value < 0.0001) but showed no significant correlation with age, BMI, blood pressure, or lipid profile. The absence of significant correlations between CRP and most metabolic parameters in ")),
  new TextRun(b("Nagasaki et al. (2007)")),
  new TextRun(p(" study mirrors the present finding that CRP and TNF-alpha did not correlate with the majority of clinical and ultrasonographic variables assessed in either hypothyroid group. The unexpected negative correlation between IL-6 and abdominal fat thickness observed in the overt hypothyroidism group (r = -0.322, p-value = 0.024) may reflect a non-canonical regulation of adipokine secretion in severe thyroid hormone deficiency whereby the usual positive association between adiposity and IL-6 is modified by the direct suppressive effects of hypothyroidism on cytokine production or clearance. ")),
  new TextRun(b("Uppu and Gupta (2018)")),
  new TextRun(p(" study has similarly reported altered correlations between inflammatory markers and metabolic parameters in subclinical hypothyroidism which supports the concept that thyroid hormone status modifies the relationship between adiposity and inflammation."))
]));

children.push(para([
  new TextRun(p("ROC curve analysis for TNF-alpha in differentiating subclinical from overt hypothyroidism yielded an AUC of 0.652 (95% CI 0.544 to 0.760, p-value = 0.010) with a sensitivity of 83.67% but a specificity of only 42.86% at a cut-off greater than 87.1 ng/L. The sensitivity is acceptable for a screening tool but the low specificity limits its clinical utility as a standalone discriminatory biomarker. These results can be contextualised against ")),
  new TextRun(b("Ghosh et al. (2025)")),
  new TextRun(p(" who performed ROC curve analysis on a panel of inflammatory markers in 139 hypothyroid patients and 60 healthy controls. In that study IL-6 and IL-1 showed the highest predictive accuracy for identifying subclinical hypothyroidism (AUC = 0.983 for both) followed by ICAM-1 (AUC = 0.827). Notably ")),
  new TextRun(b("Ghosh et al. (2025)")),
  new TextRun(p(" found that TNF-alpha while significantly elevated in hypothyroid patients compared with controls in univariate analysis was not retained as a significant predictor in multivariate logistic regression (p-value = 0.747). This pattern bears some resemblance to the present findings where TNF-alpha showed only modest discriminatory ability between subclinical and overt hypothyroidism despite being the only cytokine with a statistically significant intergroup difference. The substantially higher AUC values reported by ")),
  new TextRun(b("Ghosh et al. (2025)")),
  new TextRun(p(" for IL-6 reflect a fundamentally different comparison that is subclinical hypothyroidism versus euthyroidism rather than a direct discrimination between two stages of thyroid dysfunction as performed in the present analysis. To our knowledge no prior study has specifically examined the ROC performance of TNF-alpha in differentiating subclinical from overt hypothyroidism which suggests that this represents a novel contribution of the present work."))
]));

children.push(para([
  new TextRun(p("The ROC analyses for IL-6 as a predictor of fatty liver and fatty pancreas showed AUC values of 0.603 and 0.606 respectively indicating modest discriminatory ability. These values are considerably lower than the AUC of 0.983 reported by ")),
  new TextRun(b("Ghosh et al. (2025)")),
  new TextRun(p(" for IL-6 in discriminating subclinical hypothyroidism from euthyroidism. The difference is readily explained by the outcome being predicted. ")),
  new TextRun(b("Ghosh et al. (2025)")),
  new TextRun(p(" study used IL-6 to predict a systemic inflammatory state directly related to thyroid hormone deficiency whereas our analysis used IL-6 to predict ectopic fat deposition in the liver and pancreas which is a more distal and multifactorial outcome influenced by numerous variables beyond inflammation alone including insulin resistance, dietary habits, and genetic predisposition. The modest AUC values observed here suggest that while IL-6 is statistically associated with the presence of hepatic and pancreatic steatosis it lacks sufficient diagnostic accuracy to serve as a standalone clinical screening tool for these conditions in hypothyroid patients."))
]));

// ======================== 1.6 Logistic Regression ========================
children.push(headingH2("1.6 Logistic Regression and Independent Predictors"));

children.push(para([
  new TextRun(p("The logistic regression analyses identified the independent predictors of fatty liver and fatty pancreas. For fatty liver the final multivariate model identified BMI, free T4, HDL cholesterol, liver size, and abdominal fat as significant independent predictors. Each 1 kg/m² increase in BMI was associated with a 19.6% increase in the odds of fatty liver (OR 1.196, 95% CI 1.001 to 1.428, p-value = 0.048). Free T4 was protective with higher levels associated with 82.9% lower odds of fatty liver (OR 0.171, 95% CI 0.043 to 0.680, p-value = 0.012). This is consistent with the dose-response relationship reported by ")),
  new TextRun(b("Xiang et al. (2024)")),
  new TextRun(p(" where each 1 ng/dL increment in free T4 reduced NAFLD risk by over 10%. Abdominal fat showed the strongest association with each one-unit increase conferring roughly 5.2-fold higher odds of fatty liver (OR 5.198, 95% CI 2.379 to 11.357, p-value < 0.001). For fatty pancreas the independent predictors were HDL cholesterol (OR 0.919, 95% CI 0.875 to 0.965, p-value < 0.001), overt hypothyroidism (OR 5.341, 95% CI 1.70 to 16.77, p-value = 0.004), and abdominal fat (OR 5.738, 95% CI 2.801 to 11.757, p-value < 0.001). The fact that subclinical hypothyroidism was not an independent predictor of fatty pancreas after adjustment (OR 1.787, 95% CI 0.545 to 5.859, p-value = 0.273) suggests that the degree of thyroid dysfunction is an important determinant of pancreatic fat accumulation and that a certain threshold of thyroid hormone deficiency may be required before pancreatic steatosis develops independently of obesity. These regression models highlight the centrality of abdominal adiposity as a driver of both hepatic and pancreatic steatosis while also establishing that overt hypothyroidism exerts an independent effect on pancreatic fat accumulation beyond what can be accounted for by adiposity alone. This is broadly consistent with ")),
  new TextRun(b("Bayyigit et al. (2024)")),
  new TextRun(p(" who reported that pancreatic steatosis was more strongly associated with hypothyroidism after adjustment for metabolic confounders."))
]));

// ======================== 1.7 Limitations ========================
children.push(headingH2("1.7 Study Limitations"));

children.push(para([
  new TextRun(p("Several limitations of this study should be noted. The cross-sectional design precludes determination of causality between hypothyroidism and the observed changes in pancreatic steatosis and inflammatory markers. The relatively modest sample size while comparable to similar studies in the literature may have limited our ability to detect smaller differences in inflammatory markers between groups. The exclusion of patients with BMI of 30 kg/m² or greater while methodologically justified to isolate the effects of hypothyroidism from obesity-driven inflammation may have attenuated the observed differences in inflammatory markers and limits the generalisability of our findings to the broader hypothyroid population many of whom are overweight or obese. The ultrasonographic assessment of pancreatic and hepatic steatosis while practical and non-invasive is operator-dependent and semi-quantitative so more precise methods such as MRI-based proton density fat fraction or controlled attenuation parameter would have provided more accurate fat quantification. The lack of data on thyroid autoantibodies prevents differentiation between autoimmune and non-autoimmune causes of hypothyroidism which may have distinct inflammatory profiles. Finally dietary habits, physical activity levels, and medication adherence all of which influence both thyroid function and metabolic parameters were not systematically assessed."))
]));

// ======================== 1.8 Summary ========================
children.push(headingH2("1.8 Summary of Results"));

children.push(para([
  new TextRun(p("Gender distribution differed significantly among groups (p-value = 0.042) with females representing 75.5% of controls, 91.8% of subclinical hypothyroidism, and 89.8% of overt hypothyroidism. BMI was significantly higher in subclinical hypothyroidism (26.6 ± 2.5 kg/m²) and overt hypothyroidism (26.8 ± 2.3 kg/m²) compared with controls (25.1 ± 2.9 kg/m²) (p-value = 0.003). TSH levels increased progressively with controls at 1.7 mIU/L, subclinical at 7.67 mIU/L, and overt at 20.8 mIU/L (p-value < 0.001) with significant pairwise differences between all groups. Free T4 was significantly lower in overt hypothyroidism (0.7 ng/dL) compared with controls (1.2 ng/dL) and subclinical hypothyroidism (1.1 ng/dL) (p-value < 0.001). Total cholesterol (p-value = 0.033), LDL (p-value = 0.008), and triglycerides (p-value = 0.020) were significantly higher in overt hypothyroidism compared with controls. TNF-alpha was significantly different among groups (p-value = 0.029) being higher in overt (105.7 ng/L) versus subclinical hypothyroidism (93.8 ng/L) while CRP (p-value = 0.533) and IL-6 (p-value = 0.244) showed no significant differences. Fatty pancreas prevalence was 16.3% in controls, 42.9% in subclinical, and 55.1% in overt hypothyroidism (p-value < 0.001). Fatty liver prevalence was 32.7% in controls, 61.2% in subclinical, and 73.5% in overt hypothyroidism (p-value < 0.001). Abdominal fat was significantly higher in subclinical (2.2) and overt hypothyroidism (2.1) compared with controls (1.5) (p-value < 0.001). Portal vein diameter did not differ among groups (p-value = 0.190). ROC curve for TNF-alpha differentiating subclinical from overt hypothyroidism showed AUC 0.652, sensitivity 83.67%, specificity 42.86% (p-value = 0.010). ROC curve for IL-6 predicting fatty liver showed AUC 0.603, sensitivity 60.98%, specificity 69.23% (p-value = 0.032) and for fatty pancreas AUC 0.606, sensitivity 58.93%, specificity 68.13% (p-value = 0.032). Logistic regression for fatty liver identified independent predictors as BMI (OR 1.196, p-value = 0.048), free T4 (OR 0.171, p-value = 0.012), HDL (OR 0.949, p-value = 0.022), liver size (OR 1.850, p-value = 0.005), and abdominal fat (OR 5.198, p-value < 0.001). For fatty pancreas the independent predictors were HDL (OR 0.919, p-value < 0.001), overt hypothyroidism (OR 5.341, p-value = 0.004), and abdominal fat (OR 5.738, p-value < 0.001)."))
]));

// ======================== CONCLUSIONS ========================
children.push(headingH1("Conclusions"));

children.push(para([
  new TextRun(p("The prevalence of both pancreatic and hepatic steatosis increases progressively across the spectrum of thyroid dysfunction from euthyroidism through subclinical to overt hypothyroidism. Overt hypothyroidism is an independent predictor of fatty pancreas after adjustment for BMI, lipid profile, and abdominal adiposity which supports a direct pathogenic role for thyroid hormone deficiency in pancreatic fat accumulation. Abdominal fat is the strongest independent predictor of both hepatic and pancreatic steatosis underscoring the central role of visceral adiposity in ectopic fat deposition. Among the inflammatory markers studied TNF-alpha shows potential as a discriminatory marker between subclinical and overt hypothyroidism though with modest specificity. The lack of significant differences in CRP and IL-6 between groups suggests that the inflammatory burden of uncomplicated hypothyroidism in non-obese individuals may be relatively mild."))
]));

// ======================== RECOMMENDATIONS ========================
children.push(headingH1("Recommendations"));

children.push(para([
  new TextRun(p("Thyroid function testing should be considered in patients presenting with NAFPD or NAFLD as untreated hypothyroidism may contribute to the initiation or progression of ectopic fat deposition. Abdominal fat measurement should be incorporated into the routine clinical evaluation of hypothyroid patients given its strong and consistent association with both hepatic and pancreatic steatosis. Larger prospective cohort studies with longitudinal follow-up are needed to establish the temporal and causal relationships between hypothyroidism and NAFPD and to determine whether levothyroxine replacement therapy can reverse pancreatic steatosis. Future studies should include patients across the full BMI spectrum to clarify the interaction between obesity-driven inflammation and thyroid hormone deficiency in the pathogenesis of ectopic fat deposition. The role of TNF-alpha as a potential biomarker for thyroid dysfunction severity warrants further investigation in larger cohorts with standardised assay methods and longitudinal assessment before and after levothyroxine therapy. Interventional studies examining the effects of thyroid hormone replacement on pancreatic fat content ideally using quantitative imaging methods such as MRI-PDFF are needed to establish causality and guide clinical management. Given the reciprocal relationship between NAFLD and hypothyroidism demonstrated in recent large-scale meta-analyses mutual screening strategies should be considered in clinical practice."))
]));

// ======================== REFERENCES ========================
children.push(headingH1("References"));

children.push(refParaBoldPrefix("Al-Hindawi S (2019) ", "Analysis of Serum Il-6 and CRP Levels among Autoimmune and Non-Autoimmune Hypothyroid Patients. Indian Journal of Public Health Research and Development 10: 1439-1445."));
children.push(refParaBoldPrefix("Ayati Firoozabadi A, Elahi Vahed I, Lotfi P, et al. (2025) ", "The reciprocal relationship between non-alcoholic fatty liver disease and hypothyroidism: A systematic review and meta-analysis of about 39 million individuals. Plos one 20(12): e0338413."));
children.push(refParaBoldPrefix("Bayyigit A, Gokden Y, Onol S, et al. (2024) ", "Hypothyroidism and subclinical hypothyroidism are associated with fatty pancreas (Non-Alcoholic Fatty Pancreas Disease). Diabetes/Metabolism Research and Reviews 40(2): e3720."));
children.push(refParaBoldPrefix("Díte P, Blaho M, Bojková M, et al. (2019) ", "Nonalcoholic Fatty Pancreas Disease: Clinical Consequences. Digestive Diseases 38: 143-149."));
children.push(refParaBoldPrefix("Duntas L (2002) ", "Thyroid Disease and Lipids. Thyroid 12: 287-293."));
children.push(refParaBoldPrefix("Ghosh H, Biswas D, Pramanik S, et al. (2025) ", "Analysis of risk factors and predictive modelling of biomarkers in subclinical hypothyroidism and implications for levothyroxine therapy in disease management. Scientific Reports 15(1): 40946."));
children.push(refParaBoldPrefix("Hak AE, Pols HAP, Visser TJ, et al. (2000) ", "Subclinical Hypothyroidism Is an Independent Risk Factor for Atherosclerosis and Myocardial Infarction in Elderly Women: The Rotterdam Study. Annals of Internal Medicine 132(4): 270-278."));
children.push(refParaBoldPrefix("He W, An X, Li L, et al. (2017) ", "Relationship between Hypothyroidism and Non-Alcoholic Fatty Liver Disease: A Systematic Review and Meta-analysis. Frontiers in Endocrinology 8."));
children.push(refParaBoldPrefix("Lai R, Yin B, Feng Z, et al. (2024) ", "The causal relationship between 41 inflammatory cytokines and hypothyroidism: bidirectional two-sample Mendelian randomization study. Frontiers in Endocrinology 14: 1332383."));
children.push(refParaBoldPrefix("Mantovani A, Nascimbeni F, Lonardo A, et al. (2018) ", "Association Between Primary Hypothyroidism and Nonalcoholic Fatty Liver Disease: A Systematic Review and Meta-Analysis. Thyroid 28(10): 1270-1284."));
children.push(refParaBoldPrefix("Marchiori RC, Pereira LAF, Naujorks AA, et al. (2015) ", "Improvement of blood inflammatory marker levels in patients with hypothyroidism under levothyroxine treatment. BMC Endocrine Disorders 15(1): 32."));
children.push(refParaBoldPrefix("Nagasaki T, Inaba M, Shirakawa K, et al. (2007) ", "Increased levels of C-reactive protein in hypothyroid patients and its correlation with arterial stiffness in the common carotid artery. Biomedicine & Pharmacotherapy 61(2): 167-172."));
children.push(refParaBoldPrefix("Onohuean H, Nnolum-Orji NF, Naik Bukke SP, et al. (2025) ", "Non-alcoholic fatty pancreas disease (NAFPD) as a pre-neoplastic niche: Metabolic and inflammatory Gateways to pancreatic ductal adenocarcinoma. Journal of Clinical & Translational Endocrinology 42: 100424."));
children.push(refParaBoldPrefix("Pagkali A, Makris A, Brofidi K, et al. (2024) ", "Pathophysiological Mechanisms and Clinical Associations of Non-Alcoholic Fatty Pancreas Disease. Diabetes, Metabolic Syndrome and Obesity Volume 17: 283-294."));
children.push(refParaBoldPrefix("Pourseyedi N, Arefhosseini S, Tutunchi H, et al. (2025) ", "Evidence on the link between hypothyroidism and non-alcoholic fatty liver disease: an updated systematic review. BMC Endocrine Disorders 25(1): 154."));
children.push(refParaBoldPrefix("Ritter MJ, Amano I and Hollenberg AN (2020) ", "Thyroid Hormone Signaling and the Liver. Hepatology 72(2): 742-752."));
children.push(refParaBoldPrefix("Silveira Rossi JL, Barbalho SM, Reverete de Araujo R, et al. (2022) ", "Metabolic syndrome and cardiovascular diseases: Going beyond traditional risk factors. Diabetes/Metabolism Research and Reviews 38(3): e3502."));
children.push(refParaBoldPrefix("Tsou M-T (2021) ", "Subclinical Hypothyroidism Represents Visceral Adipose Indices, Especially in Women With Cardiovascular Risk. Journal of the Endocrine Society 5(6): bvab028."));
children.push(refParaBoldPrefix("Uppu S and Gupta M (2018) ", "Association between C-reactive protein and interleukin-6 levels in subclinical hypothyroid patients. Journal of Datta Meghe Institute of Medical Sciences University 13(4): 195."));
children.push(refParaBoldPrefix("Xiang L-l, Cao Y-t, Sun J, et al. (2024) ", "Association between thyroid function and nonalcoholic fatty liver disease: a dose-response meta-analysis. Frontiers in Endocrinology 15: 1399517."));
children.push(refParaBoldPrefix("Zeng X, Li B and Zou Y (2021) ", "The relationship between non-alcoholic fatty liver disease and hypothyroidism: A systematic review and meta-analysis. Medicine 100(17): e25738."));

// ======================== DOCUMENT ========================
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

const outPath = "D:\\ElGazzar_FREELANCE\\Areej\\Study files\\Humanized_V4_Discussion_Chapter_Areej_Ahmed_Mansour.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("DONE: " + outPath + " (" + (buffer.length / 1024).toFixed(1) + " KB)");
}).catch(err => {
  console.error("ERROR:", err.message);
});
