export type Role = "lecteur" | "redacteur" | "admin";

export type Profile = {
  id: string;
  nom: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
};

export type Category = {
  id: string;
  nom: string;
  slug: string;
  type: string;
  couleur: string | null;
  icone: string | null;
  created_at: string;
};

export type Tag = {
  id: string;
  nom: string;
  slug: string;
};

export type Article = {
  id: string;
  titre: string;
  slug: string;
  contenu: string | null;
  extrait: string | null;
  image_cover: string | null;
  auteur_id: string | null;
  categorie_id: string | null;
  statut: string;
  featured: boolean;
  vues: number;
  created_at: string;
  published_at: string | null;
  categorie?: Category | null;
  auteur?: Profile | null;
};

export type Adresse = {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  categorie_id: string | null;
  adresse: string | null;
  ville: string | null;
  region: string | null;
  telephone: string | null;
  site_web: string | null;
  email: string | null;
  instagram: string | null;
  image: string | null;
  images: string[] | null;
  horaires: string | null;
  prix_moyen: string | null;
  statut: string;
  featured: boolean;
  created_at: string;
  categorie?: Category | null;
};

export type Publicite = {
  id: string;
  titre: string | null;
  image: string;
  lien: string;
  emplacement: string;
  date_debut: string | null;
  date_fin: string | null;
  actif: boolean;
  clics: number;
  impressions: number;
  created_at: string;
};

export type Newsletter = {
  id: string;
  email: string;
  nom: string | null;
  actif: boolean;
  created_at: string;
};
