import { isDemoMode } from '@/lib/site-config';

export function DemoBanner() {
  if (!isDemoMode) return null;
  return <div className="demo-banner">Mode démonstration · Les véhicules affichés sont des exemples. Configurez Supabase pour publier les annonces réelles.</div>;
}