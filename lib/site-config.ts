const defaultPhoneNumbers = ['+221 76 988 61 22', '+221 77 314 35 56'];
const defaultWhatsAppNumbers = ['221769886122', '221773143556'];

function getConfiguredNumbers(configuredNumbers: string | undefined, defaults: string[], normalize: (number: string) => string) {
  return (configuredNumbers ?? defaults.join(','))
    .split(',')
    .map((number) => normalize(number.trim()))
    .filter(Boolean);
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_AGENCY_NAME || 'Akob Automobile',
  phones: getConfiguredNumbers(process.env.NEXT_PUBLIC_AGENCY_PHONES || process.env.NEXT_PUBLIC_AGENCY_PHONE, defaultPhoneNumbers, (number) => number),
  email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || 'akobcoly051@gmail.com',
  address: process.env.NEXT_PUBLIC_AGENCY_ADDRESS || 'Dakar, Sénégal',
  whatsappNumbers: getConfiguredNumbers(process.env.NEXT_PUBLIC_WHATSAPP_NUMBERS || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, defaultWhatsAppNumbers, (number) => number.replace(/\D/g, '')),
};

export const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;