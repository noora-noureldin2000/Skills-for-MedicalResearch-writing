# PptxGenJS API Reference

## Initialization

```javascript
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

// Layout
pres.layout = "LAYOUT_16x9";  // 10" x 5.625"

// Custom layout
pres.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 });
pres.layout = "CUSTOM";

// Document properties
pres.author = "Author Name";
pres.title = "Presentation Title";
pres.subject = "Subject";
pres.company = "Company Name";
```

---

## Slide Methods

### addSlide()
```javascript
const slide = pres.addSlide();
```

### slide.background
```javascript
// Solid color
slide.background = { color: "F8F9FA" };

// Gradient
slide.background = {
  fill: {
    type: "solid",
    color: "F8F9FA",
    // or gradient
    type: "gradient",
    color: ["F8F9FA", "E9ECEF"],
    angle: 45
  }
};

// Image
slide.background = { path: "./imgs/bg.jpg" };
```

---

## Adding Elements

### slide.addText(text, options)

```javascript
// Simple text
slide.addText("Hello World", {
  x: 0.5, y: 0.5, w: 9, h: 1,
  fontSize: 24,
  fontFace: "Arial",
  color: "333333",
  bold: false,
  italic: false,
  underline: false,
  align: "left",        // "left" | "center" | "right" | "justify"
  valign: "middle",     // "top" | "middle" | "bottom"
  rotate: 0,            // degrees
  wrap: true,
  lineSpacingMultiple: 1.2,
  lineSpacing: 24,      // in points
  paraSpaceBefore: 6,   // in points
  paraSpaceAfter: 6,    // in points
  shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.3 },
  outline: { color: "000000", size: 1 },
  rtlMode: false,
  superscript: false,
  subscript: false
});

// Multi-format text (rich text)
slide.addText([
  { text: "Bold ", options: { bold: true, fontSize: 20, color: "1B4F72" } },
  { text: "and ", options: { italic: true, fontSize: 20 } },
  { text: "Colored", options: { color: "E74C3C", fontSize: 20 } }
], {
  x: 0.5, y: 1, w: 9, h: 1,
  fontFace: "Arial",
  align: "center",
  valign: "middle"
});

// Text with hyperlink
slide.addText("Click Here", {
  x: 0.5, y: 1, w: 3, h: 0.5,
  hyperlink: { url: "https://example.com" },
  color: "2980B9",
  underline: true
});

// Text with slide hyperlink
slide.addText("Go to Slide 5", {
  x: 0.5, y: 1.5, w: 3, h: 0.5,
  hyperlink: { slide: 5 },
  color: "2980B9"
});
```

### slide.addShape(shapeName, options)

Shape types: `pres.shapes.RECTANGLE`, `pres.shapes.OVAL`, `pres.shapes.LINE`, `pres.shapes.ROUNDED_RECTANGLE`

```javascript
// Rectangle
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 0.5, w: 9, h: 0.5,
  fill: { color: "1B4F72", transparency: 0 },
  line: { color: "000000", width: 1, dashType: "solid" },
  // line dashTypes: "solid" | "dash" | "dashDot" | "lgDash" | "lgDashDot" | "lgDashDotDot" | "sysDash" | "sysDot"
  shadow: { type: "outer", blur: 4, offset: 2, color: "000000", opacity: 0.2 },
  rotate: 0,
  flipH: false,
  flipV: false
});

// Rounded Rectangle
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 0.5, w: 9, h: 1,
  fill: { color: "D4E6F1" },
  rectRadius: 0.2  // corner radius in inches
});

// Oval / Circle
slide.addShape(pres.shapes.OVAL, {
  x: 1, y: 1, w: 1, h: 1,
  fill: { color: "85C1E9" }
});

// Line
slide.addShape(pres.shapes.LINE, {
  x: 0.5, y: 1, w: 9, h: 0,
  line: { color: "1B4F72", width: 2 }
});
```

### slide.addImage(options)

```javascript
slide.addImage({
  path: "./imgs/photo.png",    // File path
  // OR data: base64data,      // base64 data
  // OR path: "https://..."    // URL (may not work in all environments)
  x: 0, y: 0, w: 10, h: 5.625,
  sizing: {
    type: "contain",           // "contain" | "cover" | "stretch"
    w: 10,
    h: 5.625,
    x: 0.5,                    // crop x offset
    y: 0.5                     // crop y offset
  },
  hyperlink: { url: "https://example.com" },
  rotate: 0
});
```

### slide.addTable(rows, options)

```javascript
const rows = [
  // Header row
  [
    { text: "Column 1", options: { bold: true, color: "FFFFFF", fill: { color: "1B4F72" }, align: "center", valign: "middle" } },
    { text: "Column 2", options: { bold: true, color: "FFFFFF", fill: { color: "1B4F72" }, align: "center", valign: "middle" } },
    { text: "Column 3", options: { bold: true, color: "FFFFFF", fill: { color: "1B4F72" }, align: "center", valign: "middle" } }
  ],
  // Data rows
  [
    { text: "Row 1 Data", options: { fill: { color: "F0F8FF" }, align: "center" } },
    { text: "42", options: { fill: { color: "F0F8FF" }, align: "center" } },
    { text: "$1,200", options: { fill: { color: "F0F8FF" }, align: "center" } }
  ],
  [
    { text: "Row 2 Data", options: { fill: { color: "FFFFFF" }, align: "center" } },
    { text: "37", options: { fill: { color: "FFFFFF" }, align: "center" } },
    { text: "$950", options: { fill: { color: "FFFFFF" }, align: "center" } }
  ]
];

slide.addTable(rows, {
  x: 0.5, y: 1, w: 9,        // w is total width
  colW: [3, 3, 3],             // width per column (total must match w)
  rowH: [0.5, 0.4, 0.4],       // optional row heights
  fontSize: 14,
  fontFace: "Arial",
  color: "333333",
  border: { type: "solid", pt: 0.5, color: "DEE2E6" },
  fill: { color: "FFFFFF" },
  margin: [4, 8, 4, 8],        // [top, right, bottom, left] in points
  autoPage: false               // auto-add new slide for overflow
});
```

### slide.addChart(chartType, chartData, options)

Chart types: `pres.charts.BAR`, `pres.charts.LINE`, `pres.charts.PIE`, `pres.charts.DOUGHNUT`, `pres.charts.SCATTER`, `pres.charts.BUBBLE`, `pres.charts.RADAR`

```javascript
// Bar Chart
const barData = [
  { name: "Category A", values: [35, 42, 28, 51] },
  { name: "Category B", values: [28, 35, 22, 44] }
];

slide.addChart(pres.charts.BAR, barData, {
  x: 0.5, y: 1, w: 9, h: 4,
  showTitle: true,
  title: "Quarterly Results",
  titleFontFace: "Arial",
  titleFontSize: 16,
  titleColor: "333333",
  showLegend: true,
  legendPos: "b",             // "b" | "t" | "l" | "r" | "tr"
  legendFontSize: 12,
  barGrouping: "clustered",   // "clustered" | "stacked" | "percentStacked"
  barDirection: "bar",        // "bar" (horizontal) | "col" (vertical)
  barGapWidthPct: 100,        // gap between bars
  chartColors: ["1B4F72", "85C1E9"],
  catAxisLabelColor: "333333",
  catAxisLabelFontSize: 11,
  catAxisOrientation: "normal", // "normal" | "minMax" | "maxMin"
  valAxisLabelColor: "333333",
  valAxisLabelFontSize: 11,
  valAxisOrientation: "normal",
  valAxisMinVal: 0,
  valAxisMaxVal: 60,
  valAxisMajorUnit: 10,
  showValue: false,
  dataLabelFontSize: 10,
  dataLabelColor: "333333",
  dataLabelPosition: "outEnd",  // "inBase" | "inEnd" | "outEnd" | "bestFit" | "ctr"
  chartColors: ["4A235A", "6C3483", "AF7AC5"],
  gradient: { enabled: false }
});

// Line Chart
const lineData = [
  { name: "Series 1", values: [10, 25, 18, 35, 42] }
];

slide.addChart(pres.charts.LINE, lineData, {
  x: 0.5, y: 1, w: 9, h: 4,
  showTitle: true,
  title: "Trend Over Time",
  lineSize: 2.5,
  lineDataSymbolSize: 5,
  catAxisLabelColor: "333333",
  valAxisLabelColor: "333333",
  chartColors: ["1B4F72"],
  catAxisOrientation: "normal",
  valAxisOrientation: "normal"
});

// Pie Chart
const pieData = [
  { name: "Category A", values: [35] },
  { name: "Category B", values: [25] },
  { name: "Category C", values: [20] },
  { name: "Category D", values: [20] }
];

slide.addChart(pres.charts.PIE, pieData, {
  x: 0.5, y: 1, w: 5, h: 4,
  showTitle: true,
  title: "Market Share",
  showLegend: true,
  legendPos: "r",
  showPercent: true,
  showValue: false,
  chartColors: ["1B4F72", "2E86C1", "85C1E9", "D4E6F1"],
  dataLabelFontSize: 12,
  dataLabelColor: "333333"
});

// Doughnut Chart
slide.addChart(pres.charts.DOUGHNUT, pieData, {
  x: 0.5, y: 1, w: 5, h: 4,
  showTitle: true,
  title: "Market Share",
  showLegend: true,
  legendPos: "r",
  showPercent: true,
  chartColors: ["1B4F72", "2E86C1", "85C1E9", "D4E6F1"],
  holeSize: 50  // percentage of inner hole
});

// Scatter Chart
const scatterData = [
  { name: "Series 1", values: [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 4 }] }
];

slide.addChart(pres.charts.SCATTER, scatterData, {
  x: 0.5, y: 1, w: 9, h: 4,
  showTitle: true,
  title: "Correlation",
  chartColors: ["1B4F72"],
  lineSize: 0,
  lineDataSymbolSize: 8
});
```

### slide.addMedia(options)

```javascript
slide.addMedia({
  type: "video",
  path: "./media/video.mp4",
  x: 1, y: 1, w: 8, h: 4,
  link: "https://youtube.com/..."  // fallback link
});

slide.addMedia({
  type: "audio",
  path: "./media/audio.mp3",
  x: 1, y: 5, w: 0.5, h: 0.5,
  icon: 2  // 1=speaker, 2=microphone
});
```

---

## Saving

```javascript
// Write to file
pres.writeFile({ fileName: "./output/presentation.pptx" })
  .then(fileName => {
    console.log("Created:", fileName);
  })
  .catch(err => {
    console.error("Error:", err);
  });

// Write to base64
pres.writeFile({ outputType: "base64" })
  .then(base64 => { /* use base64 data */ });

// Write to node buffer
pres.writeFile({ outputType: "nodebuffer" })
  .then(buffer => { /* use buffer */ });

// Write to stream
pres.writeFile({ outputType: "stream" })
  .then(stream => { /* pipe stream */ });
```

---

## Full Options Reference

### Text Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| x | Number | required | Left position (inches) |
| y | Number | required | Top position (inches) |
| w | Number | required | Width (inches) |
| h | Number | required | Height (inches) |
| fontSize | Number | 18 | Font size in points |
| fontFace | String | "Arial" | Font name |
| color | String | "333333" | Font color (6-char hex, no #) |
| bold | Boolean | false | Bold text |
| italic | Boolean | false | Italic text |
| underline | Boolean | false | Underline text |
| align | String | "left" | Text alignment |
| valign | String | "top" | Vertical alignment |
| wrap | Boolean | true | Word wrap |
| rotate | Number | 0 | Rotation in degrees |
| lineSpacingMultiple | Number | - | Line spacing multiplier |
| lineSpacing | Number | - | Line spacing in points |
| paraSpaceBefore | Number | - | Space before paragraph |
| paraSpaceAfter | Number | - | Space after paragraph |
| margin | Number[] | - | [top, right, bottom, left] in pts |
| rtlMode | Boolean | false | Right-to-left mode |
| superscript | Boolean | false | Superscript |
| subscript | Boolean | false | Subscript |
| shadow | Object | - | Shadow effect |
| outline | Object | - | Text outline |
| hyperlink | Object | - | Hyperlink { url: "" } or { slide: N } |
| placeholder | String | - | Placeholder type: "title", "body" |

### Shape Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| x | Number | required | Left position (inches) |
| y | Number | required | Top position (inches) |
| w | Number | required | Width (inches) |
| h | Number | required | Height (inches) |
| fill | Object | - | Fill: { color, transparency } |
| line | Object | - | Line: { color, width, dashType } |
| shadow | Object | - | Shadow effect |
| rotate | Number | 0 | Rotation in degrees |
| flipH | Boolean | false | Flip horizontally |
| flipV | Boolean | false | Flip vertically |
| rectRadius | Number | 0 | Corner radius (ROUNDED_RECTANGLE only) |

### Image Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| path | String | required | Image file path |
| data | String | - | Base64-encoded image data |
| x | Number | required | Left position (inches) |
| y | Number | required | Top position (inches) |
| w | Number | required | Width (inches) |
| h | Number | required | Height (inches) |
| sizing | Object | - | { type: "contain"\|"cover"\|"stretch", w, h, x, y } |
| hyperlink | Object | - | Hyperlink |
| rotate | Number | 0 | Rotation |

### Table Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| x | Number | required | Left position (inches) |
| y | Number | required | Top position (inches) |
| w | Number | required | Total width (inches) |
| colW | Number[] | - | Array of column widths (inches) |
| rowH | Number[] | - | Array of row heights (inches) |
| fontSize | Number | 12 | Font size |
| fontFace | String | "Arial" | Font name |
| color | String | "333333" | Font color |
| bold | Boolean | false | Bold text |
| align | String | "left" | Text alignment |
| valign | String | "bottom" | Vertical alignment |
| border | Object | - | Border: { type, pt, color } |
| fill | Object | - | Fill color |
| margin | Number[] | - | [top, right, bottom, left] in pts |
| autoPage | Boolean | false | Auto-add slide for overflow |
| rowAlign | String | - | "left"\|"center"\|"right" |
| colAlign | String[] | - | Per-column alignment |
| rowValign | String | - | "top"\|"middle"\|"bottom" |
| colValign | String[] | - | Per-column vertical alignment |

### Chart Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| x | Number | required | Left position (inches) |
| y | Number | required | Top position (inches) |
| w | Number | required | Width (inches) |
| h | Number | required | Height (inches) |
| showTitle | Boolean | false | Show chart title |
| title | String | - | Chart title text |
| titleFontFace | String | "Arial" | Title font |
| titleFontSize | Number | 14 | Title font size |
| titleColor | String | "333333" | Title color |
| showLegend | Boolean | false | Show legend |
| legendPos | String | "b" | Legend position |
| legendFontSize | Number | 10 | Legend font size |
| chartColors | String[] | - | Array of hex colors |
| showValue | Boolean | false | Show data values |
| dataLabelFontSize | Number | 10 | Data label font size |
| dataLabelColor | String | "333333" | Data label color |
| dataLabelPosition | String | - | Label position |
| catAxisLabelColor | String | - | Category axis label color |
| catAxisLabelFontSize | Number | 10 | Category axis label size |
| valAxisLabelColor | String | - | Value axis label color |
| valAxisLabelFontSize | Number | 10 | Value axis label size |
| valAxisMinVal | Number | - | Value axis minimum |
| valAxisMaxVal | Number | - | Value axis maximum |
| valAxisMajorUnit | Number | - | Value axis major unit |

---

## Notes

- All positioning values are in **inches**
- Colors are 6-character hex **without** `#` prefix
- Coordinate system origin is top-left
- X increases to the right, Y increases downward
- Functions are synchronous — do NOT use `async/await` in slide creation
