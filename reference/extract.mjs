// v1 HTML'deki VERİ script bloğunu JSON'a çevirir (tek seferlik göç aracı).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(new URL("./v1-duru-kariyer-kesif-testi.html", import.meta.url), "utf8");
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const dataBlock = blocks.find(b => b.includes("const RIASEC_META"));
if (!dataBlock) throw new Error("VERİ bloğu bulunamadı");
const ctx = { module: {}, exports: {} };
vm.createContext(ctx);
vm.runInContext(dataBlock + "\n;globalThis.__out = { RIASEC_META, LIKERT_ITEMS, SCENARIOS, PREDIGER, ENV_PREFS, VALUES, FLOW_QS, CONF_ITEMS, PROBLEMS, TECHS, OPEN_QS, CLUSTERS, LIKERT_LABELS, CONF_LABELS };", ctx);
const out = ctx.__out;
mkdirSync(new URL("../data/_v1/", import.meta.url), { recursive: true });
for (const [k, v] of Object.entries(out)) {
  writeFileSync(new URL(`../data/_v1/${k}.json`, import.meta.url), JSON.stringify(v, null, 2) + "\n", "utf8");
}
console.log(Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length + " kayıt" : Object.keys(v).length + " anahtar"}`).join("\n"));
