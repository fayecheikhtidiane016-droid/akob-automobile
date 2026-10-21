'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/image/logoakob.jpeg';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand-mark" onClick={close} aria-label="Akob Automobile, accueil">
          <Image src={logo} alt="Akob Automobile" className="brand-logo" priority />
        </Link>
        <button className="menu-toggle" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navigation principale">
          <Link href="/location" onClick={close}>Location</Link>
          <Link href="/vente" onClick={close}>Vente</Link>
          <Link href="/a-propos" onClick={close}>Notre agence</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
          <Link href="/admin" onClick={close}>Espace équipe</Link>
          <Link href="/location" className="nav-cta" onClick={close}>Trouver une voiture <span>↗</span></Link>
        </nav>
      </div>
    </header>
  );
}