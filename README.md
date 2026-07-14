# ⚽ SoccerLink

**Le terrain, en poche.** La communauté football amateur en Israël — trouve des joueurs
pour compléter tes équipes, organise des matchs 5v5 / 7v7 / 11v11, suis tes stats et joue en ligue.

Interface **française**, mobile-first, design « terrain en poche » (gazon, lignes à la craie,
carte-terrain signature où chaque place libre est un maillot en pointillés à toucher pour s'inscrire).

## Stack

- **React 19 + Vite** (JSX, sans TypeScript)
- **Tailwind CSS**
- **Supabase** — Postgres + Auth (Google OAuth & lien magique) + Realtime + Storage (avatars)
- Déployable sur **Vercel**

## Démarrage local

```bash
npm install
cp .env.example .env      # puis renseigne tes clés Supabase
npm run dev
```

L'app tourne sur http://localhost:5173

## Configuration Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor** → colle et exécute `supabase/schema.sql` (tables + RLS + bucket `avatars`).
3. (Optionnel) Exécute `supabase/seed.sql` pour charger les données de démo
   (20 joueurs, 3 terrains à Tel-Aviv, 5 matchs, 1 ligue).
4. **Authentication → Providers** :
   - active **Email** (lien magique, activé par défaut),
   - active **Google** et renseigne le Client ID / Secret OAuth,
   - ajoute l'URL de ton app dans **Redirect URLs** (ex. `http://localhost:5173` et l'URL Vercel).
5. **Project Settings → API** : récupère `Project URL` et `anon public key`,
   place-les dans `.env` :

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

## Déploiement Vercel

1. Pousse ce dépôt sur GitHub.
2. Sur [vercel.com](https://vercel.com), **Add New → Project** et importe le dépôt.
3. Framework preset : **Vite** (build `npm run build`, output `dist`).
4. **Settings → Environment Variables** : ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
5. **Deploy**.
6. Reporte l'URL de production dans les **Redirect URLs** Supabase (étape 4 ci-dessus)
   pour que la connexion Google / lien magique redirige correctement.

## Fonctionnalités

- **Matchs ouverts** — carte-terrain vue du dessus, inscription en un clic sur une place libre,
  liste d'attente auto quand c'est complet, équilibrage des équipes par note moyenne,
  statuts `open → full → played → rated`, mises à jour en direct (Realtime),
  bouton de partage WhatsApp.
- **Ligues** — classement J/G/N/P/BP/BC/Diff/Pts (3/1/0) et classement individuel par points cumulés.
- **Stats & notation** — après match, note tes coéquipiers et adversaires sur 5 critères
  adaptés au poste (joueur de champ vs gardien), note globale (min. 3 notations),
  courbe de progression, système de points (victoire +30, nul +10, défaite +5, bonus buts/passes/note).
- **Rangs** — Bronze → Argent → Or → Platine → Légende, en écussons de club.

## Structure

```
supabase/schema.sql   schéma + policies RLS + bucket avatars
supabase/seed.sql     données de démo
src/lib/              constantes, formations (carte-terrain), helpers
src/components/       FieldCard (signature), MatchCard, RatingModal, UI…
src/tabs/             Accueil, Matchs, Ligues, Joueurs, Profil
src/SoccerLink.jsx    orchestrateur (données, actions, realtime)
```
