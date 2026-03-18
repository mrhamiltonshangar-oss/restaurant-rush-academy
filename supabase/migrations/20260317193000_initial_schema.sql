create extension if not exists "pgcrypto";

create type public.app_role as enum ('teacher', 'student');
create type public.game_mode as enum ('individual', 'team');
create type public.restaurant_theme as enum ('cafe', 'bakery', 'diner', 'food-truck', 'fantasy-tavern');
create type public.scenario_mode as enum ('tutorial', 'guided', 'challenge');
create type public.station_type as enum ('prep', 'line', 'baking', 'front-of-house');
create type public.assignment_status as enum ('assigned', 'in_progress', 'completed', 'archived');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 40),
  email text not null unique,
  role public.app_role not null,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null,
  school_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles(user_id) on delete cascade,
  name text not null,
  term_label text not null,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  name text not null,
  class_code text not null unique,
  mode public.game_mode not null default 'individual',
  leaderboard_enabled boolean not null default false,
  simplified_instructions_default boolean not null default false,
  larger_text_default boolean not null default false,
  reduced_motion_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  home_language text,
  accessibility_settings jsonb not null default '{}'::jsonb,
  current_section_id uuid references public.sections(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  name text not null,
  shared_restaurant_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (section_id, student_id)
);

create table if not exists public.teacher_settings (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles(user_id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  completion_weight numeric(5,2) not null default 50,
  safety_weight numeric(5,2) not null default 25,
  reflection_weight numeric(5,2) not null default 15,
  challenge_weight numeric(5,2) not null default 10,
  team_mode_enabled boolean not null default false,
  leaderboard_enabled boolean not null default false,
  simplified_instructions_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.scenarios (
  id text primary key,
  slug text not null unique,
  week_number integer not null,
  title text not null,
  subtitle text not null,
  summary text not null,
  difficulty integer not null,
  estimated_minutes integer not null,
  mode public.scenario_mode not null,
  unit_tag text not null,
  standard_tags text[] not null default '{}',
  station_order public.station_type[] not null default '{}'
);

create table if not exists public.scenario_steps (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null references public.scenarios(id) on delete cascade,
  step_key text not null,
  title text not null,
  description text not null,
  station public.station_type,
  duration_minutes integer not null default 5,
  vocabulary text[] not null default '{}',
  sequence_order integer not null,
  unique (scenario_id, step_key)
);

create table if not exists public.reflection_prompts (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null references public.scenarios(id) on delete cascade,
  prompt text not null,
  standard_tag text not null
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  unlock_week integer not null default 1
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.student_profiles(user_id) on delete cascade,
  owner_team_id uuid references public.teams(id) on delete cascade,
  name text not null,
  theme public.restaurant_theme not null,
  tagline text,
  location_id uuid references public.locations(id) on delete set null,
  cash integer not null default 1000,
  inventory_health integer not null default 100,
  staff_morale integer not null default 100,
  customer_satisfaction integer not null default 100,
  reputation integer not null default 0,
  stars integer not null default 0,
  created_at timestamptz not null default now(),
  check ((owner_user_id is not null) <> (owner_team_id is not null))
);

alter table public.teams
  add constraint teams_shared_restaurant_id_fkey
  foreign key (shared_restaurant_id) references public.restaurants(id) on delete set null;

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  unit text not null,
  shelf_life_days integer,
  cost_per_unit numeric(8,2) not null default 0
);

create table if not exists public.allergens (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  unit_tag text not null,
  station public.station_type not null,
  summary text not null,
  base_price numeric(8,2) not null default 0,
  estimated_minutes integer not null,
  skill_level integer not null default 1,
  is_template boolean not null default true
);

create table if not exists public.recipe_ingredients (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  quantity numeric(8,2) not null,
  primary key (recipe_id, ingredient_id)
);

create table if not exists public.recipe_allergens (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  allergen_id uuid not null references public.allergens(id) on delete cascade,
  primary key (recipe_id, allergen_id)
);

create table if not exists public.recipe_substitutions (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  substitution_text text not null
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null references public.scenarios(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  section_id uuid references public.sections(id) on delete cascade,
  assigned_by uuid not null references public.teacher_profiles(user_id) on delete cascade,
  due_at timestamptz,
  grading_enabled boolean not null default true,
  status public.assignment_status not null default 'assigned',
  unique (scenario_id, section_id)
);

create table if not exists public.menu_plans (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  assignment_id uuid references public.assignments(id) on delete set null,
  title text not null,
  menu_feedback text,
  food_cost_percentage numeric(5,2),
  created_at timestamptz not null default now()
);

create table if not exists public.menu_plan_recipes (
  menu_plan_id uuid not null references public.menu_plans(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  selling_price numeric(8,2) not null,
  primary key (menu_plan_id, recipe_id)
);

create table if not exists public.business_metrics (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  scenario_id text references public.scenarios(id) on delete set null,
  cash_delta integer not null default 0,
  inventory_delta integer not null default 0,
  morale_delta integer not null default 0,
  satisfaction_delta integer not null default 0,
  reputation_delta integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.minigame_attempts (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id) on delete set null,
  student_id uuid references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  scenario_id text not null references public.scenarios(id) on delete cascade,
  step_id uuid references public.scenario_steps(id) on delete set null,
  station public.station_type not null,
  score integer not null default 0,
  completed boolean not null default false,
  duration_seconds integer not null default 0,
  attempt_number integer not null default 1,
  created_at timestamptz not null default now(),
  check ((student_id is not null) <> (team_id is not null))
);

create table if not exists public.cooking_metrics (
  id uuid primary key default gen_random_uuid(),
  minigame_attempt_id uuid not null references public.minigame_attempts(id) on delete cascade,
  metric_type text not null,
  metric_value numeric(8,2) not null,
  notes text
);

create table if not exists public.sanitation_events (
  id uuid primary key default gen_random_uuid(),
  minigame_attempt_id uuid not null references public.minigame_attempts(id) on delete cascade,
  event_type text not null,
  severity integer not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.reflection_responses (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.reflection_prompts(id) on delete cascade,
  assignment_id uuid references public.assignments(id) on delete set null,
  student_id uuid references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  response_text text not null,
  created_at timestamptz not null default now(),
  check ((student_id is not null) <> (team_id is not null))
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text not null,
  category text not null
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  student_id uuid references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  check ((student_id is not null) <> (team_id is not null))
);

create table if not exists public.leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  scenario_id text references public.scenarios(id) on delete set null,
  student_id uuid references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  display_name text not null,
  score integer not null default 0,
  stars integer not null default 0,
  recorded_at timestamptz not null default now(),
  check ((student_id is not null) <> (team_id is not null))
);

create table if not exists public.game_saves (
  id text primary key,
  user_id uuid references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  scenario_slug text not null,
  step_id text not null,
  station public.station_type,
  checkpoint_label text not null,
  progress_percent integer not null default 0,
  timer_seconds_remaining integer not null default 0,
  score integer not null default 0,
  save_blob jsonb not null,
  updated_at timestamptz not null default now(),
  check ((user_id is not null) <> (team_id is not null))
);

create table if not exists public.event_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.student_profiles(user_id) on delete cascade,
  team_id uuid references public.teams(id) on delete cascade,
  teacher_id uuid references public.teacher_profiles(user_id) on delete cascade,
  event_type text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_sections_class_id on public.sections(class_id);
create index if not exists idx_enrollments_section_id on public.enrollments(section_id);
create index if not exists idx_assignments_section_id on public.assignments(section_id);
create index if not exists idx_scenario_steps_scenario_id on public.scenario_steps(scenario_id);
create index if not exists idx_minigame_attempts_student_id on public.minigame_attempts(student_id);
create index if not exists idx_game_saves_user_id on public.game_saves(user_id);
create index if not exists idx_game_saves_team_id on public.game_saves(team_id);
create index if not exists idx_event_logs_student_id on public.event_logs(student_id);
create index if not exists idx_event_logs_team_id on public.event_logs(team_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, first_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'student')
  )
  on conflict (id) do nothing;

  if coalesce(new.raw_user_meta_data->>'role', 'student') = 'teacher' then
    insert into public.teacher_profiles (user_id, display_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'first_name', 'Teacher'))
    on conflict (user_id) do nothing;
  else
    insert into public.student_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.classes enable row level security;
alter table public.sections enable row level security;
alter table public.enrollments enable row level security;
alter table public.teams enable row level security;
alter table public.assignments enable row level security;
alter table public.minigame_attempts enable row level security;
alter table public.game_saves enable row level security;
alter table public.reflection_responses enable row level security;
alter table public.business_metrics enable row level security;
alter table public.event_logs enable row level security;
alter table public.menu_plans enable row level security;

create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id);

create policy "teacher own profile" on public.teacher_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "student own profile" on public.student_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "teacher manages classes" on public.classes
  for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

create policy "teacher manages sections" on public.sections
  for all using (
    exists (
      select 1 from public.classes
      where classes.id = sections.class_id and classes.teacher_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.classes
      where classes.id = sections.class_id and classes.teacher_id = auth.uid()
    )
  );

create policy "student reads own enrollment" on public.enrollments
  for select using (student_id = auth.uid());

create policy "teacher manages enrollments" on public.enrollments
  for all using (
    exists (
      select 1
      from public.sections
      join public.classes on classes.id = sections.class_id
      where sections.id = enrollments.section_id and classes.teacher_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.sections
      join public.classes on classes.id = sections.class_id
      where sections.id = enrollments.section_id and classes.teacher_id = auth.uid()
    )
  );

create policy "student reads assignments in enrolled section" on public.assignments
  for select using (
    exists (
      select 1
      from public.enrollments
      where enrollments.section_id = assignments.section_id and enrollments.student_id = auth.uid()
    )
  );

create policy "teacher manages assignments" on public.assignments
  for all using (assigned_by = auth.uid()) with check (assigned_by = auth.uid());

create policy "student manages own attempts" on public.minigame_attempts
  for all using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "student manages own saves" on public.game_saves
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "student manages own reflections" on public.reflection_responses
  for all using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "student reads own menu plans" on public.menu_plans
  for select using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menu_plans.restaurant_id and restaurants.owner_user_id = auth.uid()
    )
  );

create or replace view public.teacher_progress_overview as
select
  s.id as section_id,
  s.name as section_name,
  count(distinct e.student_id) as student_count,
  count(distinct gs.user_id) as active_savers,
  coalesce(avg(gs.progress_percent), 0)::numeric(5,2) as avg_progress_percent,
  coalesce(sum(ma.duration_seconds), 0) as total_duration_seconds,
  coalesce(sum(case when se.id is not null then 1 else 0 end), 0) as sanitation_events
from public.sections s
left join public.enrollments e on e.section_id = s.id
left join public.game_saves gs on gs.user_id = e.student_id
left join public.minigame_attempts ma on ma.student_id = e.student_id
left join public.sanitation_events se on se.minigame_attempt_id = ma.id
group by s.id, s.name;
