# Akob Automobile

Site Next.js de vente et d’importation de véhicules, avec catalogue public, formulaire de contact et espace administrateur.

## Démarrage local

Prérequis : Node.js 20.9 ou ultérieur et npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sans configuration de stockage, le site démarre en mode démonstration avec des véhicules exemples. Pour gérer un catalogue partagé sans Supabase, configurez l'accès GitHub ci-dessous.

## Administration sans Supabase

L'espace `/admin` peut utiliser GitHub comme stockage partagé : les fiches et les photos sont enregistrées dans le dépôt et un commit déclenche le déploiement habituel du site. Supabase n'est pas nécessaire pour cette option.

1. Créez un **Fine-grained personal access token** GitHub limité au dépôt du site, avec la permission **Contents: Read and write**. Ne mettez jamais ce token dans une variable `NEXT_PUBLIC_*` et ne le partagez pas.
2. Dans `.env.local` pour le développement, puis dans les variables d'environnement du projet Vercel pour la production, renseignez :

   ```env
   GITHUB_TOKEN=le-token-a-conserver-secret
   GITHUB_REPOSITORY=fayecheikhtidiane016-droid/akob-automobile
   GITHUB_BRANCH=main
   ADMIN_PASSWORD=un-mot-de-passe-aleatoire-d-au-moins-16-caracteres
   ```

3. Redémarrez le serveur local ou redéployez le projet Vercel après avoir ajouté les variables. Ouvrez `/admin` et connectez-vous avec `ADMIN_PASSWORD`.
4. Ajoutez une annonce et jusqu'à cinq photos (4 Mo au total maximum). La modification est committée dans GitHub et devient visible sur le site après le déploiement.

Le cookie d'administration est HttpOnly et signé avec le token GitHub. Le bouton/lien d'administration n'est pas un contrôle d'accès : la protection repose sur le mot de passe et la validation côté serveur. Le dépôt ne doit pas contenir de secrets.

## Configuration Supabase (optionnelle)

1. Créer un projet Supabase et conserver son URL ainsi que sa clé publique `anon`.
2. Dans **SQL Editor**, exécuter dans l'ordre [`supabase/migrations/202610210001_initial_schema.sql`](supabase/migrations/202610210001_initial_schema.sql), [`supabase/migrations/202610210002_developer_access.sql`](supabase/migrations/202610210002_developer_access.sql), [`supabase/migrations/202610210003_sales_importation_only.sql`](supabase/migrations/202610210003_sales_importation_only.sql), puis [`supabase/migrations/202610210004_optional_sale_price.sql`](supabase/migrations/202610210004_optional_sale_price.sql). La troisième migration convertit les anciennes annonces en annonces de vente et réserve les opérations de gestion à l’administrateur unique ; la quatrième permet d’ajouter une annonce dont le prix est « sur demande ».
3. Dans **Authentication > URL Configuration**, définir l'URL du site et ajouter à la liste des redirections autorisées `http://localhost:3000/auth/callback` ainsi que `https://VOTRE-DOMAINE/auth/callback` pour la production. Les liens de récupération utilisent automatiquement le domaine sur lequel la demande est faite ; vérifiez que son URL de callback figure dans cette liste.
4. Dans **Authentication > Providers > Email**, désactiver les inscriptions publiques. Dans **Authentication > Users**, inviter `fayecheikhtidiane016@gmail.com`. Il s’agit du seul compte autorisé à gérer les annonces et les photos. N'ouvrez pas encore le lien reçu.
5. Dans **SQL Editor**, exécuter [`supabase/bootstrap-admins.sql`](supabase/bootstrap-admins.sql). Le script retrouve cette adresse et lui attribue le rôle `owner`. Il s'arrête si le compte n'a pas encore été invité.
6. Copiez les variables de `.env.example` dans `.env.local`, démarrez le site, puis ouvrez le lien reçu. Le callback vérifie le rôle et permet de choisir le mot de passe (12 caractères minimum). Connectez-vous à `http://localhost:3000/admin`.

Ne pas exposer la clé `service_role` dans une variable `NEXT_PUBLIC_*`, un navigateur, un dépôt Git ou un journal. L'application utilise uniquement la clé publique et les règles RLS. Les rôles sont attribués dans le SQL Editor privilégié et jamais par le compte lui-même.

Variables de `.env.example` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
NEXT_PUBLIC_WHATSAPP_NUMBER=221785811871
NEXT_PUBLIC_AGENCY_PHONE=+221 78 581 18 71
NEXT_PUBLIC_AGENCY_EMAIL=akobcoly051@gmail.com
NEXT_PUBLIC_AGENCY_ADDRESS=Dakar, Sénégal
NEXT_PUBLIC_AGENCY_NAME=Akob Automobile
```

Le bucket `vehicle-photos` reste privé. Les fichiers doivent être servis avec des URL signées ; les policies autorisent la lecture des photos seulement lorsqu'elles appartiennent à une annonce publiée, et réservent leur gestion au compte administrateur autorisé. Les images acceptées sont JPEG, PNG, WebP et AVIF, 10 Mo maximum par fichier.

## Déploiement Vercel

Importer le dépôt dans Vercel et sélectionner Next.js. Pour l'administration sans Supabase, définir `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_BRANCH` et `ADMIN_PASSWORD` dans les variables d'environnement de Vercel. Les commits du catalogue doivent déclencher un déploiement sur la branche configurée. La connexion Supabase et ses migrations ne sont nécessaires que si l'option Supabase est utilisée.

## Parcours inclus

- Accueil, annonces de véhicules à vendre, filtres, fiches véhicule et contact WhatsApp configurable.
- Demandes d’informations sur un achat ou un projet d’importation.
- Contact public, confidentialité, conditions à faire valider, 404 et gestion d'erreur.
- Espace administrateur : gestion GitHub protégée par mot de passe ou connexion Supabase facultative ; création, publication et suppression d'annonces.
- Protection RLS sur les tables privées et bucket photos privé.

Les coordonnées, textes juridiques, véhicules de démonstration, tarifs et identifiants WhatsApp doivent être remplacés ou vérifiés par l'agence avant mise en production. Les témoignages ne sont affichés que lorsque l'agence pourra fournir des témoignages réels ; aucune donnée client de démonstration n'est incluse.

## Vérifications

```bash
npm run typecheck
npm run build
```
