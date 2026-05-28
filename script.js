// ---------- Config from data-attributes ----------
const cfgEl = document.getElementById('site-config');
const CFG = {
  name: cfgEl.dataset.name,
  tagline: cfgEl.dataset.tagline,
  whatsapp: cfgEl.dataset.whatsapp,
  phone: cfgEl.dataset.phone,
  address: cfgEl.dataset.address,
  hours: cfgEl.dataset.hours,
  radius: cfgEl.dataset.radius,
  maps: cfgEl.dataset.maps,
};

// ---------- Bind config to [data-bind] elements ----------
document.querySelectorAll('[data-bind]').forEach(el => {
  const key = el.dataset.bind;
  if (CFG[key]) el.textContent = CFG[key];
});
document.querySelectorAll('[data-bind-href="tel"]').forEach(el => {
  el.href = `tel:${CFG.phone.replace(/\s/g,'')}`;
});

// Page title / meta tweak
document.title = `${CFG.name} — Medicines, Prescriptions & Home Delivery`;

// Map
const mapFrame = document.getElementById('mapFrame');
if (mapFrame) mapFrame.src = CFG.maps;
const dirBtn = document.getElementById('directionsBtn');
if (dirBtn) dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CFG.address)}`;

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- WhatsApp helper ----------
function waUrl(message) {
  const text = encodeURIComponent(message || `Hi ${CFG.name}, I'd like to place an order.`);
  return `https://wa.me/${CFG.whatsapp}?text=${text}`;
}

document.querySelectorAll('[data-action="whatsapp"]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const msg = el.dataset.message;
    window.open(waUrl(msg), '_blank', 'noopener');
  });
});

// Quick order form
const quickBtn = document.getElementById('quickOrderBtn');
quickBtn.addEventListener('click', () => {
  const med = document.getElementById('quickMedicine').value.trim();
  const qty = document.getElementById('quickQty').value || 1;
  const area = document.getElementById('quickArea').value.trim();
  if (!med) {
    document.getElementById('quickMedicine').focus();
    return;
  }
  const msg = `Hi ${CFG.name}, I'd like to order:\n• ${med} × ${qty}${area ? `\nDeliver to: ${area}` : ''}`;
  window.open(waUrl(msg), '_blank', 'noopener');
});

// ---------- Nav scroll + mobile menu ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('is-open'));
});

// ---------- Medicine catalog ----------
const grid = document.getElementById('medGrid');
const empty = document.getElementById('medEmpty');
const countEl = document.getElementById('searchCount');
const searchInput = document.getElementById('medSearch');
const chipBar = document.getElementById('chips');

let medicines = [];
let activeCat = 'all';

fetch('assets/medicines.json')
  .then(r => r.json())
  .then(data => {
    medicines = data;
    render();
  })
  .catch(() => {
    grid.innerHTML = '<p class="empty">Catalog could not load. Please send your order on WhatsApp.</p>';
  });

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = medicines.filter(m => {
    const matchCat = activeCat === 'all' || m.category === activeCat;
    const matchQ = !q || m.name.toLowerCase().includes(q) || (m.salt || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  countEl.textContent = `${filtered.length} result${filtered.length === 1 ? '' : 's'}`;
  empty.hidden = filtered.length > 0;
  grid.innerHTML = filtered.map(card).join('');
  grid.querySelectorAll('[data-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.order;
      const msg = `Hi ${CFG.name}, I'd like to order:\n• ${name} × 1\nPlease confirm availability and delivery time.`;
      window.open(waUrl(msg), '_blank', 'noopener');
    });
  });
}

function card(m) {
  return `
    <article class="med">
      <div class="med__top">
        <div>
          <div class="med__name">${escapeHtml(m.name)}</div>
          <p class="med__sub">${escapeHtml(m.salt || '')} ${m.pack ? `· ${escapeHtml(m.pack)}` : ''}</p>
        </div>
        <span class="med__cat">${escapeHtml(m.category)}</span>
      </div>
      <div class="med__row">
        <div class="med__price">₹${m.price}<small> /pack</small></div>
        <button class="med__btn" data-order="${escapeAttr(m.name)}">Order</button>
      </div>
    </article>
  `;
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function escapeAttr(s = '') { return escapeHtml(s); }

searchInput.addEventListener('input', render);
chipBar.addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  activeCat = btn.dataset.cat;
  chipBar.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === btn));
  render();
});
