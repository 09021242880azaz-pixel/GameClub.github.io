/* GAME CLUB — ۱۸ زبان (پیش‌فرض: فارسی). زبان‌های راست‌به‌چپ: فارسی، عبری، اردو. */
const LANGS = [
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "zh", name: "中文", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
  { code: "ko", name: "한국어", dir: "ltr" },
  { code: "it", name: "Italiano", dir: "ltr" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "nl", name: "Nederlands", dir: "ltr" },
  { code: "sv", name: "Svenska", dir: "ltr" },
  { code: "pl", name: "Polski", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", dir: "ltr" },
  { code: "th", name: "ไทย", dir: "ltr" },
  { code: "vi", name: "Tiếng Việt", dir: "ltr" },
  { code: "uk", name: "Українська", dir: "ltr" },
  { code: "el", name: "Ελληνικά", dir: "ltr" },
  { code: "he", name: "עברית", dir: "rtl" },
  { code: "bn", name: "বাংলা", dir: "ltr" },
  { code: "ur", name: "اردو", dir: "rtl" },
];

const STRINGS = {
  fa: {
    home: "خانه", library: "کتابخانه", ai: "هوش مصنوعی", admin: "مدیریت", search: "جستجوی بازی‌ها…",
    hero_title: "به GAME CLUB خوش آمدید", hero_text: "کتابخانه‌ای از بازی‌های منتخب با نیازمندی‌های سیستم، گالری و دستیار هوشمند.",
    btn_library: "مشاهده کتابخانه", btn_ai: "دستیار هوشمند", categories: "دسته‌بندی‌ها", featured: "ویژه", popular: "محبوب",
    recent: "تازه اضافه‌شده", recommended: "پیشنهادی", stats: "آمار", activity: "دسته‌های پرتعداد", other_platforms: "پلتفرم‌های دیگر",
    total_games: "کل بازی‌ها", avg_rating: "میانگین امتیاز", updates: "آخرین افزوده‌شده", no_games: "هنوز بازی‌ای ثبت نشده است.",
    no_links: "لینکی تنظیم نشده است.", all: "همه", setup_needed: "بک‌اند هنوز تنظیم نشده است. فایل config.js را پر کنید (راهنما در README).",
    error: "خطا رخ داد. دوباره تلاش کنید.",
    cat_action: "اکشن", cat_adventure: "ماجراجویی", cat_racing: "مسابقه‌ای", cat_sports: "ورزشی", cat_horror: "ترسناک",
    cat_shooting: "شوتر", cat_simulation: "شبیه‌سازی", cat_strategy: "استراتژی", cat_rpg: "نقش‌آفرینی", cat_open_world: "جهان باز",
  },
  zh: {
    home: "首页", library: "游戏库", ai: "AI 助手", admin: "管理", search: "搜索游戏…",
    hero_title: "欢迎来到 GAME CLUB", hero_text: "精选游戏库，附系统需求、媒体画廊和智能助手。",
    btn_library: "浏览游戏库", btn_ai: "智能助手", categories: "分类", featured: "精选", popular: "热门",
    recent: "最新添加", recommended: "推荐", stats: "统计", activity: "热门分类", other_platforms: "其他平台",
    total_games: "游戏总数", avg_rating: "平均评分", updates: "最新添加", no_games: "暂无游戏。",
    no_links: "尚未设置链接。", all: "全部", setup_needed: "后端尚未配置。请填写 config.js（见 README）。",
    error: "出错了，请重试。",
    cat_action: "动作", cat_adventure: "冒险", cat_racing: "竞速", cat_sports: "体育", cat_horror: "恐怖",
    cat_shooting: "射击", cat_simulation: "模拟", cat_strategy: "策略", cat_rpg: "角色扮演", cat_open_world: "开放世界",
  },
  ja: {
    home: "ホーム", library: "ライブラリ", ai: "AIアシスタント", admin: "管理", search: "ゲームを検索…",
    hero_title: "GAME CLUBへようこそ", hero_text: "厳選されたゲームのライブラリ。動作環境、ギャラリー、AIアシスタントを搭載。",
    btn_library: "ライブラリを見る", btn_ai: "AIアシスタント", categories: "カテゴリ", featured: "注目", popular: "人気",
    recent: "新着", recommended: "おすすめ", stats: "統計", activity: "主なカテゴリ", other_platforms: "その他のプラットフォーム",
    total_games: "ゲーム数", avg_rating: "平均評価", updates: "最新追加", no_games: "まだゲームが登録されていません。",
    no_links: "リンクが設定されていません。", all: "すべて", setup_needed: "バックエンドが未設定です。config.js を入力してください（README参照）。",
    error: "エラーが発生しました。もう一度お試しください。",
    cat_action: "アクション", cat_adventure: "アドベンチャー", cat_racing: "レース", cat_sports: "スポーツ", cat_horror: "ホラー",
    cat_shooting: "シューター", cat_simulation: "シミュレーション", cat_strategy: "ストラテジー", cat_rpg: "RPG", cat_open_world: "オープンワールド",
  },
  ko: {
    home: "홈", library: "라이브러리", ai: "AI 어시스턴트", admin: "관리", search: "게임 검색…",
    hero_title: "GAME CLUB에 오신 것을 환영합니다", hero_text: "엄선된 게임 라이브러리, 시스템 요구 사항, 갤러리와 AI 어시스턴트.",
    btn_library: "라이브러리 보기", btn_ai: "AI 어시스턴트", categories: "카테고리", featured: "추천", popular: "인기",
    recent: "최근 추가", recommended: "추천 게임", stats: "통계", activity: "주요 카테고리", other_platforms: "기타 플랫폼",
    total_games: "전체 게임", avg_rating: "평균 평점", updates: "최근 추가", no_games: "등록된 게임이 없습니다.",
    no_links: "설정된 링크가 없습니다.", all: "전체", setup_needed: "백엔드가 아직 설정되지 않았습니다. config.js를 입력하세요(README 참고).",
    error: "오류가 발생했습니다. 다시 시도하세요.",
    cat_action: "액션", cat_adventure: "어드벤처", cat_racing: "레이싱", cat_sports: "스포츠", cat_horror: "공포",
    cat_shooting: "슈팅", cat_simulation: "시뮬레이션", cat_strategy: "전략", cat_rpg: "RPG", cat_open_world: "오픈월드",
  },
  it: {
    home: "Home", library: "Libreria", ai: "Assistente IA", admin: "Admin", search: "Cerca giochi…",
    hero_title: "Benvenuto su GAME CLUB", hero_text: "Una libreria di giochi selezionati, con requisiti di sistema, galleria e assistente IA.",
    btn_library: "Vai alla libreria", btn_ai: "Assistente IA", categories: "Categorie", featured: "In evidenza", popular: "Popolari",
    recent: "Aggiunti di recente", recommended: "Consigliati", stats: "Statistiche", activity: "Categorie principali", other_platforms: "Altre piattaforme",
    total_games: "Giochi totali", avg_rating: "Valutazione media", updates: "Ultimo aggiunto", no_games: "Nessun gioco ancora.",
    no_links: "Nessun link configurato.", all: "Tutti", setup_needed: "Backend non configurato. Compila config.js (vedi README).",
    error: "Si è verificato un errore. Riprova.",
    cat_action: "Azione", cat_adventure: "Avventura", cat_racing: "Corse", cat_sports: "Sport", cat_horror: "Horror",
    cat_shooting: "Sparatutto", cat_simulation: "Simulazione", cat_strategy: "Strategia", cat_rpg: "GdR", cat_open_world: "Mondo aperto",
  },
  hi: {
    home: "होम", library: "लाइब्रेरी", ai: "AI सहायक", admin: "प्रबंधन", search: "गेम खोजें…",
    hero_title: "GAME CLUB में आपका स्वागत है", hero_text: "चुनिंदा गेम्स की लाइब्रेरी, सिस्टम आवश्यकताएँ, गैलरी और AI सहायक।",
    btn_library: "लाइब्रेरी देखें", btn_ai: "AI सहायक", categories: "श्रेणियाँ", featured: "विशेष", popular: "लोकप्रिय",
    recent: "हाल ही में जोड़े गए", recommended: "अनुशंसित", stats: "आँकड़े", activity: "प्रमुख श्रेणियाँ", other_platforms: "अन्य प्लेटफ़ॉर्म",
    total_games: "कुल गेम्स", avg_rating: "औसत रेटिंग", updates: "नवीनतम जोड़", no_games: "अभी कोई गेम नहीं है।",
    no_links: "कोई लिंक सेट नहीं है।", all: "सभी", setup_needed: "बैकएंड अभी सेट नहीं है। config.js भरें (README देखें)।",
    error: "कुछ गड़बड़ हुई। फिर से कोशिश करें।",
    cat_action: "एक्शन", cat_adventure: "एडवेंचर", cat_racing: "रेसिंग", cat_sports: "स्पोर्ट्स", cat_horror: "हॉरर",
    cat_shooting: "शूटर", cat_simulation: "सिमुलेशन", cat_strategy: "स्ट्रैटेजी", cat_rpg: "RPG", cat_open_world: "ओपन वर्ल्ड",
  },
  tr: {
    home: "Ana sayfa", library: "Kütüphane", ai: "Yapay zeka asistanı", admin: "Yönetim", search: "Oyun ara…",
    hero_title: "GAME CLUB'a hoş geldiniz", hero_text: "Sistem gereksinimleri, galeri ve yapay zeka asistanıyla seçilmiş oyunlar.",
    btn_library: "Kütüphaneyi gör", btn_ai: "Yapay zeka asistanı", categories: "Kategoriler", featured: "Öne çıkan", popular: "Popüler",
    recent: "Yeni eklenenler", recommended: "Önerilenler", stats: "İstatistikler", activity: "Öne çıkan kategoriler", other_platforms: "Diğer platformlar",
    total_games: "Toplam oyun", avg_rating: "Ortalama puan", updates: "Son eklenen", no_games: "Henüz oyun eklenmedi.",
    no_links: "Bağlantı ayarlanmadı.", all: "Tümü", setup_needed: "Arka uç henüz yapılandırılmadı. config.js dosyasını doldurun (README).",
    error: "Bir hata oluştu. Tekrar deneyin.",
    cat_action: "Aksiyon", cat_adventure: "Macera", cat_racing: "Yarış", cat_sports: "Spor", cat_horror: "Korku",
    cat_shooting: "Nişancı", cat_simulation: "Simülasyon", cat_strategy: "Strateji", cat_rpg: "RPG", cat_open_world: "Açık dünya",
  },
  nl: {
    home: "Home", library: "Bibliotheek", ai: "AI-assistent", admin: "Beheer", search: "Zoek games…",
    hero_title: "Welkom bij GAME CLUB", hero_text: "Een zorgvuldig gekozen gamebibliotheek met systeemeisen, galerij en AI-assistent.",
    btn_library: "Bekijk bibliotheek", btn_ai: "AI-assistent", categories: "Categorieën", featured: "Uitgelicht", popular: "Populair",
    recent: "Recent toegevoegd", recommended: "Aanbevolen", stats: "Statistieken", activity: "Topcategorieën", other_platforms: "Andere platforms",
    total_games: "Games", avg_rating: "Gemiddelde score", updates: "Laatst toegevoegd", no_games: "Nog geen games.",
    no_links: "Geen links ingesteld.", all: "Alle", setup_needed: "Backend nog niet ingesteld. Vul config.js in (zie README).",
    error: "Er ging iets mis. Probeer opnieuw.",
    cat_action: "Actie", cat_adventure: "Avontuur", cat_racing: "Racen", cat_sports: "Sport", cat_horror: "Horror",
    cat_shooting: "Shooter", cat_simulation: "Simulatie", cat_strategy: "Strategie", cat_rpg: "RPG", cat_open_world: "Open wereld",
  },
  sv: {
    home: "Start", library: "Bibliotek", ai: "AI-assistent", admin: "Admin", search: "Sök spel…",
    hero_title: "Välkommen till GAME CLUB", hero_text: "Ett utvalt spelbibliotek med systemkrav, galleri och AI-assistent.",
    btn_library: "Visa biblioteket", btn_ai: "AI-assistent", categories: "Kategorier", featured: "Utvalda", popular: "Populära",
    recent: "Nyligen tillagda", recommended: "Rekommenderade", stats: "Statistik", activity: "Största kategorier", other_platforms: "Andra plattformar",
    total_games: "Spel totalt", avg_rating: "Genomsnittligt betyg", updates: "Senast tillagd", no_games: "Inga spel ännu.",
    no_links: "Inga länkar inställda.", all: "Alla", setup_needed: "Backend är inte konfigurerad. Fyll i config.js (se README).",
    error: "Något gick fel. Försök igen.",
    cat_action: "Action", cat_adventure: "Äventyr", cat_racing: "Racing", cat_sports: "Sport", cat_horror: "Skräck",
    cat_shooting: "Skjutspel", cat_simulation: "Simulering", cat_strategy: "Strategi", cat_rpg: "RPG", cat_open_world: "Öppen värld",
  },
  pl: {
    home: "Start", library: "Biblioteka", ai: "Asystent AI", admin: "Panel", search: "Szukaj gier…",
    hero_title: "Witamy w GAME CLUB", hero_text: "Wyselekcjonowana biblioteka gier z wymaganiami sprzętowymi, galerią i asystentem AI.",
    btn_library: "Przeglądaj bibliotekę", btn_ai: "Asystent AI", categories: "Kategorie", featured: "Polecane", popular: "Popularne",
    recent: "Ostatnio dodane", recommended: "Rekomendowane", stats: "Statystyki", activity: "Najliczniejsze kategorie", other_platforms: "Inne platformy",
    total_games: "Gier", avg_rating: "Średnia ocena", updates: "Ostatnio dodane", no_games: "Brak gier.",
    no_links: "Nie ustawiono linków.", all: "Wszystkie", setup_needed: "Backend nie jest skonfigurowany. Uzupełnij config.js (zobacz README).",
    error: "Wystąpił błąd. Spróbuj ponownie.",
    cat_action: "Akcja", cat_adventure: "Przygodowe", cat_racing: "Wyścigi", cat_sports: "Sportowe", cat_horror: "Horror",
    cat_shooting: "Strzelanka", cat_simulation: "Symulacja", cat_strategy: "Strategia", cat_rpg: "RPG", cat_open_world: "Otwarty świat",
  },
  id: {
    home: "Beranda", library: "Pustaka", ai: "Asisten AI", admin: "Admin", search: "Cari game…",
    hero_title: "Selamat datang di GAME CLUB", hero_text: "Pustaka game pilihan dengan persyaratan sistem, galeri, dan asisten AI.",
    btn_library: "Lihat pustaka", btn_ai: "Asisten AI", categories: "Kategori", featured: "Unggulan", popular: "Populer",
    recent: "Baru ditambahkan", recommended: "Rekomendasi", stats: "Statistik", activity: "Kategori teratas", other_platforms: "Platform lainnya",
    total_games: "Total game", avg_rating: "Rata-rata rating", updates: "Terbaru ditambahkan", no_games: "Belum ada game.",
    no_links: "Belum ada tautan.", all: "Semua", setup_needed: "Backend belum dikonfigurasi. Isi config.js (lihat README).",
    error: "Terjadi kesalahan. Coba lagi.",
    cat_action: "Aksi", cat_adventure: "Petualangan", cat_racing: "Balap", cat_sports: "Olahraga", cat_horror: "Horor",
    cat_shooting: "Penembak", cat_simulation: "Simulasi", cat_strategy: "Strategi", cat_rpg: "RPG", cat_open_world: "Dunia terbuka",
  },
  th: {
    home: "หน้าแรก", library: "คลังเกม", ai: "ผู้ช่วย AI", admin: "จัดการ", search: "ค้นหาเกม…",
    hero_title: "ยินดีต้อนรับสู่ GAME CLUB", hero_text: "คลังเกมคัดสรรพร้อมความต้องการของระบบ แกลเลอรี และผู้ช่วย AI",
    btn_library: "ดูคลังเกม", btn_ai: "ผู้ช่วย AI", categories: "หมวดหมู่", featured: "เกมแนะนำ", popular: "ยอดนิยม",
    recent: "เพิ่มล่าสุด", recommended: "แนะนำให้คุณ", stats: "สถิติ", activity: "หมวดหมู่หลัก", other_platforms: "แพลตฟอร์มอื่น",
    total_games: "จำนวนเกม", avg_rating: "คะแนนเฉลี่ย", updates: "เพิ่มล่าสุด", no_games: "ยังไม่มีเกม",
    no_links: "ยังไม่ได้ตั้งค่าลิงก์", all: "ทั้งหมด", setup_needed: "ยังไม่ได้ตั้งค่าแบ็กเอนด์ กรุณากรอก config.js (ดู README)",
    error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
    cat_action: "แอคชัน", cat_adventure: "ผจญภัย", cat_racing: "แข่งรถ", cat_sports: "กีฬา", cat_horror: "สยองขวัญ",
    cat_shooting: "ยิงปืน", cat_simulation: "จำลอง", cat_strategy: "วางแผน", cat_rpg: "RPG", cat_open_world: "โลกเปิด",
  },
  vi: {
    home: "Trang chủ", library: "Thư viện", ai: "Trợ lý AI", admin: "Quản trị", search: "Tìm trò chơi…",
    hero_title: "Chào mừng đến GAME CLUB", hero_text: "Thư viện trò chơi chọn lọc, kèm cấu hình yêu cầu, thư viện ảnh và trợ lý AI.",
    btn_library: "Xem thư viện", btn_ai: "Trợ lý AI", categories: "Thể loại", featured: "Nổi bật", popular: "Phổ biến",
    recent: "Mới thêm", recommended: "Đề xuất", stats: "Thống kê", activity: "Thể loại hàng đầu", other_platforms: "Nền tảng khác",
    total_games: "Tổng số game", avg_rating: "Điểm trung bình", updates: "Mới thêm gần nhất", no_games: "Chưa có trò chơi nào.",
    no_links: "Chưa thiết lập liên kết.", all: "Tất cả", setup_needed: "Backend chưa được cấu hình. Hãy điền config.js (xem README).",
    error: "Đã xảy ra lỗi. Vui lòng thử lại.",
    cat_action: "Hành động", cat_adventure: "Phiêu lưu", cat_racing: "Đua xe", cat_sports: "Thể thao", cat_horror: "Kinh dị",
    cat_shooting: "Bắn súng", cat_simulation: "Mô phỏng", cat_strategy: "Chiến thuật", cat_rpg: "RPG", cat_open_world: "Thế giới mở",
  },
  uk: {
    home: "Головна", library: "Бібліотека", ai: "ШІ-асистент", admin: "Адмін", search: "Пошук ігор…",
    hero_title: "Ласкаво просимо до GAME CLUB", hero_text: "Добірна бібліотека ігор із системними вимогами, галереєю та ШІ-асистентом.",
    btn_library: "Переглянути бібліотеку", btn_ai: "ШІ-асистент", categories: "Категорії", featured: "Рекомендовані", popular: "Популярні",
    recent: "Нещодавно додані", recommended: "Рекомендації", stats: "Статистика", activity: "Найбільші категорії", other_platforms: "Інші платформи",
    total_games: "Ігор", avg_rating: "Середній рейтинг", updates: "Останні додані", no_games: "Ігор ще немає.",
    no_links: "Посилання не налаштовано.", all: "Усі", setup_needed: "Бекенд не налаштовано. Заповніть config.js (див. README).",
    error: "Сталася помилка. Спробуйте ще раз.",
    cat_action: "Екшн", cat_adventure: "Пригоди", cat_racing: "Перегони", cat_sports: "Спорт", cat_horror: "Жахи",
    cat_shooting: "Шутер", cat_simulation: "Симулятор", cat_strategy: "Стратегія", cat_rpg: "RPG", cat_open_world: "Відкритий світ",
  },
  el: {
    home: "Αρχική", library: "Βιβλιοθήκη", ai: "Βοηθός AI", admin: "Διαχείριση", search: "Αναζήτηση παιχνιδιών…",
    hero_title: "Καλώς ήρθατε στο GAME CLUB", hero_text: "Επιλεγμένη βιβλιοθήκη παιχνιδιών με απαιτήσεις συστήματος, γκαλερί και βοηθό AI.",
    btn_library: "Δείτε τη βιβλιοθήκη", btn_ai: "Βοηθός AI", categories: "Κατηγορίες", featured: "Επιλεγμένα", popular: "Δημοφιλή",
    recent: "Πρόσφατα προστέθηκαν", recommended: "Προτεινόμενα", stats: "Στατιστικά", activity: "Κορυφαίες κατηγορίες", other_platforms: "Άλλες πλατφόρμες",
    total_games: "Παιχνίδια", avg_rating: "Μέση βαθμολογία", updates: "Τελευταία προσθήκη", no_games: "Δεν υπάρχουν παιχνίδια ακόμη.",
    no_links: "Δεν έχουν οριστεί σύνδεσμοι.", all: "Όλα", setup_needed: "Το backend δεν έχει ρυθμιστεί. Συμπληρώστε το config.js (δείτε το README).",
    error: "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.",
    cat_action: "Δράση", cat_adventure: "Περιπέτεια", cat_racing: "Αγώνες", cat_sports: "Αθλητικά", cat_horror: "Τρόμου",
    cat_shooting: "Σκοποβολής", cat_simulation: "Προσομοίωση", cat_strategy: "Στρατηγική", cat_rpg: "RPG", cat_open_world: "Ανοιχτός κόσμος",
  },
  he: {
    home: "בית", library: "ספרייה", ai: "עוזר AI", admin: "ניהול", search: "חיפוש משחקים…",
    hero_title: "ברוכים הבאים ל-GAME CLUB", hero_text: "ספריית משחקים נבחרת עם דרישות מערכת, גלריה ועוזר בינה מלאכותית.",
    btn_library: "לספרייה", btn_ai: "עוזר AI", categories: "קטגוריות", featured: "מומלצים", popular: "פופולריים",
    recent: "נוספו לאחרונה", recommended: "מוצעים לך", stats: "סטטיסטיקה", activity: "הקטגוריות המובילות", other_platforms: "פלטפורמות נוספות",
    total_games: "משחקים", avg_rating: "דירוג ממוצע", updates: "נוסף לאחרונה", no_games: "עדיין אין משחקים.",
    no_links: "לא הוגדרו קישורים.", all: "הכול", setup_needed: "הבק-אנד לא הוגדר. מלאו את config.js (ראו README).",
    error: "אירעה שגיאה. נסו שוב.",
    cat_action: "אקשן", cat_adventure: "הרפתקאות", cat_racing: "מירוץ", cat_sports: "ספורט", cat_horror: "אימה",
    cat_shooting: "יריות", cat_simulation: "סימולציה", cat_strategy: "אסטרטגיה", cat_rpg: "RPG", cat_open_world: "עולם פתוח",
  },
  bn: {
    home: "হোম", library: "লাইব্রেরি", ai: "এআই সহকারী", admin: "অ্যাডমিন", search: "গেম খুঁজুন…",
    hero_title: "GAME CLUB-এ স্বাগতম", hero_text: "বাছাই করা গেমের লাইব্রেরি, সিস্টেম প্রয়োজনীয়তা, গ্যালারি ও এআই সহকারী।",
    btn_library: "লাইব্রেরি দেখুন", btn_ai: "এআই সহকারী", categories: "ক্যাটাগরি", featured: "বিশেষ", popular: "জনপ্রিয়",
    recent: "সম্প্রতি যোগ হয়েছে", recommended: "প্রস্তাবিত", stats: "পরিসংখ্যান", activity: "শীর্ষ ক্যাটাগরি", other_platforms: "অন্যান্য প্ল্যাটফর্ম",
    total_games: "মোট গেম", avg_rating: "গড় রেটিং", updates: "সর্বশেষ যোগ", no_games: "এখনো কোনো গেম নেই।",
    no_links: "কোনো লিংক সেট করা হয়নি।", all: "সব", setup_needed: "ব্যাকএন্ড কনফিগার করা হয়নি। config.js পূরণ করুন (README দেখুন)।",
    error: "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    cat_action: "অ্যাকশন", cat_adventure: "অ্যাডভেঞ্চার", cat_racing: "রেসিং", cat_sports: "স্পোর্টস", cat_horror: "হরর",
    cat_shooting: "শুটার", cat_simulation: "সিমুলেশন", cat_strategy: "স্ট্র্যাটেজি", cat_rpg: "আরপিজি", cat_open_world: "ওপেন ওয়ার্ল্ড",
  },
  ur: {
    home: "ہوم", library: "لائبریری", ai: "اے آئی اسسٹنٹ", admin: "انتظام", search: "گیمز تلاش کریں…",
    hero_title: "GAME CLUB میں خوش آمدید", hero_text: "منتخب گیمز کی لائبریری، سسٹم کی ضروریات، گیلری اور اے آئی اسسٹنٹ کے ساتھ۔",
    btn_library: "لائبریری دیکھیں", btn_ai: "اے آئی اسسٹنٹ", categories: "زمرے", featured: "نمایاں", popular: "مقبول",
    recent: "حال ہی میں شامل", recommended: "تجویز کردہ", stats: "اعداد و شمار", activity: "نمایاں زمرے", other_platforms: "دیگر پلیٹ فارمز",
    total_games: "کل گیمز", avg_rating: "اوسط ریٹنگ", updates: "حال ہی میں شامل", no_games: "ابھی کوئی گیم شامل نہیں۔",
    no_links: "کوئی لنک ترتیب نہیں دیا گیا۔", all: "تمام", setup_needed: "بیک اینڈ ابھی ترتیب نہیں دیا گیا۔ config.js بھریں (README دیکھیں)۔",
    error: "کوئی خرابی ہوئی۔ دوبارہ کوشش کریں۔",
    cat_action: "ایکشن", cat_adventure: "ایڈونچر", cat_racing: "ریسنگ", cat_sports: "اسپورٹس", cat_horror: "ہارر",
    cat_shooting: "شوٹر", cat_simulation: "سمولیشن", cat_strategy: "حکمت عملی", cat_rpg: "آر پی جی", cat_open_world: "اوپن ورلڈ",
  },
};

const LANG = (() => {
  try {
    const saved = localStorage.getItem("gc_lang");
    return STRINGS[saved] ? saved : "fa";
  } catch (e) {
    return "fa";
  }
})();

function t(key) {
  return (STRINGS[LANG] && STRINGS[LANG][key]) || STRINGS.fa[key] || key;
}

function setLang(code) {
  if (!STRINGS[code]) return;
  try { localStorage.setItem("gc_lang", code); } catch (e) {}
  location.reload();
}

function applyI18n() {
  const meta = LANGS.find((l) => l.code === LANG);
  document.documentElement.lang = LANG;
  document.documentElement.dir = meta.dir;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
}

document.addEventListener("DOMContentLoaded", applyI18n);
