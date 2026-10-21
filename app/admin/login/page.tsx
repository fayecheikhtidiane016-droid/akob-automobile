'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@akob.local');
  const [password, setPassword] = useState('demo-admin');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('akob-demo-admin');
    if (saved === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email && password) {
      localStorage.setItem('akob-demo-admin', 'true');
      router.push('/admin');
      return;
    }
    setError('Veuillez saisir vos identifiants.');
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-20 lg:px-8">
        <div className="rounded-[30px] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Espace admin</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-900">Connexion</h1>
          <p className="mt-2 text-sm text-amber-700">Mode démonstration : l’authentification réelle doit être configurée via Supabase Auth.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-4 py-3" placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-4 py-3" placeholder="Mot de passe" />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="submit" className="w-full rounded-full bg-[#c9a45b] px-5 py-3 font-semibold text-black hover:bg-[#d9b975]">
              Se connecter
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
