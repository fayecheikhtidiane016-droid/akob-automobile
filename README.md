# Akob Automobile

Site Next.js de vente et d’importation de véhicules, avec catalogue public, formulaire de contact et espace administrateur protégé par Supabase.

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
2. Dans **SQL Editor**, exécuter dans l'ordre [`supabase/migrations/202610210001_initial_schema.sql`](supabase/migrations/202610210001_initial_schema.sql), [`supabase/migrations/202610210002_developer_access.sql`](supabase/migrations/202610210002_developer_access.sql), puis [`supabase/migrations/202610210003_sales_importation_only.sql`](supabase/migrations/202610210003_sales_importation_only.sql). La troisième migration convertit les anciennes annonces en annonces de vente et réserve les opérations de gestion à l’administrateur unique.
3. Dans **Authentication > URL Configuration**, définir l'URL du site et ajouter à la liste des redirections autorisées `http://localhost:3000/auth/callback` ainsi que `https://VOTRE-DOMAINE/auth/callback` pour la production. Les liens de récupération utilisent automatiquement le domaine sur lequel la demande est faite ; vérifiez que son URL de callback figure dans cette liste.
4. Dans **Authentication > Providers > Email**, désactiver les inscriptions publiques. Dans **Authentication > Users**, inviter `fayecheikhtidiane016@gmail.com`. Il s’agit du seul compte autorisé à gérer les annonces et les photos. N'ouvrez pas encore le lien reçu.
5. Dans **SQL Editor**, exécuter [`supabase/bootstrap-admins.sql`](supabase/bootstrap-admins.sql). Le script retrouve cette adresse et lui attribue le rôle `owner`. Il s'arrête si le compte n'a pas encore été invité.
6. Copiez les variables de `.env.example` dans `.env.local`, démarrez le site, puis ouvrez le lien reçu. Le callback vérifie le rôle et permet de choisir le mot de passe (12 caractères minimum). Connectez-vous à `http://localhost:3000/admin`.

Ne pas exposer la clé `service_role` dans une variable `NEXT_PUBLIC_*`, un navigateur, un dépôt Git ou un journal. L'application utilise uniquement la clé publique et les règles RLS. Les rôles sont attribués dans le SQL Editor privilégié et jamais par le compte lui-même.

Variables de `.env.example` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
NEXT_PUBLIC_WHATSAPP_NUMBER=221770000000
NEXT_PUBLIC_AGENCY_PHONE=+221 77 000 00 00
NEXT_PUBLIC_AGENCY_EMAIL=bonjour@akob-automobile.com
NEXT_PUBLIC_AGENCY_ADDRESS=Dakar, Sénégal
NEXT_PUBLIC_AGENCY_NAME=Akob Automobile
```

Le bucket `vehicle-photos` reste privé. Les fichiers doivent être servis avec des URL signées ; les policies autorisent la lecture des photos seulement lorsqu'elles appartiennent à une annonce publiée, et réservent leur gestion au compte administrateur autorisé. Les images acceptées sont JPEG, PNG, WebP et AVIF, 10 Mo maximum par fichier.

## Déploiement Vercel

Importer le dépôt dans Vercel, sélectionner Next.js, puis définir les variables de `.env.example` pour les environnements concernés. Ajouter l'URL de production comme URL de site et URL de redirection d'authentification autorisées dans Supabase. Déployer après application de la migration et attribution des rôles. Ne pas mettre de clé `service_role` dans les variables publiques.

## Parcours inclus

- Accueil, annonces de véhicules à vendre, filtres, fiches véhicule et contact WhatsApp configurable.
- Demandes d’informations sur un achat ou un projet d’importation.
- Contact public, confidentialité, conditions à faire valider, 404 et gestion d'erreur.
- Espace administrateur : connexion Supabase limitée à une adresse e-mail, création et modification d'annonces, publication, statuts et gestion des photos.
- Protection RLS sur les tables privées et bucket photos privé.

Les coordonnées, textes juridiques, véhicules de démonstration, tarifs et identifiants WhatsApp doivent être remplacés ou vérifiés par l'agence avant mise en production. Les témoignages ne sont affichés que lorsque l'agence pourra fournir des témoignages réels ; aucune donnée client de démonstration n'est incluse.

## Vérifications

```bash
npm run typecheck
npm run build
```
