-- 1. Customers
create table if not exists customers (
  id uuid references auth.users not null primary key,
  stripe_customer_id text,
  created_at timestamptz default now()
);
alter table customers enable row level security;
create policy "Users can read their own customer data" on customers for select using (auth.uid() = id);

-- 2. Products
create table if not exists products (
  id text primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);
alter table products enable row level security;
create policy "Anyone can read active products" on products for select using (true);

-- 3. Prices
create table if not exists prices (
  id text primary key,
  product_id text references products,
  active boolean,
  descrip text,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type text check (type in ('one_time', 'recurring')),
  interval text check (interval in ('day', 'week', 'month', 'year')),
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);
alter table prices enable row level security;
create policy "Anyone can read active prices" on prices for select using (true);

-- 4. Subscriptions
create table if not exists subscriptions (
  id text primary key,
  user_id uuid references auth.users not null,
  status text check (status in ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused')),
  metadata jsonb,
  price_id text references prices,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamptz default now(),
  current_period_start timestamptz default now(),
  current_period_end timestamptz default now(),
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz
);
alter table subscriptions enable row level security;
create policy "Users can read own subscriptions" on subscriptions for select using (auth.uid() = user_id);

-- 5. Connect Accounts (Marketplace)
create table if not exists connect_accounts (
  user_id uuid references auth.users not null primary key,
  stripe_account_id text unique,
  charges_enabled boolean default false,
  payouts_enabled boolean default false,
  created_at timestamptz default now()
);
alter table connect_accounts enable row level security;
create policy "Users can read own connect account" on connect_accounts for select using (auth.uid() = user_id);
