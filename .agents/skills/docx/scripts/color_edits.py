import docx
from docx.shared import Pt, RGBColor
import sys

BLUE = RGBColor(0x2E, 0x75, 0xB6)
BLACK = RGBColor(0x00, 0x00, 0x00)

doc = docx.Document(sys.argv[1])

def set_para_blue(para):
    for run in para.runs:
        run.font.color.rgb = BLUE

def replace_para_with_runs(para, parts):
    """parts: list of (text, color, bold) tuples"""
    existing = list(para.runs)
    for r in existing:
        r.text = ''
    for i, (text, color, bold) in enumerate(parts):
        if i < len(existing):
            existing[i].text = text
            existing[i].font.color.rgb = color
            if bold:
                existing[i].bold = True
        else:
            r = para.add_run(text)
            r.font.color.rgb = color
            if bold:
                r.bold = True
    for j in range(len(parts), len(existing)):
        existing[j].text = ''

found = {}

for para in doc.paragraphs:
    t = para.text.strip()

    if '2 study hospitals' in t and 'cross-sectional' in t:
        parts = [
            ('This was a cross-sectional ', BLACK, False),
            ('screening', BLUE, False),
            (' study with prospective data collection among asymptomatic adult companions of hypertensive patients attending outpatient clinics at ', BLACK, False),
            ('the 2 study hospitals', BLUE, False),
            ('. A convenience sampling method was used. All 1,000 participants were retained in the analyses. They had no previous hypertension diagnosis, were not receiving antihypertensive therapy, and reported no symptoms suggestive of elevated blood pressure at the screening visit. Two auscultatory office readings were obtained during 1 visit and averaged for screening classification ', BLACK, False),
            ('[Results, Table 6]', BLUE, False),
            ('.', BLACK, False),
        ]
        replace_para_with_runs(para, parts)
        found['design'] = True

    elif 'based on a modified adult classification' in t:
        parts = [
            ('BMI was ', BLACK, False),
            ('based on a modified adult classification', BLUE, False),
            ('. Overweight was present in 38.7%, normal weight in 35.3%, obesity class I in 17.6%, combined obesity class II/III in 6.0%, and underweight in 2.4%', BLACK, False),
            (' [Results, Table 2]', BLUE, False),
            ('. The combined class II/III category and its BMI thresholds were ', BLACK, False),
            ('as defined in the source data', BLUE, False),
            ('.', BLACK, False),
        ]
        replace_para_with_runs(para, parts)
        found['bmi'] = True

    elif t.startswith('A single combined multivariable logistic regression model was built'):
        set_para_blue(para)
        found['reg1'] = True

    elif t.startswith('After multivariable adjustment, none of the evaluated factors remained'):
        set_para_blue(para)
        found['reg2'] = True

    elif t.startswith('The cross-tabulations showed that obesity prevalence increased sharply'):
        set_para_blue(para)
        found['reg3'] = True

    elif 'best cut-off 36 years, sensitivity 52.2%' in t:
        set_para_blue(para)
        found['roc'] = True

    elif 'Univariable associations were observed for number of children and university education' in t:
        set_para_blue(para)
        found['concl'] = True

    elif 'not specified in the available data' in t:
        parts = [
            ('This study had several limitations. Blood pressure was measured during a single visit, so the findings represent silent, screen-detected BP ranges rather than confirmed hypertension and may have been affected by white-coat or situational stress. The term silent was based on the absence of self-reported symptoms at screening and did not include a detailed symptom severity scale or assessment of target-organ injury. Recruitment of companions of hypertensive patients produced selection bias and a risk-enriched convenience sample. Family history and smoking exposure were self-reported and were vulnerable to recall and reporting error. ', BLACK, False),
            ('[Unverified] The blood pressure device type was not specified in the available data.', BLUE, False),
            (' Recruitment was limited to ', BLACK, False),
            ('2 hospitals', BLUE, False),
            (', restricting geographic generalizability. Finally, the cross-sectional design precluded temporal or causal conclusions about the identified associations.', BLACK, False),
        ]
        replace_para_with_runs(para, parts)
        found['limits'] = True

missing = [k for k in ['design','bmi','reg1','reg2','reg3','roc','concl','limits'] if k not in found]
if missing:
    print('WARNING - not found:', missing)
else:
    print('All edited paragraphs found and colored')

doc.save(sys.argv[1])
print('Saved:', sys.argv[1])
