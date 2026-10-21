import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4 text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[#d5bb7a]">Erreur 404</p>
        <h1 className="mt-4 text-5xl font-bold">Page introuvable</h1>
        <p className="mt-4 text-zinc-300">La page que vous recherchez n’existe pas ou a été déplacée.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-[#c9a45b] px-6 py-3 font-semibold text-black hover:bg-[#d9b975]">
          Revenir à l’accueil
        </Link>
      </div>
    </main>
  );
}
