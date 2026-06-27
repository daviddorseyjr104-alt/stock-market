-- ════════════════════════════════════════════════════════════════════════
-- Campus Capital — Seed data (catalog tables)
-- Run AFTER schema.sql + rls.sql. Idempotent via ON CONFLICT.
-- Full lesson bodies + quizzes live in the app data layer (lib/data/*) and can
-- be backfilled here; this seed covers the catalog + leaderboard so the
-- product is populated on first boot.
-- ════════════════════════════════════════════════════════════════════════

-- ── Schools (11) ──────────────────────────────────────────────────────────
insert into schools (id, name, short_name, location, emoji, color) values
  ('ucla','University of California, Los Angeles','UCLA','Los Angeles, CA','🐻','from-sky-400 to-amber-400'),
  ('usc','University of Southern California','USC','Los Angeles, CA','✌️','from-rose-500 to-amber-400'),
  ('berkeley','UC Berkeley','Berkeley','Berkeley, CA','🐻','from-blue-500 to-amber-300'),
  ('stanford','Stanford University','Stanford','Stanford, CA','🌲','from-rose-600 to-rose-400'),
  ('howard','Howard University','Howard','Washington, D.C.','🦬','from-red-500 to-blue-600'),
  ('nyu','New York University','NYU','New York, NY','🗽','from-violet-500 to-fuchsia-500'),
  ('michigan','University of Michigan','Michigan','Ann Arbor, MI','〽️','from-blue-700 to-amber-400'),
  ('texas','University of Texas at Austin','Texas','Austin, TX','🤘','from-orange-500 to-amber-400'),
  ('gsu','Georgia State University','Georgia State','Atlanta, GA','🐾','from-blue-600 to-sky-400'),
  ('spelman','Spelman College','Spelman','Atlanta, GA','💙','from-rose-500 to-fuchsia-500'),
  ('morehouse','Morehouse College','Morehouse','Atlanta, GA','🐯','from-rose-600 to-amber-500')
on conflict (id) do nothing;

-- ── Leaderboard cache ─────────────────────────────────────────────────────
insert into schools_leaderboard (school_id, total_xp, active_students, weekly_growth, top_student) values
  ('ucla',1284500,3120,12.4,'Davon Carter'),
  ('usc',1190200,2870,9.1,'Maya Lin'),
  ('berkeley',1342900,3410,14.8,'Andre Diallo'),
  ('stanford',1098700,2210,7.6,'Priya Raman'),
  ('howard',1411300,3680,18.2,'Jordan Banks'),
  ('nyu',1255100,3040,10.7,'Sofia Russo'),
  ('michigan',1208400,2950,8.9,'Tyler Novak'),
  ('texas',1176800,2810,11.3,'Camila Reyes'),
  ('gsu',1320600,3520,16.5,'Marcus Hill'),
  ('spelman',1389900,1980,21.4,'Imani Brooks'),
  ('morehouse',1276400,1720,19.7,'Elijah Grant')
on conflict (school_id) do nothing;

-- ── Modules (5) ───────────────────────────────────────────────────────────
insert into lesson_modules (id, letter, title, description, color, icon, sort_order) values
  ('start-here','A','Start Here','The mindset and first principles of investing.','from-capital-400 to-capital-600','Rocket',1),
  ('money-foundation','B','Student Money Foundation','Budgeting, debt, credit and income.','from-sky-400 to-violet-500','Wallet',2),
  ('market-basics','C','Market Basics','Stocks, ETFs, index funds, bonds and dividends.','from-amber-400 to-orange-500','LineChart',3),
  ('wealth-early','D','Building Wealth Early','Roth IRAs, brokerage accounts, automation.','from-fuchsia-500 to-violet-600','TrendingUp',4),
  ('advanced-path','E','Advanced Student Path','Valuation, statements, allocation, behavior.','from-rose-500 to-fuchsia-500','BrainCircuit',5)
on conflict (id) do nothing;

-- ── Lessons (20) — catalog metadata ───────────────────────────────────────
insert into lessons (id, module_id, sort_order, title, difficulty, minutes, xp, summary) values
  ('what-is-investing','start-here',1,'What is investing, really?','Beginner',5,50,'Putting money to work so it grows without trading hours for it.'),
  ('why-students-early','start-here',2,'Why students should learn early','Beginner',4,50,'Your biggest asset in college is the decades of time ahead of you.'),
  ('saving-vs-investing','start-here',3,'Saving vs. investing','Beginner',5,50,'Saving protects money for soon; investing grows money for later.'),
  ('risk-explained','start-here',4,'Risk, explained simply','Beginner',5,60,'Risk is the range of outcomes you sign up for, not just loss.'),
  ('compound-interest','start-here',5,'Compound interest: the snowball','Beginner',6,70,'Earning returns on your returns — growth that accelerates.'),
  ('budgeting-college','money-foundation',1,'Budgeting in college','Beginner',5,50,'A plan that tells your money where to go before it disappears.'),
  ('emergency-funds','money-foundation',2,'Emergency funds','Beginner',4,50,'The cash cushion that keeps a bad week from becoming debt.'),
  ('credit-cards','money-foundation',3,'Credit cards & credit scores','Beginner',6,60,'Used right, a card builds your score for free.'),
  ('student-loans','money-foundation',4,'Student loans, demystified','Intermediate',6,70,'The rate and type decide how heavy the debt really is.'),
  ('when-not-to-invest','money-foundation',5,'When NOT to invest yet','Beginner',4,50,'Sometimes paying off debt or building a cushion comes first.'),
  ('stocks','market-basics',1,'Stocks: owning a slice','Beginner',5,60,'A stock is a tiny ownership share of a real company.'),
  ('etfs','market-basics',2,'ETFs: a basket in one click','Beginner',5,60,'An ETF bundles many investments into one for instant diversification.'),
  ('index-funds','market-basics',3,'Index funds: owning the whole market','Beginner',5,60,'Tracks a whole index — simple, cheap, hard to beat.'),
  ('bonds','market-basics',4,'Bonds: lending instead of owning','Intermediate',5,60,'A loan you make in exchange for steady interest.'),
  ('dividends','market-basics',5,'Dividends & market indexes','Intermediate',5,60,'Profit payments to owners; indexes are the market scoreboards.'),
  ('roth-ira','wealth-early',1,'The Roth IRA: a student''s secret weapon','Intermediate',6,80,'Investments grow and are withdrawn tax-free in retirement.'),
  ('brokerage-accounts','wealth-early',2,'Brokerage accounts 101','Beginner',4,60,'The flexible place where you buy and hold investments.'),
  ('dollar-cost-averaging','wealth-early',3,'Dollar-cost averaging','Beginner',5,70,'Investing a fixed amount on a schedule removes emotion.'),
  ('long-term-automation','wealth-early',4,'Long-term investing & automation','Beginner',5,70,'Set it, automate it, and let time do the work.'),
  ('valuation-basics','advanced-path',1,'Valuation basics','Advanced',7,90,'Is this company''s price fair for what you''re getting?'),
  ('financial-statements','advanced-path',2,'Reading financial statements','Advanced',7,90,'Income, balance sheet and cash flow reveal real health.'),
  ('portfolio-allocation','advanced-path',3,'Portfolio allocation & risk management','Advanced',6,90,'How you split money across assets drives most results.'),
  ('behavioral-finance','advanced-path',4,'Behavioral finance & economic cycles','Advanced',6,90,'Your emotions and the economy''s cycles are real risks.')
on conflict (id) do nothing;

-- ── Badges (10) ───────────────────────────────────────────────────────────
insert into badges (id, name, description, icon, color, rarity) values
  ('first-lesson','First Lesson','Completed your very first lesson.','Sparkles','from-capital-400 to-capital-600','Common'),
  ('etf-explorer','ETF Explorer','Finished the full ETF & index fund track.','Compass','from-sky-400 to-violet-500','Rare'),
  ('compound-king','Compound King','Mastered compound interest.','Crown','from-amber-400 to-amber-600','Epic'),
  ('budget-builder','Budget Builder','Built your first student budget plan.','Wallet','from-emerald-400 to-capital-500','Common'),
  ('risk-manager','Risk Manager','Learned to size positions and manage risk.','ShieldCheck','from-blue-400 to-indigo-500','Rare'),
  ('roth-rookie','Roth Rookie','Opened your first mock Roth IRA strategy.','PiggyBank','from-rose-400 to-fuchsia-500','Common'),
  ('campus-top-10','Campus Top 10','Reached the top 10 on your campus.','Medal','from-amber-300 to-orange-500','Epic'),
  ('streak-7','7-Day Streak','Learned 7 days in a row.','Flame','from-orange-400 to-rose-500','Rare'),
  ('streak-30','30-Day Streak','A full month of daily learning.','Zap','from-fuchsia-500 to-violet-600','Legendary'),
  ('diversified','Diversified','Built a portfolio across 4+ asset types.','PieChart','from-capital-300 to-sky-500','Rare')
on conflict (id) do nothing;

-- ── Clubs (8) ─────────────────────────────────────────────────────────────
insert into clubs (id, name, tagline, emoji, color, school_scope, learning_goal, weekly_challenge) values
  ('ucla-investors','UCLA Student Investors','Bruins building portfolios before payday.','🐻','from-sky-400 to-amber-400','single','Everyone builds a diversified mock portfolio by midterms.','Build your first mock ETF portfolio'),
  ('black-wealth','Black Wealth Builders','Generational wealth starts on campus.','👑','from-amber-400 to-rose-500','national','Master long-term wealth-building fundamentals.','Create a $100/month investing plan'),
  ('first-gen','First-Gen Finance','No family playbook? We''ll write one together.','🌱','from-capital-400 to-emerald-500','national','Build financial confidence from zero.','Understand Roth IRA basics'),
  ('women-investing','Women in Investing','Closing the gap, one share at a time.','💜','from-fuchsia-500 to-violet-600','national','Every member opens a mock Roth IRA strategy.','Compare saving vs investing'),
  ('transfer-investors','Transfer Student Investors','New campus, same financial goals.','🔁','from-blue-400 to-capital-400','national','Get every transfer to a 7-day streak.','Learn compound interest in 5 minutes'),
  ('entrepreneurship-markets','Entrepreneurship & Markets','Founders who understand the money game.','🚀','from-violet-500 to-fuchsia-500','national','Finish valuation and financial-statements lessons.','Make an internship paycheck plan'),
  ('usc-traders','USC Market Movers','Trojans tracking the market together.','✌️','from-rose-500 to-amber-400','single','Top the USC simulator leaderboard.','Explain diversification to a friend'),
  ('atlanta-collective','ATL Campus Collective','Spelman × Morehouse × Georgia State.','🍑','from-orange-500 to-rose-500','national','Win the regional school-vs-school cup.','Build a debt payoff vs investing decision tree')
on conflict (id) do nothing;

-- ── Challenges (10) ───────────────────────────────────────────────────────
insert into challenges (id, title, description, goal, xp, badge_id, deadline_days, category, icon) values
  ('first-mock-etf','Build your first mock ETF portfolio','Construct a diversified ETF-based portfolio.','Add at least 3 ETF or index-fund holdings.',150,'diversified',5,'Simulator','PieChart'),
  ('compound-5min','Learn compound interest in 5 minutes','See why time is your biggest advantage.','Finish the compound interest lesson and quiz.',100,'compound-king',3,'Learning','Sparkles'),
  ('100-month-plan','Create a $100/month investing plan','Design a realistic automated monthly plan.','Map out where $100/month would go.',120,null,7,'Planning','CalendarClock'),
  ('save-vs-invest','Compare saving vs investing','Understand when to save and when to invest.','Finish the saving-vs-investing lesson.',90,null,4,'Learning','Scale'),
  ('roth-basics','Understand Roth IRA basics','Learn the student''s secret weapon.','Complete the Roth IRA lesson.',130,'roth-rookie',6,'Learning','PiggyBank'),
  ('debt-vs-invest-tree','Build a debt payoff vs investing decision tree','Decide when to attack debt vs invest.','Outline your own decision rules.',140,null,7,'Planning','GitBranch'),
  ('internship-paycheck','Make an internship paycheck plan','Split a paycheck into saving, investing, living.','Build a percentage plan.',120,null,10,'Planning','Briefcase'),
  ('explain-diversification','Explain diversification to a friend','Teach it in your own words.','Write a Campus post explaining diversification.',80,null,3,'Social','Users'),
  ('7-day-streak','Hit a 7-day learning streak','Build the habit that compounds.','One lesson per day for 7 days.',200,'streak-7',7,'Habit','Flame'),
  ('budget-builder-challenge','Build your first student budget','Create a 50/30/20 budget.','Finish the budgeting lesson and draft a budget.',100,'budget-builder',5,'Planning','Wallet')
on conflict (id) do nothing;
