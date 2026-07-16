-- ============================================================
--  SoccerLink — données de démo
--  À exécuter APRÈS schema.sql (Supabase → SQL Editor)
--  Crée 20 joueurs, 3 terrains à Tel-Aviv, 5 matchs, 1 ligue.
--  Les comptes démo (demoN@soccerlink.app / mot de passe : soccerlink)
--  servent surtout à peupler l'app ; connecte-toi avec ton vrai compte.
-- ============================================================

do $$
declare
  names text[] := array[
    'Yossi Cohen','Daniel Levi','Omer Azoulay','Noam Bar','Eitan Peretz',
    'Adam Friedman','Guy Mizrahi','Itai Shalev','Roi Katz','Liad Ohana',
    'Tomer Gabbay','Bar Refael','Ariel Dahan','Nadav Solomon','Yonatan Amar',
    'Shai Elbaz','Ido Malka','Or Ben David','Elad Segal','Ronen Haddad'
  ];
  poss text[] := array['GK','DEF','DEF','MID','MID','MID','FWD','FWD','DEF','MID','FWD','GK','DEF','MID','FWD','MID','DEF','FWD','MID','DEF'];
  feet text[] := array['right','left','both'];
  pid uuid;
  pids uuid[] := '{}';
  v1 uuid; v2 uuid; v3 uuid;
  lg uuid;
  mt uuid;
  i int;
  j int;
begin
  -- Joueurs (auth.users + profiles)
  for i in 1..array_length(names, 1) loop
    pid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data
    ) values (
      '00000000-0000-0000-0000-000000000000', pid, 'authenticated', 'authenticated',
      'demo' || i || '@soccerlink.app', crypt('soccerlink', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', names[i])
    ) on conflict do nothing;

    insert into profiles (id, full_name, city, position, preferred_foot, rank, points,
                          matches_played, wins, goals, assists, clean_sheets)
    values (
      pid, names[i], 'Tel Aviv', poss[i], feet[1 + (i % 3)],
      case when (i*173)%3500 >= 3500 then 'Légende'
           when (i*173)%3500 >= 1800 then 'Platine'
           when (i*173)%3500 >= 800  then 'Or'
           when (i*173)%3500 >= 300  then 'Argent'
           else 'Bronze' end,
      (i*173) % 1500,
      (i*7) % 20, (i*3) % 12, (i*5) % 25, (i*4) % 15,
      case when poss[i]='GK' then (i*2)%8 else 0 end
    );
    pids := array_append(pids, pid);
  end loop;

  -- Terrains à Tel-Aviv
  insert into venues (name, address, city, lat, lng, formats)
  values ('Sportek Tel Aviv', 'HaTsafon HaYashan', 'Tel Aviv', 32.0968, 34.8022, array['5v5','7v7'])
  returning id into v1;
  insert into venues (name, address, city, lat, lng, formats)
  values ('Complexe Yarkon', 'Rokach Blvd', 'Tel Aviv', 32.1020, 34.8100, array['7v7','11v11'])
  returning id into v2;
  insert into venues (name, address, city, lat, lng, formats)
  values ('Gan HaHashmal Arena', 'Barzilay St', 'Tel Aviv', 32.0640, 34.7740, array['5v5'])
  returning id into v3;

  -- Ligue
  insert into leagues (name, format, admin_id, season, starts_on, ends_on)
  values ('Ligue Tel Aviv Amateur', '7v7', pids[1], 'Été 2026', current_date - 20, current_date + 40)
  returning id into lg;

  -- Classement de ligue (les 10 premiers joueurs)
  for i in 1..10 loop
    insert into league_standings (league_id, player_id, played, won, drawn, lost,
                                  goals_for, goals_against, points)
    values (lg, pids[i], 6, (11-i)/2, i%3, (i)/3,
            20 - i, 8 + i%5, ((11-i)/2)*3 + (i%3))
    on conflict do nothing;
  end loop;

  -- Match 1 — 5v5 ouvert, presque plein (8/10)
  insert into matches (creator_id, venue_id, format, starts_at, slots, price_per_player, level, status)
  values (pids[1], v1, '5v5', now() + interval '2 days' + interval '19 hours', 10, 40, 'Intermédiaire', 'open')
  returning id into mt;
  for j in 1..8 loop insert into match_players (match_id, player_id) values (mt, pids[j]) on conflict do nothing; end loop;

  -- Match 2 — 7v7 ouvert, à moitié (7/14)
  insert into matches (creator_id, venue_id, format, starts_at, slots, price_per_player, level, status, league_id)
  values (pids[2], v2, '7v7', now() + interval '3 days' + interval '20 hours', 14, 35, 'Confirmé', 'open', lg)
  returning id into mt;
  for j in 1..7 loop insert into match_players (match_id, player_id) values (mt, pids[j+3]) on conflict do nothing; end loop;

  -- Match 3 — 5v5 complet
  insert into matches (creator_id, venue_id, format, starts_at, slots, price_per_player, level, status)
  values (pids[5], v3, '5v5', now() + interval '1 day' + interval '18 hours', 10, 45, 'Avancé', 'full')
  returning id into mt;
  for j in 1..10 loop insert into match_players (match_id, player_id, team)
    values (mt, pids[j], case when j % 2 = 0 then 'A' else 'B' end) on conflict do nothing; end loop;

  -- Match 4 — 11v11 ouvert (14/22)
  insert into matches (creator_id, venue_id, format, starts_at, slots, price_per_player, level, status)
  values (pids[3], v2, '11v11', now() + interval '5 days' + interval '17 hours', 22, 30, 'Intermédiaire', 'open')
  returning id into mt;
  for j in 1..14 loop insert into match_players (match_id, player_id) values (mt, pids[j]) on conflict do nothing; end loop;

  -- Match 5 — 7v7 joué avec score
  insert into matches (creator_id, venue_id, format, starts_at, slots, price_per_player, level, status, score_a, score_b, league_id)
  values (pids[4], v1, '7v7', now() - interval '3 days' + interval '19 hours', 14, 35, 'Confirmé', 'played', 4, 2, lg)
  returning id into mt;
  for j in 1..14 loop insert into match_players (match_id, player_id, team, goals)
    values (mt, pids[j], case when j % 2 = 0 then 'A' else 'B' end, case when j <= 4 then 1 else 0 end)
    on conflict do nothing; end loop;
end $$;
