const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat, ShadingType, BorderStyle, WidthType, Header, Footer, PageNumber, TableOfContents } = require("docx");

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22, color: "1a1a1a" } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "1a3a5c", font: "Calibri" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, color: "2b5a8c", font: "Calibri" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "3a7abf", font: "Calibri" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
      {
        id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 52, bold: true, color: "0d2b4e", font: "Calibri" },
        paragraph: { spacing: { before: 600, after: 400 }, alignment: AlignmentType.CENTER },
      },
      {
        id: "Subtitle", name: "Subtitle", basedOn: "Normal",
        run: { size: 28, color: "5a7a9a", font: "Calibri", italics: true },
        paragraph: { spacing: { after: 200 }, alignment: AlignmentType.CENTER },
      },
      {
        id: "Code", name: "Code", basedOn: "Normal",
        run: { font: "Consolas", size: 18, color: "2d2d2d" },
        paragraph: { spacing: { before: 80, after: 80 }, indent: { left: 360 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          size: { width: 12240, height: 15840 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "Mega Medical Writer — User Manual", font: "Calibri", size: 18, color: "999999", italics: true })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", font: "Calibri", size: 18, color: "999999" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 18, color: "999999" }),
            ],
          })],
        }),
      },
      children: [
        new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Mega Medical Writer")] }),
        new Paragraph({ style: "Subtitle", children: [new TextRun("Complete User Manual — Reference Document")] }),
        new Paragraph({ children: [new TextRun({ text: "", size: 22 })] }),
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Introduction")] }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun("This is the reference styling document for the Mega Medical Writer user manual. It defines professional heading styles, body text formatting, and page layout used during pandoc conversion.")],
        }),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Typography & Layout")] }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun("Body text uses Calibri 11pt for clean readability. Headings use a blue color palette (dark navy to medium blue) for clear visual hierarchy. Code blocks use Consolas 9pt to distinguish commands from prose.")],
        }),
        new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("Code Example")] }),
        new Paragraph({ style: "Code", children: [new TextRun("python agent_core/main.py execute \"your request here\"")] }),
        new Paragraph({ spacing: { before: 120 }, children: [new TextRun("Page headers show the document title; footers show centered page numbers.")] }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("reference.docx", buffer);
  console.log("reference.docx created");
});
