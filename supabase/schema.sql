-- Drop existing tables and types to start fresh
drop table if exists public.reviews cascade;
drop table if exists public.bookings cascade;
drop table if exists public.services cascade;
drop table if exists public.profiles cascade;
drop type if exists booking_status cascade;
drop function if exists public.handle_new_user cascade;
-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text not null,
  avatar_url text,
  role text check (role in ('client', 'provider')) not null default 'client',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Turn on row level security for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);
-- 2. Trigger for creating profile on user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- 3. Create Services Table
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  provider text not null, -- provider name (denormalized for simplicity)
  rating numeric(3,2) default 5.0,
  review_count integer default 0,
  price numeric(10,2) not null,
  price_unit text not null,
  description text not null,
  experience text, -- Added experience field
  image_url text,
  tags text[] default '{}',
  location text not null,
  availability text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;
create policy "Services are viewable by everyone" on services for select using (true);
create policy "Providers can insert own services" on services for insert with check (auth.uid() = provider_id);
create policy "Providers can update own services" on services for update using (auth.uid() = provider_id);
create policy "Providers can delete own services" on services for delete using (auth.uid() = provider_id);

-- 4. Create Bookings Table
create type booking_status as enum ('pending', 'upcoming', 'completed', 'cancelled', 'paid');
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  service_title text not null,
  provider text not null,
  date text not null,
  time text not null,
  status booking_status default 'pending',
  price numeric(10,2) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.bookings enable row level security;
-- Clients can see their bookings. Providers can see bookings for their services.
create policy "Users can view own bookings" on bookings for select using (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT provider_id FROM services WHERE id = service_id)
);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own or related bookings" on bookings for update using (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT provider_id FROM services WHERE id = service_id)
);
-- 5. Create Reviews Table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Authenticated users can insert reviews" on reviews for insert with check (auth.role() = 'authenticated')