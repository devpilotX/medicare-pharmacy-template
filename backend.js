// MediCare — Backend abstraction.
// If window.BACKEND_CONFIG.enabled, persists orders/refills/customers to Supabase.
// Otherwise falls back to localStorage (the existing window.Orders / window.Refills stores).
(function () {
  const C = window.BACKEND_CONFIG || { enabled: false };
  const localMode = !C.enabled;
  let sb = null, ready = null;

  function loadSupabase() {
    if (ready) return ready;
    ready = new Promise((resolve, reject) => {
      if (window.supabase) return resolve(window.supabase);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = () => resolve(window.supabase);
      s.onerror = () => reject(new Error('Failed to load Supabase SDK'));
      document.head.appendChild(s);
    }).then(lib => { sb = lib.createClient(C.supabaseUrl, C.supabaseAnonKey); return sb; });
    return ready;
  }

  window.Backend = {
    mode: localMode ? 'local' : 'supabase',
    isRemote: !localMode,
    init() { return localMode ? Promise.resolve() : loadSupabase(); },

    // ----- Orders -----
    saveOrder(order) {
      if (localMode) { window.Orders.add(order); return Promise.resolve(order); }
      return loadSupabase().then(() => sb.from('orders').insert({
        order_id: order.id, customer_name: order.customer.name, customer_phone: order.customer.phone,
        customer_address: order.customer.address, items: order.items, total: order.total,
        payment: order.payment, status: order.status, payment_id: order.paymentId || null
      })).then(({ error }) => { if (error) throw error; window.Orders.add(order); return order; });
    },
    getOrders(filter) {
      if (localMode) {
        let list = window.Orders.all();
        if (filter && filter.phone) list = list.filter(o => o.customer.phone === filter.phone);
        return Promise.resolve(list);
      }
      let q = sb.from('orders').select('*').order('created_at', { ascending: false });
      if (filter && filter.phone) q = q.eq('customer_phone', filter.phone);
      return loadSupabase().then(() => q).then(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(r => ({ id: r.order_id, customer: { name: r.customer_name, phone: r.customer_phone, address: r.customer_address }, items: r.items, total: r.total, payment: r.payment, status: r.status, paymentId: r.payment_id, createdAt: r.created_at }));
      });
    },
    updateOrderStatus(id, status) {
      window.Orders.update(id, { status: status });
      if (localMode) return Promise.resolve();
      return loadSupabase().then(() => sb.from('orders').update({ status: status }).eq('order_id', id));
    },

    // ----- Refills -----
    getRefills(filter) {
      if (localMode) {
        let list = window.Refills.all();
        if (filter && filter.phone) list = list.filter(r => r.phone === filter.phone);
        return Promise.resolve(list);
      }
      let q = sb.from('refills').select('*').order('next_date', { ascending: true });
      if (filter && filter.phone) q = q.eq('phone', filter.phone);
      return loadSupabase().then(() => q).then(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(r => ({ id: r.id, customer: r.customer, phone: r.phone, medicine: r.medicine, nextDate: r.next_date, notes: r.notes }));
      });
    },
    saveRefill(r) {
      if (localMode) { const all = window.Refills.all(); all.push(r); window.Refills.save(all); return Promise.resolve(r); }
      return loadSupabase().then(() => sb.from('refills').insert({ id: r.id, customer: r.customer, phone: r.phone, medicine: r.medicine, next_date: r.nextDate, notes: r.notes })).then(({ error }) => { if (error) throw error; return r; });
    },

    // ----- Auth (customer accounts) -----
    signUp({ email, password, name, phone }) {
      if (localMode) {
        const key = 'medicare:account:v1';
        const acct = { email: email, name: name, phone: phone, createdAt: new Date().toISOString() };
        localStorage.setItem(key, JSON.stringify(acct));
        return Promise.resolve({ user: acct });
      }
      return loadSupabase().then(() => sb.auth.signUp({ email: email, password: password, options: { data: { name: name, phone: phone } } })).then(({ data, error }) => { if (error) throw error; return data; });
    },
    signIn({ email, password }) {
      if (localMode) {
        const acct = JSON.parse(localStorage.getItem('medicare:account:v1') || 'null');
        if (acct && acct.email === email) return Promise.resolve({ user: acct });
        return Promise.reject(new Error('No local account for this email. Sign up first.'));
      }
      return loadSupabase().then(() => sb.auth.signInWithPassword({ email: email, password: password })).then(({ data, error }) => { if (error) throw error; return data; });
    },
    signOut() {
      if (localMode) { localStorage.removeItem('medicare:account:v1'); return Promise.resolve(); }
      return loadSupabase().then(() => sb.auth.signOut());
    },
    currentUser() {
      if (localMode) return Promise.resolve(JSON.parse(localStorage.getItem('medicare:account:v1') || 'null'));
      return loadSupabase().then(() => sb.auth.getUser()).then(({ data }) => {
        const u = data && data.user; if (!u) return null;
        return { email: u.email, name: u.user_metadata && u.user_metadata.name, phone: u.user_metadata && u.user_metadata.phone, id: u.id };
      });
    }
  };
})();
