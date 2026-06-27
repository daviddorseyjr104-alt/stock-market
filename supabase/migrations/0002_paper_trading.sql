-- ════════════════════════════════════════════════════════════════════════
-- Migration 0002 — Paper-trading model
-- Run this in the Supabase SQL Editor if you applied setup.sql BEFORE the
-- live-prices/paper-trading update. Safe to run multiple times.
-- Adds shares + avg_cost to portfolio_holdings (replacing the allocation model).
-- ════════════════════════════════════════════════════════════════════════

alter table portfolio_holdings add column if not exists shares   numeric default 0;
alter table portfolio_holdings add column if not exists avg_cost numeric default 0;

-- The old percentage-allocation column is no longer used (kept harmless if present).
-- alter table portfolio_holdings drop column if exists allocation;
