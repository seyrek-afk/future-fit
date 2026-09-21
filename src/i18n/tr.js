/* Kullanıcıya görünen tüm metinler.
 *
 * Bileşenlerin içine düz metin yazılmaz — ileride ikinci bir dil eklenebilsin diye her şey burada.
 * Soru maddelerinin metni data/*.json içindedir; burası yalnızca arayüz çerçevesidir.
 *
 * ÜSLUP KURALI (CLAUDE.md kural 6): kesinlik dili yok. "Senin mesleğin şu" değil,
 * "profilinle örtüşme derecesi". Tanı, garanti ve başarı olasılığı ifadesi kullanılmaz.
 */

export const tr = {
  app: {
    title: 'Future-Fit',
    subtitle: 'Kariyer keşif envanteri',
    skipToContent: 'İçeriğe geç',
  },

  intro: {
    /* Hedef kitle 15-18 yaş. Ton doğrudan; çocuklaştırma ve pazarlama cümlesi yok.
       Hero'da uzun düz metin bulunmaz — ayrıntı Explainer'a girer. */
    heading: 'İlgilerin 2030’un becerileriyle nerede örtüşüyor?',
    lead: 'Tutkularını WEF’in 2030 beceri setiyle örtüştürür ve sonucu radarına çizer: hangi alanlara ne kadar fit olduğunu görürsün. Meslek atamaz, yön gösterir.',
    leadMore: 'Tam olarak ne yapıyor?',
    leadDetail:
      'İlgi profilini altı tip üzerinden çıkarıp 13 meslek kümesiyle örtüşme derecesine göre sıralar. Çıkan sıralama bir hüküm değil, nereden başlayacağına dair bir işaret.',
    whatItIsTitle: 'Ne yapar',
    whatItIs: [
      'İlgi profilini (Holland RIASEC) altı tip üzerinden çıkarır.',
      'Çalışma tarzını, değerlerini ve kendine güvendiğin alanları kaydeder.',
      'Bunları WEF\'in 2030 beceri çerçevesi ve güncel iş piyasası verileriyle eşleştirir.',
      '13 meslek kümesini profilinle örtüşme derecesine göre sıralar.',
    ],
    whatItIsNotTitle: 'Ne yapmaz',
    whatItIsNot: [
      'Yetenek ölçmez. İlgi ile yetenek aynı şey değildir.',
      'Psikometrik bir test değildir: normlanmamıştır, tanı koymaz.',
      '"Doğru meslek" söylemez. Sıralama bir hüküm değil, bir keşif haritasıdır.',
      'Başarı olasılığı hesaplamaz.',
    ],
    privacyTitle: 'Verin nereye gidiyor',
    privacy:
      'Hiçbir yere. Bu sayfa internete hiç bağlanmaz; cevapların yalnızca bu cihazda kalır.',
    privacyDetail:
      'Sunucu yok, hesap yok, çerez yok. Yaş, doğum tarihi, okul ve e-posta sorulmaz. Cevapların tarayıcının kendi hafızasında durur; "Sonuçları sil" dediğin an gider. Rapora eklediğin isim de yalnızca bu cihazda kalır — paylaşım bağlantısına ve panoya kopyalanan döküme girmez.',
    duration:
      'Yaklaşık 12-18 dakika · 8 bölüm · zorunlu soru yok · kaydın tutulur, yarıda bırakabilirsin',
    startNote: 'Zorunlu soru yok. Boş bıraktıkların hesaba katılmaz.',
    start: 'Başla',
    resume: 'Kaldığın yerden devam et',
    startOver: 'Baştan başla',
    resumeNote: 'Yarım kalmış bir oturum bulundu.',
    sharedNote:
      'Bu bağlantı bir başkasının cevaplarını taşıyor. Görüntüleyebilir ya da temizleyip kendi testini çözebilirsin.',
  },

  nav: {
    back: 'Geri',
    next: 'Devam',
    finish: 'Raporu gör',
    skip: 'Bu bölümü atla',
    progress: 'İlerleme',
    progressLabel: (pct) => `Tamamlanan: %${pct}`,
    saved: 'Kaydedildi',
    saving: 'Kaydediliyor…',
    saveFailed: 'Bu tarayıcıda kayıt kapalı — sayfayı yenileme.',
    stepOf: (current, total) => `Bölüm ${current} / ${total}`,
    optional: 'Tüm sorular isteğe bağlı. Boş bıraktıkların skorlamada hesaba katılmaz.',
    sectionStripLabel: 'Bölümlerin durumu',
    sectionStatus: (n, title, answered, total) =>
      `Bölüm ${n}: ${title} — ${answered} / ${total} cevaplandı`,
    sectionStateDone: 'tamam',
    sectionStatePartial: 'yarım',
    sectionStateEmpty: 'boş',
  },

  actions: {
    reset: 'Sonuçları sil',
    resetConfirm:
      'Tüm cevapların ve raporun bu cihazdan silinecek. Bu işlem geri alınamaz. Devam edilsin mi?',
    resetDone: 'Silindi.',
  },

  sections: {
    likert: {
      short: 'İlgi',
      title: 'İlgi alanların',
      about: 'Bu bölüm neyi yapmaktan hoşlandığını ölçüyor — neyi iyi yaptığını değil.',
      instruction: 'Her etkinlik için: bunu yapmak sana ne kadar çekici geliyor?',
      pageOf: (current, total) => `Sayfa ${current} / ${total}`,
    },
    scenarios: {
      short: 'Senaryo',
      title: 'Senaryolar',
      about: 'Bu bölüm belirli durumlarda ilk içgüdünün ne olduğuna bakıyor.',
      instruction: 'Doğru cevap yok; sana en çok benzeyeni seç.',
    },
    flow: {
      short: 'Akış',
      title: 'Akış soruları',
      about: 'Bu bölüm zamanın nasıl geçtiğini fark etmediğin anları arıyor.',
      instruction: (max) => `En fazla ${max} seçenek işaretleyebilirsin.`,
      remaining: (left) => (left > 0 ? `${left} seçim hakkın kaldı` : 'Seçim hakkın doldu'),
    },
    workstyle: {
      short: 'Tarz',
      title: 'Çalışma tarzın',
      about:
        'Bu bölüm insanlarla mı nesnelerle mi, veriyle mi fikirle mi çalışmayı sevdiğini ölçüyor.',
      predigerTitle: 'İkisinden birini seç',
      predigerAbout: 'İkisi de çekici gelse bile birini seçmen gerekiyor — ölçtüğü şey tam olarak bu.',
      environmentTitle: 'Çalışma ortamı tercihlerin',
      environmentAbout: 'Bu tercihler skora girmez; raporunda ayrı bir bölüm olarak görünür.',
    },
    values: {
      short: 'Değer',
      title: 'Değerlerin',
      about: 'Bu bölüm bir işte seni asıl tatmin edecek şeyi sıralıyor.',
      instruction:
        'Altı değeri senin için en önemliden en az önemliye doğru sırala. Sürükleyebilir ya da ok düğmelerini kullanabilirsin.',
      moveUp: 'Yukarı taşı',
      moveDown: 'Aşağı taşı',
      positionLabel: (rank, total, title) => `${title}, ${total} değer içinde ${rank}. sırada`,
      reorderHint: 'Sıralamayı değiştirmek için yukarı/aşağı düğmelerini kullan.',
    },
    confidence: {
      short: 'Güven',
      title: 'Kendine güven',
      about: 'Bu bölüm neyi iyi yaptığını değil, neyi yapabileceğine inandığını ölçüyor.',
      instruction: '1 = hiç güvenmiyorum · 5 = çok güveniyorum',
      scaleLow: 'Hiç güvenmiyorum',
      scaleHigh: 'Çok güveniyorum',
    },
    interests: {
      short: 'Merak',
      title: 'Merak ettiklerin',
      about: 'Bu bölüm hangi sorunların ve teknolojilerin ilgini çektiğini topluyor.',
      problemsTitle: 'Hangi dünya sorunları seni gerçekten ilgilendiriyor?',
      techsTitle: 'Hangi teknolojiler seni heyecanlandırıyor?',
      multiHint: 'İstediğin kadar seçebilirsin.',
      selectedCount: (n) => `${n} seçildi`,
    },
    open: {
      short: 'Yazılı',
      title: 'Kendi cümlelerin',
      about:
        'Bu bölüm skora girmez. Cevapların raporunda ve panoya kopyalanan dökümde aynen yer alır; hepsini boş bırakabilirsin.',
      placeholder: 'İstersen boş bırak',
      charCount: (n) => `${n} karakter`,
    },
  },

  likertLegend: {
    label: 'Ne kadar hoşlanırsın?',
  },

  report: {
    heading: 'Keşif raporun',
    generatedOn: (date) => `${date} tarihinde oluşturuldu`,
    namePrompt: 'Rapora adını eklemek ister misin? (isteğe bağlı, yalnızca bu cihazda kalır)',
    namePlaceholder: 'Adın',
    nameLabel: 'Rapor başlığındaki isim',
    backToSurvey: 'Cevaplara dön',

    /* Özet — raporun ilk ekranı. Hedef kitle lise çağında: sonuç kısa ve görsel,
       gerekçe ve uyarılar aşağıda ve açılır bloklarda durur. Hiçbiri silinmez, ertelenir. */
    summaryTitle: 'Özet',
    summaryWhatLetters: 'Bu harfler ne demek?',
    summaryTopClusters: 'En çok örtüşen 3 alan',
    summaryAllClusters: '13 alanın tamamı',
    summaryStrengths: 'En güçlü 3 becerin',
    summaryAllSkills: 'Beceri radarının tamamı',
    summaryFlat: 'Altı tipin puanları birbirine yakın — profilin henüz belirginleşmemiş olabilir.',
    summaryNote:
      'Bu yüzdeler bir sıralamadır, bir kehanet değil. Aşağıdaki bölümler her sayının nereden geldiğini gösterir.',

    /** Uzun gerekçe metinlerini saklayan açılır blokların ortak etiketi. */
    howToRead: 'Bunu nasıl okumalı?',
    showDetails: 'Ayrıntıyı göster',
    methodNote: 'Nasıl hesaplandı?',

    /* Rapor üç ana bölüme ayrılır; kalan her şey "Ek bilgiler" altında toplanır.
       İçindekiler listesi raporun en başında, başlığın hemen altında durur. */
    tocTitle: 'Bu raporda ne var',
    tocHint: 'Bir bölüme atlamak için üstüne tıkla.',
    parts: {
      profile: {
        n: 1,
        title: 'Kişisel tanıtım',
        about:
          'Neyi yapmaktan hoşlandığın, nasıl çalışmayı sevdiğin, bir işte neye değer verdiğin ve bugün kendine nerede güvendiğin.',
        items: ['İlgi profilin', 'Çalışma tarzın', 'Değerlerin', 'Kendine güven haritan'],
      },
      skills: {
        n: 2,
        title: '2030 beceri radarı',
        about:
          'Profilinin, WEF\'in 2030\'a dek önemi en hızlı artan becerileriyle hangi yönde örtüştüğü — bir yetenek ölçümü değil, bir eğilim haritası.',
        items: ['Doğal güçlü yanların', 'Bilinçli yatırım gerekenler', 'WEF yükselen 10 beceri'],
      },
      clusters: {
        n: 3,
        title: 'Profilinle en çok örtüşen meslek kümeleri',
        about:
          '13 meslek kümesinin örtüşme sıralaması ve ilk beşinin ayrıntısı: örnek meslekler, kaynaklı rozetler, 2030 becerileri, otomasyon duruşu ve dürüst uyarılar.',
        items: ['İlk 5 küme kartı'],
      },
      extra: {
        title: 'Ek bilgiler',
        about: 'Sıralamanın geri kalanı, otomasyon merceği, sonraki adımlar ve kaynak künyesi.',
        items: ['Diğer kümeler', 'Yapay zekâ merceği', 'Sonraki adımlar ve çıktılar', 'Kaynaklar ve künye'],
      },
    },
    partLabel: (n) => `${n}. Bölüm`,

    hollandTitle: 'Holland kodun',
    hollandExplain: (letters, names) =>
      `${letters} — ${names}. Bu üç harf, ilgi profilinde en öne çıkan üç eğilimi gösterir; bir kişilik tipi ya da bir yetenek ölçüsü değildir.`,

    explorationTitle: 'Keşif modu',
    explorationBody:
      'Altı tipin puanları birbirine çok yakın çıktı (farklılaşma 15 puanın altında). Bu, "hiçbir şeyi sevmiyorsun" demek değil; profilin henüz belirginleşmemiş ya da gerçekten geniş ilgili olabilirsin. Aşağıdaki sıralamayı bir hüküm değil, nereye bakmaya başlayacağına dair bir işaret olarak oku.',

    interestTitle: 'İlgi profilin',
    interestLeadShort: 'Her yüzde, o tipteki maddelerden aldığın puanın oranı. Tipler birbiriyle yarışmaz.',
    interestLead:
      'Her yüzde, o tipteki maddelerden alabileceğin puanın ne kadarını aldığını gösterir. Tipler birbiriyle yarışmaz; hepsi yüksek ya da hepsi düşük olabilir.',

    axesTitle: 'Çalışma tarzın',
    axesLeadShort: 'Skora girmez — sadece nasıl çalışmayı sevdiğini tarif eder.',
    axesLead: 'Bu iki eksen skora girmez; nasıl çalışmayı sevdiğini tarif eder.',
    axisPeopleThings: 'Nesnelerle ↔ İnsanlarla',
    axisDataIdeas: 'Veriyle ↔ Fikirlerle',
    axisPeople: 'İnsanlar',
    axisThings: 'Nesneler',
    axisData: 'Veri',
    axisIdeas: 'Fikirler',
    axisUnanswered: 'Bu eksende yeterli cevap yok.',
    environmentTitle: 'Ortam tercihlerin',
    environmentEmpty: 'Ortam tercihi seçilmemiş.',

    valuesTitle: 'Değerlerin',
    valuesLeadShort: 'Kendi sıraladığın ilk üç. Uyum skorunun %15’i buradan geliyor.',
    valuesLead: 'Kendi sıraladığın ilk üç değer. Küme uyumunun %15\'i bu sıralamadan gelir.',
    valuesEmpty: 'Değer sıralaması yapılmamış.',
    valuesRest: 'Diğer değerlerin sırası',

    confidenceTitle: 'Kendine güven haritan',
    confidenceLeadShort: 'Yetenek ölçümü değil, kendi beyanın. Düşük çubuk kapalı kapı değil.',
    confidenceLead:
      'Bu bir yetenek ölçümü değil, bir özbildirimdir: bugün kendini nerede rahat hissettiğini gösterir. Düşük bir çubuk kapalı bir kapı değil, henüz girilmemiş bir alandır.',
    confidenceEmpty: 'Kendine güven bölümü doldurulmamış.',

    skillsTitle: '2030 beceri radarı',
    skillsLeadShort: 'Yetenek değil eğilim: hangi beceriyi geliştirmek sana daha doğal gelebilir.',
    skillsLead:
      'Aşağıdaki puanlar ilgi profilinin WEF\'in yükselen becerileriyle ne kadar aynı yöne baktığını gösterir. Bir yetenek ölçümü değil, bir eğilim haritasıdır: "bu beceriyi geliştirmek sana daha doğal gelebilir" der, "bu beceride iyisin" demez.',
    skillsStrengthTitle: 'Doğal güçlü yanların',
    skillsStrengthNote: 'Profilinin en çok yaklaştığı üç yükselen beceri.',
    skillsInvestTitle: 'Bilinçli yatırım gerekenler',
    skillsInvestNote:
      'WEF sıralamasında ilk beşte olan ama profiline en uzak duran iki beceri. Bunlar eksiklik değil; farkında olarak çalışılması gereken alanlar.',
    skillsHowToBuild: 'Nasıl geliştirilir',
    skillsRisingTitle: 'WEF\'in 2030\'a dek önemi en hızlı artan 10 becerisi',
    skillsRisingNote: 'Liste WEF sırasındadır; yanındaki çubuk senin profiline yakınlığını gösterir.',
    skillsHeadlineTitle: 'Bağlam',

    clustersTitle: 'Profilinle en çok örtüşen meslek kümeleri',
    clustersLeadShort: 'Yüzde = örtüşme derecesi. Bir başarı olasılığı değildir.',
    clustersLead:
      'Yüzdeler bir başarı olasılığı değildir. Her biri, o kümenin profilinle örtüşme derecesini gösterir ve yalnızca sıralama amaçlıdır.',
    clustersFormula:
      'Uyum = %45 ilgi profili + %20 kendine güven + %20 teknoloji/sorun merakı + %15 değer sıralaması.',
    clusterMatch: (pct) => `%${pct} örtüşme`,
    clusterBreakdown: 'Skorun dağılımı',
    clusterInterest: 'İlgi',
    clusterConfidence: 'Güven',
    clusterCuriosity: 'Merak',
    clusterValues: 'Değer',
    clusterJobs: 'Bu kümedeki örnek meslekler',
    clusterSkills: 'Öne çıkan 2030 becerileri',
    clusterStudyPaths: 'Türkiye\'de ilgili lisans/MYO programları',
    clusterStudyPathsNote:
      'Editoryal derleme — yaygın program adlarından oluşur, YÖK kontenjan ya da yerleşme verisine dayanmaz.',
    clusterCaution: 'Dikkat',
    clusterCautionNote: 'Editoryal dürüstlük notu, kaynaklı bir bulgu değil.',
    clusterAiPosture: 'Otomasyon karşısındaki duruşu',
    clusterWhyGrowing: 'Bu alan neden hareketli?',
    clusterAiWhy: 'Neden bu duruş?',

    otherClustersTitle: 'Diğer kümeler',
    otherClustersLeadShort: 'Düşük yüzde "bu alan sana kapalı" demek değil.',
    otherClustersLead:
      'Sıralamanın alt tarafı. Düşük bir yüzde "bu alan sana kapalı" demek değil; bu envanterin ölçtüğü şeylerle daha az örtüştüğü anlamına gelir.',
    otherClustersExpand: 'Ayrıntıları göster',

    aiLensTitle: 'Yapay zekâ merceği',
    aiLensLeadShort: 'Bu bilgi uyum skoruna GİRMEZ. Bir tercih değil, bir bağlam.',
    aiLensLead:
      'Bu bilgi uyum skoruna bilinçli olarak KATILMAMIŞTIR. Otomasyona direnç bir tercih değil, bir bağlamdır: ilgi duymadığın bir alanı yalnızca "güvenli görünüyor" diye seçmek iyi bir karar değildir. Buradaki üç sütun, kümeleri bugünkü verilere göre nasıl konumlandığına göre ayırır.',
    aiLensHigh: 'Yüksek dirençli',
    aiLensHighNote: 'Fiziksel dünyada teşhis, insan teması ya da yerinde muhakeme gerektiren işler.',
    aiLensMedium: 'Orta',
    aiLensMediumNote: 'Alan büyüyor, ama giriş seviyesi rutin işler otomatikleşiyor.',
    aiLensMixed: 'Karışık',
    aiLensMixedNote: 'Aynı alan içinde bazı roller güçlenirken bazıları daralıyor.',

    nextStepsTitle: 'Sonraki adımlar',
    nextStepsBody: [
      'Bu rapor bir hüküm değil, bir konuşma başlangıcıdır. En iyi kullanımı: birine göstermek ve "bu bana benziyor mu?" diye sormak.',
      'İlgi ile yetenek aynı şey değildir. Buradaki hiçbir sayı neyi başarabileceğini söylemez.',
      'Meslek verileri ağırlıklı olarak küresel ve ABD kaynaklıdır; Türkiye iş piyasası farklı seyredebilir.',
      'İlk sıradaki kümeyi değil, ilk üçü birden oku. Aralarındaki ortak şey genelde tek bir kümeden daha fazlasını anlatır.',
      'Bir yıl sonra testi tekrar çöz. 15-17 yaşında ilgi profili değişir; değişimin kendisi bilgidir.',
    ],
    retakeHint: 'Testi tekrar çözmek istersen önce sonuçlarını silmen gerekir.',

    outputsTitle: 'Raporunu al',
    print: 'PDF olarak indir',
    printHint: 'Tarayıcının yazdırma penceresinden "PDF olarak kaydet"i seç.',
    copy: 'Panoya kopyala',
    copyHint:
      'Tüm cevaplarını ve skorlarını metin olarak kopyalar. Bir yapay zekâya yapıştırıp daha derin bir yorum isteyebilirsin.',
    copyDone: 'Kopyalandı',
    copyFailed: 'Kopyalanamadı — metni elle seçip kopyalayabilirsin.',
    share: 'Bağlantıyla paylaş',
    shareHint: 'Bu bağlantı cevaplarının tamamını içerir. Paylaşmak, cevaplarını paylaşmak demektir.',
    shareDone: 'Bağlantı kopyalandı',
    shareTooLong:
      'Cevapların bir bağlantıya sığmayacak kadar uzun (özellikle açık uçlu yanıtlar). Bunun yerine PDF olarak indirebilirsin.',
    shareNoServer: 'Sunucu yoktur: veri bağlantının kendisinde taşınır, hiçbir yere kaydedilmez.',

    sourcesTitle: 'Kaynaklar ve künye',
    sourcesLead:
      'Bu raporda geçen her rozet ve her istatistik aşağıdaki kaynaklardan birine dayanır. Kaynağı olmayan alanlar "editoryal" olarak işaretlenmiştir.',
    sourcesUsedTitle: 'Kullanılan kaynaklar',
    /* Tam künye açılır durur: meraklısı açar. Kaynakların KİM olduğu yine de açıkta —
       rozet şeridi tek bakışta görünür ve her rozet kendi künyesini tek tıkla açar. */
    sourcesGlance: (n) => `${n} kaynak — her rozet kendi künyesini açar`,
    sourcesFull: (n) => `${n} kaynağın tam künyesi`,
    frameworksTitle: 'Ölçüm çerçeveleri',
    frameworksLead:
      'Sorular aşağıdaki çerçevelerden uyarlanmıştır. Uyarlanmış maddeler, çerçevenin ölçülmüş/normlanmış test maddeleri DEĞİLDİR.',
    editorialTitle: 'Editoryal alanlar',
    editorialLead:
      'Aşağıdaki alanlar dış kaynağa değil, bu projenin editoryal yargısına dayanır ve raporda kaynak rozeti taşımaz:',
    disclaimerTitle: 'Sınırlar',
    dataUpdated: (date) => `Veri seti son güncelleme: ${date}`,
    // Erişilebilir ad, GÖRÜNEN metni birebir içermeli (sesle kontrol kullanıcıları gördüğünü söyler).
    sourceBadgeLabel: (short, year) => `Kaynak: ${short} · ${year}`,
    editorialBadge: 'Editoryal',
    editorialBadgeTitle: 'Bu alan dış bir kaynağa değil, projenin editoryal yargısına dayanır.',
    openSource: 'Kaynağı aç',
  },

  copyExport: {
    instruction:
      'Aşağıda bir kariyer keşif envanterinin ham çıktısı var. Bu bir psikometrik test değildir, normlanmamıştır ve tanı koymaz; skorlar yalnızca sıralama amaçlıdır. Lütfen bunu kesin bir yargıya dönüştürmeden yorumla: örüntüleri, çelişkileri ve keşfedilmeye değer yönleri göster; sorular sor.',
    header: 'FUTURE-FIT — KARİYER KEŞİF ENVANTERİ ÇIKTISI',
  },

  misc: {
    unanswered: 'cevapsız',
    none: '—',
    yes: 'Evet',
    no: 'Hayır',
  },
}

export default tr
