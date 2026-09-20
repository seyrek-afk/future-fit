// Her veri alanına kaynak izi ekler ve her dosyanın SONUNA künye bloğu koyar.
import { readFileSync, writeFileSync } from "node:fs";
const p = n => new URL(`../data/${n}.json`, import.meta.url);
const rd = n => JSON.parse(readFileSync(p(n), "utf8"));
const wr = (n, o) => writeFileSync(p(n), JSON.stringify(o, null, 2) + "\n", "utf8");

// --- clusters.json: note alanlarının kaynakları ---
const NOTE_SOURCES = {
  ai_data:       ["wef_foj_2025_skills", "linkedin_jotr_2026", "wef_transformation_2025_12"],
  software_cyber:["isc2_2025", "wef_foj_2025"],
  engineering:   ["wef_foj_2025"],
  green:         ["wef_foj_2025_skills", "bls_ooh_fastest"],
  medicine:      ["bls_ep_2025_35", "wef_transformation_2025_12"],
  biotech:       ["wef_foj_2025_skills", "oecd_ai_skills_2026"],
  finance:       ["wef_foj_2025"],
  design_tech:   ["wef_foj_2025", "wef_foj_2025_skills"],
  business:      ["wef_foj_2025_skills", "linkedin_jotr_2026"],
  frontier:      ["wef_mckinsey_space_2024", "mckinsey_quantum_2023"],
  care_edu:      ["wef_foj_2025", "bls_ep_2025_35", "stanford_canaries_2026"],
  trades_infra:  ["bls_ooh_fastest", "linkedin_jotr_2026"],
  law_gov:       ["oecd_ai_skills_2026", "wef_foj_2025"]
};

const cl = rd("clusters");
cl.clusters = cl.clusters.map(c => {
  const { noteSources, ...rest } = c;
  return { ...rest, noteSources: NOTE_SOURCES[c.id] };
});
cl._provenance = {
  _comment: "Hangi alan dış kaynağa dayanıyor, hangisi editoryal yargı. Arayüz yalnızca 'sourced' alanların yanında kaynak rozeti göstermeli; 'editorial' alanlar kaynaklı gibi sunulmamalı.",
  sourced: {
    "jobs[].badge": "jobs[].source → sources.json",
    "note": "noteSources[] → sources.json",
    "aiPosture.note": "aiPosture.source → sources.json"
  },
  editorial: {
    "riasec / conf / values / skills / tech / problems": "Kümenin profil eşleşme ağırlıkları. Holland ve O*NET çerçevelerinden türetilmiş editoryal eşlemedir; ölçülmüş katsayı değildir.",
    "tagline / caution": "Editoryal. caution alanı kaynak değil, dürüstlük notudur.",
    "studyPathsTR": "Editoryal. Türkiye'deki yaygın lisans/MYO program adlarından derlenmiştir; YÖK kontenjan veya yerleşme verisine dayanmaz."
  }
};
cl._attribution = {
  _comment: "DOSYA KÜNYESİ — bu dosyadaki iddiaların dayandığı kaynakların tam listesi. Arayüzdeki rapor sayfasının en altında bu künye açık biçimde gösterilmelidir.",
  usedSources: [...new Set(cl.clusters.flatMap(c => [...(c.jobs || []).map(j => j.source), c.aiPosture?.source, ...(c.noteSources || [])]).filter(Boolean))].sort(),
  registry: "data/sources.json",
  disclaimer: "Meslek verileri ağırlıklı olarak küresel ve ABD kaynaklıdır; Türkiye iş piyasası farklı seyredebilir. Projeksiyonlar tahmindir."
};
wr("clusters", cl);

// --- skills2030.json: her beceri maddesine kaynak ---
const sk = rd("skills2030");
sk.rising = sk.rising.map(s => ({ ...s, source: "wef_foj_2025_skills" }));
sk.core2025 = sk.core2025.map(s => ({ ...s, source: "wef_foj_2025_skills" }));
sk.extraCore = sk.extraCore.map(s => ({ ...s, source: "wef_foj_2025_skills" }));
sk.declining = sk.declining.map(s => ({ ...s, source: "wef_foj_2025_skills" }));
sk._provenance = {
  sourced: { "headline / rising / core2025 / extraCore / declining / fastestGrowingJobs / largestVolumeGrowth / fastestDecliningJobs": "WEF Future of Jobs 2025" },
  editorial: { "riasecAffinity": "Becerinin RIASEC tipleriyle eğilim eşlemesi — editoryaldir, WEF verisi değildir.", "howToBuild": "Editoryal öneri." }
};
sk._attribution = {
  _comment: "DOSYA KÜNYESİ — raporun altında gösterilecek kaynak.",
  usedSources: ["wef_foj_2025", "wef_foj_2025_skills"],
  registry: "data/sources.json"
};
wr("skills2030", sk);

// --- ölçüm araçları: akademik çerçeve künyesi ---
const FRAMEWORKS = {
  riasec: ["Holland, J. L. — RIASEC ilgi tipolojisi", "Maddeler v1 envanterinden (2026-07) türetilmiştir; normlanmamış, özgün madde havuzudur."],
  workstyle: ["Prediger, D. J. — insan↔nesne ve veri↔fikir çalışma tarzı eksenleri"],
  values: ["O*NET Work Values (ABD Çalışma Bakanlığı) çerçevesinden uyarlanmıştır"],
  confidence: ["Bandura'nın öz-yeterlik kavramından uyarlanmış özbildirim ölçeği — tanı aracı değildir"],
  interests: ["Editoryal madde havuzu; WEF 2025 teknoloji ve küresel sorun başlıklarıyla hizalanmıştır"],
  "open-questions": ["Editoryal; akış (flow) ve anlatı temelli kariyer danışmanlığı pratiğinden uyarlanmıştır"]
};
for (const [name, framework] of Object.entries(FRAMEWORKS)) {
  const o = rd(name);
  o._attribution = {
    _comment: "DOSYA KÜNYESİ — bu bölümün dayandığı çerçeve. Raporun altındaki metodoloji satırında belirtilmelidir.",
    framework,
    note: "Bu maddeler ölçülmüş bir psikometrik testin maddeleri DEĞİLDİR; çerçeveden uyarlanmış keşif sorularıdır.",
    registry: "data/sources.json"
  };
  wr(name, o);
}
console.log("Kaynak izi eklendi. clusters.json künyesindeki kaynak sayısı:", cl._attribution.usedSources.length);
