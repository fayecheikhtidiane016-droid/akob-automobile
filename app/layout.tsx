export const metadata = {
  title: 'Akob Automobile | Location & vente de voitures premium',
  description: 'Location et vente de véhicules premium en Côte d’Ivoire et en Afrique.',
  keywords: ['location voiture', 'vente voiture', 'Akob Automobile', 'voitures premium'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#f6f3ee] text-zinc-900">{children}</body>
    </html>
  );
}
