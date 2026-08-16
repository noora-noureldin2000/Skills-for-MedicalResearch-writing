---
name: spss-apa-reporting
description: "Professional data analysis of SPSS statistics documents (.sav) using Python/R and generating academic reports with tables and figures formatted strictly to APA 7th style."
license: MIT
author: Antigravity AI
---

# SPSS Data Analysis & APA 7th Reporting Skill

This skill guide provides the concepts, formulas, code templates, and styling guidelines required to read SPSS statistics datasets (`.sav`), run professional descriptive and inferential analyses, and export academic-grade reports in MS Word (`.docx`) and R with figures and tables adhering strictly to APA 7th edition formatting.

---

## 1. Reading SPSS Data

SPSS statistics documents use a compiled binary format (`.sav`) containing metadata such as variable labels (descriptions of columns) and value labels (mappings of numerical codes to strings).

### Python (using `pyreadstat` and `pandas`)
```python
import pandas as pd
import pyreadstat

# Load the file and extract metadata
df, meta = pyreadstat.read_sav("path/to/file.sav")

# Access metadata mapping
gender_labels = meta.variable_value_labels.get("Gender", {})
variable_description = meta.column_names_to_labels.get("Gender", "Gender")

# Map codes to labels for descriptive analyses
df["Gender_Label"] = df["Gender"].map(gender_labels)
```

### R (using `haven`)
```R
library(haven)

# Read SPSS file preserving labels
df <- read_sav("path/to/file.sav")

# Convert specific columns to factors using SPSS value labels
df$Gender_Label <- as_factor(df$Gender)
```

---

## 2. Statistical Pipeline

### A. Scale Reliability (Cronbach's Alpha)
Used to validate the internal consistency of Likert-scale questionnaires (e.g., DASS-21). A value of $\alpha \ge .70$ is acceptable; $\alpha \ge .80$ is good; $\alpha \ge .90$ is excellent.

$$\alpha = \frac{N}{N-1} \left(1 - \frac{\sum \sigma^2_Y}{\sigma^2_X}\right)$$

*   **Python implementation:**
    ```python
    def cronbach_alpha(df_items):
        df_items = df_items.dropna()
        item_vars = df_items.var(ddof=1)
        total_var = df_items.sum(axis=1).var(ddof=1)
        n_items = df_items.shape[1]
        return (n_items / (n_items - 1)) * (1 - (item_vars.sum() / total_var))
    ```

### B. Inferential Analyses
1.  **Group Differences (2 Groups):** Independent-samples t-test. Use Welch's t-test (unequal variances assumed) by default in R (`t.test(..., var.equal = FALSE)`) and Python (`scipy.stats.ttest_ind(..., equal_var = False)`).
2.  **Group Differences (3+ Groups):** One-way ANOVA followed by Tukey's HSD (Honestly Significant Difference) post-hoc test to identify pairwise differences while controlling for Family-Wise Error Rate.
3.  **Multivariable Modeling (Multiple Linear Regression):** Predicts an outcome controlling for multiple confounders. Compute standardized coefficients ($\beta$) to compare predictor impact strength:
    
    $$\beta_j = B_j \times \frac{SD(X_j)}{SD(Y)}$$

*   **Python Regression (with standardized beta):**
    ```python
    import statsmodels.api as sm
    
    def run_regression(df, y_col, x_cols):
        df_clean = df[[y_col] + x_cols].dropna()
        y = df_clean[y_col]
        X = df_clean[x_cols]
        
        # Calculate standard deviations for beta
        y_std = y.std()
        x_stds = X.std()
        
        X_const = sm.add_constant(X)
        model = sm.OLS(y, X_const).fit()
        
        # Extract B, Beta, t, and p
        for col in x_cols:
            B = model.params[col]
            beta = B * (x_stds[col] / y_std) if y_std > 0 else 0.0
            t_val = model.tvalues[col]
            p_val = model.pvalues[col]
            # Report in APA style
    ```

---

## 3. APA 7th Table Styling in MS Word

APA 7th tables require a clean presentation without vertical gridlines, using minimal horizontal borders (only top, bottom, and bottom of the header row). Text columns are left-aligned; statistical/numeric columns are centered.

### Python-docx Styling XML Helper Code
Use these XML functions to format your word tables dynamically:

```python
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def apply_apa_table_borders(table):
    """Removes default borders and applies top and bottom APA lines"""
    tblPr = table._tbl.tblPr
    tblBorders = tblPr.find(qn('w:tblBorders'))
    if tblBorders is not None:
        tblPr.remove(tblBorders)
        
    tblBorders = OxmlElement('w:tblBorders')
    
    # Top border (0.5 pt)
    top = OxmlElement('w:top')
    top.set(qn('w:val'), 'single')
    top.set(qn('w:sz'), '4') # sz 4 = 0.5 pt
    top.set(qn('w:space'), '0')
    top.set(qn('w:color'), '000000')
    tblBorders.append(top)
    
    # Bottom border (0.5 pt)
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '4')
    bottom.set(qn('w:space'), '0')
    bottom.set(qn('w:color'), '000000')
    tblBorders.append(bottom)
    
    # Disable vertical/inner borders
    for border_name in ['left', 'right', 'insideH', 'insideV']:
        border = OxmlElement(f'w:{border_name}')
        border.set(qn('w:val'), 'none')
        tblBorders.append(border)
        
    tblPr.append(tblBorders)

def set_cell_bottom_border(cell):
    """Draws a bottom horizontal border under the cell (for headers)"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '4')
    bottom.set(qn('w:space'), '0')
    bottom.set(qn('w:color'), '000000')
    tcBorders.append(bottom)
    tcPr.append(tcBorders)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets cell padding in dxa (1 pt = 20 dxa)"""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for margin_side, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{margin_side}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)
```

---

## 4. Academic Figure Standards (APA 7th)

### Formatting Layout
1.  **Figure Number:** Above the title, in bold (e.g., **Figure 1**).
2.  **Figure Title:** One line spacing below the figure number, in italics using Title Case (e.g., *Prevalence of Mental Distress*).
3.  **The Visual Element:** The image itself (no border around the image).
4.  **Note:** Below the figure, flush left, starting with *Note.* in italics, followed by descriptions of abbreviations, scales, and significance indicators (e.g., *Note.* DASS-21 score ranges are 0–42. *p < .05).

### Visual Styling in ggplot2 (R)
```R
theme_publication <- function(base_size = 14) {
  theme_minimal(base_size = base_size) %+replace%
    theme(
      panel.background = element_rect(fill = "white", color = NA),
      plot.background = element_rect(fill = "white", color = NA),
      panel.grid.major = element_line(color = "grey92", linewidth = 0.3),
      panel.grid.minor = element_blank(),
      axis.line = element_line(color = "grey40", linewidth = 0.5),
      axis.ticks = element_line(color = "grey40", linewidth = 0.4),
      plot.title = element_text(face = "bold", size = 16, hjust = 0.5),
      plot.subtitle = element_text(size = 11, color = "grey30", hjust = 0.5),
      axis.title = element_text(face = "bold", size = 12),
      axis.text = element_text(size = 11, color = "black"),
      legend.position = "top"
    )
}
```

---

## 5. APA Statistical Symbols & Abbreviation Formatting

When writing statistical results in the report narrative, ensure the following formatting standards:
*   *Italicize* all statistical abbreviations that are not Greek letters: *M*, *SD*, *p*, *t*, *F*, *R²*, *d*, *r*, *N*, *n*, *df*, *z*, *B*, *beta* ($\beta$ is not italicized when written as Greek character, but standardized coefficient label $\beta$ or *beta* is).
*   Report exact p-values to two or three decimal places (e.g., *p* = .008, *p* = .046). For very small values, use *p* < .001. Do not use leading zeros for p-values since they cannot exceed 1.0 (e.g., *p* = .02, not *p* = 0.02).
*   Provide confidence intervals inside brackets (e.g., 95% CI [3.76, 15.88]).

---

## 6. Standardized APA 7th Statistical Writing Templates

When drafting statistical analysis plans or reporting findings in the results section, apply the following strict templates:

### Descriptive & Parametric Comparison Tests
*   **Mean and SD**:
    *   *Template*: "The [variable] scores for the [group] (*M* = [Mean], *SD* = [Standard Deviation]) were calculated."
    *   *Example*: "The reading comprehension scores for the intervention group (*M* = 85.40, *SD* = 5.23) were calculated prior to the test."
*   **Independent Samples t-Test**:
    *   *Template*: "An independent-samples t-test was conducted to compare [dependent variable] for [Group 1] and [Group 2]. There was a significant difference in the scores for [Group 1] (*M* = [Mean1], *SD* = [SD1]) and [Group 2] (*M* = [Mean2], *SD* = [SD2]); *t*([df]) = [t-value], *p* = [p-value], *d* = [Cohen's d]."
*   **Paired Samples t-Test**:
    *   *Template*: "A paired-samples t-test was conducted to evaluate the impact of [intervention] on [variable]. There was a statistically significant [increase/decrease] in scores from pre-test (*M* = [Mean1], *SD* = [SD1]) to post-test (*M* = [Mean2], *SD* = [SD2]), *t*([df]) = [t-value], *p* = [p-value], *d* = [effect size]."
*   **One-Way ANOVA**:
    *   *Template*: "A one-way between-subjects ANOVA was conducted to compare the effect of [independent variable] on [dependent variable] in [Group 1], [Group 2], and [Group 3] conditions. There was a significant effect of [independent variable] on [dependent variable] at the *p* < .05 level for the three conditions [*F*([df between], [df within]) = [F-value], *p* = [p-value], ηp² = [effect size]]."
*   **Repeated Measures ANOVA**:
    *   *Template*: "A repeated measures ANOVA determined that mean [dependent variable] differed statistically significantly across time points (*F*([df time], [df error]) = [F-value], *p* = [p-value], ηp² = [effect size])."

### Correlation & Regressions
*   **Pearson Correlation**:
    *   *Template*: "A Pearson product-moment correlation was computed to assess the relationship between [Variable 1] and [Variable 2]. There was a [positive/negative], [weak/moderate/strong] correlation between the two variables, *r*([df]) = [r-value], *p* = [p-value]."
*   **Spearman Correlation**:
    *   *Template*: "A Spearman's rank-order correlation was run to assess the relationship between [Variable 1] and [Variable 2]. There was a statistically significant, [strong/moderate/weak] [positive/negative] correlation between the two variables, *r_s*([df]) = [r-value], *p* = [p-value]."
*   **Simple Linear Regression**:
    *   *Template*: "A simple linear regression was calculated to predict [dependent variable] based on [independent variable]. A significant regression equation was found (*F*([df regression], [df residual]) = [F-value], *p* = [p-value]), with an *R²* of [R-squared]."
*   **Multiple Linear Regression**:
    *   *Template*: "A multiple regression was run to predict [dependent variable] from [Predictors]. These variables statistically significantly predicted [dependent variable], *F*([df model], [df residual]) = [F-value], *p* = [p-value], *R²* = [R-squared]."
*   **Logistic Regression**:
    *   *Template*: "A logistic regression was performed to ascertain the effects of [predictors] on the likelihood that participants [binary outcome]. The model was statistically significant, χ²([df]) = [chi-square], *p* = [p-value], explaining [Nagelkerke R²]% (Nagelkerke *R²*) of the variance."
*   **Ordinal Regression**:
    *   *Template*: "An ordinal logistic regression was conducted to determine the effect of [predictor] on [ordinal outcome]. The final model statistically significantly predicted the dependent variable over and above the intercept-only model, χ²([df]) = [chi-square value], *p* = [p-value]."

### Non-Parametric Comparison Tests
*   **Chi-Square Test of Independence**:
    *   *Template*: "A chi-square test of independence was performed to examine the relation between [Categorical Variable 1] and [Categorical Variable 2]. The relation between these variables was significant, *X²*([df], *N* = [sample size]) = [chi-square value], *p* = [p-value]."
*   **Fisher's Exact Test**:
    *   *Template*: "A Fisher's exact test was conducted to determine if there was a significant association between [Variable 1] and [Variable 2]. There was a statistically significant association between the variables, *p* = [p-value]."
*   **Mann-Whitney U Test**:
    *   *Template*: "A Mann-Whitney U test was run to determine if there were differences in [dependent variable] scores between [Group 1] and [Group 2]. Median scores were statistically significantly higher in [Group 1] (*Mdn* = [Median 1]) than in [Group 2] (*Mdn* = [Median 2]), *U* = [U-value], *p* = [p-value]."
*   **Wilcoxon Signed-Rank Test**:
    *   *Template*: "A Wilcoxon signed-rank test was conducted to evaluate whether [dependent variable] differed significantly between [Time 1] and [Time 2]. The results indicated a significant [increase/decrease] in scores from [Time 1] (*Mdn* = [Median 1]) to [Time 2] (*Mdn* = [Median 2]), *T* = [T-value], *z* = [z-value], *p* = [p-value]."
*   **Kruskal-Wallis H Test**:
    *   *Template*: "A Kruskal-Wallis H test was conducted to determine if there were differences in [dependent variable] between [Group 1], [Group 2], and [Group 3]. Median [dependent variable] scores were statistically significantly different between the groups, *H*([df]) = [H-value], *p* = [p-value]."

---

## 7. SAMPL Guidelines for Biomedical Statistical Reporting

When writing statistical results for biomedical journals, strictly adhere to the **Statistical Analyses and Methods in the Published Literature (SAMPL)** guidelines. These emphasize reproducibility, precise reporting, and enabling future meta-analyses:

### General Reporting Principles
1. **Sufficient Detail**: Describe statistical methods with enough detail to enable a knowledgeable reader with access to the original data to verify the reported results. Provide enough detail that results can be incorporated into other analyses (e.g., reporting numerators and denominators for percentages).
2. **Precision**: Report numbers with an appropriate degree of precision. For ease of comprehension, round as much as is reasonable (e.g., mean age to the nearest year).
3. **P-values**: Report *p* values as equalities to one or two decimal places (e.g., *p* = .03 or .22) instead of inequalities (e.g., *p* < .05). **Do not report "NS"**; give the actual *p* value. The smallest *p* value that need be reported is *p* < .001.

### Descriptive Statistics
1. **Normal Distributions**: Summarize data that are approximately normally distributed with means and standard deviations. Use the form: Mean (SD), not Mean ± SD.
2. **Non-normal Distributions**: Summarize non-normally distributed data with medians and interpercentile ranges or ranges. Report the upper and lower boundaries (minimum and maximum), not just the size of the range.
3. **Avoid Standard Error (SE)**: Do **NOT** use the standard error of the mean (SE) to indicate the variability of a data set or the precision of an estimate. Use Standard Deviations (SD), inter-percentile ranges, or 95% Confidence Intervals instead.

### Inferential Statistics & Precision
1. **Confidence Intervals**: Avoid relying solely on statistical hypothesis testing (such as *p* values), which fail to convey effect size. Provide a measure of precision, such as the 95% Confidence Interval (95% CI), for all primary outcomes, differences, diagnostic sensitivity, and regression slopes.
2. **Tests and Assumptions**: Identify the name of the test used, state the alpha level that defines statistical significance, and confirm that the assumptions of the test were met by the data. Indicate if tests were one- or two-tailed.
