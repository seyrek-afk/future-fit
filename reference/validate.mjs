// data/*.json arası id bütünlüğü denetimi. src/ içindeki kalıcı test bunun aynısını yapmalı.
import { readFileSync } from "node:fs";
const rd = n => JSON.parse(readFileSync(new URL(`../data/${n}.json`, import.meta.url), "utf8"));
const clusters = rd("clusters").clusters;
const conf = new Set(rd("confidence").items.map(i => i.id));
const int = rd("interests");
const techs = new Set(int.techs.map(t => t.id));
const probs = new Set(int.problems.map(p => p.id));
const values = new Set(rd("values").values.map(v => v.id));
const sk = rd("skills2030");
const skills = new Set([...sk.rising, ...sk.extraCore].map(s => s.id));
const sources = new Set(rd("sources").sources.map(s => s.id));
const riasec = new Set(Object.keys(rd("riasec").meta));
const errs = [];
const ids = new Set();
for (const c of clusters) {
  const w = (f, set, vals) => (vals || []).forEach(v => set.has(v) || errs.push(`${c.id}.${f}: bilinmeyen id "${v}"`));
  if (ids.has(c.id)) errs.push(`yinelenen küme id: ${c.id}`); ids.add(c.id);
  w("conf", conf, c.conf); w("tech", techs, c.tech); w("problems", probs, c.problems);
  w("values", values, c.values); w("skills", skills, c.skills);
  Object.keys(c.riasec || {}).forEach(k => riasec.has(k) || errs.push(`${c.id}.riasec: bilinmeyen tip "${k}"`));
  (c.jobs || []).forEach(j => sources.has(j.source) || errs.push(`${c.id} / ${j.name}: bilinmeyen kaynak "${j.source}"`));
  if (c.aiPosture && !sources.has(c.aiPosture.source)) errs.push(`${c.id}.aiPosture: bilinmeyen kaynak "${c.aiPosture.source}"`);
  ["tagline","note","caution"].forEach(f => c[f] || errs.push(`${c.id}: "${f}" eksik`));
  if (!(c.studyPathsTR || []).length) errs.push(`${c.id}: studyPathsTR boş`);
  if ((c.jobs || []).length < 4) errs.push(`${c.id}: 4'ten az meslek`);
}
// her RIASEC tipi en az bir kümede baskın (ağırlık >= 2.5) olmalı
for (const t of riasec) {
  const has = clusters.some(c => (c.riasec[t] || 0) >= 2.5);
  if (!has) errs.push(`KAPSAMA: "${t}" tipi hiçbir kümede baskın değil`);
}

// --- v2.1: kaynak izi (provenance) denetimi ---
const DATA_FILES = ["clusters","skills2030","riasec","workstyle","values","confidence","interests","open-questions"];
for (const f of DATA_FILES) {
  const o = rd(f);
  if (!o._attribution) errs.push(`${f}.json: dosya sonunda _attribution künyesi yok`);
  const keys = Object.keys(o);
  if (keys[keys.length - 1] !== "_attribution") errs.push(`${f}.json: _attribution en altta değil (şu an: ${keys[keys.length - 1]})`);
  (o._attribution?.usedSources || []).forEach(id => sources.has(id) || errs.push(`${f}.json künyesi: bilinmeyen kaynak "${id}"`));
}
for (const c of clusters) {
  if (!(c.noteSources || []).length) errs.push(`${c.id}: note alanı için noteSources yok`);
  (c.noteSources || []).forEach(id => sources.has(id) || errs.push(`${c.id}.noteSources: bilinmeyen kaynak "${id}"`));
}
// kayıtta olup hiç kullanılmayan kaynak kalmasın
const used = new Set(clusters.flatMap(c => [...(c.jobs||[]).map(j=>j.source), c.aiPosture?.source, ...(c.noteSources||[])]).filter(Boolean));
[...sources].forEach(id => used.has(id) || rd("skills2030")._attribution.usedSources.includes(id) || errs.push(`sources.json: "${id}" hiçbir veri alanında kullanılmıyor`));
console.log(`Kaynak izi: ${used.size} kaynak aktif olarak kullanılıyor.`);

console.log(`${clusters.length} küme, ${sources.size} kaynak, ${skills.size} beceri denetlendi.`);
if (errs.length) { console.error("HATALAR:\n" + errs.join("\n")); process.exit(1); }
console.log("✓ Tüm id referansları ve kapsama kuralları geçerli.");
