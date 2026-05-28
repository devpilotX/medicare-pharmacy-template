// Copy this file's contents into the <head> of every HTML page (before script.js)
// to override defaults, or just edit PHARMACY_CONFIG inside script.js directly.
// Loading this file is OPTIONAL — if absent, the defaults in script.js apply.

window.PHARMACY_CONFIG = {
  name: 'MediCare Pharmacy',
  short: 'MediCare',
  tagline: 'Your trusted neighbourhood pharmacy',
  whatsapp: '919876543210',     // country code + number, no + or spaces
  phone: '+91 98765 43210',
  email: 'hello@medicarepatna.in',
  address: '123 Boring Road, Patna, Bihar 800001',
  hours: '8 AM – 11 PM · Open 7 days',
  radius: '5 km',
  maps: 'https://www.google.com/maps?q=Boring+Road+Patna&output=embed',
  license: 'DL No. BR-12345/AB · GSTIN 10ABCDE1234F1Z5',
  adminPassword: 'change-me-please'
};

// ----- Razorpay / UPI online payments -----
// Get your key from https://dashboard.razorpay.com/app/keys
// Leave enabled:false to keep cash/UPI-on-delivery only.
window.RAZORPAY_CONFIG = {
  enabled: false,
  keyId: 'rzp_test_XXXXXXXXXXXXXX',  // public key ID (safe in client)
  // For PRODUCTION: server endpoint that calls Razorpay Orders API and returns
  // { id, amount, currency }. Leave empty for test-mode direct checkout.
  createOrderUrl: ''
};

// ----- Supabase backend (orders, refills, customer accounts) -----
// Create a free project at https://supabase.com and run the SQL in README.md
// Leave enabled:false to keep using localStorage (single device).
window.BACKEND_CONFIG = {
  enabled: false,
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-ANON-KEY'
};
