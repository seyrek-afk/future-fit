# Envanter v1 → v2 değişiklikleri

v1: `reference/v1-duru-kariyer-kesif-testi.html` (20 Temmuz 2026, tek kullanıcı için).
v2: bu repodaki `data/*.json` (20 Eylül 2026, genel kullanım).

## Korunanlar (iyi çalışan iskelet)

- 36 Likert maddesi, 5 senaryo, 3 akış sorusu — her RIASEC tipinden dengeli dağılım.
- Prediger'in iki ekseni ve 6 ortam tercihi sorusu.
- O*NET tabanlı 6 değer ve sıralama biçimi.
- Öz-yeterlik ölçeği ve "ilgi yüksek / güven düşük" bayrağı — v1'in en iyi fikri.
- Düz profil (düşük farklılaşma) uyarısı.
- Sonuçları metin olarak kopyalayıp bir YZ'ye devretme akışı.

## Eklenenler

| Ne | Neden |
|---|---|
| **3 yeni meslek kümesi**: Bakım Ekonomisi & Eğitim, Uygulamalı Teknik Meslekler & Altyapı, Hukuk & YZ Yönetişimi | v1'in 10 kümesi I ve R ağırlıklıydı; S ve C baskın kullanıcılar boşa düşüyordu |
| **`aiPosture`** her kümede (yüksek direnç / orta / karışık) + gerekçe + kaynak | 2026'nın asıl karar bilgisi bu; bilinçli olarak skorun dışında |
| **`studyPathsTR`** her kümede | Türk öğrenci için soyut meslek adını somut bölüme bağlar |
| **`caution`** her kümede | Her kümenin dürüst dezavantajı — v1 yalnızca olumlu yanı söylüyordu |
| **`values`** her kümede + skora %15 ağırlık | v1'de değerler ölçülüyor ama hiçbir şeyi etkilemiyordu |
| **2030 beceri radarı** (`skills2030.json` + `riasecAffinity`) | v1 becerileri yalnızca etiket olarak gösteriyordu; artık profile göre kişiselleşiyor |
| **`sources.json`** künye kaydı | v1'de rozetler kaynaksızdı |
| **2 yeni öz-yeterlik maddesi** (`c_care`, `c_detail`) | Yeni kümelerin eşleşebilmesi için |
| **1 yeni sorun** (`care`), **1 yeni teknoloji** (`agritech`), **1 yeni açık uçlu soru** (`O4`) | Kapsama genişletmesi |
| **`valuesMismatch` bayrağı** | "Alan uyuyor ama seni tatmin edecek şeyi beslemiyor" durumu |

## Değişenler

- **Skor formülü**: v1 `0.50 ilgi + 0.25 güven + 0.15 teknoloji + 0.10 sorun` →
  v2 `0.45 ilgi + 0.20 güven + 0.20 merak + 0.15 değer`.
  Ayrıca teknoloji/sorun örtüşmesi ikili (var/yok) olmaktan çıkıp oransal hale geldi — v1'de tek bir
  eşleşme tam puan veriyordu, bu da kümeleri yapay biçimde birbirine yaklaştırıyordu.
- **Rozetler**: BLS 2024-34 → 2025-35 serisi; siber güvenlikte "4,8M açık pozisyon" → ISC2 2025
  beceri açığı verisi; kuantumdaki aday/pozisyon oranı kaldırıldı.
- **Dil**: "Duru" ve kişiye özel tüm bağlam kaldırıldı; rapor ikinci tekil şahısla ve isteğe bağlı isimle.

## Çıkarılanlar

- v1'in sonundaki "Duru Bölüm Okul Seçimi projesi" bağlamı ve proje-içi yönlendirmeler.
- Doğrulanamayan üç sayısal iddia (çip tasarımında 1M ek uzman, kuantum aday oranı, aktüer %22).

## Not

v1 dosyası `reference/` altında bilerek duruyor: v2'nin soru bankası ondan türetildi
(`reference/extract.mjs` → `data/_v1/*.json` → `reference/compose-v2.mjs`). Soru metinlerinde
değişiklik gerekirse doğrudan `data/*.json` düzenlenmeli; `_v1` klasörü yalnızca tarihsel kayıttır.
