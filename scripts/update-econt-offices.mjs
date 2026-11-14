// Downloads the current list of Econt offices in Bulgaria and saves a small
// version of it for the order form. Run with:  npm run update-offices
import { mkdir, writeFile } from "node:fs/promises";

const ENDPOINT =
  "https://ee.econt.com/services/Nomenclatures/NomenclaturesService.getOffices.json";
const OUT = new URL("../public/data/econt-offices.json", import.meta.url);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ countryCode: "BGR" }),
});
if (!res.ok) throw new Error(`Econt answered ${res.status}`);

const { offices } = await res.json();
if (!Array.isArray(offices) || offices.length < 100) {
  throw new Error("Econt returned an unexpectedly short office list");
}

// { "София": [["Office name", "street address"], ...], ... }
const cities = {};
for (const office of offices) {
  const city = office.address?.city?.name?.trim();
  const name = office.name?.trim();
  if (!city || !name) continue;
  let address = (office.address.fullAddress ?? "").replace(/\s+/g, " ").trim();
  if (address.startsWith(city)) address = address.slice(city.length).trim();
  (cities[city] ??= []).push([name, address]);
}

const collator = new Intl.Collator("bg");
const sorted = {};
for (const city of Object.keys(cities).sort(collator.compare)) {
  sorted[city] = cities[city].sort((a, b) => collator.compare(a[0], b[0]));
}

await mkdir(new URL("./", OUT), { recursive: true });
await writeFile(
  OUT,
  JSON.stringify({ updated: new Date().toISOString().slice(0, 10), cities: sorted })
);

const count = Object.values(sorted).reduce((n, list) => n + list.length, 0);
console.log(`Saved ${count} offices in ${Object.keys(sorted).length} cities.`);
