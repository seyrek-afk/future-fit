# Araştırma Notları — Eylül 2026

Bu belge, v1 envanterindeki meslek verilerinin neden ve nasıl güncellendiğini kaydeder.
Her iddianın künyesi `data/sources.json` içindedir; buradaki başlıklar o id'lere atıfta bulunur.

## 1. Çerçeve hâlâ WEF 2025 — ama tek başına yetmiyor

WEF *Future of Jobs* raporu iki yılda bir yayımlanıyor; **Ocak 2025 baskısı hâlâ en güncel olanı**
(bir sonrakinin 2027'de gelmesi bekleniyor). Dolayısıyla beceri çerçevesini değiştirmeye gerek yok:

- **2030'un yükselen 10 becerisi** (sırayla): yapay zekâ ve büyük veri · ağlar ve siber güvenlik ·
  teknoloji okuryazarlığı · yaratıcı düşünme · dayanıklılık ve çeviklik · merak ve yaşam boyu öğrenme ·
  liderlik ve sosyal etki · yetenek yönetimi · analitik düşünme · çevresel yönetişim.
- **Bugünün çekirdek becerisi** hâlâ analitik düşünme; onu dayanıklılık ve liderlik izliyor.
- Çalışanların **çekirdek becerilerinin %39'u** 2030'a kadar değişiyor; her 100 kişiden 59'u yeniden eğitim istiyor.
- 2030'a kadar 170M yeni rol, 92M yer değiştiren rol, **net +78M**; işlerin %22'si dönüşüyor.

Ama WEF 2025'ten bu yana geçen 20 ayda üç şey oldu ve envanterin bunları yansıtması gerekiyordu.

## 2. Değişen üç şey (v2'nin asıl gerekçesi)

### (a) ABD projeksiyonları çok daha durgun bir tablo çiziyor — ve sağlığa kayıyor

BLS'in **27 Ağustos 2026'da yayımlanan 2025-2035 projeksiyonları**, v1'de kullanılan 2024-34
serisinin yerini aldı ve tonu değiştirdi:

- ABD on yılda yalnızca **5,9 milyon iş** ekliyor — %3,5 büyüme; önceki on yılda bu oran %10,9'du.
- **Yeni işlerin %37'si sağlık ve sosyal hizmette.** İkinci sırada 926.700 işle profesyonel/bilimsel/teknik hizmetler var.
- **Büro ve idari destek %4,0 daralıyor (-752.100 kişi)** ve BLS bunun gerekçesi olarak doğrudan YZ otomasyonunu gösteriyor.
- En hızlı büyüyenler: hemşire pratisyen %41, güneş PV kurulumcusu %36,5, veri bilimci %34,6,
  rüzgâr türbini teknisyeni %30, bilgi güvenliği analisti %21, epidemiyolog %19.

**Envantere etkisi:** v1'in "veri bilimci +%33 (2024-34)" rozeti %34,6'ya güncellendi; sağlık kümesinin
gerekçesi güçlendirildi; *Bakım Ekonomisi & Eğitim* ve *Uygulamalı Teknik Meslekler* kümeleri eklendi.

### (b) YZ'nin ilk kurbanı sektör değil, giriş seviyesi

Stanford Digital Economy Lab'in **Ağustos 2026 güncellemesi** (Kasım 2022 – Haziran 2026 verisi):

- 22-25 yaş çalışanların YZ'ye yüksek maruz mesleklerdeki istihdamı, düşük maruz akranlarına göre
  **%19 geride** — Temmuz 2025'te bu fark %15'ti, yani açılıyor.
- Ayrım sektörel değil **bilgi türüne göre**: ders kitabından öğrenilebilen *kodlanmış* bilgiye
  dayalı işler daralıyor; deneyimle kazanılan *örtük* bilgiye dayalı işler daralmıyor.
- Yazarlar nedenselliğin kanıtlanmadığını özellikle vurguluyor.

**Envantere etkisi:** Her kümeye `aiPosture` alanı eklendi (yüksek direnç / orta / karışık) ve bu
bilinçli olarak uyum skorunun dışında tutuldu. Yazılım kümesinin notu "rutin giriş-seviye kodlama
riskli, mimari ve güvenlik güçlü" biçiminde netleştirildi.

### (c) Siber güvenlikte sorun artık kişi sayısı değil, beceri

ISC2'nin **Aralık 2025** araştırması (16.029 profesyonel) v1'deki "4,8 milyon açık pozisyon"
çerçevesini geçersiz kılıyor:

- Kurumların **%59'u kritik/ciddi beceri açığı** bildiriyor (2024'te %44); %95'i en az bir açık yaşıyor.
- En büyük açık **YZ becerilerinde (%41)**, ardından bulut güvenliği (%36).
- %34'ü kadrosunun yeterli olduğunu ama ekibin gereken yetkinliği bulamadığını söylüyor.

**Envantere etkisi:** Siber güvenlik rozetleri "açık pozisyon sayısı"ndan "beceri açığı"na çevrildi.

## 3. Doğrulanan ve düzeltilen v1 iddiaları

| v1 iddiası | Durum | v2'de ne yapıldı |
|---|---|---|
| "YZ/ML Mühendisi — LinkedIn #1 iş" | ✅ Doğru | LinkedIn 2026 listesinde YZ Mühendisi hâlâ #1; ilk beşin dördü YZ rolü |
| "YZ Danışmanı — LinkedIn 2026 #2" | ✅ Doğru | Korundu |
| "FinTech Mühendisi — WEF en hızlı büyüyen #2" | ✅ Doğru | Korundu |
| "UX/UI — WEF hızlı büyüyen" | ✅ Doğru (#8) | Sıra numarası eklendi |
| "Veri bilimci +%33 (2024-34)" | ⚠️ Eskimiş | %34,6 (2025-35) olarak güncellendi |
| "Siber güvenlikte ~4,8M açık pozisyon" | ⚠️ Çerçeve değişti | ISC2 2025 beceri-açığı verisiyle değiştirildi |
| "Kuantumda her 2-3 açığa 1 nitelikli aday" | ❌ Eskimiş/yanlış aktarım | Kaldırıldı; yerine McKinsey'in 2035'e dek 1,3T$ değer öngörüsü kondu |
| "Çip tasarımında 2030'a ~1M ek uzman" | ⚠️ Doğrulanamadı | Sayı kaldırıldı, nitel ifadeye çevrildi |
| "Uzay ekonomisi 2035'te 1,8T$" | ✅ Doğru | WEF/McKinsey Nisan 2024 künyesiyle korundu |
| "Aktüer +%22" | ⚠️ Yeni seriyle doğrulanamadı | Yüzde kaldırıldı, nitel ifadeye çevrildi |

## 4. v1'in yapısal boşluğu: RIASEC kapsaması

v1'deki 10 kümenin ağırlık merkezi **I (Araştırmacı)** ve **R (Yapıcı)** idi. Sonuç: baskın tipi
**S (Sosyal)** olan bir kullanıcıya yalnızca "Tıp" kümesi çıkıyordu; **C (Düzenleyici)** baskın bir
kullanıcıya ise doğru dürüst hiçbir şey. Bu, testin en büyük kusuruydu — çünkü başka kişiler
kullanacaksa profil çeşitliliği artacak.

v2'de eklenen üç küme:

1. **Bakım Ekonomisi, Eğitim & Psikoloji** (S ağırlıklı) — WEF'in mutlak sayıda en çok iş ekleyen
   rolleri (hemşirelik, sosyal hizmet, öğretmenlik) ve BLS'in %37'lik sağlık payı burada karşılık buluyor.
   Ayrıca Stanford'un "örtük bilgi" bulgusuyla en korunaklı küme.
2. **Uygulamalı Teknik Meslekler & Altyapı** (R + C) — dört yıllık üniversite şartı olmayan, iyi kazanan,
   otomasyona dirençli rota. Veri merkezi teknisyenliği (LinkedIn 2026), güneş/rüzgâr teknisyenliği
   (%30-36 büyüme), endüstriyel bakım (%18).
3. **Hukuk, Politika & YZ Yönetişimi** (E + C + I) — regülasyon dalgasıyla açılan, teknik okuryazarlığı
   olan hukukçu/politika uzmanı kıtlığı.

## 5. Bilinçli olarak yapılmayanlar

- **Türkiye'ye özel istihdam projeksiyonu eklenmedi.** İŞKUR/TÜİK'te WEF veya BLS ile karşılaştırılabilir,
  meslek kırılımlı 10 yıllık bir projeksiyon serisi bulunamadı; arama sonuçlarının çoğu ikincil blog
  içeriğiydi. Bunun yerine her kümeye **Türkiye'deki ilgili lisans/MYO programları** (`studyPathsTR`)
  eklendi ve rapora "veriler ağırlıklı olarak küresel/ABD kaynaklıdır" uyarısı kondu. Doğrulanabilir bir
  yerel seri bulunursa `sources.json`'a eklenmeli.
- **Maaş rakamı gösterilmiyor.** ABD medyan ücretleri Türkiye'deki bir öğrenciyi yanıltır; TL karşılıkları
  ise enflasyon nedeniyle birkaç ayda eskir.
- **YZ direnci skora katılmadı** — gerekçesi `METHODOLOGY.md` §7'de.

## 6. Bir sonraki güncelleme için kontrol listesi

- [ ] WEF *Future of Jobs* 2027 baskısı (Ocak 2027 beklentisi) → beceri listeleri ve meslek sıralamaları
- [ ] BLS 2026-36 projeksiyonları (Ağustos 2027 beklentisi) → tüm yüzdeler
- [ ] LinkedIn *Jobs on the Rise* 2027 (Ocak 2027) → rozetler
- [ ] Stanford Canaries panosu → giriş seviyesi açığı %19'dan nereye gitti
- [ ] ISC2 2026 araştırması (Aralık 2026) → siber beceri açığı
- [ ] Türkiye için doğrulanabilir bir meslek projeksiyonu serisi çıktı mı
