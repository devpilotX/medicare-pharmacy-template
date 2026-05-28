// Admin dashboard—login gate, orders, inventory, refills, customers.
(function () {
  const root = document.getElementById('adminRoot');
  const CFG = window.PHARMACY_CONFIG;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  function fmtINR(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
  function fmtDate(iso) { try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; } }
  function dateOnly(iso) { try { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); } catch (e) { return iso; } }

  // --- Seeding demo data (only first time) ---
  function seedDemo() {
    if (window.Orders.all().length) return;
    const now = Date.now();
    const sample = [
      { name: 'Rohit Singh', phone: '9876543210', address: 'Boring Road, Patna', items: [{ name: 'Dolo 650', salt: 'Paracetamol 650mg', pack: '15 tablets', price: 32, qty: 2 }, { name: 'Becosules', salt: 'B-Complex', pack: '20 capsules', price: 42, qty: 1 }], payment: 'Cash on delivery', status: 'Delivered', d: 1 },
      { name: 'Priya Kumari', phone: '9988776655', address: 'Rajendra Nagar, Patna', items: [{ name: 'Metformin 500', salt: 'Metformin HCl', pack: '15 tablets', price: 24, qty: 3 }], payment: 'UPI on delivery', status: 'Out for delivery', d: 0 },
      { name: 'Anil Gupta', phone: '9123456780', address: 'Kankarbagh, Patna', items: [{ name: 'Telma 40', salt: 'Telmisartan', pack: '15 tablets', price: 152, qty: 1 }, { name: 'Ecosprin 75', salt: 'Aspirin', pack: '14 tablets', price: 12, qty: 2 }], payment: 'Cash on delivery', status: 'Pending', d: 0 },
      { name: 'Sneha Verma', phone: '9012345678', address: 'Patliputra Colony, Patna', items: [{ name: 'Zincovit', salt: 'Multivitamin', pack: '15 tablets', price: 105, qty: 1 }, { name: 'Sinarest', salt: 'Paracetamol+CPM', pack: '15 tablets', price: 78, qty: 1 }], payment: 'UPI on delivery', status: 'Delivered', d: 2 },
      { name: 'Amit Kumar', phone: '9001122334', address: 'Bailey Road, Patna', items: [{ name: 'Augmentin 625', salt: 'Amoxicillin+Clavulanate', pack: '10 tablets', price: 285, qty: 1 }], payment: 'Cash on delivery', status: 'Delivered', d: 3 },
      { name: 'Kavita Sharma', phone: '9223344556', address: 'Ashok Rajpath, Patna', items: [{ name: 'Crocin Advance', salt: 'Paracetamol 500mg', pack: '15 tablets', price: 28, qty: 2 }, { name: 'Strepsils', salt: 'Amylmetacresol', pack: '8 lozenges', price: 38, qty: 2 }], payment: 'Cash on delivery', status: 'Delivered', d: 4 },
      { name: 'Rakesh Mishra', phone: '9445566778', address: 'Danapur, Patna', items: [{ name: 'Glycomet GP1', salt: 'Glimepiride+Metformin', pack: '15 tablets', price: 78, qty: 3 }], payment: 'UPI on delivery', status: 'Delivered', d: 5 }
    ];
    const orders = sample.map(s => {
      const total = s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      return { id: window.makeOrderId(), customer: { name: s.name, phone: s.phone, address: s.address }, items: s.items, total: total, payment: s.payment, status: s.status, createdAt: new Date(now - s.d * 86400000).toISOString() };
    });
    window.Orders.save(orders);
    if (!window.Refills.all().length) {
      window.Refills.save([
        { id: 'R-' + Math.random().toString(36).slice(2, 7), customer: 'Rohit Singh', phone: '9876543210', medicine: 'Telma 40', nextDate: new Date(now + 4 * 86400000).toISOString().slice(0, 10), notes: 'Monthly BP refill' },
        { id: 'R-' + Math.random().toString(36).slice(2, 7), customer: 'Priya Kumari', phone: '9988776655', medicine: 'Metformin 500', nextDate: new Date(now + 2 * 86400000).toISOString().slice(0, 10), notes: 'Diabetes — morning dose' },
        { id: 'R-' + Math.random().toString(36).slice(2, 7), customer: 'Anil Gupta', phone: '9123456780', medicine: 'Ecosprin 75', nextDate: new Date(now + 8 * 86400000).toISOString().slice(0, 10), notes: '' }
      ]);
    }
  }

  // --- Login ---
  function renderLogin(msg) {
    root.innerHTML = '<div class="login-wrap"><div class="card login-card">'
      + '<h1>Admin login</h1><p>Sign in to manage orders, inventory, refills, and customers.</p>'
      + (msg ? '<p style="color:var(--danger);margin:0 0 12px;font-size:13px;font-weight:600">' + esc(msg) + '</p>' : '')
      + '<label class="field"><span>Password</span><input type="password" id="pw" placeholder="admin123" autofocus/></label>'
      + '<button class="btn btn--primary btn--block" id="loginBtn">Sign in</button>'
      + '<p class="card__note">Default password is <code>admin123</code>. Change it in <code>PHARMACY_CONFIG</code> in <code>script.js</code>.</p>'
      + '</div></div>';
    const pw = root.querySelector('#pw');
    function go() { if (window.Admin.login(pw.value)) renderApp(); else renderLogin('Wrong password. Default is admin123.'); }
    root.querySelector('#loginBtn').addEventListener('click', go);
    pw.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  }

  // --- Main app shell ---
  const TABS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'inventory', label: 'Inventory', icon: '💊' },
    { id: 'refills', label: 'Refills', icon: '🔁' },
    { id: 'customers', label: 'Customers', icon: '👥' }
  ];
  function renderApp() {
    seedDemo();
    const tab = (location.hash || '#overview').slice(1);
    const cur = TABS.find(t => t.id === tab) ? tab : 'overview';
    root.innerHTML = '<div class="admin"><aside class="admin__side"><div class="admin__brand">Dashboard</div>'
      + '<nav class="admin__nav">' + TABS.map(t => '<a href="#' + t.id + '" class="' + (t.id === cur ? 'is-active' : '') + '"><span>' + t.icon + '</span> ' + t.label + '</a>').join('') + '</nav>'
      + '<div style="margin-top:auto;padding:12px"><button class="btn btn--danger" id="logoutBtn" style="width:100%">Logout</button></div>'
      + '</aside><section class="admin__main" id="adminMain"></section></div>';
    root.querySelector('#logoutBtn').addEventListener('click', () => { window.Admin.logout(); renderLogin(); });
    renderTab(cur);
  }
  function renderTab(id) {
    const m = document.getElementById('adminMain'); if (!m) return;
    if (id === 'overview') return renderOverview(m);
    if (id === 'orders') return renderOrders(m);
    if (id === 'inventory') return renderInventory(m);
    if (id === 'refills') return renderRefills(m);
    if (id === 'customers') return renderCustomers(m);
  }
  window.addEventListener('hashchange', () => { if (window.Admin.isAuthed()) renderApp(); });

  // --- Overview ---
  function renderOverview(m) {
    const orders = window.Orders.all();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const totalRev = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    const customers = new Set(orders.map(o => o.customer && o.customer.phone)).size;
    // 7-day chart
    const days = []; for (let i = 6; i >= 0; i--) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); days.push(d); }
    const series = days.map(d => { const end = new Date(d); end.setDate(end.getDate() + 1); return orders.filter(o => { const t = new Date(o.createdAt); return t >= d && t < end; }).reduce((s, o) => s + o.total, 0); });
    const maxV = Math.max.apply(null, series.concat([1]));
    m.innerHTML = '<div class="admin__head"><h1>Overview</h1><span class="pill pill--success">Live</span></div>'
      + '<div class="kpis">'
      + kpi('Total revenue', fmtINR(totalRev), '+ all-time')
      + kpi('Orders today', todayOrders.length, todayOrders.length ? 'Last: ' + fmtDate(todayOrders[0].createdAt) : 'No orders yet')
      + kpi('Pending orders', pending, pending ? 'Action needed' : 'All caught up', !!pending)
      + kpi('Unique customers', customers, '+ all-time')
      + '</div>'
      + '<div class="panel"><div class="panel__head"><h2>Revenue — last 7 days</h2><span class="pill">' + fmtINR(series.reduce((a, b) => a + b, 0)) + '</span></div>'
      + '<div class="bars" style="position:relative">' + series.map((v, i) => '<div class="bars__bar" style="height:' + Math.round((v / maxV) * 100) + '%"><span class="bars__val">' + (v ? fmtINR(v) : '—') + '</span><span class="bars__lbl">' + dateOnly(days[i].toISOString()) + '</span></div>').join('') + '</div>'
      + '<div style="height:32px"></div></div>'
      + '<div class="panel"><div class="panel__head"><h2>Recent orders</h2><a href="#orders" style="font-size:13px;color:var(--brand)">View all →</a></div>' + ordersTable(orders.slice(0, 5)) + '</div>';
  }
  function kpi(label, value, sub, danger) { return '<div class="kpi"><div class="kpi__label">' + label + '</div><div class="kpi__value">' + value + '</div><div class="kpi__sub' + (danger ? ' neg' : '') + '">' + sub + '</div></div>'; }

  // --- Orders ---
  const STATUS = ['Pending', 'Out for delivery', 'Delivered', 'Cancelled'];
  function statusBadge(s) { const cls = { 'Pending':'pending','Out for delivery':'out','Delivered':'delivered','Cancelled':'cancelled' }[s] || 'pending'; return '<span class="status status--' + cls + '">' + s + '</span>'; }
  function ordersTable(list) {
    if (!list.length) return '<p class="empty">No orders yet. New WhatsApp checkouts will appear here automatically.</p>';
    return '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th class="num">Total</th><th>Status</th><th>Placed</th></tr></thead><tbody>'
      + list.map(o => '<tr><td><strong>' + esc(o.id) + '</strong></td><td>' + esc(o.customer.name) + '<br><small style="color:var(--muted)">' + esc(o.customer.phone) + '</small></td>'
      + '<td><small>' + o.items.map(i => esc(i.name) + ' ×' + i.qty).join('<br>') + '</small></td>'
      + '<td class="num">' + fmtINR(o.total) + '</td><td>' + statusBadge(o.status) + '</td><td><small>' + fmtDate(o.createdAt) + '</small></td></tr>').join('') + '</tbody></table></div>';
  }
  function renderOrders(m) {
    const orders = window.Orders.all();
    m.innerHTML = '<div class="admin__head"><h1>Orders</h1><span class="pill">' + orders.length + ' total</span></div>'
      + '<div class="panel"><div class="panel__head"><h2>All orders</h2><div style="display:flex;gap:8px"><input id="oSearch" placeholder="Search name or order ID" style="padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font-size:13px"/><select id="oFilter" class="sort-sel"><option value="">All status</option>' + STATUS.map(s => '<option>' + s + '</option>').join('') + '</select></div></div><div id="oList"></div></div>';
    function render() {
      const q = (document.getElementById('oSearch').value || '').toLowerCase();
      const f = document.getElementById('oFilter').value;
      let list = orders.filter(o => (!q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q)) && (!f || o.status === f));
      const html = list.length ? '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th class="num">Total</th><th>Status</th><th>Placed</th><th></th></tr></thead><tbody>'
        + list.map(o => '<tr><td><strong>' + esc(o.id) + '</strong></td>'
          + '<td>' + esc(o.customer.name) + '<br><small style="color:var(--muted)">' + esc(o.customer.phone) + '<br>' + esc(o.customer.address) + '</small></td>'
          + '<td><small>' + o.items.map(i => esc(i.name) + ' ×' + i.qty + ' = ' + fmtINR(i.price * i.qty)).join('<br>') + '</small><br><small style="color:var(--muted)">' + esc(o.payment) + '</small></td>'
          + '<td class="num">' + fmtINR(o.total) + '</td>'
          + '<td><select class="sort-sel" data-status="' + esc(o.id) + '" style="font-size:12px;padding:6px 10px">' + STATUS.map(s => '<option' + (s === o.status ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td>'
          + '<td><small>' + fmtDate(o.createdAt) + '</small></td>'
          + '<td><a href="https://wa.me/91' + esc(o.customer.phone) + '?text=' + encodeURIComponent('Hi ' + o.customer.name + ', regarding your order ' + o.id + ' —') + '" target="_blank" rel="noopener" class="btn btn--ghost" style="padding:6px 10px;font-size:12px">WhatsApp</a></td></tr>').join('') + '</tbody></table></div>'
        : '<p class="empty">No orders match your filter.</p>';
      document.getElementById('oList').innerHTML = html;
      document.querySelectorAll('[data-status]').forEach(sel => sel.addEventListener('change', e => {
        const id = e.target.dataset.status;
        window.Orders.update(id, { status: e.target.value });
        const o = window.Orders.all().find(x => x.id === id); if (o) o.status = e.target.value;
        render();
      }));
    }
    document.getElementById('oSearch').addEventListener('input', render);
    document.getElementById('oFilter').addEventListener('change', render);
    render();
  }

  // --- Inventory ---
  function renderInventory(m) {
    let inv = window.Inventory.load([]);
    function load() {
      if (inv.length) return Promise.resolve(inv);
      return fetch('assets/medicines.json').then(r => r.json()).then(d => { inv = d; window.Inventory.save(inv); return inv; });
    }
    m.innerHTML = '<div class="admin__head"><h1>Inventory</h1><span class="pill" id="invCount">—</span></div>'
      + '<div class="panel"><div class="panel__head"><h2>Add medicine</h2></div>'
      + '<div class="row-form"><input id="iName" placeholder="Name (e.g. Dolo 650)"/><input id="iSalt" placeholder="Salt / composition"/><input id="iPack" placeholder="Pack size"/><input id="iCat" placeholder="Category"/><input id="iPrice" type="number" placeholder="Price (₹)"/><button class="btn btn--primary" id="iAdd">Add</button></div></div>'
      + '<div class="panel"><div class="panel__head"><h2>All medicines</h2><input id="iSearch" placeholder="Search" style="padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);font-size:13px"/></div><div id="iList"></div></div>';
    function renderList() {
      const q = (document.getElementById('iSearch').value || '').toLowerCase();
      const list = inv.map((x, i) => ({ x: x, i: i })).filter(({ x }) => !q || x.name.toLowerCase().includes(q) || (x.salt || '').toLowerCase().includes(q) || (x.category || '').toLowerCase().includes(q));
      document.getElementById('invCount').textContent = inv.length + ' items';
      document.getElementById('iList').innerHTML = list.length ? '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Name</th><th>Salt</th><th>Pack</th><th>Category</th><th class="num">Price</th><th></th></tr></thead><tbody>'
        + list.map(({ x, i }) => '<tr data-i="' + i + '"><td><input class="iEdit" data-k="name" value="' + esc(x.name) + '"/></td>'
          + '<td><input class="iEdit" data-k="salt" value="' + esc(x.salt || '') + '"/></td>'
          + '<td><input class="iEdit" data-k="pack" value="' + esc(x.pack || '') + '"/></td>'
          + '<td><input class="iEdit" data-k="category" value="' + esc(x.category || '') + '"/></td>'
          + '<td class="num"><input class="iEdit num" data-k="price" type="number" value="' + (x.price || 0) + '" style="width:80px;text-align:right"/></td>'
          + '<td><button class="btn btn--danger" data-del="' + i + '" style="padding:6px 10px;font-size:12px">×</button></td></tr>').join('') + '</tbody></table></div><style>.iEdit{padding:6px 8px;border:1px solid transparent;border-radius:6px;background:transparent;font:inherit;color:inherit;width:100%}.iEdit:hover,.iEdit:focus{border-color:var(--line);background:var(--bg);outline:none}</style>'
        : '<p class="empty">No matches.</p>';
      document.querySelectorAll('.iEdit').forEach(el => el.addEventListener('change', e => {
        const tr = e.target.closest('tr'); const i = +tr.dataset.i; const k = e.target.dataset.k;
        inv[i][k] = k === 'price' ? Number(e.target.value) : e.target.value;
        window.Inventory.save(inv);
      }));
      document.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', e => {
        if (!confirm('Delete this medicine from inventory?')) return;
        inv.splice(+e.target.dataset.del, 1); window.Inventory.save(inv); renderList();
      }));
    }
    document.getElementById('iAdd').addEventListener('click', () => {
      const n = document.getElementById('iName').value.trim(); if (!n) return alert('Enter a name.');
      inv.unshift({ name: n, salt: document.getElementById('iSalt').value.trim(), pack: document.getElementById('iPack').value.trim(), category: document.getElementById('iCat').value.trim() || 'Other', price: Number(document.getElementById('iPrice').value) || 0 });
      window.Inventory.save(inv);
      ['iName','iSalt','iPack','iCat','iPrice'].forEach(id => document.getElementById(id).value = '');
      renderList();
    });
    document.getElementById('iSearch').addEventListener('input', renderList);
    load().then(renderList);
  }

  // --- Refills ---
  function renderRefills(m) {
    const refills = window.Refills.all();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    function daysFromNow(d) { return Math.round((new Date(d) - today) / 86400000); }
    m.innerHTML = '<div class="admin__head"><h1>Refill reminders</h1><span class="pill">' + refills.length + ' scheduled</span></div>'
      + '<div class="panel"><div class="panel__head"><h2>Schedule a reminder</h2></div>'
      + '<div class="row-form"><input id="rCust" placeholder="Customer name"/><input id="rPhone" placeholder="Phone (10 digits)"/><input id="rMed" placeholder="Medicine"/><input id="rDate" type="date"/><input id="rNote" placeholder="Note (optional)"/><button class="btn btn--primary" id="rAdd">Add</button></div></div>'
      + '<div class="panel"><div class="panel__head"><h2>Upcoming refills</h2></div><div id="rList"></div></div>';
    function render() {
      const list = window.Refills.all().slice().sort((a, b) => a.nextDate.localeCompare(b.nextDate));
      document.getElementById('rList').innerHTML = list.length ? '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Customer</th><th>Medicine</th><th>Next date</th><th>In</th><th>Notes</th><th></th></tr></thead><tbody>'
        + list.map(r => { const d = daysFromNow(r.nextDate); const cls = d <= 0 ? 'pending' : (d <= 3 ? 'out' : 'delivered'); const lbl = d < 0 ? Math.abs(d) + ' days ago' : (d === 0 ? 'Today' : d + ' days'); return '<tr><td><strong>' + esc(r.customer) + '</strong><br><small style="color:var(--muted)">' + esc(r.phone) + '</small></td><td>' + esc(r.medicine) + '</td><td>' + r.nextDate + '</td><td><span class="status status--' + cls + '">' + lbl + '</span></td><td><small>' + esc(r.notes || '') + '</small></td><td style="display:flex;gap:6px"><a href="https://wa.me/91' + esc(r.phone) + '?text=' + encodeURIComponent('Hi ' + r.customer + ', reminder: time to refill ' + r.medicine + '. Reply YES to order today.') + '" target="_blank" rel="noopener" class="btn btn--ghost" style="padding:6px 10px;font-size:12px">Send</a><button class="btn btn--danger" data-rdel="' + esc(r.id) + '" style="padding:6px 10px;font-size:12px">×</button></td></tr>'; }).join('') + '</tbody></table></div>'
        : '<p class="empty">No reminders yet. Add one above to start engaging customers monthly.</p>';
      document.querySelectorAll('[data-rdel]').forEach(b => b.addEventListener('click', e => {
        const id = e.target.dataset.rdel;
        window.Refills.save(window.Refills.all().filter(x => x.id !== id));
        render();
      }));
    }
    document.getElementById('rAdd').addEventListener('click', () => {
      const c = document.getElementById('rCust').value.trim();
      const p = document.getElementById('rPhone').value.trim();
      const md = document.getElementById('rMed').value.trim();
      const d = document.getElementById('rDate').value;
      if (!c || !p || !md || !d) return alert('Fill customer, phone, medicine, and date.');
      const all = window.Refills.all();
      all.push({ id: 'R-' + Math.random().toString(36).slice(2, 7), customer: c, phone: p, medicine: md, nextDate: d, notes: document.getElementById('rNote').value.trim() });
      window.Refills.save(all);
      ['rCust','rPhone','rMed','rDate','rNote'].forEach(id => document.getElementById(id).value = '');
      render();
    });
    render();
  }

  // --- Customers ---
  function renderCustomers(m) {
    const orders = window.Orders.all();
    const map = new Map();
    orders.forEach(o => {
      const k = o.customer.phone || o.customer.name;
      const ex = map.get(k) || { name: o.customer.name, phone: o.customer.phone, address: o.customer.address, orders: 0, spend: 0, last: null };
      ex.orders++; ex.spend += o.total || 0;
      if (!ex.last || new Date(o.createdAt) > new Date(ex.last)) ex.last = o.createdAt;
      map.set(k, ex);
    });
    const list = Array.from(map.values()).sort((a, b) => b.spend - a.spend);
    m.innerHTML = '<div class="admin__head"><h1>Customers</h1><span class="pill">' + list.length + ' total</span></div>'
      + '<div class="panel">' + (list.length ? '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Customer</th><th>Phone</th><th>Address</th><th class="num">Orders</th><th class="num">Lifetime spend</th><th>Last order</th><th></th></tr></thead><tbody>'
      + list.map(c => '<tr><td><strong>' + esc(c.name) + '</strong></td><td>' + esc(c.phone) + '</td><td><small>' + esc(c.address || '') + '</small></td><td class="num">' + c.orders + '</td><td class="num">' + fmtINR(c.spend) + '</td><td><small>' + fmtDate(c.last) + '</small></td><td><a href="https://wa.me/91' + esc(c.phone) + '" target="_blank" rel="noopener" class="btn btn--ghost" style="padding:6px 10px;font-size:12px">WhatsApp</a></td></tr>').join('') + '</tbody></table></div>'
        : '<p class="empty">No customers yet. They\'ll appear after the first WhatsApp checkout.</p>') + '</div>';
  }

  // --- Boot ---
  if (!window.Admin.isAuthed()) renderLogin(); else renderApp();
})();
