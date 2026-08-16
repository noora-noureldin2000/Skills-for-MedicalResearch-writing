const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, LevelFormat } = require('docx');

const RED = "FF0000";
const BLACK = "000000";

function run(text, color = BLACK, opts = {}) {
  return new TextRun({ text, color, size: 22, font: "Times New Roman", ...opts });
}

function citationRun(text) {
  return new TextRun({ text, color: RED, size: 22, font: "Times New Roman", bold: true });
}

function refRun(text) {
  return new TextRun({ text, color: BLACK, size: 20, font: "Times New Roman" });
}

const ANCHOR_RE = /\[CitationAnchor:[^\]]+\]/g;

function parseText(text) {
  const result = [];
  let lastIdx = 0;
  let m;
  ANCHOR_RE.lastIndex = 0;
  while ((m = ANCHOR_RE.exec(text)) !== null) {
    if (m.index > lastIdx) {
      result.push(run(text.slice(lastIdx, m.index)));
    }
    result.push(citationRun(m[0]));
    lastIdx = ANCHOR_RE.lastIndex;
  }
  if (lastIdx < text.length) {
    result.push(run(text.slice(lastIdx)));
  }
  return result;
}

const INPUT = "D:\\ElGazzar_FREELANCE\\Sayed Mahmoud Ahmed\\Discussion_Sayed_Mahmoud_Ahmed_V2.md";
const OUTPUT = "D:\\ElGazzar_FREELANCE\\Sayed Mahmoud Ahmed\\Discussion_Sayed_Mahmoud_Ahmed_V2.docx";

const md = fs.readFileSync(INPUT, 'utf8').replace(/\r\n/g, '\n');
const blocks = md.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 0);

const HEADINGS = new Set([
  "Discussion", "Summary", "Summary of results",
  "Conclusions", "Limitations", "Recommendations", "References"
]);

const children = [];
let section = "none";
let listCounter = 0;

function nextBulletRef() {
  listCounter++;
  return "bullet-list-" + listCounter;
}

for (const block of blocks) {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) continue;

  const first = lines[0];

  // Detect headings
  if (HEADINGS.has(first)) {
    section = first;
    if (first === "Discussion") {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 240 },
        children: [
          new TextRun({ text: first, bold: true, size: 28, font: "Times New Roman", color: BLACK })
        ]
      }));
    } else if (first === "References") {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 120 },
        children: [
          new TextRun({ text: first, bold: true, size: 28, font: "Times New Roman", color: BLACK })
        ]
      }));
    } else {
      children.push(new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({ text: first, bold: true, size: 26, font: "Times New Roman", color: BLACK })
        ]
      }));
    }
    continue;
  }

  // Section: References
  if (section === "References") {
    for (const line of lines) {
      children.push(new Paragraph({
        spacing: { after: 80, line: 300 },
        indent: { left: 720, hanging: 720 },
        children: [refRun(line)]
      }));
    }
    continue;
  }

  // Bullet lists in Summary of results, Limitations, Recommendations
  const allAreBullets = lines.every(l => l.startsWith('- '));
  if (allAreBullets) {
    const ref = nextBulletRef();
    for (const line of lines) {
      const text = line.replace(/^- /, '');
      children.push(new Paragraph({
        numbering: { reference: ref, level: 0 },
        spacing: { after: 60, line: 320 },
        children: parseText(text)
      }));
    }
    continue;
  }

  // Regular paragraph (may span multiple lines joined)
  const text = lines.join(' ');
  children.push(new Paragraph({
    spacing: { after: 120, line: 360 },
    children: parseText(text)
  }));
}

// Build numbering config for all bullet lists
const numbering = {
  config: []
};
for (let i = 1; i <= listCounter; i++) {
  numbering.config.push({
    reference: "bullet-list-" + i,
    levels: [{
      level: 0,
      format: LevelFormat.BULLET,
      text: "\u2022",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } }
    }]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Times New Roman", size: 22 } }
    }
  },
  numbering: listCounter > 0 ? numbering : undefined,
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("DONE: " + OUTPUT);
}).catch(err => {
  console.error("ERROR:", err);
});
