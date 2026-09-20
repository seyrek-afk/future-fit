// v1 JSON'larından v2 soru bankasını üretir; v2'de eklenen maddeler burada tanımlıdır.
import { readFileSync, writeFileSync } from "node:fs";
const rd = n => JSON.parse(readFileSync(new URL(`../data/_v1/${n}.json`, import.meta.url), "utf8"));
const wr = (n, o) => writeFileSync(new URL(`../data/${n}.json`, import.meta.url), JSON.stringify(o, null, 2) + "\n", "utf8");
const UPD = "2026-09-20";

wr("riasec", {
  _comment: "RIASEC ilgi envanteri. likert: 5'li Likert (0-4). scenarios: tek seçim. flow: çoklu seçim (max alanına bakın). Puanlama için docs/METHODOLOGY.md.",
  _updated: UPD,
  meta: rd("RIASEC_META"),
  likertLabels: rd("LIKERT_LABELS"),
  likert: rd("LIKERT_ITEMS"),
  scenarios: rd("SCENARIOS"),
  flow: rd("FLOW_QS")
});

wr("workstyle", {
  _comment: "Prediger eksenleri (insan↔nesne, veri↔fikir) ve çalışma ortamı tercihleri. Ortam tercihleri skora girmez, rapora girer.",
  _updated: UPD,
  prediger: rd("PREDIGER"),
  environment: rd("ENV_PREFS")
});

wr("values", {
  _comment: "O*NET iş değerleri. Kullanıcı 6 değeri sürükleyerek sıralar; ilk 3'ü rapora ve (v2'de) skora girer.",
  _updated: UPD,
  values: rd("VALUES")
});

const conf = rd("CONF_ITEMS").concat([
  { id: "c_care",   text: "Birine sabırla, birebir ilgilenmek ve destek olmak" },
  { id: "c_detail", text: "Ayrıntıya dikkat ve titizlik gerektiren işler" }
]);
wr("confidence", {
  _comment: "Öz-yeterlik (1-5). v2'de c_care ve c_detail eklendi: bakım/eğitim ve teknik-altyapı kümelerinin eşleşmesi için gerekli.",
  _updated: UPD,
  labels: rd("CONF_LABELS"),
  items: conf
});

const problems = rd("PROBLEMS").concat([
  { id: "care", text: "Yaşlanan nüfus, bakım ve ruh sağlığı" }
]);
const techs = rd("TECHS").concat([
  { id: "agritech", text: "Tarım ve gıda teknolojileri" }
]);
wr("interests", {
  _comment: "Önemsenen dünya sorunları ve heyecan veren teknolojiler (çoklu seçim). v2'de 'care' ve 'agritech' eklendi.",
  _updated: UPD,
  problems, techs
});

const open = rd("OPEN_QS").concat([
  { id: "O4", q: "Hiç denemediğin ama içten içe merak ettiğin bir iş ya da alan var mı? Neden denemedin?" }
]);
wr("open-questions", {
  _comment: "Açık uçlu sorular. Skora girmez; rapora ve YZ'ye devredilen derin analiz çıktısına girer.",
  _updated: UPD,
  questions: open
});

console.log("v2 soru bankası yazıldı:",
  ["riasec","workstyle","values","confidence","interests","open-questions"].join(", "));
