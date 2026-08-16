# Pitfalls & QA Reference

## QA Process (Required After Every Creation)

Run these checks on the final PPTX before delivering:

### 1. Content Check

- [ ] All slides present and in correct order
- [ ] No placeholder text or Lorem ipsum remaining
- [ ] All text is readable (not cut off, overlapping, or overflowing)
- [ ] Correct spelling and grammar throughout
- [ ] All data points accurate (numbers, dates, names)

### 2. Visual Check

- [ ] Consistent color usage across all slides
- [ ] Consistent font usage (no unexpected font substitutions)
- [ ] Page number badges on all slides except cover
- [ ] No visual overlap between elements
- [ ] Proper alignment (elements don't look misaligned)
- [ ] Images display correctly (no broken paths or missing files)
- [ ] Charts render properly with correct data

### 3. Technical Check

- [ ] File opens without errors in PowerPoint / Google Slides
- [ ] All hyperlinks work (if any)
- [ ] File size is reasonable
- [ ] No corruption when re-saving

### 4. Design Consistency

- [ ] Cover and summary slides feel like bookends
- [ ] Section dividers follow consistent pattern
- [ ] Layout variety across content slides (no repeated patterns)
- [ ] Theme keys used correctly (primary/secondary/accent/light/bg)

---

## Common Mistakes

### Wrong Theme Keys

```javascript
// WRONG - Do NOT use these key names
theme.background   // NO
theme.text         // NO
theme.muted        // NO
theme.darkest      // NO
theme.lightest     // NO

// CORRECT - Use only these keys
theme.primary      // YES
theme.secondary    // YES
theme.accent       // YES
theme.light        // YES
theme.bg           // YES
```

### Colors with # Prefix

```javascript
// WRONG
color: "#FF0000"

// CORRECT
color: "FF0000"
```

### Using Async Functions

```javascript
// WRONG - async is NOT supported
async function createSlide(pres, theme) { ... }

// CORRECT - synchronous only
function createSlide(pres, theme) { ... }
```

### Missing Page Numbers

All slides except the cover MUST have a page number badge. This is the most commonly missed requirement.

### Repeated Layouts

Adjacent content slides should NOT use the same layout pattern. Vary between:
- Title + Body
- Title + Two Columns
- Title + Image
- Title + Chart
- Title + Cards
- etc.

### Overlapping Elements

Always check that:
- Text boxes don't extend beyond slide boundaries (10" x 5.625")
- Shapes don't overlap text in unintended ways
- Table cells have adequate padding
- Charts don't overlap with titles or other elements

---

## Critical PptxGenJS Pitfalls

### 1. Color Formatting

PptxGenJS expects 6-character hex strings **without** the `#` prefix:

```javascript
// Correct
fill: { color: "1B4F72" }

// Incorrect
fill: { color: "#1B4F72" }
fill: { color: "rgb(27, 79, 114)" }
```

### 2. Font Handling for Chinese

Chinese text requires `Microsoft YaHei`. Always set `fontFace` to `"Microsoft YaHei"` when the text contains Chinese characters:

```javascript
slide.addText("中文标题", {
  fontSize: 28,
  fontFace: "Microsoft YaHei",  // Required for Chinese
  color: theme.primary
});
```

### 3. Shape Types

Use `pres.shapes.*` constants, not strings:

```javascript
// Correct
pres.shapes.RECTANGLE
pres.shapes.OVAL
pres.shapes.LINE
pres.shapes.ROUNDED_RECTANGLE

// Incorrect
"rectangle"
"oval"
```

### 4. Chart Types

Use `pres.charts.*` constants, not strings:

```javascript
// Correct
pres.charts.BAR
pres.charts.LINE
pres.charts.PIE

// Incorrect
"bar"
"line"
```

### 5. Text Objects vs Arrays

For simple text, use a string. For multi-format text, use an array of `{ text, options }` objects:

```javascript
// Simple text
slide.addText("Hello World", { ... });

// Multi-format text
slide.addText([
  { text: "Bold Part", options: { bold: true } },
  { text: "Normal Part", options: {} }
], { ... });
```

### 6. Image Paths

Images are loaded from the filesystem at slide-creation time. The path is relative to the script, NOT relative to the slide file:

```javascript
slide.addImage({
  path: "./imgs/photo.png",  // relative to running script
  x: 0, y: 0, w: 10, h: 5.625
});
```

### 7. Layout Setting Must Be String

```javascript
// Correct
pres.layout = 'LAYOUT_16x9';

// Also correct
pres.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });

// Incorrect
pres.layout = LAYOUT_16x9;
```

### 8. File Writing Uses writeFile, Not save

```javascript
// Correct
pres.writeFile({ fileName: './output/presentation.pptx' });

// Incorrect
pres.save('./output/presentation.pptx');
```

### 9. Table Column Widths

`colW` values must be an array with one entry per column. Values are in inches:

```javascript
slide.addTable(rows, {
  colW: [2.8, 2.8, 2.8]  // one value per column
});
```

### 10. Text Overflow

Text does not auto-shrink. Ensure your text fits within the specified dimensions. Test with the longest expected content.
