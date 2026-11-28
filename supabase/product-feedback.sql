begin;

create table if not exists public.product_feedback (
  id uuid primary key default gen_random_uuid(),
  product_id text not null check (product_id in ('sunday', 'morning', 'beanie', 'cloud', 'warmth', 'winter')),
  author_id uuid references auth.users(id) on delete set null default auth.uid(),
  rating smallint check (rating between 1 and 5),
  body text not null check (length(body) <= 1000 and body ~ '[^[:space:]]'),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_feedback_public_feed
  on public.product_feedback (product_id, created_at desc, id desc) where approved;

alter table public.product_feedback enable row level security;
revoke all on public.product_feedback from public, anon, authenticated;
grant select (id, product_id, rating, body, created_at) on public.product_feedback to anon, authenticated;
grant insert (product_id, rating, body) on public.product_feedback to authenticated;

drop policy if exists "Read approved feedback" on public.product_feedback;
create policy "Read approved feedback" on public.product_feedback
  for select to anon, authenticated using (approved);

drop policy if exists "Submit own feedback for moderation" on public.product_feedback;
create policy "Submit own feedback for moderation" on public.product_feedback
  for insert to authenticated with check (author_id = (select auth.uid()) and not approved);

commit;
