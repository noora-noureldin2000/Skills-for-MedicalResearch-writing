# Editing Presentations

## When to Use

Use this workflow when the user provides a **template** or **reference presentation** that they want modified or built upon. Do NOT use this for creating from scratch.

---

## Workflow

### 1. Unpack the PPTX

A `.pptx` file is a ZIP archive containing XML files.

```bash
# Copy the template into the project
cp template.pptx slides/template.pptx

# Unzip it
cd slides
Expand-Archive -Path "template.pptx" -DestinationPath "template_unpacked"
```

### 2. Understand the Structure

Key files inside the unpacked archive:

```
template_unpacked/
├── [Content_Types].xml
├── ppt/
│   ├── presentation.xml        # Slide order, dimensions
│   ├── slides/
│   │   ├── slide1.xml
│   │   ├── slide2.xml
│   │   └── ...
│   ├── slideMasters/
│   │   └── slideMaster1.xml    # Master layout definitions
│   ├── slideLayouts/
│   │   └── slideLayout1.xml    # Layout definitions
│   ├── media/                  # Images and other media
│   │   ├── image1.png
│   │   └── ...
│   └── theme/
│       └── theme1.xml          # Color scheme, fonts
└── docProps/
    ├── app.xml
    └── core.xml
```

### 3. Extract Current Text

```bash
# Using markitdown for a quick text overview
python -m markitdown slides/template.pptx
```

### 4. Modify XML Content

Edit the slide XML files directly. Each slide XML contains a `p:sld` root element with `p:spTree` containing shape elements.

**Common XML operations:**

**Change text in a shape:**
```xml
<p:sp>
  <p:nvSpPr>
    <p:cNvPr id="4" name="Title 1"/>
  </p:nvSpPr>
  <p:spPr/>
  <p:txBody>
    <a:p>
      <a:r>
        <a:t>New Title Text Here</a:t>
      </a:r>
    </a:p>
  </p:txBody>
</p:sp>
```

**Change a color:**
```xml
<a:solidFill>
  <a:srgbClr val="1B4F72"/>  <!-- Change this hex value -->
</a:solidFill>
```

**Change text in `a:r` elements:**
```bash
# PowerShell: find and replace text across all slides
Get-ChildItem -Path "template_unpacked/ppt/slides" -Filter "slide*.xml" | ForEach-Object {
  (Get-Content $_.FullName) -replace "Old Text", "New Text" | Set-Content $_.FullName
}
```

**Update a color across the entire deck:**
```bash
# Replace a specific hex color in all XML files
Get-ChildItem -Path "template_unpacked" -Recurse -Include "*.xml" | ForEach-Object {
  (Get-Content $_.FullName) -replace "FF5733", "1B4F72" | Set-Content $_.FullName
}
```

### 5. Repack the PPTX

```bash
# Repack into .pptx
Compress-Archive -Path "template_unpacked/*" -DestinationPath "edited.pptx"
# Rename to .pptx (Compress-Archive adds .zip)
Rename-Item -Path "edited.pptx" -NewName "edited.pptx"  # Already .pptx

# Or use the full approach:
cd template_unpacked
Compress-Archive -Path * -DestinationPath "..\edited_presentation.pptx" -Force
```

**Important:** Compress-Archive may produce a file that PowerPoint flags as corrupt. A more reliable approach:

```bash
# Use dotnet to create a proper ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory("template_unpacked", "edited_presentation.pptx")
```

### 6. Verify

```bash
python -m markitdown edited_presentation.pptx
```

---

## Formatting Rules for XML Edits

- **Colors**: Always 6-char hex, uppercase or lowercase accepted by PowerPoint
- **Fonts**: `a:latin` for Latin text, `a:ea` for East Asian text
- **Font size**: Specified in hundredths of a point (`a:szPt` or `sz val="1800"` = 18pt)
- **Positions**: In EMUs (English Metric Units). 1" = 914400 EMU. 1cm = 360000 EMU.
- **Line spacing**: `a:lnSpc` with `a:spcPct` (percentage) or `a:spcPts` (points)

---

## Common Pitfalls

1. **Corrupt archive**: Always use `[System.IO.Compression.ZipFile]::CreateFromDirectory` instead of `Compress-Archive` for reliability
2. **Lost media**: When unpacking and repacking, ensure the `media/` folder is preserved
3. **Theme references**: If changing colors, also update `theme/theme1.xml` for master-level changes
4. **Slide references**: If adding/removing slides, update `[Content_Types].xml` and `ppt/presentation.xml`
5. **Encoding**: Ensure XML files are saved as UTF-8 without BOM
6. **Backup**: Always keep the original template before editing
