// MediCare — shared app script. Header/footer injection, cart store, WhatsApp helper.
window.PHARMACY_CONFIG = window.PHARMACY_CONFIG || {
  name: 'MediCare Pharmacy', short: 'MediCare', tagline: 'Your trusted neighbourhood pharmacy',
  whatsapp: '919876543210', phone: '+91 98765 43210', email: 'hello@medicarepatna.in',
  address: '123 Boring Road, Patna, Bihar 800001', hours: '8 AM – 11 PM · Open 7 days',
  radius: '5 km', maps: 'https://www.google.com/maps?q=Boring+Road+Patna&output=embed',
  license: 'DL No. BR-12345/AB · GSTIN 10ABCDE1234F1Z5'
};
const CFG = window.PHARMACY_CONFIG;
const PAGE = document.body.dataset.page || 'home';
const PAGE_FILE = (PAGE === 'home' ? 'index' : PAGE) + '.html';

function navHTML() {
  const L = (h, t) => '<a href="' + h + '" class="' + (PAGE_FILE === h ? 'is-active' : '') + '">' + t + '</a>';
  return '<header class="nav" id="nav"><div class="container nav__inner"><a href="index.html" class="brand" aria-label="' + CFG.name + ' home"><span class="brand__mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span><span class="brand__name">' + CFG.short + '</span></a>'
  + '<nav class="nav__links" aria-label="Primary">' + L('medicines.html','Medicines') + L('prescription.html','Prescription') + L('delivery.html','Delivery') + L('about.html','About') + L('contact.html','Contact') + '</nav>'
  + '<a href="cart.html" class="cart-btn" aria-label="View cart"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.5L22 8H6"/><circle cx="10" cy="21" r="1.5" fill="currentColor"/><circle cx="18" cy="21" r="1.5" fill="currentColor"/></svg><span class="cart-count" id="cartCount">0</span></a>'
  + '<a class="btn btn--primary nav__cta" data-action="whatsapp" href="#">Order</a>'
  + '<button class="nav__toggle" aria-label="Open menu" id="navToggle"><span></span><span></span><span></span></button>'
  + '</div></header>';
}
function footerHTML() {
  return '<footer class="footer"><div class="container footer__inner">'
  + '<div><span class="brand"><span class="brand__mark"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span><span class="brand__name">' + CFG.name + '</span></span>'
  + '<p class="footer__note">' + CFG.tagline + '<br>' + CFG.license + '</p>'
  + '<p class="footer__note">' + CFG.address + '<br>' + CFG.hours + '</p></div>'
  + '<div class="footer__cols"><div><h4>Shop</h4><a href="medicines.html">Medicines</a><a href="prescription.html">Prescription</a><a href="cart.html">Cart</a></div>'
  + '<div><h4>Help</h4><a href="delivery.html">Delivery</a><a href="contact.html">Contact</a><a href="about.html">About us</a></div>'
  + '<div><h4>Contact</h4><a href="tel:' + CFG.phone.replace(/\s/g,'') + '">' + CFG.phone + '</a><a href="#" data-action="whatsapp">WhatsApp</a><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></div></div>'
  + '</div><div class="container footer__base"><small>© ' + new Date().getFullYear() + ' ' + CFG.name + '. Made with care in Patna 🇮🇳</small></div></footer>';
}
const hs = document.querySelector('[data-header]'); if (hs) hs.outerHTML = navHTML();
const fs = document.querySelector('[data-footer]'); if (fs) fs.outerHTML = footerHTML();

document.querySelectorAll('[data-bind]').forEach(el => { const k = el.dataset.bind; if (CFG[k]) el.textContent = CFG[k]; });
if (document.body.dataset.title) document.title = document.body.dataset.title + ' · ' + CFG.name;

window.waUrl = function (msg) {
  return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg || ('Hi ' + CFG.name + ', I would like to place an order.'));
};
window.bindWhatsapp = function (root) {
  (root || document).querySelectorAll('[data-action="whatsapp"]').forEach(el => {
    if (el.dataset.waBound) return; el.dataset.waBound = '1';
    el.addEventListener('click', e => { e.preventDefault(); window.open(window.waUrl(el.dataset.message), '_blank', 'noopener'); });
  });
};
window.bindWhatsapp();

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

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
