# Restaurant Rush Academy

Restaurant Rush Academy is a browser-based classroom restaurant simulation built for 7th, 8th, and 9th grade culinary / Family and Consumer Sciences students. The MVP is designed for school Chromebooks, short class sessions, Supabase persistence, and a teacher workflow that stays simple.

## What is included

- Next.js App Router + TypeScript + Tailwind CSS app shell
- Public landing page and demo login flows
- Student dashboard with restaurant setup, scenario map, menu planner, business view, and achievements
- 12 seeded semester scenarios
- 4 working browser-friendly cooking station experiences:
  - Prep station
  - Line station
  - Baking station
  - Front-of-house / plating station
- Autosave API plus offline-first local save fallback
- Teacher dashboard, classes, assignments, content CMS, reports, and settings pages
- Normalized Supabase schema and seed SQL
- Demo seeding scripts for content and demo users
- Vercel-ready structure

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Fill in the Supabase values in `.env.local`.

4. Start the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Required environment variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_PASSWORD=your-db-password
DEMO_TEACHER_EMAIL=chef.teacher@school.edu
DEMO_STUDENT_EMAIL=jamie.student@school.edu
DEFAULT_CLASS_CODE=RRA-101
```

### What each variable does

- `NEXT_PUBLIC_APP_URL`: Base app URL for local dev or production links.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public browser key for auth and client reads.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only key used by seed/admin scripts.
- `SUPABASE_DB_PASSWORD`: Needed for Supabase CLI workflows if you run local migrations.
- `DEMO_TEACHER_EMAIL`: Seeded teacher demo account.
- `DEMO_STUDENT_EMAIL`: Seeded student demo account.
- `DEFAULT_CLASS_CODE`: Default demo section code shown in the UI.

## Connect Supabase

1. Create a new Supabase project.
2. In Supabase, open `Project Settings -> API`.
3. Copy:
   - Project URL into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key into `SUPABASE_SERVICE_ROLE_KEY`
4. Run the SQL in [20260317193000_initial_schema.sql](/Users/rileyhamilton/Desktop/Coding/restaurant-rush-academy/supabase/migrations/20260317193000_initial_schema.sql).
5. Run the SQL in [demo_seed.sql](/Users/rileyhamilton/Desktop/Coding/restaurant-rush-academy/supabase/seed/demo_seed.sql).
6. Optional: run demo user + scenario seeding with:

```bash
npm run seed:supabase
```

`npm run seed:demo` is a lightweight local content check. `npm run seed:supabase` is the script that creates demo auth users and writes scenario rows into Supabase.

## Deploy to Vercel

1. Push this project to GitHub.
2. Create a new Vercel project and import the repo.
3. In Vercel, add all environment variables from `.env.local`.
4. Set the production values:
   - `NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app`
   - Supabase URL and keys from the live Supabase project
5. Deploy.

Vercel will detect Next.js automatically. No extra build configuration is required for this MVP.

### Fastest way to get a real website link

1. Put this folder in a GitHub repo.
2. Import that repo into Vercel.
3. Add the Supabase environment variables in Vercel.
4. Click `Deploy`.
5. Vercel will give you a live link like `https://your-project.vercel.app`.

That Vercel URL is the HTML/website link students and teachers can open directly in a browser.

## Create a public app link

After deployment, Vercel gives you a production URL such as:

`https://restaurant-rush-academy.vercel.app`

That becomes the public browser link students can open on school Chromebooks. If you later add a custom domain, use that instead and update `NEXT_PUBLIC_APP_URL`.

## Teacher workflow

### How a teacher creates classes and tracks students

1. Teacher signs in with school email.
2. Teacher creates a class and one or more sections in the Classes area.
3. The app generates a class code for each section.
4. Students sign in with school email + class code.
5. Teachers assign scenarios from the Assignments area.
6. Teachers track:
   - completion
   - time played
   - sanitation mistakes
   - scenario scores
   - standards progress
   - where students got stuck

### How to archive a semester and copy it to the next term

1. Open the teacher dashboard.
2. Archive the old class term.
3. Duplicate the archived class into a new term.
4. Keep old analytics in archived tables or archived class rows.
5. Issue new section class codes if needed.

The included API stubs for `/api/teacher/archive` and `/api/teacher/reset` show where to connect those workflows to Supabase mutations.

## Recommended V2 features

- Real Supabase-authenticated login and route guards
- Richer action logging and replay timeline
- Full bilingual scaffold packs
- Avatar asset system and moderation queue
- More minigame variations per station
- Multi-location expansion and equipment upgrade trees
- Teacher-created custom standards mappings
- Smarter leaderboard filters and opt-in competition settings
- Offline queue syncing for flaky networks

## Notes

- This MVP intentionally favors reliability and maintainability over heavy graphics.
- The station simulator uses responsive “first-person-style” action panels instead of a 3D engine.
- Autosave currently uses local storage as an offline fallback even when Supabase is unavailable.
