# Akob Automobile

Projet Next.js + Tailwind + Supabase pour une plateforme de location et de vente de véhicules premium.

## Architecture proposée

- app/ : routes publiques, pages d’admin et API
- components/ : UI réutilisable (header, footer, cards, formulaires)
- lib/ : types, données de démonstration et clients Supabase
- supabase/ : schéma SQL et policies RLS
- README.md : documentation de mise en route

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (authentification, base de données, stockage)
- Vercel pour le déploiement

## Installation

1. Cloner le repo.
2. Installer les dépendances :
   npm install
3. Copier le fichier .env.example vers .env.local et remplir les variables.
4. Démarrer le projet :
   npm run dev
5. Ouvrir http://localhost:3000

## Variables d’environnement recommandées

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_AGENCY_NAME
- NEXT_PUBLIC_WHATSAPP_NUMBER
- NEXT_PUBLIC_CONTACT_EMAIL
- NEXT_PUBLIC_CONTACT_PHONE

## Déploiement Vercel

1. Créer un repo GitHub.
2. Connecter le repo à Vercel.
3. Configurer les variables d’environnement dans Vercel.
4. Déployer.

## Sécurité

- Les identifiants de production ne doivent pas être stockés dans le dépôt.
- Les comptes admin doivent être créés via Supabase Auth, avec rôles et politiques RLS.
- Le mode démonstration inclus dans l’UI doit être clairement séparé des données de production.

## Supabase

Les scripts SQL sont dans le dossier `supabase/`.

## Tests rapides

- Vérifier la page d’accueil
- Vérifier les filtres de véhicules
- Vérifier la page de réservation
- Vérifier le dashboard admin en mode démo
