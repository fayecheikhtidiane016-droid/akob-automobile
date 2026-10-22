import { isDemoMode } from '@/lib/site-config';
import { isGithubAdminConfigured } from '@/lib/github-catalog';

export function DemoBanner() {
  if (!isDemoMode || isGithubAdminConfigured()) return null;
  return <div className="demo-banner">Mode démonstration · Les véhicules affichés sont des exemples. Configurez Supabase pour publier les annonces réelles.</div>;
}