// MediCare — page dispatcher.
const P = document.body.dataset.page || 'home';
const _T = window.t || function (k) { return k; };
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
let MEDS = null;
function catKey(c) { return ({ 'Pain Relief':'cat_pain','Diabetes':'cat_diabetes','Heart':'cat_heart','Vitamins':'cat_vitamins','Cold & Cough':'cat_cold','Antibiotic':'cat_antibiotic','Digestive':'cat_digestive','Allergy':'cat_allergy','First Aid':'cat_first_aid' })[c]; }
function catLabel(c) { const k = catKey(c); return k ? _T(k) : c; }
function loadMeds() {
  if (MEDS) return Promise.resolve(MEDS);
  const inv = window.Inventory ? window.Inventory.load(null) : null;
  if (inv && Array.isArray(inv) && inv.length) { MEDS = inv; return Promise.resolve(MEDS); }
  return fetch('assets/medicines.json').then(r => r.json()).then(d => { MEDS = d; if (window.Inventory) window.Inventory.save(d); return d; });
}
function medCard(m, idx) {
  return '<article class="med"><div class="med__top"><div><div class="med__name">' + esc(m.name) + '</div><p class="med__sub">' + esc(m.salt || '') + (m.pack ? ' · ' + esc(m.pack) : '') + '</p></div><span class="med__cat">' + esc(catLabel(m.category)) + '</span></div>'
  + '<div class="med__row"><div class="med__price">₹' + m.price + '<small> /pack</small></div><button class="med__btn" data-add="' + idx + '">' + _T('add') + '</button></div></article>';
}
function bindAdd(root) {
  (root || document).querySelectorAll('[data-add]').forEach(btn => {
    if (btn.dataset.bound) return; btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const m = MEDS[parseInt(btn.dataset.add, 10)]; if (!m) return;
      window.Cart.add(m, 1);
      btn.textContent = _T('added'); btn.classList.add('is-added');
      setTimeout(() => { btn.textContent = _T('add'); btn.classList.remove('is-added'); }, 1200);
    });
  });
}

if (P === 'home') {
  const q = document.getElementById('quickOrderBtn');
  if (q) q.addEventListener('click', () => {
    const med = (document.getElementById('quickMedicine').value || '').trim();
    const qty = document.getElementById('quickQty').value || 1;
    const area = (document.getElementById('quickArea').value || '').trim();
    if (!med) return document.getElementById('quickMedicine').focus();
    const msg = 'Hi ' + window.PHARMACY_CONFIG.name + ', I would like to order:\n• ' + med + ' × ' + qty + (area ? '\nDeliver to: ' + area : '');
    window.open(window.waUrl(msg), '_blank', 'noopener');
  });
  const f = document.getElementById('featuredMeds');
  if (f) loadMeds().then(d => { f.innerHTML = d.slice(0, 8).map((m, i) => medCard(m, i)).join(''); bindAdd(f); });
}

if (P === 'medicines') {
  const grid = document.getElementById('medGrid'), empty = document.getElementById('medEmpty'),
        countEl = document.getElementById('searchCount'), sIn = document.getElementById('medSearch'),
        chips = document.getElementById('chips'), sortSel = document.getElementById('sortSel');
  let cat = 'all';
  function render() {
    const q = (sIn.value || '').trim().toLowerCase();
    let list = MEDS.map((m, i) => ({ m: m, i: i })).filter(x => (cat === 'all' || x.m.category === cat) && (!q || x.m.name.toLowerCase().includes(q) || (x.m.salt || '').toLowerCase().includes(q)));
    const s = sortSel.value;
    if (s === 'price-asc') list.sort((a, b) => a.m.price - b.m.price);
    else if (s === 'price-desc') list.sort((a, b) => b.m.price - a.m.price);
    else if (s === 'name') list.sort((a, b) => a.m.name.localeCompare(b.m.name));
    countEl.textContent = list.length + ' ' + (window.LANG === 'hi' ? 'परिणाम' : ('result' + (list.length === 1 ? '' : 's')));
    empty.hidden = list.length > 0;
    grid.innerHTML = list.map(x => medCard(x.m, x.i)).join('');
    bindAdd(grid);
  }
  loadMeds().then(() => {
    const cats = Array.from(new Set(MEDS.map(m => m.category))).sort();
    chips.innerHTML = '<button class="chip is-active" data-cat="all">' + _T('cat_all') + '</button>' + cats.map(c => '<button class="chip" data-cat="' + esc(c) + '">' + esc(catLabel(c)) + '</button>').join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      cat = b.dataset.cat;
      chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === b));
      render();
    });
    render();
  });
  sIn.addEventListener('input', render);
  sortSel.addEventListener('change', render);
}

if (P === 'prescription') {
  const fi = document.getElementById('rxFile'), lab = document.getElementById('rxFileLabel'),
        sb = document.getElementById('rxSend'), note = document.getElementById('rxNote');
  fi.addEventListener('change', () => { if (fi.files && fi.files[0]) { lab.textContent = fi.files[0].name + ' — ready to send'; lab.classList.add('is-set'); } });
  sb.addEventListener('click', () => {
    const n = (note.value || '').trim();
    const f = fi.files && fi.files[0] ? fi.files[0].name : '(I will attach in WhatsApp)';
    const msg = 'Hi ' + window.PHARMACY_CONFIG.name + ', I would like to send a prescription.\nFile: ' + f + (n ? '\nNote: ' + n : '');
    window.open(window.waUrl(msg), '_blank', 'noopener');
  });
}

if (P === 'delivery') {
  const tb = document.getElementById('trackBtn');
  if (tb) tb.addEventListener('click', () => {
    const id = (document.getElementById('orderId').value || '').trim();
    if (!id) return document.getElementById('orderId').focus();
    window.open(window.waUrl('Hi, please share the status of my order #' + id + '. Thanks!'), '_blank', 'noopener');
  });
}

if (P === 'contact') {
  const map = document.getElementById('mapFrame'); if (map) map.src = window.PHARMACY_CONFIG.maps;
  const dir = document.getElementById('directionsBtn'); if (dir) dir.href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(window.PHARMACY_CONFIG.address);
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const n = (form.cname.value || '').trim(), p = (form.cphone.value || '').trim(), m = (form.cmessage.value || '').trim();
    window.open(window.waUrl('Hi ' + window.PHARMACY_CONFIG.name + ',\nName: ' + n + '\nPhone: ' + p + '\n\n' + m), '_blank', 'noopener');
  });
}

if (P === 'cart') {
  const list = document.getElementById('cartList'), empty = document.getElementById('cartEmpty'),
        subEl = document.getElementById('cartSubtotal'), totEl = document.getElementById('cartTotal'),
        cob = document.getElementById('checkoutBtn'), clb = document.getElementById('clearBtn'),
        paySel = document.getElementById('coPay'), payOnlineOpt = document.getElementById('payOnlineOpt'),
        modePill = document.getElementById('checkoutMode'), note = document.getElementById('coNote');

  if (window.Payment && window.Payment.enabled && payOnlineOpt) payOnlineOpt.hidden = false;

  function row(i) {
    return '<div class="cart-row" data-name="' + esc(i.name) + '"><div><div class="cart-row__name">' + esc(i.name) + '</div><p class="cart-row__sub">' + esc(i.salt || '') + (i.pack ? ' · ' + esc(i.pack) : '') + '</p></div>'
    + '<div class="qty"><button class="qty__btn" data-dec aria-label="−">−</button><input class="qty__input" type="number" min="1" value="' + i.qty + '" /><button class="qty__btn" data-inc aria-label="+">+</button></div>'
    + '<div class="cart-row__price">₹' + (i.qty * i.price) + '</div><button class="cart-row__remove" data-remove aria-label="×">×</button></div>';
  }
  function render() {
    const it = window.Cart.get();
    if (!it.length) { list.innerHTML = ''; empty.hidden = false; cob.disabled = true; clb.disabled = true; }
    else { empty.hidden = true; cob.disabled = false; clb.disabled = false; list.innerHTML = it.map(row).join(''); }
    const s = window.Cart.total();
    subEl.textContent = '₹' + s; totEl.textContent = '₹' + s;
    refreshMode();
  }
  function refreshMode() {
    const online = paySel.value === 'razorpay';
    modePill.textContent = online ? 'Online payment' : 'WhatsApp';
    cob.textContent = online ? 'Pay ₹' + window.Cart.total() + ' now' : 'Place order on WhatsApp';
    note.textContent = online ? 'Secure payment via Razorpay (UPI / Card / Netbanking). We dispatch as soon as payment is confirmed.' : 'We confirm availability and ETA within 5 minutes.';
  }
  paySel.addEventListener('change', refreshMode);

  list.addEventListener('click', e => {
    const w = e.target.closest('.cart-row'); if (!w) return;
    const n = w.dataset.name, it = window.Cart.get().find(x => x.name === n); if (!it) return;
    if (e.target.matches('[data-inc]')) window.Cart.setQty(n, it.qty + 1);
    else if (e.target.matches('[data-dec]')) window.Cart.setQty(n, Math.max(1, it.qty - 1));
    else if (e.target.matches('[data-remove]')) window.Cart.remove(n);
  });
  list.addEventListener('change', e => {
    if (!e.target.matches('.qty__input')) return;
    window.Cart.setQty(e.target.closest('.cart-row').dataset.name, parseInt(e.target.value, 10) || 1);
  });
  document.addEventListener('cart:change', render);

  function payMethodLabel(v) { return ({ cod: 'Cash on delivery', 'upi-cod': 'UPI on delivery', 'card-cod': 'Card on delivery', razorpay: 'Paid online (Razorpay)' })[v] || v; }

  function placeOrder() {
    const it = window.Cart.get(); if (!it.length) return;
    const n = (document.getElementById('coName').value || '').trim();
    const ph = (document.getElementById('coPhone').value || '').trim();
    const ad = (document.getElementById('coAddress').value || '').trim();
    const pv = paySel.value;
    if (!n || !ph || !ad) return alert('Please fill name, phone, and delivery address.');
    const total = window.Cart.total();
    const baseOrder = { id: window.makeOrderId(), customer: { name: n, phone: ph, address: ad }, items: it, total: total, payment: payMethodLabel(pv), status: 'Pending', createdAt: new Date().toISOString() };

    function finish(order) {
      (window.Backend ? window.Backend.saveOrder(order) : Promise.resolve(window.Orders.add(order))).then(() => {
        const lines = order.items.map(i => '• ' + i.name + ' × ' + i.qty + ' = ₹' + (i.qty * i.price));
        const msg = ['Hi ' + window.PHARMACY_CONFIG.name + ', new order ' + order.id + ':', '', 'Customer: ' + n, 'Phone: ' + ph, 'Address: ' + ad, 'Payment: ' + order.payment + (order.paymentId ? ' (Payment ID ' + order.paymentId + ')' : ''), '', 'Items:'].concat(lines, ['', 'Total: ₹' + total, 'Delivery: Free']).join('\n');
        window.Cart.clear();
        window.open(window.waUrl(msg), '_blank', 'noopener');
        alert('Order ' + order.id + ' saved. We are opening WhatsApp to confirm.');
      }).catch(err => alert('Could not save order: ' + (err.message || err)));
    }

    if (pv === 'razorpay' && window.Payment && window.Payment.enabled) {
      window.Payment.payRazorpay({
        order: baseOrder, customer: baseOrder.customer,
        onSuccess: pid => finish(Object.assign({}, baseOrder, { paymentId: pid, status: 'Paid' })),
        onCancel: () => alert('Payment cancelled. Your cart is intact.')
      });
    } else { finish(baseOrder); }
  }
  cob.addEventListener('click', placeOrder);
  clb.addEventListener('click', () => { if (confirm('Clear all items from your cart?')) window.Cart.clear(); });
  render();
}
