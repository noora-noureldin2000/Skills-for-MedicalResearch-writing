---
name: Biostatistical Methodology & Analysis Guide
description: Clinical study design selection, statistical assumptions, biostatistical test selection guidelines, parametric/nonparametric decision trees, and diagnostic/survival analysis methods derived from Applied Medical Statistics.
---

# Biostatistical Methodology & Medical Analysis Guide

This skill provides expert biostatistical rules, clinical study design decisions, statistical test selection matrices, assumption verification protocols, and specialized analytical formulas based on *Applied Medical Statistics for Beginners* (Dr. Mohamed Elsherif).

---

## 1. Clinical Study Design & Methodology

### 1.1 Study Classification Matrix

| Study Design | Key Characteristics | Measure of Association | Primary Strengths & Limitations |
| :--- | :--- | :--- | :--- |
| **Cross-Sectional** | Exposure & outcome measured simultaneously at one point in time. | Odds Ratio (OR), Prevalence Ratio | Fast & low cost; cannot determine temporal sequence/causality. |
| **Case-Control** | Selects subjects based on outcome status (Cases vs. Controls); retroactively assesses exposure. | Odds Ratio (OR) | Ideal for rare diseases / long latency; prone to recall and selection bias. |
| **Cohort** | Selects subjects based on exposure status; follows forward (prospective/retrospective) for outcome. | Relative Risk (RR), Hazard Ratio (HR), Incidence Rate Ratio | Establishes temporal sequence; expensive, loss to follow-up risk. |
| **Randomized Controlled Trial (RCT)** | Experimental allocation of intervention vs. control with randomization & blinging. | Relative Risk (RR), Absolute Risk Reduction (ARR), NNT | Gold standard for causality; expensive, ethical constraints. |

---

## 2. Statistical Test Selection Protocol

To select the appropriate statistical test, evaluate:
1. **Outcome variable type** (Continuous, Ordinal, Nominal/Binary, Time-to-event).
2. **Number of comparison groups** (1, 2, or 3+ groups).
3. **Study structure** (Independent / unpaired vs. Paired / repeated measures).
4. **Normality and Variance Homogeneity** (Parametric vs. Nonparametric assumptions).

### 2.1 Complete Test Selection Matrix

| Outcome Type | Group Structure | Parametric Test (Normal Data) | Non-Parametric Test (Non-Normal Data) |
| :--- | :--- | :--- | :--- |
| **Continuous** | 2 Independent Groups | Independent Samples *t*-test | Mann-Whitney *U* test |
| **Continuous** | 2 Paired/Matched Groups | Paired Samples *t*-test | Wilcoxon Signed-Rank test |
| **Continuous** | 3+ Independent Groups | One-Way ANOVA | Kruskal-Wallis *H* test |
| **Continuous** | 3+ Repeated/Matched Groups| Repeated Measures ANOVA | Friedman test |
| **Continuous** | 2 Factors (Interaction) | Two-Way Factorial ANOVA | Two-Way ANOVA on Ranks / Aligned Rank |
| **Categorical/Binary** | Independent Groups | Chi-Square Test of Independence | Fisher's Exact Test (if expected cell count < 5) |
| **Categorical/Binary** | Paired/Matched Groups | McNemar's Test | Exact McNemar / Cochran's Q (for 3+ paired) |
| **Time-to-Event** | Independent Groups | Log-Rank Test | Cox Proportional Hazards Regression |
| **Correlation** | Continuous Pair | Pearson Correlation (*r*) | Spearman Rank Correlation ($\rho$) |

---

## 3. Assumption Verification & Diagnostic Rules

### 3.1 Normality & Variance Assessment
- **Normality Evaluation**:
  - Statistical tests: Shapiro-Wilk test (preferred for $n < 50$), Kolmogorov-Smirnov with Lilliefors correction ($n \ge 50$).
  - Visual inspection: Q-Q Plot alignment, Histogram symmetry, Skewness ($[-1, +1]$) & Kurtosis ($[-2, +2]$).
- **Homogeneity of Variance**:
  - Levene's Test or Bartlett's Test ($p > 0.05$ indicates equal variance).
  - If equal variance is violated in ANOVA $\rightarrow$ Use Welch's ANOVA with Games-Howell post-hoc test.

---

## 4. Specialized Biostatistical Formulas & Calculations

### 4.1 Diagnostic Test Accuracy
- **Sensitivity**: $\frac{TP}{TP + FN}$ (Probability of positive test given disease).
- **Specificity**: $\frac{TN}{TN + FP}$ (Probability of negative test given no disease).
- **Positive Predictive Value (PPV)**: $\frac{TP}{TP + FP}$ (Probability of disease given positive test; prevalence-dependent).
- **Negative Predictive Value (NPV)**: $\frac{TN}{TN + FN}$ (Probability of no disease given negative test; prevalence-dependent).
- **Positive Likelihood Ratio ($LR+$)**: $\frac{\text{Sensitivity}}{1 - \text{Specificity}}$
- **Negative Likelihood Ratio ($LR-$)**: $\frac{1 - \text{Sensitivity}}{\text{Specificity}}$
- **Youden's Index ($J$)**: $\text{Sensitivity} + \text{Specificity} - 1$ (Optimal ROC cut-point threshold).

### 4.2 Epidemiology & Risk Measures
- **Relative Risk (RR)**: $\frac{a / (a + b)}{c / (c + d)}$ (Used in Cohort / RCTs).
- **Odds Ratio (OR)**: $\frac{a \times d}{b \times c}$ (Used in Case-Control & Logistic Regression).
- **Absolute Risk Reduction (ARR)**: $| Risk_{\text{control}} - Risk_{\text{intervention}} |$
- **Number Needed to Treat (NNT)**: $\frac{1}{\text{ARR}}$

---

## 5. APA 7th Statistical Reporting Standards

- **p-values**: Report exact $p$-values to 3 decimal places (e.g., $p = .024$). Report $p < .001$ for smaller values (never $p = .000$).
- **Effect Sizes**:
  - *t*-test: Cohen's $d$ ($0.2=$ small, $0.5=$ medium, $0.8=$ large).
  - ANOVA: Partial $\eta^2$ ($0.01=$ small, $0.06=$ medium, $0.14=$ large).
  - Categorical: Cramér's $V$ or Odds Ratio / Hazard Ratio with 95% Confidence Intervals.
