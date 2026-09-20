# Future-Fit — tasarım künyesi

Tek tema: **koyu**. Açık tema kaldırıldı (`prefers-color-scheme` dalı ve `[data-theme]` yok).
Baskı paleti ayrı: `src/styles/print.css`. Hedef okur: **15-18 yaş lise öğrencisi** —
çocuklaştırma yok, ölçülebilir bilgi var. Token adları `docs/PRD.md` §7'den korunmuştur.

## Palet ve gerekçe

| Token | Değer | Neden |
|---|---|---|
| `--page` | `#0a0c0f` | Mavi-nötr mürekkep. Saf siyah değil: OLED'de kontrast sıçraması ve gölgelerin kaybolması. |
| `--surface-1/2/3` | `#14181e` `#1c2128` `#242a33` | Dört basamaklı merdiven, araları dar (1.10 / 1.21 / 1.36). Yükseklik yüzey açarak değil, saç teli kenar + gölge ile kurulur. |
| `--text-primary` | `#f4f6f9` | Saf beyaz **değil**: koyu zeminde halation yapar, uzun metinde okuma hızını düşürür. 18.09:1. |
| `--text-secondary` | `#c3cad5` | En açık yüzeye karşı 8.75:1. |
| `--muted` | `#949daa` | 0.7rem rozetlerde de geçtiği için eşik büyük metne göre gevşetilmedi. En açık yüzeye 5.27:1. |
| `--grid` / `--baseline` | `#2e343d` / `#626d7b` | `grid` saç teli (kart kenarı, ayraç, çubuk izi). `baseline` taşıyıcı kenar — surface-1/2'ye ≥3:1, WCAG 1.4.11 metin-dışı eşiği. |
| `--accent` ailesi | `#5296ec` · ink `#061120` · link `#8db9f4` | Dekoratif vurgu ile metin taşıyan vurgu ayrıldı: `--accent-fill` + `--accent-ink` = 6.25:1, `--accent-link` = 9.68:1. |
| `--seq-250…650` | `#4e82be → #9cc4f8` | Koyu temada yön tersine döner: düşük değer sönük, yüksek parlak. Dördü de çubuk izine (`--grid`) ≥3:1, aydınlıkları monoton. |
| `--good/warn/bad` | `#5cc98a` `#e2ab45` `#f5877e` | Hem yüzeylere hem kendi `-soft` zeminine ≥4.5:1 (rapor `color: --warn; background: --warn-soft` kullanıyor). |
| `--s1…--s6` | `#5296ec` `#46b862` `#ee93b4` `#e2ab45` `#35cb99` `#f5854f` | RIASEC ton sırası v1 ile aynı (okurun renk hafızası bozulmasın). Hepsi `--grid` izine ≥3:1; `--page` mürekkebi hepsine ≥6.4:1. |

**Ölçüm:** tüm çiftler WCAG göreli aydınlık formülüyle hesaplandı, göz kararı yok.
Landing'deki 38 çiftin hepsi geçer; en dar marjlar: `--muted`/`--surface-3` **5.27:1**,
`--accent-ink`/`--accent-fill` **6.25:1**, `--seq-250`/`--grid` **3.14:1**, `--baseline`/`--surface-2` **3.08:1**.

## Tipografi

Yalnızca sistem yazı tipleri (`--font-sans`, `--font-mono`) — ağ isteği yok kuralı.
Ölçek kontrastı bilerek cesur: başlık gövdenin ~2.5 katı.

| Rol | Boyut | Not |
|---|---|---|
| `.landing-title` (h1) | `clamp(1.85rem, 1.35rem + 2.2vw, 2.6rem)` / 700 / `-0.028em` / lh 1.08 | Sayfadaki tek büyük tipografik olay. |
| `.landing-lead` | `clamp(1.05rem, 1rem + .3vw, 1.175rem)` / lh 1.6 / max 56ch | `--text-secondary`. |
| `.landing-h2` | `clamp(1.15rem, 1.05rem + .45vw, 1.375rem)` / 650 | |
| Gövde / adım | `1rem` lh 1.55 · panel `0.95rem` · künye & ince yazı `0.8125rem` | |
| Sayılar | `--font-mono` + `tabular-nums` | Ölçüm aracı kaydı. |

Gövdede `letter-spacing: .0015em`: koyu zeminde açık metin optik olarak şişer, bu onu geri alır.

## Boşluk ve yüzey

- Ritim 4/8/12/16/24/32/48 + yeni `--space-8: 72px` (yalnız geniş ekran bölüm arası).
- Bölüm arası: 32px (çizgisiz) → 48px → ≥720px'te 72px. Çizgili bölümlerde **çizginin üstü ve altı eşit**.
- Landing kartsızdır; uygulamanın geri kalanı kartlıdır. Sayfadaki **tek yüzeyli panel "Ne yapmaz"**tır —
  bu asimetri kasıtlı: göz doğrudan dürüstlük sözleşmesine gider.
- Kenar hiyerarşisi: `--grid` = saç teli/ayraç · `--baseline` = kontrol sınırı ve tik · `--accent` = odak halkası (3px, offset 2px; h1'de 6px).

## Bileşen desenleri

- **Künye şeridi** — `tr.intro.duration` dizesi `·` üzerinden bölünüp taranabilir bir listeye açılır.
  Ayraç parçaların *önünde* durur, böylece sarma sırasında satır başında öksüz ayraç kalmaz.
- **Süreç rayı** — "Ne yapar" 4 maddesi `<ol>` + CSS sayaç + bağlayıcı 1px ray. Gerçek bir sıra;
  dekoratif bölüm numarası değil.
- **Sınır listesi** — "Ne yapmaz" maddeleri yatay saç tellerle ayrılır, işaret `--muted` (kırmızı değil:
  bunlar hata değil kapsam sınırı) ve renk tek başına hiçbir anlam taşımaz.
- **Holland altıgeni** — saf SVG, dosya/ağ yok. R-I-A-S-E-C çevre sırası gerçektir. Diyagram
  `aria-hidden`; aynı bilgi altındaki metin listesinde var, ekran okuyucu iki kez okumaz.
- **Ölçüm cetveli** — hero'yu gövdeden ayıran tek soyut doku: `repeating-linear-gradient` tik dizisi,
  sağa doğru maskeyle söner. Statik, metnin arkasına girmez.

## Hareket

Yalnızca **etkileşim anı**: basma `scale(.975)` 140ms, CTA oku hover'da 3px 180ms
(`@media (hover:hover)`, düzen kaymaz), renk geçişleri 140ms. Kendiliğinden oynayan, kayan,
parlayan hiçbir şey yok. `prefers-reduced-motion` `src/index.css` sonunda mutlak.
Token'lar: `--dur-1/2/3` (120/140/180ms), `--ease-1`.

## Doğrulama

`npm run build` temiz · `npx vitest run` **121/121** · bundle'da `@import` ve dış `url()` **yok** ·
360 / 640 / 720 px'te `scrollWidth == clientWidth` (yatay kaydırma yok, tarayıcıda ölçüldü) ·
dokunma hedefleri 44px (`.btn`) ve 52px (`.btn-lg`).

---

## tr.js'ye eklenmesi gereken anahtarlar (öneri — ben eklemedim)

Landing bugün **yalnızca mevcut anahtarlarla** çalışıyor; aşağıdakiler 15-18 yaş için iyileştirme.

1. **`intro.duration` — yeni anahtar gerekmez, sadece 4. parçayı ekle.** Şerit `·` üzerinden
   bölündüğü için kaç parça gelirse gelsin düzen bozulmaz:
   `'Yaklaşık 12-18 dakika · 8 bölüm · zorunlu soru yok · kaydın tutulur, yarıda bırakabilirsin'`
2. **`intro.lead` kısaltma.** Şu an 44 kelime; hero'da ≤25 kelime hedefle. Örn:
   `'Neyi yapmaktan hoşlandığını çıkarır, 2030'un iş dünyasıyla yan yana koyar. Meslek atamaz — nereye bakmaya değer olduğunu gösterir.'`
3. **`intro.heading` alternatifi** (öğrencinin kendi sorusu merkezde):
   `'Hangi işler sana benziyor?'` kalabilir; daha doğrudan bir varyant: `'Bölüm seçmeden önce: hangi işler sana benziyor?'`
4. **`intro.privacyShort` + `intro.privacyDetail`.** Kısa hâl her zaman görünür, uzun hâl
   yeni `Explainer` bileşenine girer. Örn kısa: `'Hiçbir yere. Bu sayfa internete hiç bağlanmaz; cevapların yalnızca bu cihazda kalır.'`
5. **`intro.startNote`** — hero CTA'sının altına, `nav.optional`den kısa bir sürüm:
   `'Zorunlu soru yok. Boş bıraktıkların hesaba katılmaz.'`
6. *(isteğe bağlı, yeni bölüm açmak isterseniz)* `landing.sectionsTitle` — altına
   `tr.sections.*.title` + `.about` dizilebilir; testte ne olduğunu göstermek bu yaşta terk oranını düşürür.

Anahtarlar eklendiğinde `Landing.jsx` içinde `tr.intro.lead` / `tr.nav.optional` yerine
yenilerini kullanmak yeterli; düzen değişikliği gerekmez.

## index.html'de değişmesi gereken

- `<meta name="color-scheme" content="dark">` — **yapıldı** (önceden `light dark` idi).
- *(öneri)* `<meta name="theme-color" content="#0a0c0f">` — mobil tarayıcı çubuğu sayfayla aynı
  mürekkebe gelsin. Ağ isteği doğurmaz.

## Bağlama notu

`Landing.jsx` kendi CSS'ini içeri alır (`import '../../styles/landing.css'`), bu yüzden
`main.jsx`'e dokunmaya gerek yok — bileşen App'e bağlandığı anda stil bundle'a girer.
Dilerseniz diğerleriyle tutarlılık için `main.jsx`'e taşıyabilirsiniz.
