import fs from "fs";
import path from "path";
import { pipeline, env } from "@xenova/transformers";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

type Scope = "interne" | "clients";

type IndexEntry = {
  docPath: string;
  docId: string;
  chunkId: string;
  chunk: string;
  embedding: number[];
  lang: "fr" | "en";
  tokens: number;
};

const MODEL_ID = "Xenova/bge-m3";
const DEFAULT_SCOPES: Scope[] = ["interne", "clients"];

// Ensure model downloads are cached on disk
env.allowRemoteModels = true;

function parseArgs(): { scopes: Scope[] } {
  const scopesFlag = process.argv.find((a) => a.startsWith("--scopes="));
  if (!scopesFlag) {
    return { scopes: DEFAULT_SCOPES };
  }
  const scopes = scopesFlag
    .split("=")[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as Scope[];
  const valid = new Set<Scope>(["interne", "clients"]);
  const filtered = scopes.filter((s) => valid.has(s));
  return { scopes: filtered.length ? filtered : DEFAULT_SCOPES };
}

function getRepoRoot(): string {
  // We expect to run this from web/; repo root is one level up
  return path.resolve(process.cwd(), "..");
}

function getDocumentsDir(scope: Scope): string {
  const repoRoot = getRepoRoot();
  return path.join(
    repoRoot,
    "Documents",
    scope === "interne" ? "Interne" : "Clients"
  );
}

function getOutputDir(): string {
  return path.join(process.cwd(), "data", "docs-index");
}

async function extractDocx(filePath: string): Promise<string> {
  const buffer = await fs.promises.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

async function extractPdf(filePath: string): Promise<string> {
  const buffer = await fs.promises.readFile(filePath);
  const data = await pdfParse(buffer);
  return data.text || "";
}

async function extractText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".docx") return extractDocx(filePath);
  if (ext === ".pdf") return extractPdf(filePath);
  // Ignore other types
  return "";
}

function* walkFiles(dir: string): Generator<string> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(full);
    } else {
      if (full.toLowerCase().endsWith(".docx") || full.toLowerCase().endsWith(".pdf")) {
        yield full;
      }
    }
  }
}

function chunkText(
  text: string,
  minLen = 800,
  maxLen = 1200,
  overlap = 200
): string[] {
  const clean = text.replace(/\r/g, "").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ");
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    const end = Math.min(i + maxLen, clean.length);
    let chunk = clean.slice(i, end);
    if (chunk.length < minLen && end < clean.length) {
      // extend to min length if possible
      const extra = Math.min(clean.length, end + (minLen - chunk.length));
      chunk = clean.slice(i, extra);
      i = extra - overlap;
    } else {
      i = end - overlap;
    }
    if (i < 0) i = 0;
    chunks.push(chunk.trim());
    if (end === clean.length) break;
  }
  return chunks.filter((c) => c.length > 0);
}

function guessLanguage(text: string): "fr" | "en" {
  // Simple heuristic: count frequent words
  const sample = text.slice(0, 2000).toLowerCase();
  const frHits = [" le ", " la ", " les ", " de ", " des ", " et ", " que ", " pour "]
    .map((w) => (sample.match(new RegExp(w, "g")) || []).length)
    .reduce((a, b) => a + b, 0);
  const enHits = [" the ", " and ", " to ", " of ", " in ", " for ", " with "]
    .map((w) => (sample.match(new RegExp(w, "g")) || []).length)
    .reduce((a, b) => a + b, 0);
  return frHits >= enHits ? "fr" : "en";
}

function hashStringToVector(text: string, dim = 64): number[] {
  const vec = new Array(dim).fill(0);
  let h1 = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h1 ^= text.charCodeAt(i);
    h1 += (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24);
  }
  for (let i = 0; i < dim; i++) {
    const val = Math.sin((h1 + i * 2654435761) % 1_000_000) + Math.cos((h1 ^ (i * 9973)) % 1_000_000);
    vec[i] = val;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map((v) => v / (norm || 1));
}

async function buildEmbedder() {
  const useFake = process.env.DOCS_SEARCH_FAKE_EMBED === "1" || process.env.DOCS_INGEST_FAKE_EMBED === "1";
  if (useFake) {
    return async (text: string): Promise<number[]> => hashStringToVector(text);
  }
  const extractor = await pipeline("feature-extraction", MODEL_ID);
  return async (text: string): Promise<number[]> => {
    const output: any = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });
    // output.data is a TypedArray
    const arr = Array.from(output.data as Float32Array);
    return arr;
  };
}

function toDocId(scope: Scope, file: string): string {
  const base = path.basename(file).toLowerCase().replace(/\s+/g, "-").replace(/\.+/g, "-");
  return `${scope}/${base.replace(/-pdf$|-docx$/g, "").replace(/-updated/g, "")}`;
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJsonlLine(stream: fs.WriteStream, obj: unknown) {
  stream.write(JSON.stringify(obj) + "\n");
}

async function ingestScope(scope: Scope, embed: (t: string) => Promise<number[]>) {
  const inputDir = getDocumentsDir(scope);
  const outputDir = getOutputDir();
  ensureDir(outputDir);
  const indexPath = path.join(outputDir, `${scope}.index.jsonl`);
  const indexStream = fs.createWriteStream(indexPath, { encoding: "utf8" });

  const summaries: Record<
    string,
    { docPath: string; lang: "fr" | "en"; firstLine: string; approxChars: number }
  > = {};

  let totalChunks = 0;
  for (const filePath of walkFiles(inputDir)) {
    const relFromRepo = path.relative(getRepoRoot(), filePath).replace(/\\/g, "/");
    process.stdout.write(`Extracting: ${relFromRepo}\n`);
    const raw = await extractText(filePath);
    if (!raw.trim()) continue;
    const lang = guessLanguage(raw);
    const docId = toDocId(scope, filePath);
    const chunks = chunkText(raw);
    const firstLine = raw.split(/\n+/)[0]?.trim().slice(0, 160) || "";
    summaries[docId] = {
      docPath: relFromRepo,
      lang,
      firstLine,
      approxChars: raw.length,
    };
    let idx = 0;
    for (const chunk of chunks) {
      const embedding = await embed(chunk);
      const entry: IndexEntry = {
        docPath: relFromRepo,
        docId,
        chunkId: `${docId}#${idx}`,
        chunk,
        embedding,
        lang,
        tokens: Math.ceil(chunk.length / 4), // cheap char->token approx
      };
      writeJsonlLine(indexStream, entry);
      idx += 1;
      totalChunks += 1;
    }
  }

  indexStream.end();

  const summariesPath = path.join(outputDir, "summaries.json");
  let allSummaries: any = {};
  if (fs.existsSync(summariesPath)) {
    try {
      allSummaries = JSON.parse(fs.readFileSync(summariesPath, "utf8"));
    } catch {
      allSummaries = {};
    }
  }
  allSummaries[scope] = summaries;
  fs.writeFileSync(summariesPath, JSON.stringify(allSummaries, null, 2), "utf8");

  return { totalChunks };
}

function writeMeta(dim: number) {
  const outputDir = getOutputDir();
  ensureDir(outputDir);
  const metaPath = path.join(outputDir, "meta.json");
  const meta = {
    model: MODEL_ID,
    dim,
    created: new Date().toISOString(),
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf8");
}

async function generateAlignmentReports() {
  // Generate skeleton alignment files with paths discovered and placeholders
  const repoRoot = getRepoRoot();
  const plansDir = path.join(repoRoot, "Plans", "2025-08_site_improvement");
  ensureDir(plansDir);

  const interneMd = path.join(plansDir, "interne-alignment.md");
  const clientsMd = path.join(plansDir, "clients-alignment.md");

  const sitePaths = {
    brand: path.join(process.cwd(), "lib", "brand.ts"),
    servicesFr: path.join(process.cwd(), "content", "services.fr.json"),
    servicesEn: path.join(process.cwd(), "content", "services.en.json"),
    pricingMdxFr: path.join(process.cwd(), "content", "pricing", "index.fr.mdx"),
    pricingMdxEn: path.join(process.cwd(), "content", "pricing", "index.en.mdx"),
    complianceDir: path.join(process.cwd(), "content", "compliance"),
  };

  function exists(p: string): boolean {
    try {
      fs.accessSync(p, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  const interneContent: string[] = [];
  interneContent.push("# Interne Alignment\n");
  interneContent.push("Status is heuristic; detailed review recommended.\n");
  interneContent.push("## Topics\n");
  interneContent.push("- Brand, Services, Onboarding, Pricing, Compliance, Maintenance, SEO, Operations, Master Checklist\n");
  interneContent.push("\n## Site Artifacts\n");
  interneContent.push(`- brand.ts: ${exists(sitePaths.brand) ? "present" : "missing"}`);
  interneContent.push(`- services.fr.json: ${exists(sitePaths.servicesFr) ? "present" : "missing"}`);
  interneContent.push(`- services.en.json: ${exists(sitePaths.servicesEn) ? "present" : "missing"}`);
  interneContent.push(`- pricing mdx (fr): ${exists(sitePaths.pricingMdxFr) ? "present" : "missing"}`);
  interneContent.push(`- pricing mdx (en): ${exists(sitePaths.pricingMdxEn) ? "present" : "missing"}`);
  interneContent.push(`- compliance content dir: ${exists(sitePaths.complianceDir) ? "present" : "missing"}`);
  interneContent.push("\n> Next: Use docs:query to pull excerpts for each topic and compare to these files.\n");
  fs.writeFileSync(interneMd, interneContent.join("\n"), "utf8");

  const clientsContent: string[] = [];
  clientsContent.push("# Clients Alignment\n");
  clientsContent.push("Status is heuristic; detailed review recommended.\n");
  clientsContent.push("## Key Documents\n");
  clientsContent.push("- Service Catalogue, Onboarding Questionnaire, Proposal Template, Quickstart Guide, Maintenance Report, Roadmap To Growth, SEO/AEO Report, Compliance Package Loi 25\n");
  clientsContent.push("\n> Next: Cross-check site content and downloads with these templates.\n");
  fs.writeFileSync(clientsMd, clientsContent.join("\n"), "utf8");
}

async function main() {
  const { scopes } = parseArgs();
  console.log(`Scopes: ${scopes.join(", ")}`);

  const embed = await buildEmbedder();

  // Probe for dimension
  const probeVec = await embed("probe");
  writeMeta(probeVec.length);

  for (const scope of scopes) {
    await ingestScope(scope, embed);
  }

  // Produce initial alignment stubs (refine later through dedicated queries)
  await generateAlignmentReports();

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


