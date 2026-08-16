const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, PageBreak } = require('docx');

const BLUE = "2E75B6";
const BLACK = "000000";

function p(text, color = BLACK) {
  return { text, color, size: 22, font: "Times New Roman" };
}

function b(text) {
  return { text, color: "000000", size: 22, font: "Times New Roman", bold: true };
}

function bi(text) {
  return { text, color: "000000", size: 22, font: "Times New Roman", bold: true, italics: true };
}

function ref(text) {
  return { text, color: "000000", size: 20, font: "Times New Roman" };
}

function refB(text) {
  return { text, color: "000000", size: 20, font: "Times New Roman", bold: true };
}

// Build text runs: helper to create runs mixing black/blue
function runs(parts) {
  return parts.map(part => {
    if (typeof part === 'string') return new TextRun(p(part));
    return new TextRun({ ...p(part.text, part.color || BLACK), ...(part.bold ? { bold: true } : {}), ...(part.italics ? { italics: true } : {}) });
  });
}

function para(runsArray, options = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    ...options,
    children: runsArray
  });
}

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Times New Roman", color: "000000" })]
  });
}

function refPara(line) {
  return new Paragraph({
    spacing: { after: 80, line: 300 },
    children: [new TextRun(ref(line))]
  });
}

function refParaB(line) {
  return new Paragraph({
    spacing: { after: 80, line: 300 },
    children: [new TextRun(refB(line))]
  });
}

// Mixed reference with bold prefix
function refParaMix(boldPart, regularPart) {
  return new Paragraph({
    spacing: { after: 80, line: 300 },
    children: [new TextRun(refB(boldPart)), new TextRun(ref(regularPart))]
  });
}

const children = [
  heading("Discussion"),

  // Para 1 - Unchanged (epidemiological background)
  para([new TextRun(p("Hypertension is a major modifiable cardiovascular risk factor and remains common worldwide. A substantial proportion of affected adults are unaware of elevated blood pressure, particularly in settings where routine preventive assessment is limited. Opportunistic screening can therefore identify people who require repeat measurement, out-of-office confirmation, and clinical follow-up ")), new TextRun(b("(Poulter et al., 2015; Mills et al., 2016)"))]),

  // Para 2 - Unchanged
  para([new TextRun(p("Blood pressure screening and hypertension diagnosis must be distinguished. The ACC/AHA framework classifies office blood pressure by threshold, but diagnosis requires averaged measurements obtained on at least 2 separate occasions and is strengthened by home or ambulatory confirmation. A single clinic encounter can be influenced by situational stress and the white-coat effect ")), new TextRun(b("(Whelton et al., 2018; Flack & Adekola, 2020)"))]),

  // Para 3 - CHANGED (blue edits)
  para([
    new TextRun(p("This was a cross-sectional ")),
    new TextRun({ ...p("screening", BLUE) }),
    new TextRun(p(" study with prospective data collection among asymptomatic adult companions of hypertensive patients attending outpatient clinics at ")),
    new TextRun({ ...p("the 2 study hospitals", BLUE) }),
    new TextRun(p(". A convenience sampling method was used")),
    new TextRun({ ...p(".", BLUE) }),  // period was part of the removed clause
    new TextRun(p(" All 1,000 participants were retained in the analyses. They had no previous hypertension diagnosis, were not receiving antihypertensive therapy, and reported no symptoms suggestive of elevated blood pressure at the screening visit. Two auscultatory office readings were obtained during 1 visit and averaged for screening classification")),
    new TextRun({ ...p(" [Results, Table 6]", BLUE) }),
    new TextRun(p("."))
  ]),

  // Para 4 - Unchanged
  para([new TextRun(p("The primary aim was to estimate the burden of silent, previously undiagnosed, screen-detected elevated blood pressure among adult companions of hypertensive patients and to identify factors independently associated with stage 1 or stage 2 screening thresholds."))]),

  // Para 5 - Unchanged (demographics)
  para([new TextRun(p("The cohort included 1,000 participants, with a mean age of 36.15 ± 13.54 years and an age range of 18 to 95 years. Males represented 53.4% and females 46.6%. Most participants were married and university educated. These distributions reflected the clinic-based recruitment process and should not be interpreted as representative of the general Egyptian adult population."))]),

  // Para 6 - Unchanged
  para([new TextRun(p("The recruitment strategy is central to interpretation. Participants were companions of patients with hypertension and were therefore a convenience sample enriched for hypertension risk. Many companions were likely to be first-degree relatives or members of the same household, sharing genetic susceptibility, diet, physical environment, and health behaviors. This enrichment also provides a plausible explanation for the high prevalence of any family history at 49.5%."))]),

  // Para 7 - Unchanged (literature comparison)
  para([new TextRun(p("The relatively young mean age was comparable to younger-adult screening cohorts in which elevated blood pressure was already frequent. ")), new TextRun(b("Khan et al. (2024)")), new TextRun(p(" reported substantial prehypertension and hypertension among adults aged 20 to 40 years, while ")), new TextRun(b("de Freminville et al. (2024)")), new TextRun(p(" demonstrated that clinically important hypertension and secondary causes occur throughout the 18 to 40 year age range."))]),

  // Para 8 - CHANGED (blue edits for BMI description)
  para([
    new TextRun(p("BMI was ")),
    new TextRun({ ...p("based on a modified adult classification", BLUE) }),
    new TextRun(p(". Overweight was present in 38.7%, normal weight in 35.3%, obesity class I in 17.6%, combined obesity class II/III in 6.0%, and underweight in 2.4%")),
    new TextRun({ ...p(" [Results, Table 2]", BLUE) }),
    new TextRun(p(". The combined class II/III category and its BMI thresholds were ")),
    new TextRun({ ...p("as defined in the source data", BLUE) }),
    new TextRun(p("."))
  ]),

  // Para 9 - Unchanged
  para([new TextRun(p("Obesity, defined as class I plus combined class II/III, affected 23.6% of participants. When overweight and all obesity categories were combined, 62.3% had excess body weight. These 2 percentages describe different groupings and are therefore complementary rather than contradictory."))]),

  // Para 10 - Unchanged
  para([new TextRun(p("The high burden of excess body weight was consistent with the broader increase in adult adiposity reported in population surveillance. However, direct prevalence comparison is limited because the present cohort was younger, clinic based, and selectively recruited from companions of hypertensive patients ")), new TextRun(b("(Emmerich et al., 2024; Tu et al., 2025)"))]),

  // Para 11 - Unchanged (smoking)
  para([new TextRun(p("Most participants were non-smokers, accounting for 622 (62.2%), while 368 (36.8%) were current smokers and 10 (1.0%) were ex-smokers. Among current smokers, cigarettes were reported by 278 (75.54%), vaping by 50 (13.59%), and shisha smoking by 40 (10.87%). Current cigarette smokers consumed a median of 20 cigarettes/day (IQR: 15 to 20), current vapers reported a median of 1,000 puffs/day (IQR: 700 to 1,000), and shisha smokers reported a median of 0.27 sessions/week (IQR: 0.14 to 1.00). The median smoking duration among current smokers was 5 years (IQR: 2 to 11)."))]),

  // Para 12 - Unchanged
  para([new TextRun(p("Smoking has acute pressor and chronic vascular effects, but cross-sectional associations with measured blood pressure are often inconsistent because exposure intensity, body weight, cessation, and measurement timing vary. In the present analysis, smoking status was not significantly distributed across BP screening categories, cigarette quantity among current cigarette smokers did not differ across categories, and smoking duration was greater at higher BP ranges ")), new TextRun(b("(Jareebi, 2024; Gao et al., 2023)"))]),

  // Para 13 - Unchanged
  para([new TextRun(p("Combustible cigarettes, electronic cigarettes, and shisha involve different exposure profiles and should therefore be interpreted separately. Evidence supports cardiovascular effects from both combustible and electronic cigarettes, while waterpipe smoking has been associated with acute changes in heart rate, blood pressure regulation, vascular function, and longer-term cardiovascular risk ")), new TextRun(b("(Bhatnagar et al., 2019; Rahman et al., 2025)"))]),

  // Para 14 - Unchanged (family history)
  para([new TextRun(p("Any family history of chronic disease was reported by 49.5% of participants. Family history included hypertension in 36.1%, diabetes mellitus in 29.3%, and ischemic heart disease in 15.3%. These values should be interpreted within the risk-enriched companion sample rather than compared directly with population-based family-history prevalence."))]),

  // Para 15 - Unchanged
  para([new TextRun(p("Familial aggregation of blood pressure is supported by longitudinal evidence. ")), new TextRun(b("Kunnas and Nikkari (2023)")), new TextRun(p(" found higher systolic and diastolic blood pressure and a faster age-related rise among adults with a positive family history of hypertension."))]),

  // Para 16 - Unchanged
  para([new TextRun(b("Takase et al. (2025)")), new TextRun(p(" evaluated 9,001 participants from the Tohoku Medical Megabank Community-Based Cohort Study, a Japanese population cohort. The study showed additive contributions from genetic risk, family history, and lifestyle."))]),

  // Para 17 - Unchanged (comorbidities)
  para([new TextRun(p("All 1,000 participants were free from a previous hypertension diagnosis and antihypertensive treatment by design. Diabetes mellitus was self-reported by 2.1%, while cardiovascular disease and chronic kidney disease were not reported. These findings characterize the screened sample but do not exclude undiagnosed comorbidity because laboratory and record-based verification were not performed for every condition."))]),

  // Para 18 - Unchanged (BP readings)
  para([new TextRun(p("The 2 office readings were closely similar. Average systolic BP was 126.6 ± 15.1 mmHg and average diastolic BP was 80.5 ± 9.6 mmHg. On the basis of averaged single-visit readings, 29.3% were in the normal BP range, 11.9% in the elevated range, 34.0% in the stage 1 range, and 24.8% in the stage 2 range. The combined burden at stage 1 or stage 2 screening thresholds was 58.8%."))]),

  // Para 19 - Unchanged
  para([new TextRun(p("These categories indicate a screening signal rather than confirmed hypertension. The 2017 ACC/AHA diagnostic process requires averaged readings from at least 2 separate visits and recommends out-of-office confirmation when appropriate. The present measurements were taken during 1 clinic visit among people accompanying an ill relative, so situational stress and white-coat effects may have contributed to the observed burden ")), new TextRun(b("(Whelton et al., 2018; McCarthy et al., 2025)"))]),

  // Para 20 - Unchanged
  para([new TextRun(p("Because eligibility required the absence of self-reported symptoms at the screening visit, the observed burden can be described as silent, screen-detected stage 1 or stage 2 BP. In this context, the word silent refers to asymptomatic presentation at screening and does not imply confirmed chronic hypertension, absence of target-organ injury, or low clinical risk."))]),

  // Para 21 - Unchanged (Egypt comparison)
  para([new TextRun(p("A direct comparison with recent Egyptian population data was available from an analysis based on the Egypt National STEPwise Survey. It reported measured hypertension in 29.5% of Egyptian adults and obesity in 39.8%. In the present study, 58.8% met stage 1 or stage 2 screening thresholds, which was 29.3 percentage points higher than the Egyptian population estimate, while obesity affected 23.6%, which was 16.2 percentage points lower. These differences should be interpreted cautiously because the present study recruited a risk-enriched convenience sample of asymptomatic companions of hypertensive patients, used the ACC/AHA threshold of 130/80 mmHg, and classified participants from measurements obtained during a single visit ")), new TextRun(b("(Aboulghate et al., 2021)"))]),

  // Para 22 - Unchanged
  para([new TextRun(p("The present screening burden was also considerably higher than that reported in an Egyptian community screening study of 774 adults in Al-Waily district, Cairo, where hypertension prevalence was 16.5% and previously undiagnosed hypertension was identified in 11% of participants. Although this study was published before 2020, it was retained because it provides a directly relevant Egyptian community comparison. The higher burden in the present cohort may reflect familial and household risk enrichment, the lower ACC/AHA threshold, and the single-visit screening design ")), new TextRun(b("(Abd Elaziz et al., 2015)"))]),

  // Para 23 - Unchanged
  para([new TextRun(p("Recent international evidence provides additional context for the silent component of the findings. In 2019, 59% of women and 49% of men with hypertension worldwide reported a previous diagnosis, indicating that approximately 41% of affected women and 51% of affected men remained undetected. In contrast, all participants in the present cohort were previously undiagnosed by design, and 58.8% met stage 1 or stage 2 screening thresholds ")), new TextRun(b("(NCD Risk Factor Collaboration [NCD-RisC], 2021)"))]),

  // Para 24 - Unchanged
  para([new TextRun(p("The World Health Organization has similarly emphasized persistent country-level gaps in hypertension detection, treatment, and control and the need to strengthen systematic screening and linkage to care ")), new TextRun(b("(World Health Organization [WHO], 2023)"))]),

  // Para 25 - Unchanged
  para([new TextRun(p("The ACC/AHA threshold identifies more adults with elevated blood pressure than the historical 140/90 mmHg threshold. This broader classification increases sensitivity for cardiovascular risk but makes precise terminology and diagnostic confirmation particularly important in single-visit screening studies ")), new TextRun(b("(Vemu et al., 2024)"))]),

  // Para 26 - Unchanged (male representation)
  para([new TextRun(p("Male representation increased from 45.1% in the normal BP range to 60.1% in the stage 2 BP range, and the overall distribution differed significantly across categories (p=0.004). This pattern was consistent with population evidence showing higher hypertension prevalence in men at younger and middle adult ages ")), new TextRun(b("(Fryar et al., 2024; Connelly et al., 2022)"))]),

  // Para 27 - Unchanged (BMI gradient)
  para([new TextRun(p("BMI showed a strong gradient across screening categories. Obesity class I increased from 4.8% in the normal BP range to 33.1% in the stage 2 range, while combined obesity class II/III increased from 2.7% to 13.3%. Normal weight became less frequent as BP category increased."))]),

  // Para 28 - Unchanged
  para([new TextRun(p("This association is biologically and epidemiologically plausible. General and central obesity are associated with sympathetic activation, insulin resistance, renal sodium retention, and vascular dysfunction, and obesity remains strongly associated with hypertension after adjustment for demographic and behavioral factors ")), new TextRun(b("(Chen et al., 2023; Ren et al., 2023)"))]),

  // Para 29 - Unchanged
  para([new TextRun(p("Smoking status did not differ significantly across BP categories (p=0.098). This result does not exclude tobacco-related cardiovascular harm. The category-level comparison was less informative than product-specific exposure assessment because the source data contained different measurement units and missing intensity values."))]),

  // Para 30 - Unchanged
  para([new TextRun(p("Education and marital status differed in unadjusted categorical comparisons. Married, single, divorced, widow, engaged, and separated participants were retained as individually recorded categories, and the sparse distribution was handled with an appropriate exact procedure. These distributions were strongly influenced by age, household role, and recruitment setting and were therefore evaluated in the combined multivariable model rather than interpreted causally. Egyptian, American, Libyan, and Sudanese nationalities were also retained as separate categories, with no significant association with BP screening category (p=0.662)."))]),

  // Para 31 - Unchanged
  para([new TextRun(p("Family-history variables increased across screening categories. Any family history rose from 35.2% in the normal BP range to 58.1% in the stage 2 range, and family history of hypertension rose from 24.9% to 46.0%. This gradient was consistent with the familial clustering described by ")), new TextRun(b("Kunnas and Nikkari (2023)")), new TextRun(p(" and ")), new TextRun(b("Takase et al. (2025)"))]),

  // Para 32 - Unchanged
  para([new TextRun(p("Continuous characteristics were compared using the Kruskal-Wallis test rather than analysis of variance. Age, number of children, MAP, and smoking duration among current smokers differed across BP screening categories. Cigarette consumption among current cigarette smokers with valid data did not differ significantly (p=0.576)."))]),

  // Para 33 - Unchanged (correlations)
  para([new TextRun(p("MAP correlated positively with age (rs=0.320), number of children (rs=0.278), and smoking duration among current smokers (rs=0.324). Cigarettes/day was not significantly correlated with MAP."))]),

  // Para 34 - CHANGED (REWRITTEN - entire regression model in blue)
  para([
    new TextRun({ ...p("A single combined multivariable logistic regression model was built for the outcome of stage 1 or stage 2 screening criteria versus normal or elevated BP. The model included age, number of children, sex, current smoking, any family history, obesity, university education, marital status, and history of diabetes mellitus [Results, Table 10]. In the univariable analysis, number of children was significantly associated with lower odds of the outcome (OR 0.87, 95% CI 0.77 to 0.98; p=0.032), and university education was associated with higher odds (OR 1.71, 95% CI 1.06 to 2.75; p=0.027). Age showed a borderline inverse association (OR 0.98, 95% CI 0.97 to 1.00; p=0.082). Other variables, including sex, smoking status, family history, obesity, marital status, and history of diabetes mellitus, were not significantly associated with the outcome in univariable analysis [Results, Table 10].", BLUE) })
  ]),

  // Para 35 - CHANGED (REWRITTEN - entire multivariable result in blue)
  para([
    new TextRun({ ...p("After multivariable adjustment, none of the evaluated factors remained statistically significant. The association between number of children and the outcome was attenuated (adjusted OR 1.527, 95% CI 0.93 to 2.50; p=0.093), and university education was not independently associated (adjusted OR 0.903, 95% CI 0.798 to 1.022; p=0.108) [Results, Table 10]. These findings suggest that the significant univariable associations were explained by confounding, and no independent predictors were identified in the final multivariable model.", BLUE) })
  ]),

  // Para 36 - CHANGED (REWRITTEN)
  para([
    new TextRun({ ...p("The cross-tabulations showed that obesity prevalence increased sharply across BP screening categories\u2014obesity class I rose from 4.8% in the normal BP range to 33.1% in the stage 2 range, and combined obesity class II/III rose from 2.7% to 13.3% (p<0.001) [Results, Table 7]. Similarly, male sex increased from 45.1% to 60.1% across the same categories (p=0.004), and any family history increased from 35.2% to 58.1% (p<0.001) [Results, Table 7]. These unadjusted patterns are consistent with established epidemiological evidence linking obesity, male sex, and familial predisposition with higher blood pressure ", BLUE) }),
    new TextRun(b("(Connelly et al., 2022; Chen et al., 2023; Takase et al., 2025)")),
    new TextRun({ ...p(", but they did not persist as independent predictors after multivariable adjustment in this cohort.", BLUE) })
  ]),

  // Para 37 - CHANGED (ROC detail added in blue)
  para([
    new TextRun({ ...p("ROC analysis was restricted to valid non-BP continuous predictors. Age had an AUC of 0.608 (95% CI 0.573 to 0.644), best cut-off 36 years, sensitivity 52.2%, and specificity 67.8% (p<0.001). Number of children had an AUC of 0.599 (95% CI 0.565 to 0.633), best cut-off 2 children, sensitivity 59.7%, and specificity 58.0% (p<0.001) [Results, Table 11]. The AUC of approximately 0.61 for age indicated limited rather than strong discriminative performance. Although advancing age is consistently associated with increasing blood pressure, age alone was insufficient for reliable individual classification in this cohort ", BLUE) }),
    new TextRun(b("(Fryar et al., 2024)"))
  ]),

  // Para 38 - CHANGED (conclusion about predictors in blue)
  para([
    new TextRun({ ...p("A substantial burden of silent, screen-detected elevated BP was observed, with 58.8% of the 1,000 participants meeting stage 1 or stage 2 screening thresholds during the study visit. Univariable associations were observed for number of children and university education, but no independent predictors were identified after multivariable adjustment. These findings do not establish hypertension prevalence in the general population or confirm individual diagnoses, but they indicate that opportunistic screening of relatives and companions of hypertensive patients is a high-yield strategy for identifying adults who need repeat standardized assessment and diagnostic confirmation.", BLUE) })
  ]),

  // Para 39 - Unchanged (recommendations)
  para([new TextRun(p("Based on these findings, outpatient services caring for hypertensive patients should incorporate systematic family-centered screening. Adult first-degree relatives and household companions should be offered standardized BP measurement, particularly men, individuals with obesity, and those reporting a family history of chronic disease. Participants with elevated readings should receive repeat office measurements on separate occasions and, when available, home or ambulatory BP monitoring before a diagnosis is established."))]),

  // Para 40 - Unchanged
  para([new TextRun(p("A clear referral pathway should accompany screening. Individuals with persistent stage 1 or stage 2 readings should be referred to primary care or an appropriate specialist for confirmation, cardiovascular risk assessment, and management. Those with very high readings or symptoms suggestive of hypertensive urgency or emergency should receive immediate clinical evaluation. Family-based counseling should also address weight reduction, dietary salt, physical activity, smoking cessation, and adherence to follow-up."))]),

  // Para 41 - CHANGED (limitations - blue edits)
  para([
    new TextRun(p("This study had several limitations. Blood pressure was measured during a single visit, so the findings represent silent, screen-detected BP ranges rather than confirmed hypertension and may have been affected by white-coat or situational stress. The term silent was based on the absence of self-reported symptoms at screening and did not include a detailed symptom severity scale or assessment of target-organ injury. Recruitment of companions of hypertensive patients produced selection bias and a risk-enriched convenience sample. Family history and smoking exposure were self-reported and were vulnerable to recall and reporting error. ")),
    new TextRun({ ...p("[Unverified] The blood pressure device type was not specified in the available data.", BLUE) }),
    new TextRun(p(" Recruitment was limited to ")),
    new TextRun({ ...p("2 hospitals", BLUE) }),
    new TextRun(p(", restricting geographic generalizability. Finally, the cross-sectional design precluded temporal or causal conclusions about the identified associations."))
  ]),

  // References heading
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text: "References", bold: true, size: 28, font: "Times New Roman", color: "000000" })]
  }),

  // Reference entries
  refParaMix("Abd Elaziz, K. M., Dewedar, S. A., Sabbour, S., El Gafaary, M. M., Marzouk, D. M., Aboul Fotouh, A., & Allam, M. F. (2015). ", "Screening for hypertension among adults: community outreach in Cairo, Egypt. Journal of Public Health, 37(4), 701-706."),
  refParaMix("Aboulghate, M., Elaghoury, A., Elebrashy, I., Elkafrawy, N., Elshishiney, G., Abul-Magd, E., Bassiouny, E., Toaima, D., Elezbawy, B., Fasseeh, A., Abaza, S., & Vokó, Z. (2021). ", "The burden of obesity in Egypt. Frontiers in Public Health, 9, Article 718978. https://doi.org/10.3389/fpubh.2021.718978"),
  refParaMix("Afreen, A., Khan, M. N., Nousheen, R., Shehzad, S. K., Rehman, A. U., & Rana, F. S. (2019). ", "Prevalence of hypertension in younger population according to new ACC guidelines 2017. Pakistan Armed Forces Medical Journal, 69(Suppl-3), S476\u2013S480."),
  refParaMix("Bhatnagar, A., Maziak, W., Eissenberg, T., Ward, K. D., Thurston, G., King, B. A., Sutfin, E. L., Cobb, C. O., Griffiths, M., Goldstein, L. B., & Rezk-Hanna, M. (2019). ", "Water pipe (hookah) smoking and cardiovascular disease risk: A scientific statement from the American Heart Association. Circulation, 139(19), e917\u2013e936. https://doi.org/10.1161/CIR.0000000000000671"),
  refParaMix("Chen, L., Zhang, J., Zhou, N., Weng, J. Y., Bao, Z. Y., & Wu, L. D. (2023). ", "Association of different obesity patterns with hypertension in US male adults: A cross-sectional study. Scientific Reports, 13(1), Article 10551."),
  refParaMix("Connelly, P. J., Currie, G., & Delles, C. (2022). ", "Sex differences in the prevalence, outcomes and management of hypertension. Current Hypertension Reports, 24(6), 185\u2013192."),
  refParaMix("de Freminville, J. B., Gardini, M., Cremer, A., Camelli, S., Baron, S., Bobrie, G., et al. (2024). ", "Prevalence and risk factors for secondary hypertension in young adults. Hypertension, 81(11), 2340\u20132349."),
  refParaMix("Emmerich, S. D., Fryar, C. D., Stierman, B., & Ogden, C. L. (2024). ", "Obesity and severe obesity prevalence in adults: United States, August 2021\u2013August 2023 (NCHS Data Brief No. 508). National Center for Health Statistics."),
  refParaMix("Flack, J. M., & Adekola, B. (2020). ", "Blood pressure and the new ACC/AHA hypertension guidelines. Trends in Cardiovascular Medicine, 30(3), 160\u2013164."),
  refParaMix("Fryar, C. D., Kit, B., Carroll, M. D., & Afful, J. (2024). ", "Hypertension prevalence, awareness, treatment, and control among adults age 18 and older: United States, August 2021\u2013August 2023 (NCHS Data Brief No. 512). National Center for Health Statistics."),
  refParaMix("Fujii, R., Hishida, A., Nakatochi, M., Okumiyama, H., Takashima, N., Tsuboi, Y., et al. (2024). ", "Polygenic risk score for blood pressure and lifestyle factors with overall and CVD mortality: A prospective cohort study in a Japanese population. Hypertension Research. Advance online publication."),
  refParaMix("Gao, N., Liu, T., Wang, Y., Chen, M., Yu, L., Fu, C., & Xu, K. (2023). ", "Assessing the association between smoking and hypertension: Smoking status, type of tobacco products, and interaction with alcohol consumption. Frontiers in Cardiovascular Medicine, 10, Article 1027988."),
  refParaMix("Jareebi, M. A. (2024). ", "The association between smoking behavior and the risk of hypertension: Review of the observational and genetic evidence. Journal of Multidisciplinary Healthcare, 17, 3265\u20133281. https://doi.org/10.2147/JMDH.S470589"),
  refParaMix("Khan, B., Memon, N. J., Kalhoro, M. A., Shaikh, M., Mehwish, & Inayat, D. (2024). ", "Prevalence along with the risk factors of hypertension in young adults in the population under study: A cross-sectional study. Journal of Population Therapeutics and Clinical Pharmacology, 31(7), 565\u2013570."),
  refParaMix("Kunnas, T., & Nikkari, S. T. (2023). ", "Family history of hypertension enhances age-dependent rise in blood pressure: A 15-year follow-up, the Tampere adult population cardiovascular risk study. Medicine, 102(39), Article e35366."),
  refParaMix("Mancia, G., Fagard, R., Narkiewicz, K., Redon, J., Zanchetti, A., Böhm, M., Christiaens, T., Cifkova, R., De Backer, G., Dominiczak, A., Galderisi, M., Grobbee, D. E., Jaarsma, T., Kirchhof, P., Kjeldsen, S. E., Laurent, S., Manolis, A. J., Nilsson, P. M., Ruilope, L. M., Schmieder, R. E., ... & Wood, D. A. (2013). ", "2013 ESH/ESC guidelines for the management of arterial hypertension: The Task Force for the Management of Arterial Hypertension of the European Society of Hypertension (ESH) and of the European Society of Cardiology (ESC). European Heart Journal, 34(28), 2159\u20132219."),
  refParaMix("McCarthy, C. P., Bruno, R. M., McEvoy, J. W., & Touyz, R. M. (2025). ", "2024 ESC guidelines for the management of elevated blood pressure and hypertension: What is new in pharmacotherapy? European Heart Journal, 46(8), 729\u2013733."),
  refParaMix("Mills, K. T., Bundy, J. D., Kelly, T. N., Reed, J. E., Kearney, P. M., Reynolds, K., ... & He, J. (2016). ", "Global disparities of hypertension prevalence and control: A systematic analysis of population-based studies from 90 countries. Circulation, 134(6), 441\u2013450."),
  refParaMix("NCD Risk Factor Collaboration (NCD-RisC). (2021). ", "Worldwide trends in hypertension prevalence and progress in treatment and control from 1990 to 2019: A pooled analysis of 1,201 population-representative studies with 104 million participants. The Lancet, 398(10304), 957-980. https://doi.org/10.1016/S0140-6736(21)01330-1"),
  refParaMix("Poulter, N. R., Prabhakaran, D., & Caulfield, M. (2015). ", "Hypertension. The Lancet, 386(9995), 801\u2013812."),
  refParaMix("Rahman, M., Alatiqi, M., Al Jarallah, M., Hussain, M. Y., Monayem, A., Panduranga, P., & Rajan, R. (2025). ", "Cardiovascular effects of smoking and smoking cessation: A 2024 update. Global Heart, 20(1), 15. https://doi.org/10.5334/gh.1399"),
  refParaMix("Ren, H., Guo, Y., Wang, D., Kang, X., & Yuan, G. (2023). ", "Association of normal-weight central obesity with hypertension: A cross-sectional study from the China Health and Nutrition Survey. BMC Cardiovascular Disorders, 23(1), 120."),
  refParaMix("Takase, M., Hirata, T., Nakaya, N., Kogure, M., Hatanaka, R., Nakaya, K., et al. (2025). ", "Associations of family history of hypertension, genetic, and lifestyle risks with incident hypertension. Hypertension Research, 48(10), 2606\u20132617."),
  refParaMix("Tu, J., Chen, H., Zeng, Q., Chen, L., Guo, Y., & Chen, K. (2025). ", "Trends in obesity prevalence among adults with hypertension in the United States, 2001 to 2023. Hypertension, 82(3), 498\u2013508."),
  refParaMix("Vemu, P. L., Yang, E., & Ebinger, J. E. (2024). ", "Moving toward a consensus: Comparison of the 2023 ESH and 2017 ACC/AHA hypertension guidelines. JACC: Advances, 3(10), Article 101230."),
  refParaMix("World Health Organization. (2023). ", "Global report on hypertension: The race against a silent killer. World Health Organization."),
  refParaMix("Whelton, P. K., Carey, R. M., Aronow, W. S., Casey Jr, D. E., Collins, K. J., Dennison Himmelfarb, C., ... & Wright Jr, J. T. (2018). ", "2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA guideline for the prevention, detection, evaluation, and management of high blood pressure in adults: a report of the American College of Cardiology/American Heart Association Task Force on Clinical Practice Guidelines. Circulation, 138(17), e484-e594."),
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 22 } }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children
  }]
});

const outPath = "D:\\ElGazzar_FREELANCE\\Amr Mohamed Mamdouh Hassan Elzayat\\Amr Mohamed Mamdouh Hassan Elzayat Discussion (OLD)_output\\Amr Mohamed Mamdouh Hassan Elzayat Discussion.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("DONE: " + outPath);
});
