// MediCare — shared app script.
(function applyThemeEarly() {
  let pref = 'auto';
  try { pref = localStorage.getItem('medicare:theme') || 'auto'; } catch (e) {}
  let theme = pref;
  if (pref === 'auto') theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-theme-pref', pref);
})();

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
const T = window.t || function (k) { return k; };

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
if (window.applyI18n) window.applyI18n();

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

// Theme toggle
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
if (lb && window.setLang) lb.addEventListener('click', () => window.setLang(window.LANG === 'hi' ? 'en' : 'hi'));

(function navSetup() {
  const nav = document.getElementById('nav'); if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
  const t = document.getElementById('navToggle'); if (t) t.addEventListener('click', () => nav.classList.toggle('is-open'));
  nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('is-open')));
})();

// Cart store
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

// Orders store
const ORDERS_KEY = 'medicare:orders:v1';
window.Orders = {
  all() { try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch (e) { return []; } },
  save(orders) { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); document.dispatchEvent(new CustomEvent('orders:change')); },
  add(o) { const all = window.Orders.all(); all.unshift(o); window.Orders.save(all); return o; },
  update(id, patch) { const all = window.Orders.all().map(o => o.id === id ? Object.assign({}, o, patch) : o); window.Orders.save(all); }
};
window.makeOrderId = function () { return 'MC-' + Math.floor(100000 + Math.random() * 900000); };

// Inventory + refills stores (used by admin)
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

// Admin session
window.Admin = {
  KEY: 'medicare:admin:v1',
  isAuthed() { try { return localStorage.getItem(this.KEY) === '1'; } catch (e) { return false; } },
  login(pw) { if (pw === CFG.adminPassword) { localStorage.setItem(this.KEY, '1'); return true; } return false; },
  logout() { localStorage.removeItem(this.KEY); }
};

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
