import { redirect } from 'next/navigation';
import { AdminPasswordSetup } from '@/components/admin-password-setup';
import { getAdminSession } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminSetupPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  const session = await getAdminSession();
  if (!session) redirect('/admin');
  return <section className="admin-login-page"><div className="login-panel"><a className="admin-wordmark" href="/">AKOB <span>ESPACE ÉQUIPE</span></a><span className="eyebrow">{mode === 'recovery' ? 'RÉINITIALISATION DU COMPTE' : 'ACTIVATION DU COMPTE'}</span><h1>{mode === 'recovery' ? 'Définissez un nouveau' : 'Choisissez votre'} <em>mot de passe.</em></h1><p>Compte : {session.user.email}. Choisissez un mot de passe personnel d'au moins 12 caractères.</p><AdminPasswordSetup /></div></section>;
}