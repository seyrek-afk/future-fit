# VS Code'da Claude Code'a verilecek başlangıç promptu

Aşağıdaki metni olduğu gibi kopyalayıp VS Code'daki Claude Code'a yapıştır.
Öncesinde klasörü aç: `C:\Users\seyre\ProjectRepos\future-fit`

---

```
Bu repoda Future-Fit adlı, tarayıcıda çalışan bir kariyer keşif envanteri inşa edeceğiz.
Kod henüz yok; veri, spec ve kurallar hazır.

Önce şu dosyaları oku ve bana tek paragraflık bir anlama özeti ver:
  CLAUDE.md, docs/PRD.md, docs/METHODOLOGY.md, data/clusters.json, data/skills2030.json

Sonra şu sırayla ilerle ve her adımın sonunda dur, bana göster:

1. İskelet: Vite + React 18 kurulumu (TypeScript yok), package.json, vite.config.js,
   src/index.css içinde tema token'ları (docs/PRD.md §7'deki isimler), vitest yapılandırması.
   Port 3002, strictPort. node_modules ve dist .gitignore'da.

2. Skorlama katmanı ÖNCE, arayüzden bağımsız: src/scoring/ altında saf fonksiyonlar
   (riasec.js, axes.js, clusters.js, skills.js, flags.js, index.js).
   docs/METHODOLOGY.md §3-§6'daki formüllerin birebir uygulaması olmalı.
   Aynı adımda docs/PRD.md §8'deki 8 testi yaz — özellikle veri bütünlüğü testini ve
   S-profili regresyon testini atlama. Testler yeşil olmadan devam etme.

3. Anket akışı: docs/PRD.md §4'teki 8 bölüm, tek useReducer + Context, localStorage'a
   otomatik kayıt ve kaldığı yerden devam. Telefonda tek elle bitirilebilmeli.

4. Rapor: docs/PRD.md §5'teki 10 bölüm. Her rozetin yanında kaynak kısaltması ve yılı
   görünsün (data/sources.json). Kesinlik dili kullanma.

5. Çıktılar: PDF için print CSS, panoya kopyalama, URL hash ile paylaşım (§6).

6. Son kontrol: npm run build çalışıyor mu, Lighthouse erişilebilirlik ≥95 mi,
   metinlerin hiçbirinde tek kullanıcıya ait bağlam kalmış mı.

Kurallar: çalışma zamanında hiçbir ağ isteği yok, kişisel veri toplanmıyor, skor mantığı
bileşenlerin içine sızmıyor. data/*.json dosyalarındaki içeriği kendi kafana göre değiştirme —
bir sorun görürsen bana söyle.
```

---

## Sonra: GitHub ve Render

```bash
# repo zaten git ile başlatıldı ve ilk commit atıldı
git remote add origin https://github.com/seyrek-afk/future-fit.git
git push -u origin main
```

GitHub'da `seyrek-afk/future-fit` reposunu önce boş olarak oluştur (README ekleme).

Render: Dashboard → New + → Blueprint → `seyrek-afk/future-fit` → `render.yaml` okunur → Apply.
Ortam değişkeni yok. Sonrasında `main`'e her push otomatik deploy eder.
