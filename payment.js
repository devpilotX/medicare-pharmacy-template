// MediCare — Razorpay/UPI online payment.
(function () {
  const C = window.RAZORPAY_CONFIG || { enabled: false };
  let loading = null;
  function loadSdk() {
    if (window.Razorpay) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = resolve; s.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.head.appendChild(s);
    });
    return loading;
  }

  function createServerOrder(amountPaise) {
    if (!C.createOrderUrl) return Promise.resolve(null);
    return fetch(C.createOrderUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amountPaise, currency: 'INR' }) }).then(r => r.json());
  }

  window.Payment = {
    enabled: !!C.enabled && !!C.keyId,
    label: 'Pay online (UPI / Card / Netbanking)',
    /**
     * Open Razorpay checkout. opts: { order, customer, onSuccess(paymentId), onCancel }
     */
    payRazorpay(opts) {
      const amountPaise = Math.round(opts.order.total * 100);
      return loadSdk().then(() => createServerOrder(amountPaise)).then(srvOrder => {
        const cfg = window.PHARMACY_CONFIG;
        const rzpOpts = {
          key: C.keyId,
          amount: amountPaise,
          currency: 'INR',
          name: cfg.name,
          description: 'Order ' + opts.order.id,
          image: 'assets/favicon.svg',
          prefill: { name: opts.customer.name, contact: opts.customer.phone, email: opts.customer.email || cfg.email },
          notes: { order_id: opts.order.id, address: opts.customer.address || '' },
          theme: { color: '#0f9d8a' },
          modal: { ondismiss: () => opts.onCancel && opts.onCancel() },
          handler: function (resp) { opts.onSuccess && opts.onSuccess(resp.razorpay_payment_id, resp); }
        };
        if (srvOrder && srvOrder.id) rzpOpts.order_id = srvOrder.id;
        new window.Razorpay(rzpOpts).open();
      }).catch(err => { alert('Payment could not start: ' + (err.message || err)); opts.onCancel && opts.onCancel(); });
    }
  };
})();
