import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8c6d2f]">Contact</p>
          <h1 className="mt-3 text-4xl font-bold text-zinc-900">Parlons de votre projet automobile.</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-zinc-600">Email</p>
            <p className="mt-2 text-lg font-semibold">contact@akobautomobile.com</p>
            <p className="mt-6 text-zinc-600">Téléphone</p>
            <p className="mt-2 text-lg font-semibold">À configurer</p>
            <p className="mt-6 text-zinc-600">Adresse</p>
            <p className="mt-2 text-lg font-semibold">À configurer</p>
          </div>

          <form className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="grid gap-4">
              <input className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Nom et prénom" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Email" type="email" />
              <input className="rounded-xl border border-zinc-200 px-4 py-3" placeholder="Téléphone" />
              <textarea className="min-h-[140px] rounded-xl border border-zinc-200 px-4 py-3" placeholder="Votre message" />
              <button type="submit" className="rounded-full bg-[#c9a45b] px-5 py-3 font-semibold text-black hover:bg-[#d9b975]">
                Envoyer le message
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
