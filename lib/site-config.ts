export const siteConfig = {
  name: process.env.NEXT_PUBLIC_AGENCY_NAME || 'Akob Automobile',
  phone: process.env.NEXT_PUBLIC_AGENCY_PHONE || '+221 78 581 18 71',
  email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || 'akobcoly051@gmail.com',
  address: process.env.NEXT_PUBLIC_AGENCY_ADDRESS || 'Dakar, Sénégal',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '221785811871').replace(/\D/g, ''),
};

export const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;