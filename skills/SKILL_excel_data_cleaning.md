---
name: excel-data-cleaning
description: "A complete guide and automated tools for cleaning, pre-processing, and standardizing raw Excel (.xlsx) and CSV (.csv) research spreadsheets for scientific analysis."
license: MIT

---

# Excel & CSV Raw Data Cleaning Skill

This guide explains the standard workflows, scripts, and commands available in your system to handle raw data cleaning inside Excel sheets (`.xlsx`) and CSV sheets (`.csv`) before proceeding to statistical analysis.

---

## 1. Automated Data Cleaning Tools Added to Your Project

We have added two automated scripts directly in your project root to handle general-purpose data cleaning:
1.  **Python Script:** [clean_excel_data.py](file:///d:/GitHub/Mega_Medical_writer_Noora/scripts/clean_excel_data.py) - A flexible command-line tool.
2.  **R Script:** [clean_excel_data.R](file:///d:/GitHub/Mega_Medical_writer_Noora/scripts/clean_excel_data.R) - A template function for RStudio.

### What These Tools Do Automatically:
*   **Column Name Sanitization:** Normalizes spaces, special characters, and casing to create standard names (`Age in Years` -> `age_in_years`).
*   **Safe Parsing:** Auto-detects file encodings and delimiters while safely skipping malformed and corrupt rows.
*   **Null-Value Handling:** Standardizes various string representations of missing values to `NaN`. Allows dropping columns above a defined `--drop-threshold` (default 70% null) or imputing columns with less missing data.
*   **Missing Value Imputation:** Imputes missing cells with Mean, Median, or Mode (for categorical variables) or drops rows based on the `--impute-threshold`.
*   **Outlier Detection:** Detects numerical data points using either IQR or Z-Score bounds, and clips them safely.
*   **Fuzzy Text Normalization:** Cleans categorical columns using fuzzy string matching to group similar typos.
*   **Chronological Checks:** Scans date columns for chronological inversions (e.g. End Date < Start Date) and attempts to repair them automatically.
*   **Audit Logging:** Outputs a comprehensive `_report.json` detailing all transformations.

---

## 2. Python Tool Usage (Command Line)

You can run the Python script from the PowerShell command line. By default it uses standard rules, but passing `--use-pipeline` engages the full `DataQualityEngine` pipeline.

### Full Advanced Engine Clean (Imputes missing, caps outliers, outputs JSON report)
```powershell
python clean_excel_data.py --input "D:\path\to\raw_data.csv" --output "D:\path\to\clean_data.csv" --use-pipeline --missing median --outliers cap
```

### Options:
*   `--use-pipeline`: Recommended. Runs the advanced DataQualityEngine with fuzzy clustering, encoding detection, and full auditing.
*   `--missing [none, mean, median, mode, drop]`: Strategy for missing data.
*   `--outliers [flag, remove, cap, none]`: Strategy for managing numeric outliers.

---

## 3. R Tool Usage (RStudio)

Open [clean_excel_data.R](file:///d:/GitHub/Mega_Medical_writer_Noora/scripts/clean_excel_data.R) in RStudio to load the utility function, then call it as follows:

```R
source("clean_excel_data.R")

# Run data cleaning
clean_df <- clean_dataset(
  input_path = "D:/path/to/raw_data.xlsx", 
  output_path = "D:/path/to/clean_data.xlsx", 
  missing_strategy = "median",  # Options: "none", "mean", "median", "drop"
  handle_outliers = "flag"       # Options: "none", "flag", "remove", "cap"
)
```

---

## 4. Checklist for Preparing Raw Excel Data
Before running any analysis:
- [ ] Ensure the first row of your spreadsheet contains clear column names.
- [ ] Check that numeric columns contain only numbers (remove units like `kg`, `%`, or `cm` from values; put them in the column header instead, e.g., `weight_kg`).
- [ ] Save the spreadsheet. The automated cleaner will take care of the formatting, missing values, column names, and outlier detection!
