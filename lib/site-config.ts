export const siteConfig = {
  name: process.env.NEXT_PUBLIC_AGENCY_NAME || 'Akob Automobile',
  phone: process.env.NEXT_PUBLIC_AGENCY_PHONE || '+221 77 000 00 00',
  email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || 'bonjour@akob-automobile.com',
  address: process.env.NEXT_PUBLIC_AGENCY_ADDRESS || 'Dakar, Sénégal',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '221770000000').replace(/\D/g, ''),
};

export const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;