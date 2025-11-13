import { loadIndex, embedText, rankBySimilarity, Scope, SearchResult } from "@/lib/docsSearch";

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (const a of args) {
    if (a.startsWith("--")) {
      const [k, v] = a.replace(/^--/, "").split("=");
      flags[k] = v === undefined ? true : v;
    } else {
      positionals.push(a);
    }
  }
  const query = positionals.join(" ").trim();
  const scope = (flags["scope"] as Scope) || "interne";
  const k = flags["k"] ? parseInt(String(flags["k"]), 10) : 8;
  return { query, scope, k };
}

export async function runQueryInternal(
  scope: Scope,
  query: string,
  k = 8
): Promise<SearchResult[]> {
  const entries = await loadIndex(scope);
  const qEmbed = await embedText(query);
  return rankBySimilarity(entries, qEmbed, k);
}

async function main() {
  const { query, scope, k } = parseArgs(process.argv);
  if (!query) {
    console.error("Usage: npm run docs:query -- \"your question\" --scope=interne --k=8");
    process.exit(1);
  }
  const results = await runQueryInternal(scope as Scope, query, k);
  for (const r of results) {
    const snippet = r.chunk.replace(/\s+/g, " ").slice(0, 180);
    console.log(`${r.score.toFixed(3)}\t${r.docPath}\t${snippet}…`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}


