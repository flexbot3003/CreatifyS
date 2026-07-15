-- CREATIFY STUDIOS DATABASE SETUP
-- Run this entire file in Supabase: SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

create table if not exists public.site_settings (
  id bigint primary key default 1 check (id = 1),
  studio_name text not null default 'Creatify Studios',
  logo_url text,
  eyebrow text,
  hero_line_1 text,
  hero_line_2 text,
  hero_description text,
  intro_title text,
  intro_body text,
  about_title text,
  about_body text,
  location text,
  email text,
  phone text,
  instagram text,
  linkedin text,
  behance text,
  primary_cta_label text,
  primary_cta_url text,
  secondary_cta_label text,
  secondary_cta_url text,
  footer_blurb text,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  year text,
  excerpt text,
  description text,
  image_url text,
  project_url text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text default 'Sparkles',
  description text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  client_name text not null,
  client_role text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  project_type text,
  budget text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Automatically maintain updated_at fields.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['site_settings','projects','services','clients','testimonials','faqs','stats']
  loop
    execute format('drop trigger if exists %I on public.%I', 'set_' || table_name || '_updated_at', table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', 'set_' || table_name || '_updated_at', table_name);
  end loop;
end $$;

-- Enable Row Level Security.
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.stats enable row level security;
alter table public.contact_submissions enable row level security;

-- Remove previous policies when re-running this setup.
do $$
declare
  record_item record;
begin
  for record_item in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('admin_users','site_settings','projects','services','clients','testimonials','faqs','stats','contact_submissions')
  loop
    execute format('drop policy if exists %I on %I.%I', record_item.policyname, record_item.schemaname, record_item.tablename);
  end loop;
end $$;

create policy "Admins can read their membership"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

create policy "Public can read settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "Admins manage settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published projects"
on public.projects for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "Admins manage projects"
on public.projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published services"
on public.services for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "Admins manage services"
on public.services for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published clients"
on public.clients for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "Admins manage clients"
on public.clients for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published testimonials"
on public.testimonials for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "Admins manage testimonials"
on public.testimonials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published faqs"
on public.faqs for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "Admins manage faqs"
on public.faqs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published stats"
on public.stats for select
to anon, authenticated
using (published = true or public.is_admin());

create policy "Admins manage stats"
on public.stats for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Anyone can submit a project enquiry"
on public.contact_submissions for insert
to anon, authenticated
with check (true);

create policy "Admins manage enquiries"
on public.contact_submissions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public media bucket used by project covers and client logos.
insert into storage.buckets (id, name, public)
values ('creatify-media', 'creatify-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public reads Creatify media" on storage.objects;
drop policy if exists "Admins upload Creatify media" on storage.objects;
drop policy if exists "Admins update Creatify media" on storage.objects;
drop policy if exists "Admins delete Creatify media" on storage.objects;

create policy "Public reads Creatify media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'creatify-media');

create policy "Admins upload Creatify media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'creatify-media' and public.is_admin());

create policy "Admins update Creatify media"
on storage.objects for update
to authenticated
using (bucket_id = 'creatify-media' and public.is_admin())
with check (bucket_id = 'creatify-media' and public.is_admin());

create policy "Admins delete Creatify media"
on storage.objects for delete
to authenticated
using (bucket_id = 'creatify-media' and public.is_admin());

-- Seed global website settings.
insert into public.site_settings (
  id, studio_name, logo_url, eyebrow, hero_line_1, hero_line_2, hero_description,
  intro_title, intro_body, about_title, about_body, location, email,
  primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url,
  instagram, linkedin, behance, footer_blurb
)
values (
  1,
  'Creatify Studios',
  '',
  'Creative Design Studio',
  'CRAFTING',
  'DIGITAL ICONS',
  'A South African creative studio shaping memorable brands, digital experiences and visual systems for ambitious businesses.',
  'DESIGN THAT SPEAKS VOLUMES',
  'We are a collective of passionate designers, strategists and creators dedicated to crafting exceptional brand experiences. From startups to enterprises, we partner with visionary clients to create designs that captivate, communicate and convert.',
  'WHERE CREATIVITY MEETS STRATEGY',
  'Our studio is a hub of innovation where designers, strategists and technologists come together to create extraordinary work. Every project connects bold creativity with clear business objectives.',
  'Based in South Africa. Available worldwide.',
  'hello@creatifystudios.co.za',
  'Start a Project', '#contact', 'View Projects', '#work', '#', '#', '#',
  'Elevating brands through strategic thinking, expressive design and digital excellence.'
)
on conflict (id) do nothing;

-- Seed starter projects. Replace their cover images from the admin dashboard after setup.
insert into public.projects (slug, title, category, year, excerpt, description, image_url, featured, published, sort_order)
values
('lumin-dental', 'Lumin Dental', 'Brand Identity & Graphics', '2026', 'Brand reveal concepts and promotional materials tailored for a modern dental clinic.', 'A warm, contemporary visual language developed to help Lumin Dental communicate clinical confidence without losing its human touch.', '/projects/lumin.svg', true, true, 1),
('laomai-dental', 'Laomai Dental', 'Print & Digital Layout', '2026', 'Custom flyers, posters and clinic branding created to elevate the patient experience.', 'A practical and polished campaign system designed for consistent use across social posts, print and in-clinic communication.', '/projects/laomai.svg', true, true, 2),
('creatify-collective', 'Creatify Collective', 'Web Design', '2026', 'The flagship digital home for our creative collective, featuring seamless motion and UX.', 'A flexible portfolio platform balancing confident typography, playful studio personality and a powerful content management system.', '/projects/creatify.svg', true, true, 3),
('imperial-ac', 'Imperial AC', 'Sports Branding', '2026', 'A complete visual system giving an ambitious community football club a professional edge.', 'From matchday graphics and player profiles to kit concepts and a live website, the identity positions Imperial AC for its next stage of growth.', '/projects/imperial.svg', true, true, 4),
('elevate-wellness', 'Elevate Wellness', 'Web Design', '2024', 'Holistic wellness platform featuring immersive visuals and a seamless user journey.', 'A calming editorial website system designed to make wellness services easier to understand and explore.', '/projects/elevate.svg', false, true, 5),
('lumina-tech', 'Lumina Tech Rebrand', 'Brand Identity', '2024', 'Complete brand transformation for a growing SaaS company.', 'A modern identity system with a sharper voice, flexible digital assets and scalable guidelines.', '/projects/lumina.svg', false, true, 6),
('artisan-coffee', 'Artisan Coffee Co.', 'Packaging Design', '2024', 'Premium packaging balancing artisanal craft with modern shelf presence.', 'A tactile packaging family built around provenance, ritual and contemporary specialty coffee culture.', '/projects/artisan.svg', false, true, 7),
('nova-finance', 'Nova Finance App', 'UI/UX Design', '2023', 'An intuitive mobile banking experience for a new generation of customers.', 'A simplified product experience turning everyday financial tasks into clear, approachable journeys.', '/projects/nova.svg', false, true, 8)
on conflict (slug) do nothing;

insert into public.services (title, icon, description, published, sort_order)
select * from (values
('Brand Identity', 'Sparkles', 'Strategic brand development including logo design, visual systems, positioning and comprehensive brand guidelines.', true, 1),
('Web Design', 'Monitor', 'Responsive websites that combine compelling aesthetics, clear structure and exceptional user experience.', true, 2),
('UI/UX Design', 'PanelsTopLeft', 'User-centred interface design creating intuitive, engaging digital experiences across platforms.', true, 3),
('Digital Marketing', 'Megaphone', 'Campaign systems and creative assets that capture attention and drive engagement across digital channels.', true, 4),
('Motion Design', 'Play', 'Expressive animated content, title systems and social media motion that give brands energy and personality.', true, 5),
('Print & Packaging', 'Package', 'Editorial, packaging and physical brand applications designed to feel considered in every detail.', true, 6)
) as seed(title, icon, description, published, sort_order)
where not exists (select 1 from public.services);

insert into public.clients (name, website_url, published, sort_order)
select * from (values
('Lumin Dental', '#', true, 1), ('Laomai Dental', '#', true, 2), ('Imperial AC', '#', true, 3),
('HeadsUp', '#', true, 4), ('Melora', '#', true, 5), ('MiMi', '#', true, 6),
('Significance', '#', true, 7), ('Africa Change Lab', '#', true, 8)
) as seed(name, website_url, published, sort_order)
where not exists (select 1 from public.clients);

insert into public.testimonials (quote, client_name, client_role, published, sort_order)
select * from (values
('Our beauty brand needed a fresh, elegant look. Creatify elevated our entire visual identity to match the quality of our products.', 'Melora', 'Beauty Brand', true, 1),
('Working with Creatify was a dream. They designed a beautiful, soft and modern brand aesthetic that our mommy demographic absolutely loves.', 'MiMi', 'Baby & Mommy Clothing', true, 2),
('The attention to detail Creatify brought to our jewellery brand was unmatched. Everything looks premium, luxurious and highly professional.', 'Significance', 'Jewellery', true, 3),
('Creatify gave our Sunday league squad a professional edge. The graphics and branding make us look like a top-tier team on and off the pitch.', 'Imperial AC', 'Community Football Club', true, 4),
('Creatify perfectly captured our mission to provide safe hubs for students in South Africa. The design is approachable, friendly and exactly what we needed.', 'HeadsUp', 'Student Safety Hub', true, 5)
) as seed(quote, client_name, client_role, published, sort_order)
where not exists (select 1 from public.testimonials);

insert into public.faqs (question, answer, published, sort_order)
select * from (values
('What services does Creatify offer?', 'We specialise in brand identity, website design, UI/UX, digital campaigns, print communication, packaging, motion design and creative direction.', true, 1),
('How long does a typical project take?', 'Timelines depend on scope. Smaller design projects may take several working days, while full identities and websites usually take between four and twelve weeks.', true, 2),
('What is your design process?', 'Our process generally includes discovery, research, creative direction, design development, refinement and final delivery. Each stage is adapted to the project.', true, 3),
('Do you work with clients internationally?', 'Yes. Creatify is based in South Africa and works remotely with clients locally and internationally.', true, 4),
('What are your pricing structures?', 'Projects are quoted according to scope, complexity, timing and deliverables. After a discovery conversation, we provide a clear proposal before work begins.', true, 5)
) as seed(question, answer, published, sort_order)
where not exists (select 1 from public.faqs);

insert into public.stats (value, label, published, sort_order)
select * from (values
('150+', 'Projects Delivered', true, 1),
('5+', 'Years Combined Experience', true, 2),
('30+', 'Brands Supported', true, 3),
('8+', 'Design Fields Covered', true, 4)
) as seed(value, label, published, sort_order)
where not exists (select 1 from public.stats);

-- AFTER creating your dashboard user in Authentication > Users, run:
-- insert into public.admin_users (user_id) values ('PASTE-THE-AUTH-USER-UUID-HERE');
