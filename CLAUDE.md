# Future-Fit — Claude Code çalışma notları

## Proje özeti

Tarayıcıda çalışan, sunucusuz bir kariyer keşif envanteri. Kullanıcının ilgi profilini (RIASEC),
çalışma tarzını, değerlerini ve öz-yeterliğini ölçer; sonucu WEF 2030 beceri çerçevesi ve güncel
iş piyasası verileriyle eşleştirip 13 meslek kümesine göre sıralar.

**Önce oku:** `docs/PRD.md` (ne inşa edilecek) ve `docs/METHODOLOGY.md` (skorlar nasıl hesaplanır).
Araştırma gerekçeleri `docs/RESEARCH-2026.md`, v1'den farklar `docs/CHANGELOG-INVENTORY.md`.

## Yığın

React 18 + Vite 5 + JavaScript (TypeScript yok) · vitest + @testing-library/react · lucide-react ·
CSS değişkenleriyle düz CSS · Render Static Site. Harici servis, API anahtarı ve backend **yok**.

## Değişmez kurallar

1. **Ağ isteği yok.** Uygulama çalışma zamanında hiçbir yere bağlanmaz. Analitik, font CDN'i,
   hata izleme — hiçbiri eklenmez. Veri `data/*.json`'dan build'e gömülür.
2. **Kişisel veri toplanmaz.** Yaş, doğum tarihi, okul, e-posta sorulmaz. Tek istisna: rapor
   başlığındaki isteğe bağlı isim, yalnızca `localStorage`'da.
3. **Skor mantığı `src/scoring/` içinde, saf fonksiyonlarda kalır.** Bileşenler skor hesaplamaz.
   Formül değişirse `docs/METHODOLOGY.md` aynı commit'te güncellenir.
4. **Veri dosyaları elle düzenlenir, koda gömülmez.** Yeni meslek/rozet eklerken `data/clusters.json`
   ve `data/sources.json` birlikte güncellenir; kaynaksız rozet eklenmez.
5. **Her rozetin görünür kaynağı olur.** Arayüzde kaynak kısaltması + yıl gösterilir.
6. **Kesinlik dili yasak.** "Senin mesleğin şu" değil, "profilinle örtüşme derecesi". Rapor
   metinlerinde tanı, garanti veya başarı olasılığı iması olmaz.

## Sık yapılan işler

| İş | Nereye dokunulur |
|---|---|
| Yeni meslek kümesi | `data/clusters.json` + `data/sources.json` + bütünlük testi |
| Rozet/istatistik güncelleme | `data/clusters.json` (+ künye `sources.json`, tarih `_updated`) |
| Yeni soru maddesi | ilgili `data/*.json` + `src/scoring/` içindeki max hesabı + test |
| Skor ağırlığı değişimi | `src/scoring/clusters.js` + `docs/METHODOLOGY.md` §5 + testler |
| Yıllık veri tazeleme | `docs/RESEARCH-2026.md` §6'daki kontrol listesi |

## Test beklentisi

`npm run test` yeşil olmadan commit yok. `docs/PRD.md` §8'deki 8 testin hepsi bulunmalı;
özellikle **veri bütünlüğü testi** (id'lerin dosyalar arası tutarlılığı) ve **S-profili regresyon
testi** (sosyal profil `care_edu` kümesini ilk 2'de görmeli) silinmemeli.

## Yayın

`render.yaml` repoda hazır. İlk kurulum Render panosundan bir kereliğine yapılır
(New → Blueprint → repoyu seç → Apply); sonrasında `main`'e her push otomatik deploy eder.
Env değişkeni yok.

## Dil

Arayüz ve dokümantasyon Türkçe. Kullanıcıya görünen tüm metinler `src/i18n/tr.js` içinde toplanır
(ileride İngilizce eklenebilsin diye), ama v2 tek dil yayınlanır.
