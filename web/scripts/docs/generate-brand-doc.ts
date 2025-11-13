import fs from "fs";
import path from "path";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { brandConfig } from "@/lib/brand";

function repoRoot(): string {
  return path.resolve(process.cwd(), "..");
}

function outputPath(): string {
  return path.join(
    repoRoot(),
    "Documents",
    "Interne",
    "Solutions Impact Web Brand (aligned).docx",
  );
}

function heading(text: string, level: HeadingLevel): Paragraph {
  return new Paragraph({
    text,
    heading: level,
  });
}

function body(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text })],
    spacing: {
      after: 240,
    },
  });
}

function bullet(items: string[]): Paragraph[] {
  return items.map(
    (item) =>
      new Paragraph({
        children: [new TextRun(item)],
        bullet: {
          level: 0,
        },
      }),
  );
}

async function main() {
  const now = new Date();
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Solutions Impact Web — Brand (Aligned to website)",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),
          new Paragraph({
            text: `Generated ${now.toISOString()}`,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400,
            },
          }),
          heading("Structure", HeadingLevel.HEADING_1),
          body("Umbrella: Nakoliss Studios → Solutions Impact Web (web agency)"),
          heading("Tagline", HeadingLevel.HEADING_1),
          heading("FR", HeadingLevel.HEADING_2),
          body(brandConfig.tagline.fr),
          heading("EN", HeadingLevel.HEADING_2),
          body(brandConfig.tagline.en),
          heading("Description", HeadingLevel.HEADING_1),
          heading("FR", HeadingLevel.HEADING_2),
          body(brandConfig.description.fr),
          heading("EN", HeadingLevel.HEADING_2),
          body(brandConfig.description.en),
          heading("Mission", HeadingLevel.HEADING_1),
          heading("FR", HeadingLevel.HEADING_2),
          body(brandConfig.mission.fr),
          heading("EN", HeadingLevel.HEADING_2),
          body(brandConfig.mission.en),
          heading("Values", HeadingLevel.HEADING_1),
          heading("FR", HeadingLevel.HEADING_2),
          ...bullet(brandConfig.values.fr),
          heading("EN", HeadingLevel.HEADING_2),
          ...bullet(brandConfig.values.en),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = outputPath();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`Brand document generated at ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


