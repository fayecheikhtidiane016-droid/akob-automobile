'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Location', href: '/cars?type=rent' },
  { label: 'Vente', href: '/cars?type=sale' },
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5dfd5] bg-[#f7f3ee]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          Akob Automobile
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-700 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#8c6d2f]">{item.label}</Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link href="/reservation" className="rounded-full bg-[#c9a45b] px-5 py-2.5 font-semibold text-black hover:bg-[#d9b975]">
            Réserver
          </Link>
        </div>

        <button className="rounded-full border border-zinc-300 p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu mobile">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 bg-[#f7f3ee] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm font-medium text-zinc-700">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 hover:text-[#8c6d2f]">{item.label}</Link>
            ))}
            <Link href="/reservation" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-[#c9a45b] px-5 py-2.5 text-center font-semibold text-black hover:bg-[#d9b975]">Réserver</Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
