// MediCare — shared app script (with inline i18n so every page works).
(function applyThemeEarly() {
  let pref = 'auto';
  try { pref = localStorage.getItem('medicare:theme') || 'auto'; } catch (e) {}
  let theme = pref;
  if (pref === 'auto') theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-theme-pref', pref);
})();

// ===== i18n =====
window.I18N = {
  en: {
    lang_toggle_to: 'हि', theme_label: 'Theme',
    nav_medicines: 'Medicines', nav_prescription: 'Prescription', nav_delivery: 'Delivery',
    nav_about: 'About', nav_contact: 'Contact', nav_order: 'Order', nav_cart: 'Cart', nav_admin: 'Admin',
    open_now: 'Open now · 8 AM – 11 PM',
    home_h1_a: 'Medicines delivered to your door in', home_h1_b: 'under 30 minutes', home_h1_c: '.',
    home_lede: 'Search 5,000+ medicines, upload your prescription, and order on WhatsApp. Free home delivery within 5 km across Patna.',
    cta_browse: 'Browse medicines', cta_order_wa: 'Order on WhatsApp', cta_chat_wa: 'Chat on WhatsApp',
    trust_genuine: 'Genuine medicines', trust_fast: 'Average delivery', trust_rating: '1,200+ happy customers',
    quick_h: 'Quick order', free_delivery: 'Free delivery',
    quick_med: 'Medicine name', quick_qty: 'Quantity', quick_area: 'Delivery area',
    quick_btn: 'Send order on WhatsApp', quick_note: 'No app needed. We confirm within 5 minutes.',
    strip_licensed: 'Licensed pharmacists', strip_pay: 'Cash or UPI on delivery',
    strip_refill: 'Refill reminders', strip_priv: 'Prescription privacy',
    best_sellers: 'Best sellers', popular_h: 'Popular this week',
    popular_p: 'Most-ordered medicines by our neighbours in Patna.',
    see_all: 'See all medicines →',
    rx_eye: 'Prescription', rx_h: 'Snap. Send. Done.',
    rx_p: "Click a photo of your doctor's prescription. We'll read it, confirm the medicines, and deliver to your door — usually within 30 minutes.",
    rx_step1: 'Click a photo of the prescription', rx_step2: 'Send it on WhatsApp — we reply in 5 minutes',
    rx_step3: 'Pay on delivery (Cash / UPI)', rx_upload: 'Upload prescription',
    why_eye: 'Why us', why_h: 'Free, fast, and tracked',
    why_p: 'Delivery riders in every neighbourhood. Live updates from store to door.',
    f1_h: 'Under 30 minutes', f1_p: 'Average delivery time across 5 km from our store.',
    f2_h: 'Cash or UPI', f2_p: 'Pay your way — UPI, cash, or card on delivery.',
    f3_h: 'Refill reminders', f3_p: "Monthly medicines? We'll WhatsApp you before you run out.",
    f4_h: 'Private & safe', f4_p: 'Prescriptions stored securely. Discreet packaging.',
    rev_eye: 'Reviews', rev_h: 'Trusted by 1,200+ neighbours',
    rev_1: '"Got my mother\'s BP medicines at 10 PM. Delivered in 22 minutes. Amazing service."',
    rev_1_c: '— Rohit S., Boring Road',
    rev_2: '"WhatsApp ordering is so easy. They even remind me before my dad\'s diabetes refill runs out."',
    rev_2_c: '— Priya K., Rajendra Nagar',
    rev_3: '"Prices are same as the shop, but I don\'t have to step out. Highly recommend."',
    rev_3_c: '— Anil G., Kankarbagh',
    cta_band_h: 'Need something now?', cta_band_p: 'Send us a WhatsApp message. We reply within 5 minutes.',
    foot_shop: 'Shop', foot_help: 'Help', foot_contact: 'Contact', foot_made: 'Made with care in Patna 🇮🇳',
    add: 'Add', added: 'Added ✓',
    cat_all: 'All', cat_pain: 'Pain Relief', cat_diabetes: 'Diabetes', cat_heart: 'Heart',
    cat_vitamins: 'Vitamins', cat_cold: 'Cold & Cough', cat_antibiotic: 'Antibiotic',
    cat_digestive: 'Digestive', cat_allergy: 'Allergy', cat_first_aid: 'First Aid'
  },
  hi: {
    lang_toggle_to: 'EN', theme_label: 'थीम',
    nav_medicines: 'दवाइयाँ', nav_prescription: 'पर्ची', nav_delivery: 'डिलीवरी',
    nav_about: 'हमारे बारे में', nav_contact: 'संपर्क', nav_order: 'ऑर्डर', nav_cart: 'कार्ट', nav_admin: 'एडमिन',
    open_now: 'अभी खुले · सुबह 8 – रात 11',
    home_h1_a: 'आपकी दवाइयाँ घर पर', home_h1_b: '30 मिनट से कम में', home_h1_c: '।',
    home_lede: '5,000+ दवाइयाँ खोजें, अपनी पर्ची भेजें और WhatsApp पर ऑर्डर करें। पटना में 5 किमी के भीतर मुफ़्त होम डिलीवरी।',
    cta_browse: 'दवाइयाँ देखें', cta_order_wa: 'WhatsApp पर ऑर्डर करें', cta_chat_wa: 'WhatsApp पर बात करें',
    trust_genuine: 'असली दवाइयाँ', trust_fast: 'औसत डिलीवरी समय', trust_rating: '1,200+ संतुष्ट ग्राहक',
    quick_h: 'तुरंत ऑर्डर', free_delivery: 'मुफ़्त डिलीवरी',
    quick_med: 'दवा का नाम', quick_qty: 'मात्रा', quick_area: 'डिलीवरी क्षेत्र',
    quick_btn: 'WhatsApp पर ऑर्डर भेजें', quick_note: 'किसी ऐप की ज़रूरत नहीं। हम 5 मिनट में पुष्टि करते हैं।',
    strip_licensed: 'पंजीकृत फार्मासिस्ट', strip_pay: 'डिलीवरी पर नकद या UPI',
    strip_refill: 'रिफिल रिमाइंडर', strip_priv: 'पर्ची की गोपनीयता',
    best_sellers: 'बेस्ट सेलर', popular_h: 'इस हफ़्ते लोकप्रिय',
    popular_p: 'पटना में हमारे पड़ोसियों द्वारा सबसे ज़्यादा ऑर्डर की गई दवाइयाँ।',
    see_all: 'सभी दवाइयाँ देखें →',
    rx_eye: 'पर्ची', rx_h: 'फोटो लें। भेजें। हो गया।',
    rx_p: 'अपने डॉक्टर की पर्ची की फोटो लें। हम पढ़कर दवाइयों की पुष्टि करते हैं और 30 मिनट में डिलीवर करते हैं।',
    rx_step1: 'पर्ची की फोटो लें', rx_step2: 'WhatsApp पर भेजें — हम 5 मिनट में जवाब देंगे',
    rx_step3: 'डिलीवरी पर भुगतान (नकद / UPI)', rx_upload: 'पर्ची अपलोड करें',
    why_eye: 'हम क्यों', why_h: 'मुफ़्त, तेज़, और ट्रैक करने योग्य',
    why_p: 'हर इलाक़े में डिलीवरी राइडर। दुकान से दरवाज़े तक लाइव अपडेट।',
    f1_h: '30 मिनट के अंदर', f1_p: 'हमारी दुकान से 5 किमी में औसत डिलीवरी समय।',
    f2_h: 'नकद या UPI', f2_p: 'अपनी मर्ज़ी से भुगतान — UPI, नकद, या कार्ड।',
    f3_h: 'रिफिल रिमाइंडर', f3_p: 'मासिक दवाइयाँ? हम ख़त्म होने से पहले WhatsApp करेंगे।',
    f4_h: 'निजी और सुरक्षित', f4_p: 'पर्चियाँ सुरक्षित रखी जाती हैं। पैकेजिंग discreet होती है।',
    rev_eye: 'समीक्षाएँ', rev_h: '1,200+ पड़ोसियों का भरोसा',
    rev_1: '"रात 10 बजे माँ की BP दवा 22 मिनट में मिल गई। शानदार सेवा।"',
    rev_1_c: '— रोहित एस., बोरिंग रोड',
    rev_2: '"WhatsApp ऑर्डर बहुत आसान है। डायबिटीज़ की रिफिल भी याद दिलाते हैं।"',
    rev_2_c: '— प्रिया के., राजेंद्र नगर',
    rev_3: '"दाम दुकान जैसा ही, पर घर बैठे मिलता है। बहुत बढ़िया।"',
    rev_3_c: '— अनिल जी., कंकड़बाग',
    cta_band_h: 'अभी कुछ चाहिए?', cta_band_p: 'WhatsApp पर संदेश भेजें। हम 5 मिनट में जवाब देंगे।',
    foot_shop: 'शॉप', foot_help: 'सहायता', foot_contact: 'संपर्क', foot_made: 'पटना में बनाया गया 🇮🇳',
    add: 'जोड़ें', added: 'जोड़ा ✓',
    cat_all: 'सभी', cat_pain: 'दर्द निवारक', cat_diabetes: 'मधुमेह', cat_heart: 'हृदय',
    cat_vitamins: 'विटामिन', cat_cold: 'सर्दी–खांसी', cat_antibiotic: 'एंटीबायोटिक',
    cat_digestive: 'पाचन', cat_allergy: 'एलर्जी', cat_first_aid: 'फर्स्ट एड'
  }
};
window.LANG = (function () { try { return localStorage.getItem('medicare:lang') || (navigator.language && navigator.language.startsWith('hi') ? 'hi' : 'en'); } catch (e) { return 'en'; } })();
window.t = function (k) { const d = window.I18N[window.LANG] || window.I18N.en; return d[k] != null ? d[k] : (window.I18N.en[k] != null ? window.I18N.en[k] : k); };
window.applyI18n = function (root) {
  (root || document).querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (k) el.textContent = window.t(k); });
  (root || document).querySelectorAll('[data-i18n-ph]').forEach(el => { const k = el.dataset.i18nPh; if (k) el.setAttribute('placeholder', window.t(k)); });
  document.documentElement.setAttribute('lang', window.LANG);
};
window.setLang = function (lang) { window.LANG = lang; try { localStorage.setItem('medicare:lang', lang); } catch (e) {} location.reload(); };

window.PHARMACY_CONFIG = window.PHARMACY_CONFIG || {
  name: 'MediCare Pharmacy', short: 'MediCare', tagline: 'Your trusted neighbourhood pharmacy',
  whatsapp: '919876543210', phone: '+91 98765 43210', email: 'hello@medicarepatna.in',
  address: '123 Boring Road, Patna, Bihar 800001', hours: '8 AM – 11 PM · Open 7 days',
  radius: '5 km', maps: 'https://www.google.com/maps?q=Boring+Road+Patna&output=embed',
  license: 'DL No. BR-12345/AB · GSTIN 10ABCDE1234F1Z5',
  adminPassword: 'admin123'
};
const CFG = window.PHARMACY_CONFIG;
const PAGE = document.body.dataset.page || 'home';
const PAGE_FILE = (PAGE === 'home' ? 'index' : PAGE) + '.html';
const T = window.t;

function navHTML() {
  const L = (h, k) => '<a href="' + h + '" class="' + (PAGE_FILE === h ? 'is-active' : '') + '">' + T(k) + '</a>';
  return '<header class="nav" id="nav"><div class="container nav__inner"><a href="index.html" class="brand" aria-label="' + CFG.name + ' home"><span class="brand__mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span><span class="brand__name">' + CFG.short + '</span></a>'
  + '<nav class="nav__links" aria-label="Primary">' + L('medicines.html','nav_medicines') + L('prescription.html','nav_prescription') + L('delivery.html','nav_delivery') + L('about.html','nav_about') + L('contact.html','nav_contact') + '</nav>'
  + '<div class="nav__tools">'
  + '<button class="icon-btn" id="themeBtn" aria-label="Toggle theme" title="Toggle theme"><svg class="i-sun" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="7" y2="7"/><line x1="17" y1="17" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="7" y2="17"/><line x1="17" y1="7" x2="19.1" y2="4.9"/></g></svg><svg class="i-moon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10Z"/></svg></button>'
  + '<button class="lang-btn" id="langBtn" aria-label="Switch language">' + T('lang_toggle_to') + '</button>'
  + '<a href="cart.html" class="cart-btn" aria-label="' + T('nav_cart') + '"><svg viewBox="0 0 24 24" width="18" height="18"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.5L22 8H6"/><circle cx="10" cy="21" r="1.5" fill="currentColor"/><circle cx="18" cy="21" r="1.5" fill="currentColor"/></svg><span class="cart-count" id="cartCount">0</span></a>'
  + '<a class="btn btn--primary nav__cta" data-action="whatsapp" href="#">' + T('nav_order') + '</a>'
  + '</div>'
  + '<button class="nav__toggle" aria-label="Open menu" id="navToggle"><span></span><span></span><span></span></button>'
  + '</div></header>';
}
function footerHTML() {
  return '<footer class="footer"><div class="container footer__inner">'
  + '<div><span class="brand"><span class="brand__mark"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span><span class="brand__name">' + CFG.name + '</span></span>'
  + '<p class="footer__note">' + CFG.tagline + '<br>' + CFG.license + '</p>'
  + '<p class="footer__note">' + CFG.address + '<br>' + CFG.hours + '</p></div>'
  + '<div class="footer__cols"><div><h4>' + T('foot_shop') + '</h4><a href="medicines.html">' + T('nav_medicines') + '</a><a href="prescription.html">' + T('nav_prescription') + '</a><a href="cart.html">' + T('nav_cart') + '</a></div>'
  + '<div><h4>' + T('foot_help') + '</h4><a href="delivery.html">' + T('nav_delivery') + '</a><a href="contact.html">' + T('nav_contact') + '</a><a href="about.html">' + T('nav_about') + '</a></div>'
  + '<div><h4>' + T('foot_contact') + '</h4><a href="tel:' + CFG.phone.replace(/\s/g,'') + '">' + CFG.phone + '</a><a href="#" data-action="whatsapp">WhatsApp</a><a href="mailto:' + CFG.email + '">' + CFG.email + '</a><a href="admin.html">' + T('nav_admin') + '</a></div></div>'
  + '</div><div class="container footer__base"><small>© ' + new Date().getFullYear() + ' ' + CFG.name + '. ' + T('foot_made') + '</small></div></footer>';
}
const hs = document.querySelector('[data-header]'); if (hs) hs.outerHTML = navHTML();
const fs = document.querySelector('[data-footer]'); if (fs) fs.outerHTML = footerHTML();
window.applyI18n();

document.querySelectorAll('[data-bind]').forEach(el => { const k = el.dataset.bind; if (CFG[k]) el.textContent = CFG[k]; });
if (document.body.dataset.title) document.title = document.body.dataset.title + ' · ' + CFG.name;

window.waUrl = function (msg) { return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg || ('Hi ' + CFG.name + ', I would like to place an order.')); };
window.bindWhatsapp = function (root) {
  (root || document).querySelectorAll('[data-action="whatsapp"]').forEach(el => {
    if (el.dataset.waBound) return; el.dataset.waBound = '1';
    el.addEventListener('click', e => { e.preventDefault(); window.open(window.waUrl(el.dataset.message), '_blank', 'noopener'); });
  });
};
window.bindWhatsapp();

const tb = document.getElementById('themeBtn');
if (tb) tb.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme-pref') || 'auto';
  const order = { light: 'dark', dark: 'auto', auto: 'light' };
  const next = order[cur] || 'light';
  try { localStorage.setItem('medicare:theme', next); } catch (e) {}
  let theme = next;
  if (next === 'auto') theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-theme-pref', next);
});
const lb = document.getElementById('langBtn');
if (lb) lb.addEventListener('click', () => window.setLang(window.LANG === 'hi' ? 'en' : 'hi'));

(function navSetup() {
  const nav = document.getElementById('nav'); if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
  const t = document.getElementById('navToggle'); if (t) t.addEventListener('click', () => nav.classList.toggle('is-open'));
  nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));
})();

const CART_KEY = 'medicare:cart:v1';
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } },
  save(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); updateBadge(); document.dispatchEvent(new CustomEvent('cart:change')); },
  add(m, qty) { qty = qty || 1; const it = Cart.get(); const i = it.findIndex(x => x.name === m.name); if (i >= 0) it[i].qty += qty; else it.push({ name: m.name, salt: m.salt, pack: m.pack, price: m.price, qty: qty }); Cart.save(it); },
  setQty(n, q) { Cart.save(Cart.get().map(i => i.name === n ? Object.assign({}, i, { qty: Math.max(1, q) }) : i)); },
  remove(n) { Cart.save(Cart.get().filter(i => i.name !== n)); },
  clear() { Cart.save([]); },
  count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
  total() { return Cart.get().reduce((s, i) => s + i.qty * i.price, 0); }
};
window.Cart = Cart;
function updateBadge() { const el = document.getElementById('cartCount'); if (el) { const c = Cart.count(); el.textContent = c; el.classList.toggle('is-empty', c === 0); } }
updateBadge();
window.addEventListener('storage', e => { if (e.key === CART_KEY) updateBadge(); });

const ORDERS_KEY = 'medicare:orders:v1';
window.Orders = {
  all() { try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch (e) { return []; } },
  save(orders) { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); document.dispatchEvent(new CustomEvent('orders:change')); },
  add(o) { const all = window.Orders.all(); all.unshift(o); window.Orders.save(all); return o; },
  update(id, patch) { const all = window.Orders.all().map(o => o.id === id ? Object.assign({}, o, patch) : o); window.Orders.save(all); }
};
window.makeOrderId = function () { return 'MC-' + Math.floor(100000 + Math.random() * 900000); };
window.Inventory = {
  KEY: 'medicare:inventory:v1',
  load(fallback) { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return v || fallback || []; } catch (e) { return fallback || []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); }
};
window.Refills = {
  KEY: 'medicare:refills:v1',
  all() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); }
};
window.Admin = {
  KEY: 'medicare:admin:v1',
  isAuthed() { try { return localStorage.getItem(this.KEY) === '1'; } catch (e) { return false; } },
  login(pw) { if (pw === CFG.adminPassword) { localStorage.setItem(this.KEY, '1'); return true; } return false; },
  logout() { localStorage.removeItem(this.KEY); }
};

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
