# Akob Automobile

Site Next.js de location et vente de véhicules, avec catalogue public, demandes de réservation, formulaire de contact et espace équipe protégé par Supabase.

## Démarrage local

Prérequis : Node.js 20.9 ou ultérieur, npm et un projet Supabase pour activer les formulaires et l'administration.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sans identifiants Supabase, le site démarre en mode démonstration : les véhicules affichés sont des exemples, les pages restent navigables, mais les formulaires et l'administration affichent clairement que le service en ligne n'est pas configuré.

## Configuration Supabase

1. Créer un projet Supabase et conserver son URL ainsi que sa clé publique `anon`.
2. Dans **SQL Editor**, exécuter dans l'ordre [`supabase/migrations/202610210001_initial_schema.sql`](supabase/migrations/202610210001_initial_schema.sql) puis [`supabase/migrations/202610210002_developer_access.sql`](supabase/migrations/202610210002_developer_access.sql). La seconde migration peut être réexécutée sans risque.
3. Dans **Authentication > URL Configuration**, définir l'URL du site et ajouter à la liste des redirections autorisées `http://localhost:3000/auth/callback` ainsi que `https://VOTRE-DOMAINE/auth/callback` pour la production.
4. Dans **Authentication > Providers > Email**, désactiver les inscriptions publiques. Dans **Authentication > Users**, inviter `fayecheikhtidiane016@gmail.com`. N'ouvrez pas encore le lien reçu.
5. Dans **SQL Editor**, exécuter [`supabase/bootstrap-admins.sql`](supabase/bootstrap-admins.sql). Le script retrouve le compte par e-mail et lui attribue le rôle `owner` ainsi que l'accès développeur. Il s'arrête si le compte n'a pas encore été invité.
6. Copiez les variables de `.env.example` dans `.env.local`, démarrez le site, puis ouvrez le lien reçu. Le callback vérifie le rôle et permet de choisir le mot de passe (12 caractères minimum). Connectez-vous à `http://localhost:3000/admin`.

Ne pas exposer la clé `service_role` dans une variable `NEXT_PUBLIC_*`, un navigateur, un dépôt Git ou un journal. L'application utilise uniquement la clé publique et les règles RLS. Les rôles sont attribués dans le SQL Editor privilégié et jamais par le compte lui-même.

Variables de `.env.example` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=221770000000
NEXT_PUBLIC_AGENCY_PHONE=+221 77 000 00 00
NEXT_PUBLIC_AGENCY_EMAIL=bonjour@akob-automobile.com
NEXT_PUBLIC_AGENCY_ADDRESS=Dakar, Sénégal
NEXT_PUBLIC_AGENCY_NAME=Akob Automobile
```

Le bucket `vehicle-photos` reste privé. Les fichiers doivent être servis avec des URL signées ; les policies autorisent la lecture des photos seulement lorsqu'elles appartiennent à une annonce publiée, et autorisent l'import et la suppression aux rôles d'équipe. Les images acceptées sont JPEG, PNG, WebP et AVIF, 10 Mo maximum par fichier.

## Déploiement Vercel

Importer le dépôt dans Vercel, sélectionner Next.js, puis définir les variables de `.env.example` pour les environnements concernés. Ajouter l'URL de production comme URL de site et URL de redirection d'authentification autorisées dans Supabase. Déployer après application de la migration et attribution des rôles. Ne pas mettre de clé `service_role` dans les variables publiques.

## Parcours inclus

- Accueil, annonces de location et vente, filtres, fiches véhicule et contact WhatsApp configurable.
- Demandes de réservation avec estimation au jour supérieur, validation serveur et confirmation explicite par l'agence.
- Contact public, confidentialité, conditions à faire valider, 404 et gestion d'erreur.
- Espace équipe : connexion Supabase, rôle vérifié côté serveur, indicateurs, création et modification d'annonces, publication, statuts, photos, demandes, confirmation/refus et notes internes.
- Protection RLS sur les tables privées, bucket photos privé et contrainte PostgreSQL excluant les chevauchements de réservations confirmées.

Les coordonnées, textes juridiques, véhicule de démonstration, tarifs, règles de location et identifiants WhatsApp doivent être remplacés ou vérifiés par l'agence avant mise en production. Les témoignages ne sont affichés que lorsque l'agence pourra fournir des témoignages réels ; aucune donnée client de démonstration n'est incluse.

## Vérifications

```bash
npm run typecheck
npm run build
```
