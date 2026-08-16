# Design System Reference

## Color Palette Reference

### Medical / Healthcare

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"1B4F72"` | Titles, dark backgrounds |
| secondary | `"2E86C1"` | Body text, accents |
| accent | `"85C1E9"` | Highlights, badges |
| light | `"D4E6F1"` | Light accents, dividers |
| bg | `"F0F8FF"` | Slide backgrounds |

### Corporate / Business

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"1C2833"` | Titles, dark backgrounds |
| secondary | `"2C3E50"` | Body text, accents |
| accent | `"5D6D7E"` | Highlights, badges |
| light | `"ABB2B9"` | Light accents, dividers |
| bg | `"F8F9FA"` | Slide backgrounds |

### Academic / Research

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"4A235A"` | Titles, dark backgrounds |
| secondary | `"6C3483"` | Body text, accents |
| accent | `"AF7AC5"` | Highlights, badges |
| light | `"D2B4DE"` | Light accents, dividers |
| bg | `"F5EEF8"` | Slide backgrounds |

### Nature / Environment

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"145A32"` | Titles, dark backgrounds |
| secondary | `"1E8449"` | Body text, accents |
| accent | `"82E0AA"` | Highlights, badges |
| light | `"D5F5E3"` | Light accents, dividers |
| bg | `"F2FCF5"` | Slide backgrounds |

### Sunset / Warm

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"78281F"` | Titles, dark backgrounds |
| secondary | `"B03A2E"` | Body text, accents |
| accent | `"F1948A"` | Highlights, badges |
| light | `"FADBD8"` | Light accents, dividers |
| bg | `"FDEDEC"` | Slide backgrounds |

### Ocean / Blue

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"0E6251"` | Titles, dark backgrounds |
| secondary | `"148F77"` | Body text, accents |
| accent | `"76D7C4"` | Highlights, badges |
| light | `"D1F2EB"` | Light accents, dividers |
| bg | `"E8F8F5"` | Slide backgrounds |

### Dark Theme

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"FFFFFF"` | Titles (on dark bg) |
| secondary | `"CCCCCC"` | Body text (on dark bg) |
| accent | `"6C63FF"` | Highlights, badges |
| light | `"444444"` | Card backgrounds |
| bg | `"1A1A2E"` | Slide backgrounds |

### Modern / Tech

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"0D1117"` | Titles, dark backgrounds |
| secondary | `"21262D"` | Body text, accents |
| accent | `"58A6FF"` | Highlights, badges |
| light | `"8B949E"` | Light accents, dividers |
| bg | `"F6F8FA"` | Slide backgrounds |

### Minimal / Gray

| Key | Hex | Usage |
|-----|-----|-------|
| primary | `"212529"` | Titles, dark backgrounds |
| secondary | `"495057"` | Body text, accents |
| accent | `"6C757D"` | Highlights, badges |
| light | `"DEE2E6"` | Light accents, dividers |
| bg | `"F8F9FA"` | Slide backgrounds |

---

## Font Reference

| Usage | English | Chinese |
|-------|---------|---------|
| Default | Arial | Microsoft YaHei |
| Headings | Arial (Bold) | Microsoft YaHei (Bold) |
| Body | Arial | Microsoft YaHei |
| Alternative 1 | Calibri | Microsoft YaHei |
| Alternative 2 | Helvetica | Microsoft YaHei |
| Alternative 3 | Roboto | Microsoft YaHei |
| Alternative 4 | Lato | Microsoft YaHei |

**Fallback chain (for mixed content):**
```javascript
fontFace: "Arial"  // English
fontFace: "Microsoft YaHei"  // Chinese
```

---

## Style Recipes

### Sharp (Corporate / Professional)

Clean edges, right angles, high contrast.

```javascript
// Sharp style elements
slide.addShape(pres.shapes.RECTANGLE, {
  fill: { color: theme.primary }
});
slide.addShape(pres.shapes.LINE, {
  line: { color: theme.accent, width: 2 }
});
```

| Element | Style |
|---------|-------|
| Shapes | RECTANGLE only |
| Corners | Sharp (no radius) |
| Lines | Solid, 1.5-2pt |
| Spacing | Tight, professional |
| Best for | Business, corporate, formal |

### Soft (Friendly / Approachable)

Slightly rounded corners, gentle colors, more spacing.

```javascript
// Soft style elements
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  rectRadius: 0.1,
  fill: { color: theme.light }
});
```

| Element | Style |
|---------|-------|
| Shapes | ROUNDED_RECTANGLE with small radius |
| Corners | Slightly rounded (0.1) |
| Lines | Subtle, thin |
| Spacing | Generous |
| Best for | Healthcare, education, internal |

### Rounded (Modern / Casual)

Bold rounded shapes, generous padding, contemporary feel.

```javascript
// Rounded style elements
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  rectRadius: 0.25,
  fill: { color: theme.light }
});
```

| Element | Style |
|---------|-------|
| Shapes | ROUNDED_RECTANGLE with medium radius |
| Corners | Rounded (0.2-0.3) |
| Lines | Optional, thin |
| Spacing | Generous |
| Best for | Modern, tech, creative |

### Pill (Playful / Bold)

Very rounded corners (pill shape), bold colors, confident.

```javascript
// Pill style elements
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  rectRadius: 0.5,
  fill: { color: theme.accent }
});
```

| Element | Style |
|---------|-------|
| Shapes | ROUNDED_RECTANGLE with large radius |
| Corners | Very rounded / pill-shaped (0.4-0.5) |
| Lines | Thick and bold |
| Spacing | Wide and airy |
| Best for | Youth-oriented, informal, bold |

---

## Typography & Spacing

| Element | Size (pt) | Weight |
|---------|-----------|--------|
| Cover title | 40-48 | Bold |
| Cover subtitle | 20-24 | Regular |
| Section number | 60-72 | Bold |
| Section title | 30-36 | Regular |
| Slide title | 26-32 | Bold |
| Body text | 14-18 | Regular |
| Caption / footnote | 10-12 | Regular |
| Page badge | 11-12 | Bold |

| Spacing | Value |
|---------|-------|
| Slide margin (sides) | 0.8" |
| Slide margin (top) | 0.3-0.5" |
| Slide margin (bottom) | 0.5" |
| Between paragraphs | 0.15-0.2" |
| Between list items | 0.15-0.2" |
