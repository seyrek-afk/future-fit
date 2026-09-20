# Future-Fit — Ürün Gereksinimleri

## 1. Ne bu?

Lise öğrencilerinin (ve kariyer yönünü sorgulayan herkesin) ilgi profilini çıkarıp, bunu WEF'in
2030 beceri çerçevesi ve güncel iş piyasası verileriyle eşleştiren, tarayıcıda çalışan ücretsiz bir
keşif aracı. Sunucu yok, kayıt yok, veri toplama yok.

Kökeni: tek kullanıcı için yazılmış `reference/v1-duru-kariyer-kesif-testi.html`. v2'nin işi onu
kişiye özel olmaktan çıkarıp paylaşılabilir bir ürüne dönüştürmek.

## 2. Kullanıcılar

| Kişi | İhtiyacı | Başarı ölçüsü |
|---|---|---|
| 11-12. sınıf öğrencisi | "Hangi bölümü yazacağım?" sorusuna tutamak | Testi bitirir, raporu kendi cümleleriyle anlatabilir |
| Veli | Çocuğuyla konuşacak ortak bir zemin | Raporu PDF olarak alıp okur |
| Rehber öğretmen | Sınıfta kullanılabilir, açıklanabilir bir araç | Metodolojiyi görür, sınıfa yönlendirir |
| Kariyer değiştirmeyi düşünen yetişkin | Mevcut becerilerinin nereye oturduğu | Beceri radarını ve YZ merceğini kullanır |

Dil: **Türkçe**. Metinler `src/i18n/tr.js` altında toplanır ki ileride İngilizce eklenebilsin —
ama v2 tek dil yayınlanır, çeviri altyapısı fazladan iş yaratmamalı.

## 3. Tasarım ilkeleri

1. **Dürüstlük.** Hiçbir skor kesinlik iddia etmez. "Uyum" kelimesi kullanılır, "doğru meslek" kullanılmaz.
2. **Kaynak görünür.** Her rozetin yanında kaynak kısaltması ve yılı vardır; tıklanınca künye açılır.
3. **Terk edilebilirlik.** 15 dakikalık bir test uzundur: ilerleme kaydedilir, kaldığı yerden devam eder.
4. **Telefon önce.** Kullanıcıların çoğu telefondan girecek; Likert ızgarası küçük ekranda çalışmalı.
5. **Sessiz tasarım.** Okunabilirlik ve karşıtlık öncelikli. *(v2'de sınırlı gevşetme:* hedef
   kitle 15-18 yaş olduğu için etkileşim anına bağlı kısa geçişler (120-200ms), CSS ile çizilmiş
   veri geometrisi (RIASEC altıgeni) ve RIASEC tip renklerinin cesur kullanımı serbesttir.
   Kendiliğinden oynayan, kayan ya da parlayan hiçbir şey yok; dekoratif stok görsel yok;
   `prefers-reduced-motion` mutlaktır.*)
6. **Az metin, çok sonuç.** Rapor sonuçla açılır; gerekçe ve uyarı metinleri silinmez, açılır
   bloklara ertelenir. Her dürüstlük cümlesinin kısa hâli her zaman görünür kalır.

## 4. Akış

```
Giriş → Bölüm 1 İlgi (Likert, 6 sayfa × 6 madde)
      → Bölüm 2 Senaryolar (5)
      → Bölüm 3 Akış soruları (3)
      → Bölüm 4 Çalışma tarzı (Prediger 6 + Ortam 6)
      → Bölüm 5 Değer sıralaması (6'lı sürükle-bırak)
      → Bölüm 6 Kendine güven (12 × 1-5)
      → Bölüm 7 Merak ettiklerin (sorunlar + teknolojiler)
      → Bölüm 8 Açık uçlu (4, hepsi atlanabilir)
      → Rapor
```

- Her bölümün başında tek cümlelik "bu bölüm neyi ölçüyor" açıklaması.
- Zorunlu alan yok; eksik cevaplar skorlamada maksimum tabanından düşülür (bkz. METHODOLOGY §3).
- Üst çubukta: ilerleme yüzdesi, "kaydedildi" göstergesi, sonuçları silme düğmesi.
- Yüzdenin altında **bölüm şeridi**: 8 bölümün her biri için cevaplanan/toplam oranı
  (`boş / yarım / tamam`); bir segmente dokunmak o bölüme atlar.

## 5. Rapor bölümleri

Hedef kitle lise çağında olduğu için rapor **sonuç önce** kurgulanır: en üstte tek ekrana
sığan bir **özet** (Holland kodu, RIASEC altıgeni, en çok örtüşen 3 alan, en güçlü 3 beceri),
ardından **içindekiler**, sonra aşağıdaki 11 bölüm **üç ana bölüm + "Ek bilgiler"** altında
gruplanır:

| Ana bölüm | İçerir |
|---|---|
| 1. Kişisel tanıtım | İlgi profili · Çalışma tarzı · Değerler · Kendine güven |
| 2. 2030 beceri radarı | Güçlü yanlar · Yatırım alanları · WEF yükselen 10 |
| 3. Meslek kümeleri | İlk 5 kümenin kartı |
| Ek bilgiler | Diğer kümeler · YZ merceği · Sonraki adımlar ve çıktılar · Kaynaklar ve künye |

Uzun gerekçe metinleri **silinmez, ertelenir**: açılır bloklara (`Explainer`) girer ve baskıda
zorla açılır. Her dürüstlük cümlesinin kısa hâli her zaman görünür kalır.


1. **Başlık** — isteğe bağlı isim, tarih, Holland kodu (3 harf) ve kodun tek cümlelik anlamı.
2. **İlgi profili** — 6 tipin yüzde çubukları; `explorationMode` bayrağı varsa uyarı kutusu.
3. **Çalışma tarzı** — iki eksen kaydırıcısı + seçilen ortam tercihleri çipleri.
4. **Değerlerin** — ilk 3 değer, açıklamalarıyla.
5. **Kendine güven haritası** — 12 maddelik mini çubuk listesi.
6. **2030 beceri radarı** *(yeni)* — "doğal güçlü yanların" 3 beceri + "bilinçli yatırım gerekenler"
   2 beceri, her birinde `howToBuild` önerisi. Altında WEF'in yükselen 10 beceri listesi, kullanıcının
   sıralamasıyla birlikte.
7. **Sana en uygun meslek kümeleri** — ilk 5 küme kart olarak: uyum yüzdesi, gerekçe notu,
   4 meslek (ad + İngilizce + rozet + kaynak), 2030 becerileri, `aiPosture` rozeti, `studyPathsTR`
   listesi, `caution` metni ve varsa `interestHighConfLow` / `valuesMismatch` bayrakları.
8. **Diğer kümeler** — kalan 8 küme mini çubuk listesi (tıklanınca açılır).
9. **YZ merceği** *(yeni)* — üç sütun: yüksek dirençli / orta / karışık kümeler, tek cümlelik gerekçelerle.
10. **Sonraki adımlar** — testin ne olmadığı, bir yıl sonra tekrar çözme önerisi, çıktı düğmeleri.

## 6. Çıktılar

| Çıktı | Davranış |
|---|---|
| **PDF indir** | `window.print()` + baskıya özel CSS. Ayrı PDF kütüphanesi ekleme; sayfa sonları `break-inside: avoid` ile yönetilir. |
| **Panoya kopyala** | v1'deki metin dökümünün aynısı, genelleştirilmiş: tüm cevaplar + skorlar + bayraklar. Bir YZ'ye yapıştırıp derin analiz istemek için. Üstüne kısa bir yönerge satırı ekle. |
| **Bağlantıyla paylaş** | Cevaplar LZ-benzeri sıkıştırma + base64url ile URL hash'ine kodlanır (`#r=...`). Sunucu yok. Uyarı metni: "bu bağlantı cevaplarını içerir". URL 2000 karakteri aşarsa düğme devre dışı kalır ve PDF önerilir. |
| **Sonuçları sil** | localStorage temizlenir, onay sorulur. |

## 7. Teknik

StreamTr ile aynı düzen — tanıdık olsun:

- React 18 + Vite 5, JavaScript (TypeScript yok).
- Durum yönetimi: tek `useReducer` + Context. Harici state kütüphanesi yok.
- Stil: CSS değişkenleriyle düz CSS (`src/index.css`), v1'deki token adları korunur
  (`--surface-1`, `--text-primary`, `--accent`, `--good/--warn/--bad`). **Tek tema: koyu.**
  Açık tema v2'de kaldırıldı (`prefers-color-scheme` dalı ve `[data-theme]` anahtarı yok);
  yalnızca baskı çıktısı açık palete geçer (`src/styles/print.css`). Tasarım dili: `docs/DESIGN.md`.
  Üzerinde metin taşıyan vurgu yüzeyleri `--accent-fill` + `--accent-ink` çiftini, bağlantılar
  `--accent-link` kullanır — AA karşıtlığı bu ayrımla garanti edilir.
- İkonlar: `lucide-react`.
- Test: `vitest` + `@testing-library/react`.
- Veri: `data/*.json` build sırasında import edilir; çalışma zamanında ağ isteği yok.
- Erişilebilirlik: klavyeyle tam gezinme, Likert satırları `radiogroup`, sürükle-bırak sıralamaya
  klavye alternatifi (yukarı/aşağı düğmeleri), karşıtlık AA.

### Önerilen dosya düzeni

```
src/
  main.jsx
  App.jsx
  state/            surveyReducer.js, storage.js, shareLink.js
  scoring/          riasec.js, axes.js, clusters.js, skills.js, flags.js, index.js
  components/       survey/…  report/…  ui/…
  i18n/tr.js
  test/
data/               (bu repodaki JSON'lar — src'den import edilir)
```

## 8. Testler (asgari)

`scoring/` katmanı saf fonksiyonlardan oluşmalı ve şunlar test edilmeli:

1. Tüm maddelere aynı cevap verilen profil → tüm RIASEC yüzdeleri eşit, `explorationMode: true`.
2. Yalnızca I maddelerine yüksek cevap → kod `I` ile başlar, `ai_data`/`biotech` ilk 3'te.
3. Yalnızca S maddelerine yüksek cevap → `care_edu` ilk 2'de *(v1'in düzeltilen kusuru — bu test regresyon bekçisidir)*.
4. Yalnızca R maddelerine yüksek cevap → `engineering` veya `trades_infra` ilk 2'de.
5. Boş/eksik cevaplar → çökme yok, skorlar 0-100 aralığında.
6. `interestHighConfLow` ve `valuesMismatch` bayrakları sınır değerlerde doğru tetikleniyor.
7. Paylaşım bağlantısı: kodla → çöz → aynı cevap nesnesi (round-trip).
8. `data/*.json` bütünlüğü: her kümenin `conf`, `tech`, `problems`, `values`, `skills` id'leri ilgili
   dosyalarda gerçekten var mı; her `source` id'si `sources.json`'da var mı. *(Bu testi mutlaka yaz —
   veri dosyaları elle güncellenecek.)*

## 9. Yayın

- Render **Static Site**, `render.yaml` blueprint'i repoda hazır (StreamTr'deki düzenin aynısı).
- `npm install && npm run build` → `./dist`.
- SPA fallback rewrite `/* → /index.html`.
- Güvenlik başlıkları StreamTr'deki setle aynı.
- Env değişkeni yok (kasıtlı: dışarıya hiçbir servise bağlanmıyoruz).

## 10. Bitti sayılma ölçütü

- [ ] Test baştan sona telefonda tek elle bitirilebiliyor.
- [ ] Sayfa yenilendiğinde cevaplar kayboluyor mu — hayır, kaldığı yerden devam ediyor.
- [ ] Rapor PDF'e basıldığında kartlar bölünmüyor, renkler baskıda okunuyor.
- [ ] `npm run test` yeşil, §8'deki 8 test mevcut.
- [ ] Lighthouse erişilebilirlik ≥ 95.
- [ ] Hiçbir metin "Duru" veya tek kullanıcıya ait bir bağlam içermiyor.
- [ ] Her rozetin görünür bir kaynağı var.
