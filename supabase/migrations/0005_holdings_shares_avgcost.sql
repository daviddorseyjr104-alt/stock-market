-- ─────────────────────────────────────────────────────────────────────────────
-- 0005 — Give portfolio_holdings the columns the app actually writes.
--
-- Run in the Supabase SQL editor after 0004. Idempotent.
--
-- The live table was created from an OLDER schema that stored a percentage
-- `allocation` per holding. The app has long since moved to real paper trading
-- and writes `shares` + `avg_cost` — columns that do not exist on the table.
--
-- Every portfolio save to Supabase has therefore been failing with
-- PGRST204 ("Could not find the 'avg_cost' column") since that change, and the
-- repository discarded the error, so nothing ever surfaced: portfolios looked
-- fine locally and were never actually stored. (The error checking added in the
-- same change as this migration is what made it visible.)
-- ─────────────────────────────────────────────────────────────────────────────

alter table portfolio_holdings
  add column if not exists shares   numeric not null default 0,
  add column if not exists avg_cost numeric not null default 0;

-- `allocation` is the vestige of the old percentage model. Keep the column (in
-- case anything still references it) but stop it blocking inserts that omit it.
alter table portfolio_holdings
  alter column allocation drop not null;

-- Paper trading: a holding is meaningless without a positive size and basis.
alter table portfolio_holdings
  drop constraint if exists portfolio_holdings_shares_nonneg;
alter table portfolio_holdings
  add constraint portfolio_holdings_shares_nonneg check (shares >= 0);

alter table portfolio_holdings
  drop constraint if exists portfolio_holdings_avg_cost_nonneg;
alter table portfolio_holdings
  add constraint portfolio_holdings_avg_cost_nonneg check (avg_cost >= 0);

-- PostgREST caches the schema; tell it to reload so the new columns are
-- immediately writable without waiting for the next restart.
notify pgrst, 'reload schema';
