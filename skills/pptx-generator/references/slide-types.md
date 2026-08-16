# Slide Types Reference

## The Five Core Page Types

### 1. Cover Slide

The opening slide of the presentation.

**Layout pattern:**
- Full-bleed background color or image
- Title centered or left-aligned, large (36-48pt)
- Subtitle/subtitle line below title (18-24pt)
- Optional: date, author, decorative line/element

**Example:**
```javascript
// cover slide
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // decorative top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  // title
  slide.addText("Presentation Title", {
    x: 0.8, y: 1.5, w: 8.4, h: 1.5,
    fontSize: 44, fontFace: "Arial",
    color: "FFFFFF", bold: true
  });

  // subtitle
  slide.addText("Subtitle or Tagline Here", {
    x: 0.8, y: 3, w: 8.4, h: 0.8,
    fontSize: 22, fontFace: "Arial",
    color: theme.light
  });

  // decorative bottom bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.06,
    fill: { color: theme.accent }
  });

  return slide;
}
```

### 2. Table of Contents Slide

Lists the sections/topics covered.

**Layout patterns:**
1. **Numbered list** — Sections listed vertically with numbers
2. **Grid layout** — 2x2 or 3x2 grid of section cards
3. **Timeline** — Horizontal or vertical timeline showing sections in order

**Key elements:**
- "Agenda" or "Contents" header (28-36pt)
- 4-6 items max
- Each item: number/icon + section title (16-20pt)
- Subtle dividers or spacing between items

**Example (numbered list):**
```javascript
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText("Agenda", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.8,
    fontSize: 32, fontFace: "Arial",
    color: theme.primary, bold: true
  });

  const items = [
    "Introduction & Background",
    "Methodology",
    "Key Findings",
    "Discussion",
    "Conclusion"
  ];

  items.forEach((item, i) => {
    const yPos = 1.6 + i * 0.7;
    // number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 1.0, y: yPos, w: 0.45, h: 0.45,
      fill: { color: theme.accent }
    });
    slide.addText(String(i + 1), {
      x: 1.0, y: yPos, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
    // item text
    slide.addText(item, {
      x: 1.7, y: yPos, w: 7, h: 0.45,
      fontSize: 18, fontFace: "Arial",
      color: theme.secondary, valign: "middle"
    });
  });

  return slide;
}
```

### 3. Section Divider Slide

Marks the start of a new section within the presentation.

**Layout patterns:**
1. **Full-bleed color** — Section number + title centered on colored background
2. **Split** — Colored left panel with section info, right panel with image
3. **Minimal** — Thin line/bar with section title below

**Key elements:**
- Section number (large, 48-72pt, often with accent color)
- Section title (28-36pt)
- Brief description or subtitle (optional)
- Visual break from previous content

**Example (full-bleed):**
```javascript
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // large section number
  slide.addText("02", {
    x: 0.8, y: 1.2, w: 8.4, h: 1.2,
    fontSize: 72, fontFace: "Arial",
    color: theme.accent, bold: true
  });

  // section title
  slide.addText("Methodology", {
    x: 0.8, y: 2.6, w: 8.4, h: 1,
    fontSize: 36, fontFace: "Arial",
    color: "FFFFFF"
  });

  // description
  slide.addText("Research design, data collection, and analysis approach", {
    x: 0.8, y: 3.6, w: 8.4, h: 0.6,
    fontSize: 16, fontFace: "Arial",
    color: theme.light
  });

  return slide;
}
```

### 4. Content Slide

The primary slide type for presenting information.

**Layout patterns (do NOT repeat across slides):**

| Pattern | Description | Best for |
|---------|-------------|----------|
| **Title + Body** | Header with bullet points or paragraphs | Explanatory text |
| **Title + Two Columns** | Split content side by side | Comparisons |
| **Title + Image** | Large image with supporting text | Visual content |
| **Title + Chart** | Chart/graph with key takeaway | Data presentation |
| **Title + Cards** | Multiple card-style elements | Feature overview |
| **Title + Quote** | Large pull quote with attribution | Emphasis |
| **Title + Timeline** | Horizontal or vertical timeline | Chronological info |
| **Title + Process Flow** | Connected steps in a process | Workflows |
| **Title + Stats/Number** | Large numbers with labels | Key metrics |

**Key elements:**
- Slide title (24-32pt, bold, at top)
- Content area (14-20pt body text)
- Consistent margins (0.5-0.8" on sides)
- Page number badge (required)

**Example (title + two columns):**
```javascript
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // title
  slide.addText("Key Findings Overview", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.8,
    fontSize: 28, fontFace: "Arial",
    color: theme.primary, bold: true
  });

  // divider line under title
  slide.addShape(pres.shapes.LINE, {
    x: 0.8, y: 1.1, w: 8.4, h: 0,
    line: { color: theme.light, width: 1.5 }
  });

  // left column
  slide.addText([
    { text: "Control Group\n", options: { fontSize: 18, bold: true, color: theme.secondary } },
    { text: "• 245 participants\n• Standard treatment protocol\n• 12-week follow-up\n• Primary outcome: symptom score" }
  ], {
    x: 0.8, y: 1.4, w: 3.8, h: 3.2,
    fontSize: 14, fontFace: "Arial",
    color: theme.secondary, valign: "top"
  });

  // right column
  slide.addText([
    { text: "Treatment Group\n", options: { fontSize: 18, bold: true, color: theme.secondary } },
    { text: "• 251 participants\n• Enhanced treatment protocol\n• 12-week follow-up\n• Primary outcome: symptom score" }
  ], {
    x: 5.4, y: 1.4, w: 3.8, h: 3.2,
    fontSize: 14, fontFace: "Arial",
    color: theme.secondary, valign: "top"
  });

  return slide;
}
```

### 5. Summary / Thank You Slide

The closing slide of the presentation.

**Layout patterns:**
1. **Key Takeaways** — 3-5 bullet points summarizing main messages
2. **Thank You** — Simple thank you with contact info
3. **Call to Action** — Next steps, Q&A prompt, or action items
4. **Quote** — Closing quote that encapsulates the message

**Key elements:**
- "Thank You" or "Summary" header
- 3-5 key takeaways (brief, impactful)
- Contact information or QR code (optional)
- Consistent with opening slide design

**Example (key takeaways):**
```javascript
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  slide.addText("Key Takeaways", {
    x: 0.8, y: 0.5, w: 8.4, h: 0.8,
    fontSize: 32, fontFace: "Arial",
    color: "FFFFFF", bold: true
  });

  const takeaways = [
    "Enhanced protocol shows 23% improvement in symptom scores",
    "Treatment well-tolerated with no serious adverse events",
    "Results support broader clinical implementation",
    "Further research needed for long-term outcomes"
  ];

  takeaways.forEach((text, i) => {
    const yPos = 1.6 + i * 0.8;
    // accent dot
    slide.addShape(pres.shapes.OVAL, {
      x: 1.0, y: yPos + 0.12, w: 0.12, h: 0.12,
      fill: { color: theme.accent }
    });
    slide.addText(text, {
      x: 1.4, y: yPos, w: 7.5, h: 0.6,
      fontSize: 16, fontFace: "Arial",
      color: theme.light, valign: "middle"
    });
  });

  // contact info
  slide.addText("Dr. Jane Smith | jane.smith@institution.edu", {
    x: 0.8, y: 4.8, w: 8.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: theme.accent, align: "center"
  });

  return slide;
}
```

---

## Additional Layout Patterns

### Image with Overlay Text

```javascript
slide.addImage({
  path: "imgs/background.jpg",
  x: 0, y: 0, w: 10, h: 5.625
});
// semi-transparent overlay
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 5.625,
  fill: { color: theme.primary, transparency: 40 }
});
slide.addText("Title Over Image", {
  x: 0.8, y: 2, w: 8.4, h: 1,
  fontSize: 36, fontFace: "Arial",
  color: "FFFFFF", bold: true
});
```

### Data Table

```javascript
const rows = [
  [
    { text: "Metric", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary } } },
    { text: "Control", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary } } },
    { text: "Treatment", options: { bold: true, color: "FFFFFF", fill: { color: theme.primary } } }
  ],
  [
    { text: "Sample Size", options: { fill: { color: theme.light } } },
    { text: "245", options: { fill: { color: theme.light } } },
    { text: "251", options: { fill: { color: theme.light } } }
  ],
  [
    { text: "Mean Age (SD)", options: {} },
    { text: "45.2 (12.1)", options: {} },
    { text: "44.8 (11.9)", options: {} }
  ],
  [
    { text: "Response Rate", options: { fill: { color: theme.light } } },
    { text: "78%", options: { fill: { color: theme.light } } },
    { text: "82%", options: { fill: { color: theme.light } } }
  ]
];

slide.addTable(rows, {
  x: 0.8, y: 1.5, w: 8.4,
  fontSize: 14, fontFace: "Arial",
  color: theme.secondary,
  border: { type: "solid", pt: 0.5, color: theme.light },
  colW: [2.8, 2.8, 2.8]
});
```

### Chart

```javascript
const chartData = [
  { name: "Q1", values: [35] },
  { name: "Q2", values: [42] },
  { name: "Q3", values: [28] },
  { name: "Q4", values: [51] }
];

slide.addChart(pres.charts.BAR, chartData, {
  x: 0.8, y: 1.5, w: 5, h: 3.5,
  showTitle: true,
  title: "Quarterly Results",
  showLegend: false,
  barGrouping: "clustered",
  chartColors: [theme.accent],
  catAxisLabelColor: theme.secondary,
  valAxisLabelColor: theme.secondary
});
```
