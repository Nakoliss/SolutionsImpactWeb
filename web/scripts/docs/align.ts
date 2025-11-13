import fs from "fs";
import path from "path";
import { searchDocs, Scope } from "@/lib/docsSearch";

type Topic = {
  title: string;
  query: string;
};

function getRepoRoot(): string {
  return path.resolve(process.cwd(), "..");
}

function exists(p: string): boolean {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function buildInterneAlignment() {
  const topics: Topic[] = [
    { title: "Brand", query: "identité de marque valeurs piliers ton de voix" },
    { title: "Services", query: "services offerts forfaits Solutions Impact Web" },
    { title: "Onboarding", query: "processus d'onboarding client étapes" },
    { title: "Pricing", query: "tarification prix forfaits" },
    { title: "Compliance (Loi 25)", query: "Loi 25 conformité protection des renseignements personnels" },
    { title: "Maintenance", query: "plan de maintenance site web tâches" },
    { title: "SEO / AEO / GEO", query: "SEO AEO GEO stratégie contenu" },
    { title: "Operations Scaling", query: "opérations internalisation mise à l'échelle processus" },
    { title: "Master Checklist", query: "checklist maître roadmap" },
  ];

  const site = {
    brand: path.join(process.cwd(), "lib", "brand.ts"),
    servicesFr: path.join(process.cwd(), "content", "services.fr.json"),
    servicesEn: path.join(process.cwd(), "content", "services.en.json"),
    pricingFr: path.join(process.cwd(), "content", "pricing", "index.fr.mdx"),
    pricingEn: path.join(process.cwd(), "content", "pricing", "index.en.mdx"),
    complianceDir: path.join(process.cwd(), "content", "compliance"),
  };

  const lines: string[] = [];
  lines.push("# Interne Alignment");
  lines.push("");
  lines.push("Heuristic mapping of internal documents to current site. Review manually before edits.");
  lines.push("");
  lines.push("## Site Artifacts presence");
  lines.push(`- brand.ts: ${exists(site.brand) ? "present" : "missing"}`);
  lines.push(`- services.fr.json: ${exists(site.servicesFr) ? "present" : "missing"}`);
  lines.push(`- services.en.json: ${exists(site.servicesEn) ? "present" : "missing"}`);
  lines.push(`- pricing (fr): ${exists(site.pricingFr) ? "present" : "missing"}`);
  lines.push(`- pricing (en): ${exists(site.pricingEn) ? "present" : "missing"}`);
  lines.push(`- compliance content dir: ${exists(site.complianceDir) ? "present" : "missing"}`);
  lines.push("");

  for (const t of topics) {
    const results = await searchDocs({ query: t.query, scope: "interne" as Scope, k: 3 });
    lines.push(`## ${t.title}`);
    lines.push(`Query: ${t.query}`);
    for (const r of results) {
      const snippet = r.chunk.replace(/\s+/g, " ").slice(0, 240);
      lines.push(`- (${r.score.toFixed(3)}) ${r.docPath}`);
      lines.push(`  - ${snippet}…`);
    }
    lines.push("");
  }

  const out = path.join(getRepoRoot(), "Plans", "2025-08_site_improvement", "interne-alignment.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n"), "utf8");
}

async function buildClientsAlignment() {
  const topics: Topic[] = [
    { title: "Service Catalogue", query: "Service Catalogue services offerts" },
    { title: "Onboarding Questionnaire", query: "Onboarding Questionnaire intake client" },
    { title: "Proposal Template", query: "Proposal Template offre proposition" },
    { title: "Quickstart Guide", query: "Quickstart Guide démarrage rapide" },
    { title: "Maintenance Report", query: "Maintenance Report rapport maintenance" },
    { title: "Roadmap To Growth", query: "Roadmap To Growth feuille de route" },
    { title: "SEO AEO Report", query: "SEO AEO Report Template résultats" },
    { title: "Compliance Package Loi 25", query: "Compliance Package Loi25 conformité" },
  ];

  const lines: string[] = [];
  lines.push("# Clients Alignment");
  lines.push("");
  lines.push("Heuristic mapping of client-facing documents to current site/downloads.");
  lines.push("");

  for (const t of topics) {
    const results = await searchDocs({ query: t.query, scope: "clients" as Scope, k: 3 });
    lines.push(`## ${t.title}`);
    lines.push(`Query: ${t.query}`);
    for (const r of results) {
      const snippet = r.chunk.replace(/\s+/g, " ").slice(0, 240);
      lines.push(`- (${r.score.toFixed(3)}) ${r.docPath}`);
      lines.push(`  - ${snippet}…`);
    }
    lines.push("");
  }

  const out = path.join(getRepoRoot(), "Plans", "2025-08_site_improvement", "clients-alignment.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n"), "utf8");
}

async function main() {
  await buildInterneAlignment();
  await buildClientsAlignment();
  console.log("Alignment reports generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


