import type { Lesson } from "@/lib/types";

// 20 fully-written lessons across the 5 modules.
// Every lesson is framed through real student money: aid, jobs, rent, internships.

export const lessons: Lesson[] = [
  // ── A. Start Here ────────────────────────────────────────────────────────
  {
    id: "what-is-investing",
    moduleId: "start-here",
    order: 1,
    title: "What is investing, really?",
    difficulty: "Beginner",
    minutes: 5,
    xp: 50,
    summary: "Investing is putting money to work so it can grow without you trading hours for it.",
    studentExample:
      "You work a 4-hour shift at the campus café and earn $60. That money stops the second you clock out. Investing is finding a way for $60 to keep 'working' after you've gone home to study.",
    body: [
      "Investing means buying something today that you expect to be worth more later — a slice of a company, a basket of companies, or a loan to a government. Unlike a paycheck, which only pays while you're on the clock, an investment can grow while you sleep, study, or sit in lecture.",
      "The trade-off is uncertainty. A paycheck is guaranteed; an investment is not. Some years it grows, some years it shrinks. Investing is the skill of accepting short-term bumps in exchange for long-term growth — and learning which bets are smart versus reckless.",
      "You don't need to be rich to start. You need to understand the rules of the game before you put real money on the table. That's exactly what Campus Capital is for: building the instincts now, so that your first real dollar is an informed one.",
    ],
    analogy:
      "Think of a paycheck as renting out your time, and investing as buying a tiny vending machine. The vending machine keeps selling snacks whether you're there or not.",
    takeaway: "Investing makes your money earn money — trading short-term certainty for long-term growth.",
    quiz: [
      { id: "q1", prompt: "What's the core difference between a paycheck and an investment?", options: ["A paycheck is taxed, an investment isn't", "A paycheck only pays while you work; an investment can grow on its own", "Investments are always safer", "There is no difference"], correctIndex: 1, explanation: "A paycheck stops when you stop working. An investment can keep growing in the background." },
      { id: "q2", prompt: "What do you give up in exchange for an investment's growth potential?", options: ["Nothing", "Short-term certainty", "Ownership", "Your paycheck"], correctIndex: 1, explanation: "Investments can rise or fall in the short term. You accept that uncertainty for long-term growth." },
      { id: "q3", prompt: "Do you need to be wealthy to start learning to invest?", options: ["Yes, you need at least $10,000", "No — understanding the rules matters more than the amount", "Only if you're a finance major", "Yes, brokerages require it"], correctIndex: 1, explanation: "Knowledge compounds before money does. Learning early is the real head start." },
    ],
  },
  {
    id: "why-students-early",
    moduleId: "start-here",
    order: 2,
    title: "Why students should learn early",
    difficulty: "Beginner",
    minutes: 4,
    xp: 50,
    summary: "Your biggest asset in college isn't money — it's the decades of time ahead of you.",
    studentExample:
      "A 19-year-old who invests $30/month from a part-time job can end up with more than a 35-year-old who invests $300/month — purely because of the extra years. Time is the cheat code only students still have a lot of.",
    body: [
      "Most people start investing in their 30s, after the most powerful years are already gone. As a student you have the one resource you can never buy back: time. Every year you start earlier multiplies into outsized results decades from now.",
      "You also have low expenses right now. You may never again have a period where ramen, a dorm, and a meal plan cover most of your life. Even tiny, consistent amounts invested during college can build a foundation that feels impossible to catch up to later.",
      "Starting early isn't about the money you have today — it's about building the habit and the knowledge while the stakes are low. Mistakes made with $50 of mock money are free lessons. Mistakes made with $50,000 at 40 are expensive ones.",
    ],
    analogy:
      "Planting a tree at 18 versus 35 — same tree, but one has 17 extra years of growth. You can't speed up a tree; you can only start sooner.",
    takeaway: "Time is the student's superpower. Starting early beats starting big.",
    quiz: [
      { id: "q1", prompt: "What is a student's biggest investing advantage?", options: ["More money", "Time", "Better tax rates", "Access to brokers"], correctIndex: 1, explanation: "Decades of growth ahead of you is something money literally cannot buy." },
      { id: "q2", prompt: "Why can small amounts matter so much in college?", options: ["They're tax-free", "Low expenses + long time horizon let them compound", "Brokerages match them", "They don't matter"], correctIndex: 1, explanation: "Low costs and a long runway turn small, consistent amounts into big outcomes." },
      { id: "q3", prompt: "Why practice with mock money first?", options: ["It's required by law", "Mistakes are free lessons instead of expensive ones", "It earns real returns", "It's faster"], correctIndex: 1, explanation: "Learning with simulated money turns mistakes into cheap, repeatable lessons." },
    ],
  },
  {
    id: "saving-vs-investing",
    moduleId: "start-here",
    order: 3,
    title: "Saving vs. investing",
    difficulty: "Beginner",
    minutes: 5,
    xp: 50,
    summary: "Saving protects money for soon; investing grows money for later. You need both.",
    studentExample:
      "Your textbook fund for next semester should be saved — you need it in months. The money you won't touch until after graduation can be invested, because it has time to ride out the bumps.",
    body: [
      "Saving means keeping money safe and accessible — a bank or high-yield savings account. It won't grow much, but it won't fall either. Use it for goals within the next 1–3 years and for emergencies.",
      "Investing means accepting ups and downs in exchange for growth over many years. The market can drop 20% in a bad year, which is fine if you won't need the money for a decade — and dangerous if you need it next month.",
      "The deciding question is your time horizon: when will you need this specific dollar? Soon-money gets saved. Later-money gets invested. Mixing those two up is one of the most common and costly beginner mistakes.",
    ],
    analogy:
      "Saving is your backpack — everything you need today within reach. Investing is a storage unit across town — more room to grow, but not for things you need right now.",
    takeaway: "Match the tool to the timeline: soon-money saves, later-money invests.",
    quiz: [
      { id: "q1", prompt: "Money you'll need next semester should be…", options: ["Invested in stocks", "Saved in a safe account", "Put in crypto", "Spent now"], correctIndex: 1, explanation: "Short-term money goes in savings so it's there when you need it." },
      { id: "q2", prompt: "What's the deciding question between saving and investing?", options: ["How much you have", "Your time horizon — when you'll need the money", "Your major", "Your credit score"], correctIndex: 1, explanation: "Time horizon decides the tool. Soon = save, later = invest." },
      { id: "q3", prompt: "Why is investing risky for short-term money?", options: ["Fees are higher", "Markets can drop right when you need the cash", "It's illegal", "Savings pays more"], correctIndex: 1, explanation: "A short-term drop can force you to sell at a loss exactly when you need the money." },
    ],
  },
  {
    id: "risk-explained",
    moduleId: "start-here",
    order: 4,
    title: "Risk, explained simply",
    difficulty: "Beginner",
    minutes: 5,
    xp: 60,
    summary: "Risk is the range of outcomes you're signing up for — not just the chance of loss.",
    studentExample:
      "Choosing one professor's section because you heard they give easy A's is a high-risk bet — amazing if you're right, brutal if the rumor was wrong. Spreading classes across professors is lower risk. Investing works the same way.",
    body: [
      "Risk isn't only 'how much can I lose' — it's how wide the range of possible outcomes is. A single small company's stock might double or get cut in half. A broad index of 500 companies has a much narrower, calmer range.",
      "Higher potential reward almost always comes with higher risk. There is no free lunch: anything promising big returns with 'no risk' is either misunderstood or a scam. Your job is to take risk you understand and can stomach.",
      "The right amount of risk depends on your timeline and your nerves. A long horizon lets you take more risk because you can wait out bad years. But if a 20% drop would make you panic-sell, that's a signal to dial risk down — emotions are part of risk too.",
    ],
    analogy:
      "Betting your whole grade on one final is high risk. Earning points across homework, quizzes, and the final spreads it out — one bad day can't sink you.",
    takeaway: "Risk = the range of outcomes. Take only as much as your timeline and nerves can handle.",
    quiz: [
      { id: "q1", prompt: "Risk is best described as…", options: ["Only the chance of losing money", "The range of possible outcomes", "A guarantee of loss", "A type of fee"], correctIndex: 1, explanation: "Risk is the full spread of what could happen — up and down." },
      { id: "q2", prompt: "An investment promising 'huge returns, no risk' is…", options: ["A great deal", "Probably a scam or misunderstanding", "Normal", "Tax-free"], correctIndex: 1, explanation: "There's no free lunch. High reward with zero risk doesn't exist." },
      { id: "q3", prompt: "If a 20% drop would make you panic-sell, you should…", options: ["Invest more aggressively", "Take less risk", "Ignore your emotions", "Sell everything forever"], correctIndex: 1, explanation: "Your emotional tolerance is part of risk. Size it so you can stay calm." },
    ],
  },
  {
    id: "compound-interest",
    moduleId: "start-here",
    order: 5,
    title: "Compound interest: the snowball",
    difficulty: "Beginner",
    minutes: 6,
    xp: 70,
    summary: "Compounding is earning returns on your returns — growth that accelerates over time.",
    studentExample:
      "Imagine your Instagram following grew by 10% every month, and each new follower brought more followers. That accelerating snowball is exactly how compound interest builds wealth.",
    body: [
      "Compound interest means your gains start generating their own gains. Earn 10% on $100 and you have $110. Next year's 10% is on $110, not $100 — so you earn $11, then $12.10, and so on. Each step is bigger than the last.",
      "Early on it feels slow and almost pointless. The magic is in the back half: most of the growth happens in the final years because the snowball is finally huge. This is why starting at 19 instead of 29 can literally double your end result.",
      "The enemies of compounding are interruptions and withdrawals. Every time you pull money out or stop contributing, you reset the snowball. The students who win aren't the ones who pick perfect investments — they're the ones who let time do its job.",
    ],
    analogy:
      "A snowball rolling downhill: tiny at the top, unstoppable at the bottom. The longer the hill, the bigger it gets — and college gives you the longest hill.",
    takeaway: "Compounding rewards patience. The longer you let it run, the steeper the curve.",
    quiz: [
      { id: "q1", prompt: "Compound interest means…", options: ["Earning returns on your returns", "Paying double fees", "A type of loan", "Government interest"], correctIndex: 0, explanation: "Your gains generate their own gains — that's compounding." },
      { id: "q2", prompt: "When does compounding produce the most growth?", options: ["In the first year", "In the final years, when the balance is largest", "It's constant", "Only with big deposits"], correctIndex: 1, explanation: "Growth accelerates — the back half of a long timeline does the heavy lifting." },
      { id: "q3", prompt: "What hurts compounding the most?", options: ["Leaving money invested", "Frequent withdrawals and interruptions", "Starting early", "Small contributions"], correctIndex: 1, explanation: "Pulling money out resets the snowball. Consistency is everything." },
    ],
  },

  // ── B. Student Money Foundation ──────────────────────────────────────────
  {
    id: "budgeting-college",
    moduleId: "money-foundation",
    order: 1,
    title: "Budgeting in college",
    difficulty: "Beginner",
    minutes: 5,
    xp: 50,
    summary: "A budget is just a plan that tells your money where to go before it disappears.",
    studentExample:
      "Financial aid hits your account in one big drop, then vanishes by midterms. A budget turns that lump sum into a plan that lasts the whole semester instead of the first month.",
    body: [
      "Budgeting isn't restriction — it's awareness. Most students don't overspend on purpose; they just lose track. A simple framework like 50/30/20 (needs / wants / saving + future) gives every dollar a job before it slips away.",
      "Start by listing what's actually fixed: rent, phone, meal plan, transportation. What's left is flexible spending and saving. Even committing $20 a month to your future self builds the muscle that matters more than the amount.",
      "The goal in college isn't to budget perfectly — it's to never be blindsided. Knowing your numbers means an unexpected $200 expense is a speed bump, not a crisis. That stability is the launchpad for everything else, including investing.",
    ],
    analogy:
      "A budget is a syllabus for your money: it tells you what's due, when, and how to not fail the semester by surprise.",
    takeaway: "Give every dollar a job before it vanishes — awareness beats restriction.",
    quiz: [
      { id: "q1", prompt: "The 50/30/20 rule splits money into…", options: ["Stocks/bonds/cash", "Needs/wants/saving", "Rent/food/fun", "Tax brackets"], correctIndex: 1, explanation: "50% needs, 30% wants, 20% toward saving and your future." },
      { id: "q2", prompt: "The real point of budgeting in college is to…", options: ["Never spend on fun", "Avoid being blindsided and stay aware", "Get rich fast", "Impress your parents"], correctIndex: 1, explanation: "Awareness turns surprises into speed bumps instead of crises." },
      { id: "q3", prompt: "When aid arrives as a lump sum, a budget helps you…", options: ["Spend it faster", "Stretch it across the whole semester", "Invest it all immediately", "Ignore it"], correctIndex: 1, explanation: "A plan turns a lump sum into a semester-long runway." },
    ],
  },
  {
    id: "emergency-funds",
    moduleId: "money-foundation",
    order: 2,
    title: "Emergency funds",
    difficulty: "Beginner",
    minutes: 4,
    xp: 50,
    summary: "An emergency fund is the cash cushion that keeps a bad week from becoming debt.",
    studentExample:
      "Your laptop dies the night before finals. With a $500 cushion, it's an annoying Tuesday. Without one, it's a credit card balance you carry for a year.",
    body: [
      "An emergency fund is money set aside only for true surprises: a broken laptop, an unexpected flight home, a medical bill. It lives in a plain savings account — boring and instantly available, not invested.",
      "For students, even $300–$500 is a meaningful first goal. It's enough to absorb most small disasters without reaching for a credit card, which is where short-term problems turn into long-term debt.",
      "Build it before you invest aggressively. Investing while one surprise away from debt means you might be forced to sell at the worst time. The emergency fund is the foundation that lets you invest calmly, knowing you won't have to touch it.",
    ],
    analogy:
      "It's a spare tire. You hope to never use it, but the day you need it, you're incredibly glad it's in the trunk.",
    takeaway: "Stack a small cash cushion first so surprises don't become debt.",
    quiz: [
      { id: "q1", prompt: "Where should an emergency fund live?", options: ["In stocks", "In a safe, accessible savings account", "In crypto", "In your checking, spent freely"], correctIndex: 1, explanation: "It must be safe and instantly available — not invested." },
      { id: "q2", prompt: "A good first emergency-fund goal for a student is…", options: ["$10,000", "$300–$500", "Nothing", "One month of tuition"], correctIndex: 1, explanation: "Even a few hundred dollars absorbs most small disasters." },
      { id: "q3", prompt: "Why build it before investing aggressively?", options: ["It earns more", "So a surprise won't force you to sell investments at a bad time", "It's required", "It's not necessary"], correctIndex: 1, explanation: "The cushion lets you invest calmly and avoid forced sales." },
    ],
  },
  {
    id: "credit-cards",
    moduleId: "money-foundation",
    order: 3,
    title: "Credit cards & credit scores",
    difficulty: "Beginner",
    minutes: 6,
    xp: 60,
    summary: "Used right, a credit card builds your score for free. Used wrong, it charges brutal interest.",
    studentExample:
      "Putting your $40 Spotify + textbook charge on a card and paying it off each month quietly builds the credit score you'll need to rent an apartment after graduation — at zero cost.",
    body: [
      "A credit score is a number landlords, lenders, and even some employers use to judge how reliably you repay money. Building it early — responsibly — is one of the highest-return moves a student can make, and it costs nothing if you pay in full.",
      "The trap is interest. Carry a balance and credit cards charge 20–29% APR, among the most expensive debt that exists. A $500 balance left unpaid can quietly balloon. The rule that keeps you safe: only charge what you can pay off in full, every month.",
      "Your score rises from on-time payments and keeping balances low relative to your limit. There's no need to carry debt to build credit — that's a myth. Use the card like a debit card you pay off, and you get the benefits without the cost.",
    ],
    analogy:
      "A credit card is like a campus reputation: built slowly through reliability, and torched fast by one irresponsible move that follows you around.",
    takeaway: "Pay in full every month — build the score, never the interest.",
    quiz: [
      { id: "q1", prompt: "How do you build credit at zero cost?", options: ["Carry a balance", "Charge small amounts and pay in full monthly", "Open many cards", "Never use credit"], correctIndex: 1, explanation: "Paying in full builds your score and avoids all interest." },
      { id: "q2", prompt: "Why is carrying a credit card balance dangerous?", options: ["It lowers fees", "APRs of 20–29% make it very expensive debt", "It's illegal", "It helps your score"], correctIndex: 1, explanation: "Credit card interest is among the most expensive debt around." },
      { id: "q3", prompt: "Do you need to carry debt to build credit?", options: ["Yes, always", "No — that's a myth; on-time full payments work", "Only for students", "Yes, for one year"], correctIndex: 1, explanation: "On-time payments build credit. Carrying debt is unnecessary." },
    ],
  },
  {
    id: "student-loans",
    moduleId: "money-foundation",
    order: 4,
    title: "Student loans, demystified",
    difficulty: "Intermediate",
    minutes: 6,
    xp: 70,
    summary: "Loans aren't all equal — the interest rate and type decide how heavy they really are.",
    studentExample:
      "Two students borrow $10,000. One at 5%, one at 11% on a private loan. Years later they owe very different amounts — same loan size, very different weight, purely from the rate.",
    body: [
      "Student debt comes in two main flavors: federal and private. Federal loans usually have lower rates, fixed terms, and flexible repayment options. Private loans can have higher, sometimes variable rates and fewer protections. Knowing which you have changes your whole strategy.",
      "Interest is the price of borrowing, and it accrues over time. Subsidized federal loans don't accrue interest while you're in school; unsubsidized and private ones often do — meaning the balance can grow before you've even graduated.",
      "You don't have to fear loans, but you do have to respect them. The smart move is to borrow only what you need, understand your rate, and have a rough payoff plan. Later lessons will weigh paying down high-rate debt against investing — a key decision for every graduate.",
    ],
    analogy:
      "Student loans are like group-project teammates: federal ones are the reliable, flexible kind, and high-rate private ones are the ones who quietly make your life harder if you ignore them.",
    takeaway: "Know your loan type and rate — they decide how heavy the debt really is.",
    quiz: [
      { id: "q1", prompt: "Federal loans generally have…", options: ["Higher rates and fewer protections", "Lower rates and more flexible repayment", "No interest ever", "Variable rates only"], correctIndex: 1, explanation: "Federal loans tend to be lower-rate with more borrower protections." },
      { id: "q2", prompt: "What does 'unsubsidized' interest mean for you?", options: ["The government pays it", "Interest accrues even while you're in school", "It's interest-free", "It's a grant"], correctIndex: 1, explanation: "Unsubsidized loans accrue interest while you study, growing the balance." },
      { id: "q3", prompt: "A smart borrowing rule is to…", options: ["Borrow the maximum offered", "Borrow only what you need and know your rate", "Ignore the rate", "Always choose private loans"], correctIndex: 1, explanation: "Borrow what you need and understand the rate driving the cost." },
    ],
  },
  {
    id: "when-not-to-invest",
    moduleId: "money-foundation",
    order: 5,
    title: "When NOT to invest yet",
    difficulty: "Beginner",
    minutes: 4,
    xp: 50,
    summary: "Sometimes the best investment is paying off high-interest debt or building a cushion first.",
    studentExample:
      "Carrying a $1,000 credit card balance at 24% while chasing 8% stock returns is like sprinting on a treadmill set to pull you backward faster than you run.",
    body: [
      "Investing is powerful, but it's not always the right next move. If you're carrying high-interest debt — especially credit cards at 20%+ — paying it off is a guaranteed 'return' that beats what the market typically offers, with zero risk.",
      "Likewise, if you have no emergency fund, investing first is fragile. One surprise could force you to sell at a loss or fall into debt. A small cushion comes before aggressive investing for almost everyone.",
      "This isn't a reason to wait forever — it's a reason to sequence correctly. Knock out toxic debt, build a starter cushion, then let investing take over. Doing it in the right order is what separates stable wealth-building from a stressful gamble.",
    ],
    analogy:
      "You wouldn't add toppings to a pizza with no crust. Debt payoff and an emergency fund are the crust — invest once the base can hold the weight.",
    takeaway: "Clear toxic debt and build a cushion first — then let investing take over.",
    quiz: [
      { id: "q1", prompt: "Paying off a 24% credit card is like earning…", options: ["A 0% return", "A guaranteed 24% return with no risk", "A small loss", "Nothing"], correctIndex: 1, explanation: "Eliminating 24% interest is a guaranteed, risk-free 24% 'return.'" },
      { id: "q2", prompt: "Before investing aggressively you should have…", options: ["A perfect credit score", "A starter emergency fund", "A finance degree", "$10,000 saved"], correctIndex: 1, explanation: "A cushion keeps a surprise from forcing a bad sell." },
      { id: "q3", prompt: "The lesson's main idea is about…", options: ["Never investing", "Sequencing your money moves correctly", "Avoiding the market forever", "Only paying debt"], correctIndex: 1, explanation: "It's about order: debt and cushion first, then invest." },
    ],
  },

  // ── C. Market Basics ─────────────────────────────────────────────────────
  {
    id: "stocks",
    moduleId: "market-basics",
    order: 1,
    title: "Stocks: owning a slice",
    difficulty: "Beginner",
    minutes: 5,
    xp: 60,
    summary: "A stock is a tiny ownership share of a real company — you win when the business does.",
    studentExample:
      "Buying one share of a company you love is like owning a single brick of the campus bookstore — you don't run it, but you own a real piece and share in its success.",
    body: [
      "When you buy a stock, you own a fraction of an actual company — its buildings, brand, profits, and future. If the company grows and becomes more valuable, your slice becomes worth more. If it struggles, your slice loses value.",
      "Stock prices move constantly based on what buyers and sellers think the company is worth. In the short term that's noisy and emotional. Over the long term, prices tend to follow whether the underlying business actually grows its profits.",
      "Owning individual stocks means concentrated risk — your outcome rides on a few companies. That's exciting but bumpy. Most beginners are better served starting with diversified funds (next lessons), then adding individual stocks once they understand what they own.",
    ],
    analogy:
      "A stock is one brick in a building. Own a few bricks and your fortune depends heavily on those exact bricks; own a piece of the whole street and you're far steadier.",
    takeaway: "A stock is real ownership — high potential, but concentrated and bumpy.",
    quiz: [
      { id: "q1", prompt: "Buying a stock means you own…", options: ["A loan to the company", "A small piece of the actual company", "A government bond", "Nothing tangible"], correctIndex: 1, explanation: "A stock is fractional ownership of a real business." },
      { id: "q2", prompt: "Over the long term, stock prices tend to follow…", options: ["Random luck", "Whether the business grows its profits", "Interest rates only", "Social media"], correctIndex: 1, explanation: "Long term, price follows real business performance." },
      { id: "q3", prompt: "Why are individual stocks risky for beginners?", options: ["They're illegal", "Outcome is concentrated in a few companies", "They never grow", "Fees are huge"], correctIndex: 1, explanation: "Concentration means a few companies decide your result." },
    ],
  },
  {
    id: "etfs",
    moduleId: "market-basics",
    order: 2,
    title: "ETFs: a basket in one click",
    difficulty: "Beginner",
    minutes: 5,
    xp: 60,
    summary: "An ETF bundles many investments into one, giving instant diversification.",
    studentExample:
      "Instead of cooking five dishes, you grab one combo meal that has a bit of everything. An ETF is that combo meal — one purchase, dozens or hundreds of companies inside.",
    body: [
      "An ETF (exchange-traded fund) is a single investment that holds many others inside it — sometimes hundreds or thousands of stocks or bonds. You buy one share of the ETF and instantly own a slice of everything it contains.",
      "This solves the biggest beginner problem: putting all your eggs in one basket. With an ETF, one company tanking barely dents you because it's a tiny piece of a large, diversified group. You get the market's growth without betting everything on a single name.",
      "ETFs trade like stocks — you can buy or sell during the day — and many have very low fees. A broad, low-cost ETF is one of the most recommended starting points in all of investing, precisely because it's simple, cheap, and diversified.",
    ],
    analogy:
      "Buying individual stocks is à la carte; an ETF is the combo meal. One click, balanced variety, far less chance of a single bad pick ruining your day.",
    takeaway: "ETFs deliver instant diversification in a single, low-cost purchase.",
    quiz: [
      { id: "q1", prompt: "An ETF is best described as…", options: ["A single company's stock", "A basket holding many investments at once", "A type of savings account", "A loan"], correctIndex: 1, explanation: "One ETF share holds many underlying investments." },
      { id: "q2", prompt: "The main beginner benefit of an ETF is…", options: ["Guaranteed profit", "Instant diversification", "No risk", "Tax-free growth"], correctIndex: 1, explanation: "It spreads your money across many holdings automatically." },
      { id: "q3", prompt: "If one company in a broad ETF crashes, you…", options: ["Lose everything", "Are barely affected — it's a tiny slice", "Get a refund", "Must sell"], correctIndex: 1, explanation: "Diversification means one bad name barely moves the whole basket." },
    ],
  },
  {
    id: "index-funds",
    moduleId: "market-basics",
    order: 3,
    title: "Index funds: owning the whole market",
    difficulty: "Beginner",
    minutes: 5,
    xp: 60,
    summary: "An index fund quietly tracks a whole market index — simple, cheap, and historically hard to beat.",
    studentExample:
      "Instead of guessing which classmate will be most successful, you 'invest' in the whole graduating class. An index fund does that with the whole stock market.",
    body: [
      "An index is a list that measures a slice of the market — like the S&P 500, which tracks 500 large U.S. companies. An index fund simply buys everything in that list, aiming to match the index rather than beat it.",
      "This 'just match the market' approach sounds unambitious, but decades of data show most professional stock-pickers fail to beat a simple low-cost index fund over time. By not trying to be clever, index funds avoid high fees and bad bets.",
      "For a student, a broad index fund is close to a default answer: cheap, diversified, and proven. It won't make you rich overnight, but paired with time and compounding, it's one of the most reliable wealth-building tools ever created.",
    ],
    analogy:
      "Picking stocks is betting on one runner; an index fund is betting on the entire race finishing — you win as long as the overall field moves forward.",
    takeaway: "Index funds match the market cheaply — and that quietly beats most stock-pickers.",
    quiz: [
      { id: "q1", prompt: "An index fund aims to…", options: ["Beat the market", "Match a market index", "Pick winning stocks", "Avoid the market"], correctIndex: 1, explanation: "It tracks the index instead of trying to outsmart it." },
      { id: "q2", prompt: "What does decades of data show about beating the market?", options: ["It's easy", "Most professionals fail to beat low-cost index funds", "Index funds always lose", "Stock-picking always wins"], correctIndex: 1, explanation: "Most active managers underperform a cheap index over time." },
      { id: "q3", prompt: "The S&P 500 index tracks…", options: ["5 companies", "500 large U.S. companies", "All world stocks", "Only tech"], correctIndex: 1, explanation: "It measures 500 large U.S. companies." },
    ],
  },
  {
    id: "bonds",
    moduleId: "market-basics",
    order: 4,
    title: "Bonds: lending instead of owning",
    difficulty: "Intermediate",
    minutes: 5,
    xp: 60,
    summary: "A bond is a loan you make in exchange for steady interest — calmer than stocks.",
    studentExample:
      "Lending your roommate $100 to be paid back with $5 extra next month is basically a bond. You're the lender earning interest, not an owner hoping for growth.",
    body: [
      "When you buy a bond, you're lending money — to a government or company — and they agree to pay you regular interest, then return your original amount at the end. You're a lender, not an owner.",
      "Because the terms are fixed, bonds are generally calmer and less volatile than stocks. They won't shoot up like a hot stock, but they also won't crash as hard. They add stability and income to a portfolio.",
      "Bonds aren't risk-free — the borrower could struggle to repay, and bond prices move with interest rates. But used alongside stocks, they're a classic way to smooth out the ride, especially as someone gets closer to needing their money.",
    ],
    analogy:
      "Owning stock is being a co-founder hoping the startup explodes. Owning a bond is being the bank that lent the startup money — less upside, more predictability.",
    takeaway: "Bonds are loans that pay interest — steadier income, lower highs and lows.",
    quiz: [
      { id: "q1", prompt: "When you buy a bond, you are a…", options: ["Part owner", "Lender", "Customer", "Founder"], correctIndex: 1, explanation: "A bond means you've lent money in exchange for interest." },
      { id: "q2", prompt: "Compared to stocks, bonds are generally…", options: ["More volatile", "Calmer and steadier", "Always higher returning", "Risk-free"], correctIndex: 1, explanation: "Fixed terms make bonds less volatile than stocks." },
      { id: "q3", prompt: "Why add bonds to a portfolio?", options: ["For maximum growth", "To smooth out the ride with stability and income", "To avoid all risk", "They're free"], correctIndex: 1, explanation: "Bonds add stability and income, balancing stock swings." },
    ],
  },
  {
    id: "dividends",
    moduleId: "market-basics",
    order: 5,
    title: "Dividends & market indexes",
    difficulty: "Intermediate",
    minutes: 5,
    xp: 60,
    summary: "Dividends are profit payments to owners; indexes are the scoreboards of the market.",
    studentExample:
      "If a campus food truck you co-own hands every owner $2 per month from profits, that's a dividend. Reinvesting those $2 to buy more ownership is how dividends quietly compound.",
    body: [
      "Some companies share a slice of their profits with shareholders as dividends — regular cash payments just for owning the stock. You can spend them, or reinvest them to buy more shares, which feeds the compounding snowball.",
      "Not every company pays dividends; many growing companies reinvest all profits to grow faster. Neither approach is automatically better — dividends offer steady income, while reinvesting can fuel bigger long-term growth.",
      "Indexes like the S&P 500, Dow Jones, and Nasdaq are scoreboards that summarize how groups of stocks are doing. When the news says 'the market was up today,' they usually mean an index moved — a quick pulse-check, not your personal portfolio.",
    ],
    analogy:
      "A dividend is a group project that actually pays you for your share of the work. An index is the leaderboard showing how the whole class did today.",
    takeaway: "Dividends pay owners; reinvesting them compounds. Indexes are the market's scoreboard.",
    quiz: [
      { id: "q1", prompt: "A dividend is…", options: ["A loan repayment", "A share of company profits paid to owners", "A fee", "A type of bond"], correctIndex: 1, explanation: "It's profit shared with shareholders as cash." },
      { id: "q2", prompt: "Reinvesting dividends helps you…", options: ["Pay more taxes only", "Buy more shares and compound faster", "Avoid risk", "Cash out"], correctIndex: 1, explanation: "Reinvesting buys more ownership, feeding compounding." },
      { id: "q3", prompt: "The S&P 500 and Nasdaq are…", options: ["Companies", "Market indexes that act as scoreboards", "Bonds", "Brokerages"], correctIndex: 1, explanation: "Indexes summarize how groups of stocks are performing." },
    ],
  },

  // ── D. Building Wealth Early ─────────────────────────────────────────────
  {
    id: "roth-ira",
    moduleId: "wealth-early",
    order: 1,
    title: "The Roth IRA: a student's secret weapon",
    difficulty: "Intermediate",
    minutes: 6,
    xp: 80,
    summary: "A Roth IRA lets your investments grow and be withdrawn tax-free in retirement.",
    studentExample:
      "Your summer internship pays you $4,000. Putting some into a Roth IRA at 20 means decades of growth you'll never owe taxes on — a perk most adults wish they'd used earlier.",
    body: [
      "A Roth IRA is a special retirement account where you invest money you've already paid taxes on. The payoff: all the growth, and your eventual withdrawals in retirement, are completely tax-free. For young people in low tax brackets, that trade is incredibly favorable.",
      "You can only contribute if you have earned income — a job, internship, or side hustle counts. There's an annual limit, but as a student you rarely need to max it; even small contributions started early are powerful because they have the longest time to grow tax-free.",
      "Inside the Roth you still choose what to invest in — often a simple index fund. The Roth is the tax-advantaged container; the investments inside it do the growing. Starting one in college is one of the highest-leverage financial moves available to a student with a job.",
    ],
    analogy:
      "A Roth IRA is like prepaying for a concert ticket while you're broke and in a low tax bracket — then enjoying the whole show later for free, no matter how famous the act becomes.",
    takeaway: "A Roth IRA grows tax-free — and students' low tax brackets make it a powerful early move.",
    quiz: [
      { id: "q1", prompt: "The main benefit of a Roth IRA is…", options: ["Free money from the government", "Tax-free growth and withdrawals in retirement", "Guaranteed returns", "No contribution limit"], correctIndex: 1, explanation: "You pay tax now, then growth and withdrawals are tax-free later." },
      { id: "q2", prompt: "To contribute to a Roth IRA you need…", options: ["To be over 30", "Earned income from a job or hustle", "A finance degree", "$10,000"], correctIndex: 1, explanation: "Earned income — like internship pay — is required to contribute." },
      { id: "q3", prompt: "Why is a Roth especially good for students?", options: ["Students pay higher taxes", "Low tax brackets + long time horizon make tax-free growth huge", "It's required", "It has no rules"], correctIndex: 1, explanation: "Low brackets now plus decades of tax-free growth is a great trade." },
    ],
  },
  {
    id: "brokerage-accounts",
    moduleId: "wealth-early",
    order: 2,
    title: "Brokerage accounts 101",
    difficulty: "Beginner",
    minutes: 4,
    xp: 60,
    summary: "A brokerage account is simply the place where you buy and hold investments.",
    studentExample:
      "Just like you need a meal-plan card to buy food on campus, you need a brokerage account to buy investments. It's the access card, not the food itself.",
    body: [
      "A brokerage account is a regular investment account you can open with many companies. You deposit money, then use it to buy stocks, ETFs, and funds. Unlike a Roth IRA, there are no special tax perks and no withdrawal restrictions — full flexibility.",
      "This flexibility makes a brokerage account great for goals before retirement, or for money beyond what you put in tax-advantaged accounts. You can sell and access your money anytime, though you may owe taxes on gains.",
      "Many brokerages now have no account minimums, no commissions on basic trades, and let you buy fractional shares — so you can start with $5. The account itself is free; what matters is funding it consistently and choosing solid investments inside it.",
    ],
    analogy:
      "A brokerage account is the shopping cart. The Roth IRA is a special tax-free checkout lane. Both let you shop; one just has a better deal at the register.",
    takeaway: "A brokerage account is the flexible home base for investing — open and fund one to start.",
    quiz: [
      { id: "q1", prompt: "A brokerage account is…", options: ["A type of investment", "The account where you buy and hold investments", "A loan", "A budgeting app"], correctIndex: 1, explanation: "It's the container you use to buy stocks, ETFs, and funds." },
      { id: "q2", prompt: "Compared to a Roth IRA, a standard brokerage account has…", options: ["More tax perks", "No special tax perks but full flexibility", "Withdrawal penalties", "Higher minimums always"], correctIndex: 1, explanation: "No special tax treatment, but you can access money anytime." },
      { id: "q3", prompt: "Fractional shares let you…", options: ["Avoid taxes", "Start investing with very small amounts", "Trade for free forever", "Borrow money"], correctIndex: 1, explanation: "Fractional shares mean you can begin with just a few dollars." },
    ],
  },
  {
    id: "dollar-cost-averaging",
    moduleId: "wealth-early",
    order: 3,
    title: "Dollar-cost averaging",
    difficulty: "Beginner",
    minutes: 5,
    xp: 70,
    summary: "Investing a fixed amount on a schedule removes emotion and smooths out market swings.",
    studentExample:
      "Putting $25 into an index fund every payday — no matter what the market's doing — is like always grabbing the same gym slot. The habit does the heavy lifting, not the timing.",
    body: [
      "Dollar-cost averaging (DCA) means investing a set amount at regular intervals — say $25 every two weeks — regardless of whether prices are up or down. You stop trying to guess the perfect moment and let consistency win.",
      "The math quietly helps you: your fixed amount buys more shares when prices are low and fewer when prices are high, lowering your average cost over time. More importantly, it removes the emotional trap of waiting for the 'right' moment that never feels right.",
      "For students with irregular income, DCA scales down beautifully — even $10 a week builds the habit. The goal isn't to invest perfectly; it's to invest automatically and repeatedly, so time and compounding can do their job.",
    ],
    analogy:
      "DCA is like studying a little every day instead of cramming. You don't need perfect timing — the steady rhythm beats the all-nighter every time.",
    takeaway: "Invest a fixed amount on a schedule — consistency beats trying to time the market.",
    quiz: [
      { id: "q1", prompt: "Dollar-cost averaging means…", options: ["Investing everything at once", "Investing a fixed amount on a regular schedule", "Only buying when prices drop", "Day trading"], correctIndex: 1, explanation: "You invest set amounts regularly, regardless of price." },
      { id: "q2", prompt: "A key benefit of DCA is…", options: ["Guaranteed profit", "Removing the emotion of timing the market", "No risk", "Higher fees"], correctIndex: 1, explanation: "It replaces guesswork and emotion with a steady habit." },
      { id: "q3", prompt: "With a fixed amount, when prices are low you…", options: ["Buy fewer shares", "Buy more shares", "Stop investing", "Pay more tax"], correctIndex: 1, explanation: "A fixed dollar amount buys more shares when prices are lower." },
    ],
  },
  {
    id: "long-term-automation",
    moduleId: "wealth-early",
    order: 4,
    title: "Long-term investing & automation",
    difficulty: "Beginner",
    minutes: 5,
    xp: 70,
    summary: "Set it, automate it, and let time work — the boring approach quietly wins.",
    studentExample:
      "Automating $20 from each paycheck into an index fund is like auto-renewing a subscription to your future self. You forget about it; it keeps building.",
    body: [
      "Long-term investing means buying solid, diversified investments and holding them for years or decades, ignoring the daily noise. The biggest gains historically went to people who stayed invested through the scary times, not the ones who jumped in and out.",
      "Automation makes this effortless. Set up a recurring transfer so a fixed amount moves into your investments every payday before you can spend it. You remove willpower from the equation — the system invests for you whether or not you remember.",
      "The combination of long time horizons, automation, and low-cost diversified funds is, frankly, the unglamorous formula that builds most real wealth. It's not exciting, and that's the point: boring, consistent, and automatic beats clever and inconsistent.",
    ],
    analogy:
      "Automating investing is like setting your alarm the night before. You decide once, and your future self just follows the plan without daily debate.",
    takeaway: "Automate consistent contributions and hold for the long run — boring quietly wins.",
    quiz: [
      { id: "q1", prompt: "Historically, the biggest gains went to people who…", options: ["Traded daily", "Stayed invested through the scary times", "Timed every dip", "Avoided the market"], correctIndex: 1, explanation: "Staying invested long-term beat jumping in and out." },
      { id: "q2", prompt: "Why automate your investing?", options: ["To pay more fees", "To remove willpower and invest before you can spend it", "To trade faster", "It's required"], correctIndex: 1, explanation: "Automation invests for you, removing the willpower battle." },
      { id: "q3", prompt: "The wealth-building formula in this lesson is…", options: ["Clever, frequent trading", "Boring: long-term, automated, low-cost, diversified", "High-risk bets", "Saving only"], correctIndex: 1, explanation: "Unglamorous consistency is what builds most real wealth." },
    ],
  },

  // ── E. Advanced Student Path ─────────────────────────────────────────────
  {
    id: "valuation-basics",
    moduleId: "advanced-path",
    order: 1,
    title: "Valuation basics",
    difficulty: "Advanced",
    minutes: 7,
    xp: 90,
    summary: "Valuation asks the key question: is this company's price fair for what you're getting?",
    studentExample:
      "Two used textbooks, same edition — one's $40, one's $90. Valuation is the skill of judging which price actually matches the value. Stocks need the same scrutiny.",
    body: [
      "A great company can be a bad investment if you overpay, and a mediocre company can be a fine one if it's cheap enough. Valuation is the discipline of judging what a business is worth versus what the market is charging for it.",
      "A common starting tool is the price-to-earnings (P/E) ratio — the price you pay for each dollar of a company's profit. A high P/E means investors expect big growth; a low one can mean a bargain or a warning sign. Context matters more than the raw number.",
      "Valuation is part math, part judgment, and never certain. The point isn't to find a magic 'correct' price — it's to avoid wildly overpaying out of hype. Even a rough sense of value protects you from buying purely because something is popular.",
    ],
    analogy:
      "Valuation is comparison shopping for businesses. You wouldn't buy the first laptop you see at any price — you check what you're getting for the money.",
    takeaway: "Valuation judges price against worth — great companies can still be bad buys if overpriced.",
    quiz: [
      { id: "q1", prompt: "Valuation is mainly about…", options: ["Predicting tomorrow's price", "Judging price versus what a company is worth", "Picking popular stocks", "Avoiding all stocks"], correctIndex: 1, explanation: "It compares the price charged to the underlying value." },
      { id: "q2", prompt: "The P/E ratio measures…", options: ["Total debt", "Price paid per dollar of profit", "Dividend size", "Risk level"], correctIndex: 1, explanation: "P/E is price relative to the company's earnings." },
      { id: "q3", prompt: "A great company can be a bad investment when…", options: ["It pays dividends", "You overpay for it", "It grows fast", "It's diversified"], correctIndex: 1, explanation: "Overpaying ruins the returns even on a great business." },
    ],
  },
  {
    id: "financial-statements",
    moduleId: "advanced-path",
    order: 2,
    title: "Reading financial statements",
    difficulty: "Advanced",
    minutes: 7,
    xp: 90,
    summary: "Three statements reveal a company's health: income, balance sheet, and cash flow.",
    studentExample:
      "Checking a company's financials before investing is like reviewing a club's budget before joining as treasurer — you want to see what comes in, what's owed, and what's actually in the bank.",
    body: [
      "The income statement shows whether a company made a profit over a period — revenue coming in, costs going out, and what's left. It answers: did the business actually earn money?",
      "The balance sheet is a snapshot of what a company owns (assets) versus what it owes (liabilities) at a point in time. A business drowning in debt relative to its assets is fragile, no matter how flashy its revenue looks.",
      "The cash flow statement tracks actual money moving in and out — and it's the hardest to fake. A company can report 'profit' on paper while running out of real cash. Reading all three together gives a fuller, more honest picture than any single number.",
    ],
    analogy:
      "The three statements are like a fitness check: income is your workout results, the balance sheet is your current weight, and cash flow is whether you actually have energy day to day.",
    takeaway: "Income, balance sheet, and cash flow together reveal a company's real health.",
    quiz: [
      { id: "q1", prompt: "The income statement answers…", options: ["What the company owns", "Did the business make a profit?", "How much cash is in the bank", "Who the CEO is"], correctIndex: 1, explanation: "It shows revenue, costs, and resulting profit over a period." },
      { id: "q2", prompt: "The balance sheet shows…", options: ["Profit over a year", "What a company owns versus owes", "Daily stock price", "Marketing spend"], correctIndex: 1, explanation: "It's a snapshot of assets versus liabilities." },
      { id: "q3", prompt: "Why is the cash flow statement valuable?", options: ["It's optional", "It tracks real money and is hardest to fake", "It predicts prices", "It lists employees"], correctIndex: 1, explanation: "Real cash movement is hard to fake and reveals true health." },
    ],
  },
  {
    id: "portfolio-allocation",
    moduleId: "advanced-path",
    order: 3,
    title: "Portfolio allocation & risk management",
    difficulty: "Advanced",
    minutes: 6,
    xp: 90,
    summary: "Allocation is how you split money across assets — it drives most of your results and risk.",
    studentExample:
      "Just like you spread your time across classes, work, and rest to avoid burnout, allocation spreads your money across asset types to avoid blowups. The mix matters more than any single pick.",
    body: [
      "Asset allocation is the split of your portfolio across categories — stocks, bonds, cash, and more. Research consistently shows this mix, not individual stock picks, drives the majority of your long-term results and how bumpy the ride feels.",
      "A young investor with decades ahead can hold mostly stocks, accepting big swings for higher growth. Someone needing the money soon shifts toward bonds and cash for stability. Your allocation should reflect your timeline and how much volatility you can handle.",
      "Risk management also means diversification and not over-betting on any one position. A common guideline: no single stock should be large enough that its collapse wrecks your whole plan. Rebalancing — trimming winners back to your target mix — keeps risk in check over time.",
    ],
    analogy:
      "Allocation is your academic schedule: load up on challenging courses when you have time and energy, ease toward stability near graduation. The balance protects you from burnout — financial or otherwise.",
    takeaway: "Your asset mix drives most of your risk and return — set it to your timeline, then rebalance.",
    quiz: [
      { id: "q1", prompt: "Asset allocation refers to…", options: ["Picking one great stock", "How you split money across asset types", "Your tax bracket", "Your broker"], correctIndex: 1, explanation: "It's the mix across stocks, bonds, cash, and more." },
      { id: "q2", prompt: "A young investor can typically hold…", options: ["Mostly cash", "Mostly stocks, accepting bigger swings for growth", "Only bonds", "Nothing"], correctIndex: 1, explanation: "A long horizon allows more stocks and more volatility." },
      { id: "q3", prompt: "Rebalancing means…", options: ["Selling everything", "Trimming back to your target mix over time", "Never selling", "Buying one stock"], correctIndex: 1, explanation: "Rebalancing restores your intended allocation and controls risk." },
    ],
  },
  {
    id: "behavioral-finance",
    moduleId: "advanced-path",
    order: 4,
    title: "Behavioral finance & economic cycles",
    difficulty: "Advanced",
    minutes: 6,
    xp: 90,
    summary: "Your own emotions and the economy's cycles are bigger risks than most people admit.",
    studentExample:
      "Panic-selling during a market drop is like dropping a class after one bad quiz — an emotional reaction that sabotages a long-term plan. Recognizing the urge is half the battle.",
    body: [
      "Behavioral finance studies the predictable ways our brains sabotage good decisions: panic-selling at the bottom, chasing hype at the top, and overconfidence after a lucky win. The biggest threat to your returns is often the person in the mirror.",
      "Economies move in cycles — expansion, peak, contraction, recovery — and so do markets. Downturns feel like the end of the world but are a normal, recurring part of the system. Investors who understand this can stay calm while others panic.",
      "The practical defense is having a plan and rules you set in calm times, then following them when emotions spike. Automation, diversification, and a long horizon aren't just financial tools — they're behavioral guardrails that protect you from yourself.",
    ],
    analogy:
      "Markets have seasons like a school year — stressful finals weeks and relaxing breaks. Panicking every finals week and quitting would be absurd; markets reward those who expect the cycle.",
    takeaway: "Master your emotions and expect cycles — discipline protects returns more than cleverness.",
    quiz: [
      { id: "q1", prompt: "Behavioral finance says the biggest threat to returns is often…", options: ["The government", "Your own emotional decisions", "Low fees", "Diversification"], correctIndex: 1, explanation: "Panic, hype-chasing, and overconfidence sabotage good plans." },
      { id: "q2", prompt: "Market downturns are…", options: ["The end of investing", "A normal, recurring part of economic cycles", "Always permanent", "Illegal"], correctIndex: 1, explanation: "Cycles include downturns; they're recurring, not the end." },
      { id: "q3", prompt: "The best defense against emotional mistakes is…", options: ["Trading more", "Rules and automation set during calm times", "Checking prices hourly", "Following hype"], correctIndex: 1, explanation: "Pre-set rules and automation act as behavioral guardrails." },
    ],
  },
];

export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const lessonsByModule = (moduleId: string) =>
  lessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.order - b.order);
