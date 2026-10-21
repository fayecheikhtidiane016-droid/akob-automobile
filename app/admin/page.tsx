import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminLogin } from '@/components/admin-login';
import { InviteStatus } from '@/components/invite-status';
import { getAdminSession } from '@/lib/admin';
import { GithubAdminDashboard } from '@/components/github-admin-dashboard';
import { GithubAdminLogin } from '@/components/github-admin-login';
import { demoVehicles } from '@/lib/vehicles';
import { hasGithubAdminSession, isGithubAdminConfigured, readGithubVehicles } from '@/lib/github-catalog';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    const { invite } = await searchParams;
    if (isGithubAdminConfigured()) {
      if (await hasGithubAdminSession()) {
        const vehicles = await readGithubVehicles(demoVehicles);
        return <GithubAdminDashboard vehicles={vehicles} />;
      }
      return <section className="admin-login-page"><div className="login-panel"><a className="admin-wordmark" href="/">AKOB <span>ADMINISTRATION</span></a><span className="eyebrow">ACCÈS SÉCURISÉ</span><h1>Gestion des<br /><em>véhicules.</em></h1><p>Connectez-vous pour gérer les annonces et leurs photos.</p><GithubAdminLogin /></div><span className="login-note">Espace réservé à l’administrateur Akob Automobile</span></section>;
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return <section className="admin-login-page"><div className="login-panel"><a className="admin-wordmark" href="/">AKOB <span>ADMINISTRATION</span></a><span className="eyebrow">CONFIGURATION REQUISE</span><h1>Préparez votre<br /><em>espace de gestion.</em></h1><p>Pour publier les annonces sans Supabase, configurez les variables GitHub du serveur : GITHUB_TOKEN, GITHUB_REPOSITORY et ADMIN_PASSWORD (16 caractères minimum). Consultez la section « Administration sans Supabase » du README.</p></div><span className="login-note">Ne partagez jamais le token GitHub.</span></section>;
    }
    return <section className="admin-login-page"><div className="login-panel"><a className="admin-wordmark" href="/">AKOB <span>ADMINISTRATION</span></a><span className="eyebrow">ACCÈS SÉCURISÉ</span><h1>Bienvenue<br /><em>à nouveau.</em></h1><p>Connectez-vous avec l’adresse e-mail administrateur autorisée.</p><InviteStatus status={invite} /><AdminLogin /></div><span className="login-note">Espace réservé au compte administrateur Akob Automobile</span></section>;
  }
  const { data: vehicles, error } = await session.supabase.from('vehicles').select('*').order('created_at', { ascending: false });
  if (error) return <section className="admin-login-page"><div className="login-panel"><span className="eyebrow">CONFIGURATION INCOMPLÈTE</span><h1>Impossible de charger les données.</h1><p>Vérifiez que le schéma Supabase a été appliqué et que les politiques RLS sont actives.</p></div></section>;
  return <AdminDashboard name={session.profile.full_name} initialVehicles={vehicles ?? []} />;
}