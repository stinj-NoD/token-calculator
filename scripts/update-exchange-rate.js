// Met à jour le taux de change USD->EUR dans data/providers.json (et sa copie
// FALLBACK_DATA dans index.html) à partir de l'API gratuite Frankfurter.app
// (taux officiels Banque Centrale Européenne, sans clé requise).
// Usage : node scripts/update-exchange-rate.js
// N'écrit dans les fichiers que si le taux a réellement changé (arrondi à 4 décimales).

const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.resolve(__dirname, "..");
const providersPath = path.join(root, "data", "providers.json");
const indexPath = path.join(root, "index.html");

function get(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (redirectsLeft <= 0) {
            reject(new Error("Trop de redirections"));
            res.resume();
            return;
          }
          res.resume();
          resolve(get(new URL(res.headers.location, url).toString(), redirectsLeft - 1));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}

async function fetchRate() {
  const body = await get("https://api.frankfurter.app/latest?from=USD&to=EUR");
  const json = JSON.parse(body);
  const rate = json.rates && json.rates.EUR;
  if (typeof rate !== "number") throw new Error("Champ rates.EUR absent ou invalide");
  return { rate, date: json.date };
}

function updateJsonFile(rate, verifiedOn) {
  let raw = fs.readFileSync(providersPath, "utf8");
  raw = raw.replace(
    /"exchangeRateUSDtoEUR":\s*[\d.]+,/,
    `"exchangeRateUSDtoEUR": ${rate},`
  );
  raw = raw.replace(
    /"exchangeRateVerifiedOn":\s*"[\d-]+",/,
    `"exchangeRateVerifiedOn": "${verifiedOn}",`
  );
  fs.writeFileSync(providersPath, raw, "utf8");
}

function updateFallbackInIndex(rate, verifiedOn) {
  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replace(
    /exchangeRateUSDtoEUR:\s*[\d.]+,/,
    `exchangeRateUSDtoEUR: ${rate},`
  );
  html = html.replace(
    /exchangeRateVerifiedOn:\s*"[\d-]+",/,
    `exchangeRateVerifiedOn: "${verifiedOn}",`
  );
  fs.writeFileSync(indexPath, html, "utf8");
}

async function main() {
  const { rate, date } = await fetchRate();
  const rounded = Math.round(rate * 10000) / 10000;
  const today = new Date().toISOString().slice(0, 10);

  const previous = JSON.parse(fs.readFileSync(providersPath, "utf8")).exchangeRateUSDtoEUR;

  if (previous === rounded) {
    console.log(`OK: taux inchangé (${rounded}, source BCE datée du ${date}). Rien à faire.`);
    return;
  }

  updateJsonFile(rounded, today);
  updateFallbackInIndex(rounded, today);
  console.log(`Taux mis à jour : ${previous} -> ${rounded} (source BCE datée du ${date}, vérifié le ${today}).`);
}

main().catch((e) => {
  console.error("ERREUR lors de la mise à jour du taux de change :", e.message);
  process.exitCode = 1;
});
