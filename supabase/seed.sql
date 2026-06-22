insert into categories (nom, slug, type, couleur, icone) values
  ('Actualité', 'actualite', 'news', '#4A6FD4', '📰'),
  ('Communauté', 'communaute', 'news', '#7B5EA7', '🤝'),
  ('Alyah', 'alyah', 'news', '#1B2B6B', '✈️'),
  ('Culture', 'culture', 'blog', '#C9A84C', '🎭'),
  ('Témoignages', 'temoignages', 'blog', '#7B5EA7', '💬'),
  ('Conseils', 'conseils', 'blog', '#4A6FD4', '💡'),
  ('Restaurants', 'restaurants', 'adresse', '#C9A84C', '🍽️'),
  ('Cafés', 'cafes', 'adresse', '#7B5EA7', '☕'),
  ('Services', 'services', 'adresse', '#4A6FD4', '🛠️')
on conflict (slug) do nothing;
