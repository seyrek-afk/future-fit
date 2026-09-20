# Future-Fit

Lise öğrencileri ve kariyer yönünü sorgulayan herkes için, tarayıcıda çalışan ücretsiz bir
**kariyer keşif envanteri**. İlgi profilini (Holland RIASEC), çalışma tarzını, değerlerini ve
kendine güven haritanı çıkarır; sonucu Dünya Ekonomik Forumu'nun 2030 beceri çerçevesi ve güncel
iş piyasası verileriyle eşleştirip 13 meslek kümesine göre sıralar.

**Sunucu yok. Kayıt yok. Veri toplama yok.** Tüm cevaplar yalnızca senin tarayıcında kalır.

## Ne veriyor

- **İlgi profili** — 6 RIASEC tipi ve üç harflik Holland kodun
- **Çalışma tarzı** — insan↔nesne ve veri↔fikir eksenlerinde nerede durduğun
- **Değerlerin** — bir işte seni gerçekten tatmin edecek şey
- **2030 beceri radarı** — WEF'in yükselen 10 becerisinden hangileri doğal güçlü yanın, hangileri
  bilinçli yatırım istiyor
- **13 meslek kümesi** — uyum sıralaması, her kümede 4 meslek, güncel veriye dayalı rozetler,
  Türkiye'deki ilgili bölümler ve her kümenin dürüst dezavantajı
- **YZ merceği** — hangi alanlar otomasyona dirençli, hangileri çatallanıyor

Çıktıyı PDF olarak indirebilir, bağlantıyla paylaşabilir ya da metin olarak kopyalayıp bir yapay
zekâya derin analiz için verebilirsin.

## Bu bir test değil, bir harita

Envanter normlanmamıştır, tanı koymaz ve yetenek ölçmez. İlgi ile yetenek farklı şeylerdir.
Sonuçları hüküm olarak değil, konuşma başlatıcı olarak oku — ve bir yıl sonra tekrar çöz.

## Veri kaynakları

WEF *Future of Jobs Report 2025* · ABD BLS *Employment Projections 2025-35* (Ağustos 2026) ·
LinkedIn *Jobs on the Rise 2026* · Stanford Digital Economy Lab (Ağustos 2026) · ISC2
*Cybersecurity Workforce Study 2025* · OECD *AI and Skills* (2026) · WEF/McKinsey uzay ve kuantum raporları.

Tam künyeler: [`data/sources.json`](data/sources.json). Verilerin ağırlıklı olarak küresel ve ABD
kaynaklı olduğunu, Türkiye iş piyasasının farklı seyredebileceğini unutma.

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:3002
npm run test
npm run build    # ./dist
```

## Depo düzeni

```
data/        soru bankası, meslek kümeleri, beceri çerçevesi, kaynak künyeleri (JSON)
docs/        PRD, metodoloji, araştırma notları, v1→v2 değişiklikleri
reference/   v1 HTML'i ve ondan JSON üreten göç araçları
src/         React uygulaması
render.yaml  Render Static Site blueprint'i
CLAUDE.md    Claude Code için çalışma kuralları
```

## Lisans

Kişisel ve eğitim amaçlı kullanıma açıktır. Meslek verileri kaynaklarına aittir; künyeleriyle
birlikte kullanılmalıdır.
