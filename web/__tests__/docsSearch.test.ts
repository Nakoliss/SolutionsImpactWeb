import { describe, it, expect, beforeAll } from "vitest";
import { cosineSimilarity, rankBySimilarity, IndexEntry } from "@/lib/docsSearch";
import { runQueryInternal } from "@/scripts/docs/query";

function fakeEmbed(text: string, dim = 8): number[] {
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

describe("docsSearch utils", () => {
  it("computes cosine similarity in [-1, 1]", () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    const c = [1, 1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
    expect(cosineSimilarity(a, a)).toBeCloseTo(1, 5);
    expect(cosineSimilarity(a, c)).toBeGreaterThan(0.7);
  });

  it("ranks by similarity", () => {
    const entries: IndexEntry[] = [
      {
        docPath: "a",
        docId: "a",
        chunkId: "a#0",
        chunk: "apple banana",
        embedding: fakeEmbed("apple banana"),
        lang: "en",
        tokens: 10,
      },
      {
        docPath: "b",
        docId: "b",
        chunkId: "b#0",
        chunk: "banana orange",
        embedding: fakeEmbed("banana orange"),
        lang: "en",
        tokens: 10,
      },
      {
        docPath: "c",
        docId: "c",
        chunkId: "c#0",
        chunk: "car motor engine",
        embedding: fakeEmbed("car motor engine"),
        lang: "en",
        tokens: 10,
      },
    ];
    const q = fakeEmbed("apple");
    const [top] = rankBySimilarity(entries, q, 1);
    expect(top.docPath).toBe("a");
  });
});

describe("docs:query CLI smoke", () => {
  beforeAll(() => {
    process.env.DOCS_SEARCH_FAKE_EMBED = "1";
  });

  it("returns results for a basic query", async () => {
    const results = await runQueryInternal("interne", "onboarding", 3);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });
});


