---
name: advanced-biostatistics
description: "Advanced biostatistics guides and coding workflows for Multiple Imputation (MICE), Propensity Score Matching (PSM), and Meta-Analysis with Forest/Funnel plots in R."
license: MIT

---

# Advanced Biostatistics Skill Guide: MICE, PSM, and Meta-Analysis

This skill document defines the theoretical concepts, package parameters, mathematical foundations, and standard coding structures used in your system for **Multiple Imputation by Chained Equations (MICE)**, **Propensity Score Matching (PSM)**, and **Clinical Meta-Analysis**.

---

## 1. Multiple Imputation by Chained Equations (MICE)

In clinical research, deleting cases with missing cells (listwise deletion) reduces power and introduces bias. MICE generates $m$ separate completed datasets by iteratively modeling each missing variable conditional on the others. After analysis, results are pooled using **Rubin's Rules** to account for imputation uncertainty.

### Core R Workflow (using `mice`)
```R
library(mice)

# 1. Inspect missingness pattern
md.pattern(clinical_data)

# 2. Set imputation methods
# pmm = predictive mean matching (continuous)
# logreg = logistic regression (binary)
# polyreg = polytomous regression (unordered categories)
# lda = linear discriminant analysis (ordered categories)
methods <- c("age" = "", "gender" = "", "treatment" = "", "outcome" = "pmm")

# 3. Execute Imputation (m = 5-10 is standard, maxit = 10-20 iterations)
imp_object <- mice(clinical_data, m = 5, method = methods, maxit = 10, seed = 123)

# 4. Diagnostics: Trace and Density plots
plot(imp_object)          # Check convergence (no obvious trends in chains)
densityplot(imp_object)   # Check shape (imputed vs. observed distribution)

# 5. Fit model and pool results (Rubin's Rules)
fit <- with(imp_object, lm(outcome ~ treatment + age + gender))
pooled_fit <- pool(fit)
summary(pooled_fit)
```

---

## 2. Propensity Score Matching (PSM)

In observational studies, treatment groups (e.g., surgery vs. drug) are often highly unbalanced because doctors select treatments based on age, severity, or comorbidities. PSM estimates the probability of receiving treatment (the *propensity score*) based on confounders, then pairs patients with similar scores to simulate a randomized trial.

### Core R Workflow (using `MatchIt`)
```R
library(matchit)
library(cobalt)
library(sandwich)
library(lmtest)

# 1. Matching: 1:1 nearest neighbor within a caliper width (default 0.1-0.2 SD of propensity score)
match_model <- matchit(
  treatment ~ age + baseline_severity + comorbidities,
  data = raw_cohort,
  method = "nearest",
  distance = "glm",
  link = "logit",
  caliper = 0.15
)

# 2. Balance Checks: Standard standardized mean differences (SMD)
summary(match_model)
love.plot(match_model, threshold = 0.1, abs = TRUE)  # SMDs should be < 0.1 post-match

# 3. Extract Matched Data
matched_cohort <- match.data(match_model)

# 4. Outlier Analysis / Outcome regression
# Because matching introduces paired dependencies, use cluster-robust standard errors
# clustered by 'subclass' (the matched pair IDs).
outcome_fit <- lm(recovery_days ~ treatment + age + baseline_severity, data = matched_cohort, weights = weights)
coeftest(outcome_fit, vcov = vcovCL, cluster = ~subclass)
```

---

## 3. Clinical Meta-Analysis

Meta-analysis synthesizes treatment effects across independent clinical studies. Studies are pooled using either a **Common (Fixed) Effect Model** (assumes a single true effect underlies all studies) or a **Random-Effects Model** (assumes the true effect varies across populations, estimating between-study variance $\tau^2$).

### Mathematical Foundations
*   **Heterogeneity ($I^2$):** The proportion of total variation across studies due to heterogeneity rather than chance.
    
    $$I^2 = 100\% \times \frac{Q - df}{Q}$$
    
    *   $I^2 \approx 25\%$ (Low), $50\%$ (Moderate), $75\%$ (High). High heterogeneity requires random-effects modeling.
*   **Egger's Test:** Diagnoses publication bias by evaluating asymmetry in the funnel plot (standard error plotted against log effect size).

### Core R Workflow (using `meta` and `metafor`)
```R
library(meta)
library(metafor)

# A. Binary Outcomes (Odds Ratios / Risk Ratios)
m_bin <- metabin(
  event.e = ee, n.e = ne,      # Experiment events & total
  event.c = ec, n.c = nc,      # Control events & total
  studlab = study_names,
  data = trial_dataset,
  sm = "OR",                   # Odds Ratio (or "RR", "RD")
  common = FALSE, random = TRUE
)

# B. Continuous Outcomes (Mean Differences)
m_cont <- metacont(
  n.e = ne, mean.e = me, sd.e = sde,  # Experiment details
  n.c = nc, mean.c = mc, sd.c = sdc,  # Control details
  studlab = study_names,
  data = continuous_dataset,
  sm = "SMD",                         # Standardized Mean Difference ("MD" for raw)
  method.smd = "Hedges"               # Hedges' g (corrects for small sample bias)
)

# C. Generating Forest & Funnel Plots
forest(m_bin, col.diamond = "red")
funnel(m_bin)
```

---

## 4. References & Study Guides

*   **Doing Meta-Analysis in R (Harrer et al.):** Master repository for pooling methods, subgroup moderator analyses, and meta-regression: [Doing-Meta-Analysis-in-R](https://github.com/MathiasHarrer/Doing-Meta-Analysis-in-R).
*   **Wolfgang Viechtbauer's Metafor Guide:** Detailed documentation for custom random-effects models and diagnostic checks: [metafor](https://github.com/wviechtb/metafor).
*   **CONSORT & STROBE Reporting Guidelines:** Ensure that all imputations, match ratios, calipers, and heterogeneity statistics are explicitly declared in the methods section of your academic publications.
*   **SAMPL Guidelines (Statistical Analyses and Methods in the Published Literature):** Always abide by SAMPL guidelines when reporting statistical outputs. Specifically:
    - Describe statistical methods with enough detail to verify results. Provide sufficient data (numerators, denominators) for future meta-analyses.
    - Summarize normal data with Mean (SD), not Mean ± SD. Summarize non-normal data with Medians and boundaries (min/max).
    - NEVER use Standard Error (SE) for descriptive variability. Use SD, inter-percentile ranges, or 95% Confidence Intervals.
    - Always provide an indicator of precision (e.g., 95% CI) rather than relying solely on *p*-values.
    - Report exact *p*-values to 2 decimal places (e.g., *p* = .03) rather than inequalities (e.g., *p* < .05), and do not use "NS" for non-significant results.
