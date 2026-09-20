# Metodoloji

Bu belge testin neyi ölçtüğünü, neyi ölçmediğini ve skorların nasıl hesaplandığını tanımlar.
Arayüzdeki her sayı bu belgedeki bir formüle karşılık gelmelidir; formülü değiştirirsen bu belgeyi de değiştir.

## 1. Testin dayandığı çerçeveler

| Katman | Kaynak çerçeve | Ne ölçer |
|---|---|---|
| İlgi profili | Holland RIASEC | Neyi yapmaktan hoşlandığın (6 tip) |
| Çalışma tarzı | Prediger'in iki ekseni | İnsan↔Nesne, Veri↔Fikir yönelimin |
| Değerler | O*NET Work Values | Bir işte seni tatmin edecek şey |
| Öz-yeterlik | Bandura'dan uyarlama | Kendine güvendiğin alanlar |
| Akış göstergeleri | Csikszentmihalyi'den uyarlama | Zamanı unuttuğun aktiviteler |
| Gelecek yönelimi | WEF Future of Jobs 2025 beceri çerçevesi | Profilinin 2030 becerileriyle örtüşmesi |

Bu bir **psikometrik test değildir**: normlanmamıştır, güvenirlik/geçerlik katsayısı hesaplanmamıştır ve
tanı koymaz. Amacı karar vermek değil, konuşmayı başlatmaktır. Arayüz bunu gizlemeden söylemelidir.

## 2. Soru bankası

| Bölüm | Dosya | Madde | Biçim |
|---|---|---|---|
| Likert ilgi maddeleri | `data/riasec.json` → `likert` | 36 (her tipten 6) | 0-4 |
| Senaryolar | `data/riasec.json` → `scenarios` | 5 | tek seçim, 6 seçenek |
| Akış soruları | `data/riasec.json` → `flow` | 3 | çoklu seçim (max 3/3/2) |
| Prediger | `data/workstyle.json` → `prediger` | 6 | zorunlu ikili seçim |
| Ortam tercihi | `data/workstyle.json` → `environment` | 6 | ikili seçim (rapora girer, skora girmez) |
| Değerler | `data/values.json` | 6 | sıralama |
| Öz-yeterlik | `data/confidence.json` | 12 | 1-5 |
| Dünya sorunları | `data/interests.json` → `problems` | 9 | çoklu seçim |
| Teknolojiler | `data/interests.json` → `techs` | 12 | çoklu seçim |
| Açık uçlu | `data/open-questions.json` | 4 | serbest metin |

Tahmini süre: 12-18 dakika. Arayüz ilerleme çubuğu ve "kaldığın yerden devam" göstermelidir.

## 3. RIASEC puanlaması

Her tip için ham puan ve o tipten alınabilecek maksimum puan ayrı toplanır, sonra yüzdeye çevrilir:

```
likert:    ham += cevap (0-4),        max += 4          // maddenin tipine
senaryo:   ham += 3,                  max += 3          // seçilen seçeneğin tipine; max her tipe eklenir
akış:      ham += 2 × seçim sayısı,   max += 2 × o tipteki seçenek sayısı (üst sınır: soru max'ı)
pct[t] = round(100 × ham[t] / max[t])
```

- **Holland kodu**: en yüksek 3 tip, sırayla (örn. `IEA`).
- **Farklılaşma (spread)**: `max(pct) − min(pct)`. `spread < 15` ise profil "düz" sayılır ve rapora
  *keşif modu* uyarısı düşer: sonuçlar hüküm değil, keşfe devam işareti olarak okunmalıdır.

## 4. Prediger eksenleri

Her eksende 3 zorunlu ikili seçim. `insan = +1`, `nesne = −1` (aynı şekilde `fikir = +1`, `veri = −1`),
ortalama alınır → `[−1, +1]`. Rapor bunu iki kaydırıcı olarak gösterir; skora girmez.

## 5. Küme uyum skoru (v2)

```
total = 0.45 × ilgi  +  0.20 × özyeterlik  +  0.20 × merak  +  0.15 × değer
```

| Bileşen | Hesap |
|---|---|
| **ilgi** | Kümenin `riasec` ağırlıklarıyla kullanıcının `pct` değerlerinin ağırlıklı ortalaması: `Σ(wₖ × pctₖ/100) / Σwₖ` |
| **özyeterlik** | Kümenin `conf` maddelerinin ortalaması, `(ort − 1) / 4` ile 0-1'e ölçeklenir |
| **merak** | `0.6 × teknoloji örtüşmesi + 0.4 × sorun örtüşmesi`; her biri `eşleşen / kümedeki toplam` (küme listesi boşsa 0.5) |
| **değer** | Kullanıcının 1./2./3. değerleri kümenin `values` listesindeyse sırasıyla `1.0 / 0.66 / 0.33` puan; toplam `/1.99` ile normalize |

v1'de merak bileşeni ikiliydi (bir eşleşme = tam puan) ve değerler skora hiç girmiyordu. v2'de her ikisi de düzeltildi.

**Skorlar sıralama içindir, olasılık değildir.** Arayüz "%83 uyum"u başarı olasılığı gibi
sunmamalı; "bu kümenin profilinle örtüşme derecesi" demelidir.

### Rapora düşen bayraklar

| Bayrak | Koşul | Rapordaki anlamı |
|---|---|---|
| `explorationMode` | `spread < 15` | Profil düz; sonuçları kesin hüküm olarak okuma |
| `interestHighConfLow` | ilgi ≥ 0.55 ve özyeterlik < 0.45 | İlgi var, güven yok — engel değil, gelişim alanı |
| `valuesMismatch` | kullanıcının ilk 2 değeri kümenin `values` listesinde yok | Alan uyuyor ama seni tatmin edecek şeyi beslemeyebilir |

## 6. 2030 beceri radarı (v2'de yeni)

Kullanıcının RIASEC yüzdeleri, `data/skills2030.json` içindeki her becerinin `riasecAffinity`
ağırlıklarıyla çarpılır:

```
hazırlık[beceri] = Σ(affinity[t] × pct[t]) / Σ(affinity[t])
```

Rapor iki liste üretir:

- **Doğal güçlü yanların**: hazırlık puanı en yüksek 3 yükselen beceri.
- **Bilinçli yatırım gerekenler**: WEF sıralamasında ilk 5'te olup hazırlık puanı en düşük 2 beceri —
  her birinin yanında `howToBuild` alanındaki somut öneri gösterilir.

Bu radar bir yetenek ölçümü değil, bir *eğilim* haritasıdır; metin bunu açıkça söylemelidir.

## 7. YZ direnci (v2'de yeni) — skora girmez

Her kümenin `aiPosture` alanı üç değerden birini taşır: `yuksek_direnc`, `orta`, `karisik`.
Bu bilgi **bilinçli olarak skorun dışında tutulmuştur**: otomasyona direnç bir tercih değil,
bir bağlamdır. Kullanıcı kendi ilgisiyle uyumsuz bir alanı yalnızca "güvenli" diye seçmemelidir.
Rapor bunu ayrı bir mercek olarak, kaynağıyla birlikte gösterir.

## 8. Veri ve gizlilik

- Tüm cevaplar yalnızca tarayıcıda (`localStorage`) tutulur; sunucuya hiçbir şey gönderilmez.
- Yaş, doğum tarihi, okul, e-posta gibi kişisel veri **sorulmaz**. Rapor başlığındaki isim alanı
  isteğe bağlıdır ve yalnızca cihazda kalır.
- Paylaşım bağlantısı üretilirse veri URL'in kendisine kodlanır; sunucuda saklanmaz. Arayüz
  bağlantıyı paylaşmanın cevapları paylaşmak anlamına geldiğini yazmalıdır.
- "Sonuçları sil" düğmesi her zaman görünür olmalıdır.

## 9. Sınırlar — arayüzde görünmesi gereken uyarılar

1. Bu test bir hüküm değil, bir keşif haritasıdır.
2. İlgi ile yetenek aynı şey değildir; test yetenek ölçmez.
3. Meslek verileri ağırlıklı olarak küresel ve ABD kaynaklıdır; Türkiye iş piyasası farklı seyredebilir.
4. Projeksiyonlar tahmindir: WEF ve BLS aynı mesleğe farklı yönler atfedebilir.
5. 15-16 yaşındaki bir kullanıcının ilgi profili birkaç yılda değişebilir — testi bir yıl sonra tekrar çöz.
