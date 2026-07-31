// Vérifie que data/providers.json et la copie FALLBACK_DATA embarquée dans
// index.html restent synchronisés. Aucune dépendance npm : `node` seul suffit.
// Usage : node scripts/check-fallback-sync.js

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const providersPath = path.join(root, "data", "providers.json");
const indexPath = path.join(root, "index.html");

function loadProviders() {
  return JSON.parse(fs.readFileSync(providersPath, "utf8"));
}

function loadFallbackData() {
  const html = fs.readFileSync(indexPath, "utf8");
  const startMarker = "const FALLBACK_DATA = {";
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    throw new Error("Marqueur 'const FALLBACK_DATA = {' introuvable dans index.html");
  }
  const objectStart = startIdx + startMarker.length - 1; // inclut le '{'
  const endMarker = "\n};";
  const endIdx = html.indexOf(endMarker, objectStart);
  if (endIdx === -1) {
    throw new Error("Fin du bloc FALLBACK_DATA introuvable (marqueur '\\n};')");
  }
  const objectLiteral = html.slice(objectStart, endIdx + 2); // inclut le '}' de fermeture avant ';'
  // Objet JS littéral (clés non quotées) : impossible à parser en JSON strict.
  return new Function("return (" + objectLiteral + ");")();
}

function normalize(value) {
  return JSON.stringify(value, Object.keys(value).sort ? undefined : undefined, 0);
}

function deepSortedStringify(value) {
  if (Array.isArray(value)) {
    return "[" + value.map(deepSortedStringify).join(",") + "]";
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + deepSortedStringify(value[k])).join(",") + "}";
  }
  return JSON.stringify(value);
}

function main() {
  const providers = loadProviders();
  const fallback = loadFallbackData();

  const a = deepSortedStringify(providers);
  const b = deepSortedStringify(fallback);

  if (a === b) {
    console.log("OK: data/providers.json et FALLBACK_DATA (index.html) sont synchronisés.");
    return;
  }

  console.error("ERREUR: data/providers.json et FALLBACK_DATA (index.html) divergent.");
  const providerKeys = Object.keys(providers.providers || {});
  const fallbackKeys = Object.keys(fallback.providers || {});
  const allKeys = Array.from(new Set([...providerKeys, ...fallbackKeys])).sort();
  for (const key of allKeys) {
    const pStr = deepSortedStringify(providers.providers?.[key] ?? null);
    const fStr = deepSortedStringify(fallback.providers?.[key] ?? null);
    if (pStr !== fStr) {
      console.error(`  - divergence sur le fournisseur "${key}"`);
    }
  }
  if (deepSortedStringify(providers.effortMultipliers) !== deepSortedStringify(fallback.effortMultipliers)) {
    console.error("  - divergence sur effortMultipliers");
  }
  if (deepSortedStringify(providers.effortLabels) !== deepSortedStringify(fallback.effortLabels)) {
    console.error("  - divergence sur effortLabels");
  }
  process.exitCode = 1;
}

main();
