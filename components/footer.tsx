import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold">Akob Automobile</h3>
            <p className="mt-3 text-sm text-zinc-300">Location et vente de véhicules premium avec un service de qualité.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d5bb7a]">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li><Link href="/cars">Nos voitures</Link></li>
              <li><Link href="/about">À propos</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d5bb7a]">Coordonnées</h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#d5bb7a]" /> À configurer</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-[#d5bb7a]" /> À configurer</li>
              <li className="flex items-center gap-2"><Mail size={16} className="text-[#d5bb7a]" /> contact@akobautomobile.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d5bb7a]">Réseaux</h4>
            <div className="mt-4 flex gap-3 text-zinc-300">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-zinc-400">
          © 2025 Akob Automobile. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
