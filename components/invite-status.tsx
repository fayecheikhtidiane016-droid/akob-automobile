const messages: Record<string, string> = {
  configuration: 'Supabase n’est pas configuré dans cette application. Vérifiez les variables locales et redémarrez le serveur.',
  invalid: 'Ce lien ne contient pas de code d’invitation valide. Vérifiez l’URL de redirection Supabase, puis demandez une nouvelle invitation.',
  expired: 'Ce lien d’invitation a expiré ou a déjà été utilisé. Demandez un nouvel e-mail d’invitation.',
  unauthorized: 'Le compte n’a pas encore de rôle autorisé. Exécutez le script bootstrap dans Supabase avant de réutiliser l’invitation.',
};

export function InviteStatus({ status }: { status?: string }) {
  const message = status ? messages[status] : null;
  if (!message) return null;
  return <p className="form-error invite-status" role="alert">{message}</p>;
}