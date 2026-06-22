# Mazaly

Média communautaire francophone israélien. Marque mère pensée pour durer et évoluer (Mazaly Event, Mazaly Digital). Site public 100% français + dashboard d'administration.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** : PostgreSQL, Auth, Storage
- **TipTap** : éditeur de texte riche
- **Tailwind CSS**
- Déploiement **Vercel**

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le site tourne sur http://localhost:3000

## Variables d'environnement

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (anon) Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (réservée à d'éventuels scripts serveur) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (SEO / Open Graph) |

> Sans configuration Supabase, le site public s'affiche avec des états vides ; l'admin redirige vers `/login`.

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécuter `supabase/schema.sql` (tables, RLS, fonctions, buckets Storage).
3. Optionnel : exécuter `supabase/seed.sql` pour des catégories de départ.
4. Récupérer l'URL et la clé anon dans **Project Settings → API** et les mettre dans `.env.local`.

### Créer un compte rédacteur / admin

Il n'y a pas d'inscription publique. Les comptes sont créés manuellement :

1. **Authentication → Users → Add user** : créer l'utilisateur (email + mot de passe).
2. Dans **SQL Editor**, insérer le profil avec le rôle voulu :

```sql
insert into profiles (id, nom, role)
values ('<uuid-de-l-utilisateur>', 'Prénom Nom', 'admin');
```

Rôles disponibles : `lecteur`, `redacteur`, `admin`. L'accès à `/admin` est réservé à `redacteur` et `admin` ; seul `admin` peut changer les rôles.

## Structure

```
app/
  (site)/                 Pages publiques (Navbar + Footer)
    page.tsx              Homepage
    news/                 Liste + article
    blog/                 Liste + article
    bonnes-adresses/      Liste + fiche
    a-propos/
  admin/                  Dashboard protégé (middleware + requireStaff)
    articles/ adresses/ categories/ tags/ publicites/ newsletter/ utilisateurs/
  login/                  Connexion Supabase Auth
  api/newsletter/         Inscription newsletter
components/               UI publique + composants admin (TipTap, uploads, formulaires)
lib/
  supabase/               Clients browser / server / middleware
  queries.ts              Lecture publique
  admin.ts                Lecture admin
  auth.ts slug.ts upload.ts types.ts
supabase/                 schema.sql + seed.sql
```

## Fonctionnalités

- Articles News & Blog avec éditeur TipTap (gras, italique, H2/H3, listes, citation, liens, images inline)
- Slug auto-généré (gestion des accents), unique
- Upload d'images via Supabase Storage (buckets `articles`, `adresses`, `publicites`)
- Compteur de vues (RPC `increment_article_vues`)
- Bonnes adresses avec galerie et fiche détaillée
- Publicités dynamiques par emplacement et dates actives
- Newsletter (homepage + bas d'article) avec export CSV
- SEO : meta title/description + Open Graph par page
- Articles `draft` invisibles publiquement (RLS)
- Responsive mobile first

## Déploiement Vercel

1. Pousser le repo sur GitHub.
2. **New Project** sur [vercel.com](https://vercel.com), importer le repo (framework Next.js détecté).
3. Ajouter les variables d'environnement.
4. **Deploy**. Domaine custom via **Settings → Domains**.
