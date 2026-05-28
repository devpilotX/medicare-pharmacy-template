// Customer account page.
(function () {
  const root = document.getElementById('acctRoot');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  function fmtINR(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
  function fmtDate(iso) { try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso; } }

  function renderAuth(msg) {
    root.innerHTML = '<div style="max-width:480px;margin:0 auto"><div class="card">'
      + '<div class="card__header"><h2>Sign in / Sign up</h2><span class="pill">' + (window.Backend && window.Backend.isRemote ? 'Cloud' : 'This device') + '</span></div>'
      + (msg ? '<p style="color:var(--danger);font-size:13px;font-weight:600;margin:0 0 10px">' + esc(msg) + '</p>' : '')
      + '<label class="field"><span>Full name (sign up only)</span><input id="aName" placeholder="Your name"/></label>'
      + '<label class="field"><span>Phone (10 digits)</span><input id="aPhone" placeholder="98765 43210"/></label>'
      + '<label class="field"><span>Email</span><input id="aEmail" type="email" placeholder="you@example.com"/></label>'
      + '<label class="field"><span>Password</span><input id="aPass" type="password" placeholder="••••••••"/></label>'
      + '<div style="display:flex;gap:10px"><button class="btn btn--primary" id="aLogin" style="flex:1">Sign in</button><button class="btn btn--ghost" id="aSignup" style="flex:1">Sign up</button></div>'
      + '<p class="card__note">' + (window.Backend && window.Backend.isRemote ? 'Powered by Supabase — your data syncs across devices.' : 'Backend not configured — account saved on this device only. Enable Supabase in <code>config.example.js</code> to enable real accounts.') + '</p>'
      + '</div></div>';
    const get = id => document.getElementById(id).value.trim();
    document.getElementById('aLogin').addEventListener('click', () => {
      window.Backend.signIn({ email: get('aEmail'), password: get('aPass') }).then(() => renderHome()).catch(e => renderAuth(e.message || String(e)));
    });
    document.getElementById('aSignup').addEventListener('click', () => {
      const name = get('aName'), email = get('aEmail'), phone = get('aPhone'), password = get('aPass');
      if (!name || !email || !phone) return renderAuth('Fill name, phone, and email to sign up.');
      window.Backend.signUp({ name: name, email: email, phone: phone, password: password }).then(() => renderHome()).catch(e => renderAuth(e.message || String(e)));
    });
  }

  function renderHome() {
    window.Backend.currentUser().then(user => {
      if (!user) return renderAuth();
      root.innerHTML = '<div style="display:grid;grid-template-columns:1fr;gap:18px">'
        + '<div class="card"><div class="card__header"><h2>Welcome, ' + esc(user.name || user.email) + '</h2><button class="btn btn--danger" id="signOut" style="padding:6px 12px;font-size:12px">Sign out</button></div>'
        + '<p style="color:var(--ink-2);font-size:14px;margin:0">' + esc(user.email || '') + (user.phone ? ' · ' + esc(user.phone) : '') + '</p></div>'
        + '<div class="card" id="orderCard"><div class="card__header"><h2>Your orders</h2><span class="pill" id="ordPill">…</span></div><div id="ordList"><p class="empty">Loading…</p></div></div>'
        + '<div class="card" id="refillCard"><div class="card__header"><h2>Your refill reminders</h2><span class="pill" id="refPill">…</span></div><div id="refList"><p class="empty">Loading…</p></div></div>'
        + '</div>';
      document.getElementById('signOut').addEventListener('click', () => window.Backend.signOut().then(renderAuth));
      const phone = user.phone || '';
      window.Backend.getOrders(phone ? { phone: phone } : undefined).then(orders => {
        const mine = phone ? orders : orders.filter(o => o.customer && (o.customer.phone === phone || o.customer.name === user.name));
        document.getElementById('ordPill').textContent = mine.length + (mine.length === 1 ? ' order' : ' orders');
        document.getElementById('ordList').innerHTML = mine.length ? '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Order</th><th>Items</th><th class="num">Total</th><th>Status</th><th>Placed</th></tr></thead><tbody>'
          + mine.map(o => '<tr><td><strong>' + esc(o.id) + '</strong></td><td><small>' + o.items.map(i => esc(i.name) + ' ×' + i.qty).join('<br>') + '</small></td><td class="num">' + fmtINR(o.total) + '</td><td><span class="status status--' + ({ Pending:'pending','Out for delivery':'out','Delivered':'delivered',Cancelled:'cancelled',Paid:'out' }[o.status] || 'pending') + '">' + esc(o.status) + '</span></td><td><small>' + fmtDate(o.createdAt) + '</small></td></tr>').join('') + '</tbody></table></div>'
          : '<p class="empty">No orders yet. <a href="medicines.html" style="color:var(--brand);font-weight:600">Browse medicines →</a></p>';
      });
      window.Backend.getRefills(phone ? { phone: phone } : undefined).then(refills => {
        document.getElementById('refPill').textContent = refills.length + (refills.length === 1 ? ' reminder' : ' reminders');
        document.getElementById('refList').innerHTML = refills.length ? '<div style="overflow:auto"><table class="tbl"><thead><tr><th>Medicine</th><th>Next refill</th><th>Notes</th></tr></thead><tbody>'
          + refills.map(r => '<tr><td><strong>' + esc(r.medicine) + '</strong></td><td>' + esc(r.nextDate) + '</td><td><small>' + esc(r.notes || '') + '</small></td></tr>').join('') + '</tbody></table></div>'
          : '<p class="empty">No refill reminders set. WhatsApp us to schedule monthly refills.</p>';
      });
    });
  }

  (window.Backend ? window.Backend.init() : Promise.resolve()).then(renderHome).catch(() => renderAuth());
})();
