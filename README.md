# Mazaly Digital — Site vitrine

Site one-page de l'agence web **Mazaly Digital** (Tel Aviv). Interface principale en hébreu (RTL) avec une section dédiée à la communauté francophone (LTR). Construit avec **Next.js 14 (App Router)**, **TypeScript** et **Tailwind CSS**, sans dépendance UI lourde.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Resend pour le formulaire de contact
- Composants maison (canvas étoilé, compteurs animés, fade-up au scroll)

## Installation

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000

## Variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner :

| Variable | Description |
| --- | --- |
| `RESEND_API_KEY` | Clé API Resend (obligatoire pour le formulaire) |
| `CONTACT_TO_EMAIL` | Adresse de réception des messages (défaut : `hello@mazaly.digital`) |
| `CONTACT_FROM_EMAIL` | Expéditeur vérifié chez Resend (défaut : `onboarding@resend.dev`) |

> Sans `RESEND_API_KEY`, le reste du site fonctionne ; seul l'envoi du formulaire renvoie une erreur.

## Déploiement Vercel

1. Pousser le repo sur GitHub.
2. Sur [vercel.com](https://vercel.com), **New Project** → importer le repo.
3. Framework détecté automatiquement : **Next.js** (aucune config requise).
4. Ajouter les variables d'environnement (`RESEND_API_KEY`, etc.) dans **Settings → Environment Variables**.
5. **Deploy**. Pour un domaine custom : **Settings → Domains**.

## Où changer le WhatsApp / l'email

Tout le contenu et les coordonnées sont centralisés dans **`lib/site.ts`** :

```ts
export const site = {
  name: "Mazaly.Digital",
  whatsapp: "972500000000",   // numéro WhatsApp (format international, sans +)
  email: "hello@mazaly.digital"
};
```

Le même fichier contient les services, le process, les projets, les compteurs et les points de la section française.

## Structure

```
app/
  layout.tsx              Layout RTL (he) + polices Heebo & Inter
  page.tsx                Composition de la page
  globals.css             Tailwind + CSS custom (sélecteurs à classe unique)
  api/contact/route.ts    Route d'envoi via Resend
components/                Nav, Hero, Starfield, compteurs, sections, footer
lib/site.ts               Configuration & contenu
public/favicon.svg
```

## Accessibilité

Toutes les animations (canvas, cartes flottantes, compteurs, fade-up) respectent `prefers-reduced-motion`.
