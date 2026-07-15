# Creatify Studios Website

A complete, deploy-ready creative studio website with a private Supabase-powered admin dashboard.

## Included

- Responsive public portfolio website
- Animated homepage and project showcase
- Project detail modal
- Services, studio story, statistics, testimonials, clients and FAQs
- Working project enquiry form
- Private email/password admin login
- Live CRUD editing for projects, services, clients and logos, testimonials, FAQs and statistics
- Global website copy editor
- Supabase Storage uploads for project covers and client logos
- Contact enquiry inbox inside the dashboard
- Row Level Security policies
- Vercel SPA routing configuration
- Built-in fallback content before Supabase is connected

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL shown by Vite. The public website will work with demo content before Supabase is connected.

## Connect Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In **Authentication > Users**, create your admin user with an email and password.
4. Copy that user's UUID.
5. Run this in the SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('PASTE-THE-AUTH-USER-UUID-HERE');
```

6. Open **Project Settings > API** and copy the Project URL and anon/public key.
7. Create `.env` from `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

8. Restart the development server.
9. Visit `/admin`, sign in, and edit the site.

Do not put the Supabase service-role key in this project. The browser should only use the anon key. Access is protected by Row Level Security and the `admin_users` table.

## Deploy to Vercel

1. Push the folder to GitHub.
2. Import the repository into Vercel.
3. Add the two environment variables in **Vercel > Project Settings > Environment Variables**.
4. Deploy.

Vercel detects Vite automatically. `vercel.json` is included so `/admin` and `/admin/dashboard` work when opened directly or refreshed.

## Admin dashboard sections

- **Overview:** content totals and quick workflow
- **Projects:** title, category, year, descriptions, cover image, external URL, featured status, publish status and order
- **Services:** service copy, icon, publish status and order
- **Clients & Logos:** client name, uploaded logo, website link and order
- **Testimonials:** quote, client name and client type
- **FAQs:** question, answer and order
- **Numbers:** value and label
- **Site Settings:** homepage and footer copy, contact details and CTA labels
- **Enquiries:** messages submitted through the public contact form

## Replacing demo images

The initial project art is stored in `public/projects`. After Supabase is connected, open the dashboard, edit a project and upload a real cover image. The file is uploaded to the public `creatify-media` bucket and appears on the public site immediately.

## Recommended production checks

- Replace placeholder contact email and social links
- Confirm every published testimonial is approved for public use
- Upload actual client logos and project covers
- Replace or remove demo projects that are not real case studies
- Add real Privacy Policy and Terms pages before collecting formal client data
- Test the contact form and admin login on the live domain
