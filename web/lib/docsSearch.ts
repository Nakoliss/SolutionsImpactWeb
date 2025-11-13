import fs from "fs";
import path from "path";
import readline from "readline";
import { pipeline, env } from "@xenova/transformers";

export type Scope = "interne" | "clients";

export type IndexEntry = {
  docPath: string;
  docId: string;
  chunkId: string;
  chunk: string;
  embedding: number[];
  lang: "fr" | "en";
  tokens: number;
};

export type SearchResult = IndexEntry & { score: number };

const MODEL_ID = "Xenova/bge-m3";

env.allowRemoteModels = true;

function getOutputDir(): string {
  // run from web/
  return path.join(process.cwd(), "data", "docs-index");
}

export async function loadIndex(scope: Scope): Promise<IndexEntry[]> {
  const dir = getOutputDir();
  const file = path.join(dir, `${scope}.index.jsonl`);
  if (!fs.existsSync(file)) {
    throw new Error(`Index not found: ${file}`);
  }
  const entries: IndexEntry[] = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(file, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      entries.push(obj);
    } catch {
      // skip invalid lines
    }
  }
  return entries;
}

function l2Norm(vec: number[]): number {
  let sum = 0;
  for (const v of vec) sum += v * v;
  return Math.sqrt(sum);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vector length mismatch");
  }
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  const denom = l2Norm(a) * l2Norm(b);
  return denom === 0 ? 0 : dot / denom;
}

function hashStringToVector(text: string, dim = 64): number[] {
  // Deterministic pseudo-embedding for tests and smoke checks
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
  // normalize
  const norm = l2Norm(vec);
  return vec.map((v) => v / (norm || 1));
}

let extractorPromise: Promise<any> | null = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL_ID);
  }
  return extractorPromise;
}

export async function embedText(text: string): Promise<number[]> {
  if (process.env.DOCS_SEARCH_FAKE_EMBED === "1") {
    return hashStringToVector(text);
  }
  const extractor = await getExtractor();
  const output: any = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data as Float32Array);
}

export function rankBySimilarity(
  entries: IndexEntry[],
  queryEmbedding: number[],
  k = 8
): SearchResult[] {
  const scored: SearchResult[] = entries.map((e) => ({
    ...e,
    score: cosineSimilarity(e.embedding, queryEmbedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

export async function searchDocs(params: {
  query: string;
  scope: Scope;
  k?: number;
}): Promise<SearchResult[]> {
  const { query, scope, k = 8 } = params;
  const [entries, qEmbed] = await Promise.all([loadIndex(scope), embedText(query)]);
  return rankBySimilarity(entries, qEmbed, k);
}


