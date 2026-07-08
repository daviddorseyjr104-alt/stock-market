import type { Course } from "@/lib/types";

export const investingCourse: Course = {
  id: "investing",
  title: "Investing",
  tagline: "Turn your first $5 into a lifelong habit of building real wealth.",
  description:
    "Learn how markets actually work, how to build a portfolio that fits your age and goals, and how small, boring, consistent investing beats trying to time the market. No jargon, no hype, just the moves that actually build wealth over decades.",
  category: "Investing",
  icon: "LineChart",
  color: "from-amber-400 to-orange-500",
  accent: "amber-300",
  order: 3,
  unlockLevel: 2,
  units: [
    // ────────────────────────────────────────────────────────────────
    // Unit 1: Market Foundations
    // ────────────────────────────────────────────────────────────────
    {
      id: "investing-u1",
      courseId: "investing",
      order: 1,
      title: "Market Foundations",
      subtitle: "What you're actually buying when you buy a stock",
      lessons: [
        {
          id: "investing-u1-l1",
          unitId: "investing-u1",
          courseId: "investing",
          order: 1,
          title: "What Is a Stock, Really?",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 25,
          summary: "Owning a stock means owning a real slice of a real company.",
          cards: [
            {
              kind: "teach",
              id: "investing-u1-l1-t1",
              title: "A share is real ownership",
              body: "When you buy one share of a company, you own a tiny sliver of everything that company owns, its buildings, products, cash, and future profits. You're not betting on a number going up; you're becoming a part-owner of a business.",
              example:
                "If you buy 1 share of Starbucks, you own a fraction of every store, every espresso machine, and every dollar of profit the company makes, roughly 1 out of 1.1 billion slices of the whole company.",
              analogy:
                "Think of a company like a pizza cut into a billion tiny slices. A share is one slice. You don't own the whole pizza, but you get a taste of every bite that's sold.",
            },
            {
              kind: "teach",
              id: "investing-u1-l1-t2",
              title: "Why companies sell shares",
              body: "Companies sell shares to raise cash for growth, building factories, hiring, launching products, without taking on debt. In exchange, shareholders get a claim on future profits and a vote on big decisions.",
              example:
                "When a company like Airbnb went public, it sold shares to investors to raise billions of dollars it could use to grow, instead of borrowing from a bank.",
            },
            {
              kind: "question",
              id: "investing-u1-l1-qm",
              type: "match",
              prompt: "Match each investing term to its plain-English meaning.",
              pairs: [
                { left: "Stock", right: "A small share of ownership in a company" },
                { left: "Dividend", right: "A cash payout some companies send shareholders" },
                { left: "Index fund", right: "One fund that holds hundreds of companies" },
                { left: "Risk", right: "The chance an investment loses value" },
              ],
              explanation:
                "A stock is part-ownership; a dividend is a slice of profit paid to owners; an index fund spreads your money across many companies at once; risk is the price of admission for higher potential returns.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u1-l1-q1",
              type: "mcq",
              prompt: "When you buy one share of a public company, what do you actually own?",
              options: [
                "A loan you're giving the company that it must repay with interest",
                "A tiny fractional ownership stake in the company itself",
                "A coupon for discounts on the company's products",
                "Nothing, the share is just a number on a screen",
              ],
              correctIndex: 1,
              explanation:
                "A share represents real, legal ownership in the company, a claim on its assets and future profits, no matter how small the slice.",
              hint: "It's ownership, not a loan, that's a bond.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l1-q2",
              type: "true-false",
              prompt: "Owning stock in a company gives you zero say in how the company is run.",
              correctBool: false,
              explanation:
                "Shareholders typically get voting rights on major decisions, like electing the board of directors, proportional to how many shares they own.",
              hint: "Think about shareholder votes at annual meetings.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l1-q3",
              type: "scenario",
              prompt: "What is Maya most accurately doing?",
              context:
                "Maya just bought 3 shares of Nike for about $270 total using her part-time job savings. She tells her roommate, \"I basically loaned Nike some money.\"",
              options: [
                "She's correct, buying stock is the same as lending money",
                "She's incorrect, she bought partial ownership in Nike, not a loan to Nike",
                "She's correct only if Nike pays her back with interest",
                "It doesn't matter, stocks and loans work identically",
              ],
              correctIndex: 1,
              explanation:
                "Buying stock means becoming a part-owner of Nike, not lending it money. Lending money to a company (expecting fixed interest back) is what buying a bond does.",
              hint: "Ownership vs. lending, these are two different things.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l1-q4",
              type: "fill-in",
              prompt: "Fill in the blank: A share of stock represents a fractional _____ in a company.",
              accept: ["ownership", "ownership stake", "stake"],
              explanation:
                "\"Ownership\" is the key word, a share is a legal claim on a piece of the company, not a loan or a gift card.",
              hint: "It's the same word used to describe owning part of a house or business.",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u1-l2",
          unitId: "investing-u1",
          courseId: "investing",
          order: 2,
          title: "ETFs, Index Funds & Mutual Funds",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 25,
          summary: "One purchase, hundreds of companies, how funds bundle stocks together.",
          cards: [
            {
              kind: "teach",
              id: "investing-u1-l2-t1",
              title: "A fund is a basket of stocks",
              body: "Instead of picking one company, a fund pools money from thousands of investors to buy many stocks at once. An index fund specifically tracks a market index, like the S&P 500, which covers roughly 500 of the largest U.S. companies.",
              example:
                "Buying one share of VOO or SPY (both track the S&P 500) means you instantly own a tiny piece of Apple, Microsoft, Amazon, and about 497 other companies, all in one purchase.",
              analogy:
                "A single stock is one ingredient. An index fund is the whole grocery cart, way less risky if one item goes bad.",
            },
            {
              kind: "teach",
              id: "investing-u1-l2-t2",
              title: "ETF vs. mutual fund",
              body: "ETFs (exchange-traded funds) trade all day like a stock, often with no minimum investment beyond one share. Mutual funds usually only trade once a day at market close and sometimes require a minimum investment, like $1,000-$3,000.",
              example:
                "A student with $20 can buy an ETF like VOO the moment markets open, but might be locked out of a similar mutual fund that requires a $1,000 minimum.",
            },
            {
              kind: "question",
              id: "investing-u1-l2-q1",
              type: "mcq",
              prompt: "What does an S&P 500 index fund like VOO or SPY actually contain?",
              options: [
                "Just one company's stock, chosen by a fund manager",
                "Roughly 500 of the largest publicly traded U.S. companies",
                "Only technology companies",
                "Cash and government bonds only",
              ],
              correctIndex: 1,
              explanation:
                "S&P 500 index funds track around 500 large U.S. companies across every major industry, giving you instant diversification in one purchase.",
              hint: "The name is a big clue, 500 of what?",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l2-q2",
              type: "true-false",
              prompt: "ETFs can generally be bought and sold throughout the trading day, just like an individual stock.",
              correctBool: true,
              explanation:
                "ETFs trade continuously on an exchange during market hours, while traditional mutual funds only price and settle once per day after the market closes.",
              hint: "The \"T\" in ETF stands for \"traded.\"",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l2-q3",
              type: "scenario",
              prompt: "What's the main advantage of Jordan's approach here?",
              context:
                "Jordan has $40 saved from a weekend shift and wants to start investing. Instead of trying to pick which single company will win, he buys $40 worth of a total-market index fund.",
              options: [
                "It guarantees his investment will never lose value",
                "It spreads his $40 across hundreds of companies instead of betting on one",
                "It pays a fixed guaranteed interest rate",
                "It's only available to investors with over $10,000",
              ],
              correctIndex: 1,
              explanation:
                "Index funds spread risk across many companies at once, so one company struggling doesn't sink Jordan's whole investment, unlike putting all $40 into a single stock.",
              hint: "Think about what \"index\" funds are built to do, spread across many, not one.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l2-q4",
              type: "fill-in",
              prompt: "Fill in the blank: A fund that tracks a market benchmark like the S&P 500 is called an _____ fund.",
              accept: ["index"],
              explanation:
                "\"Index\" funds are built to mirror a market index rather than have a manager hand-pick stocks, which is why they tend to have very low costs.",
              hint: "It's the same word as the number that tracks the market's overall performance.",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u1-l3",
          unitId: "investing-u1",
          courseId: "investing",
          order: 3,
          title: "Brokerage Accounts & Buying In",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 30,
          summary: "How to actually open an account and buy your first fractional share.",
          cards: [
            {
              kind: "teach",
              id: "investing-u1-l3-t1",
              title: "Taxable vs. retirement accounts",
              body: "A taxable brokerage account lets you buy and sell anytime, with no age restrictions, but you owe taxes on gains when you sell. A retirement account like a Roth IRA grows tax-free but generally can't be touched penalty-free until you're 59½.",
              example:
                "A student saving for a car in 2 years would likely use a taxable account, while money meant for retirement 40 years away is better suited for a Roth IRA.",
            },
            {
              kind: "teach",
              id: "investing-u1-l3-t2",
              title: "Fractional shares remove the price barrier",
              body: "You don't need hundreds of dollars to buy a share of an expensive stock. Most brokerages let you buy a fractional share, even $5 worth, of nearly any stock or ETF.",
              example:
                "One share of a pricey stock might cost $600, but a fractional share purchase lets a student invest just $5 of it and still own 5/600ths of a share.",
              analogy:
                "It's like splitting a pizza with strangers you'll never meet, you only pay for the slice you actually want.",
            },
            {
              kind: "question",
              id: "investing-u1-l3-q1",
              type: "mcq",
              prompt: "What's the key difference between a taxable brokerage account and a Roth IRA?",
              options: [
                "Taxable accounts can only hold ETFs, Roth IRAs can only hold individual stocks",
                "Taxable accounts have no withdrawal restrictions but you owe tax on gains; Roth IRAs grow tax-free but restrict early withdrawals",
                "There is no real difference between them",
                "Roth IRAs require a minimum of $50,000 to open",
              ],
              correctIndex: 1,
              explanation:
                "Taxable accounts are flexible but taxed on gains when sold; Roth IRAs trade some flexibility for tax-free growth meant for retirement.",
              hint: "Think about the trade-off: flexibility vs. tax treatment.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l3-q2",
              type: "true-false",
              prompt: "You need at least a few hundred dollars to buy your first share of a company like Amazon.",
              correctBool: false,
              explanation:
                "Fractional shares let you invest any dollar amount you choose, even just $5 or $10, regardless of the full share price.",
              hint: "Remember the pizza-slice analogy.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l3-q3",
              type: "scenario",
              prompt: "What should Priya keep in mind before investing this money?",
              context:
                "Priya just got her first internship paycheck and wants to invest $100 of it. She's also saving separately for a laptop she plans to buy in 4 months.",
              options: [
                "She should put the laptop money into stocks too, since stocks always go up short-term",
                "Money she needs soon (like the laptop fund) is generally safer kept out of the market, since stock prices can dip in the short term",
                "It doesn't matter, all cash should be invested immediately",
                "She should only invest money she plans to spend within a month",
              ],
              correctIndex: 1,
              explanation:
                "Money needed soon shouldn't be exposed to short-term market swings, investing generally suits money you won't need for years.",
              hint: "Think about her time horizon for the laptop money vs. the invested money.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u1-l3-q4",
              type: "fill-in",
              prompt: "Fill in the blank: Buying a partial piece of one share, like $5 worth, is called a _____ share.",
              accept: ["fractional"],
              explanation:
                "Fractional shares let investors buy any dollar amount of a stock or ETF, not just whole shares.",
              hint: "It means less than a whole share.",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u1-l4",
          unitId: "investing-u1",
          courseId: "investing",
          order: 4,
          title: "Unit 1 Challenge: Market Foundations",
          difficulty: "Beginner",
          kind: "challenge",
          xp: 75,
          summary: "Prove you've got the basics of stocks, funds, and accounts locked down.",
          cards: [
            {
              kind: "teach",
              id: "investing-u1-l4-t1",
              title: "Quick recap",
              body: "A stock is real ownership. A fund bundles many stocks together to spread risk. Brokerage accounts are where you hold investments, and fractional shares mean any budget can get started.",
            },
            {
              kind: "question",
              id: "investing-u1-l4-q1",
              type: "mcq",
              prompt: "What causes a company's stock price to move up or down day to day?",
              options: [
                "It only changes once a year, on the company's anniversary",
                "A mix of factors like earnings reports, news, and shifts in investor supply and demand",
                "The government sets a fixed price for every stock",
                "It's decided randomly by the stock exchange each morning",
              ],
              correctIndex: 1,
              explanation:
                "Stock prices move based on supply and demand from investors, which is influenced by earnings reports, company news, economic data, and overall market sentiment.",
              hint: "Think about what makes buyers suddenly want more, or fewer, shares.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u1-l4-q2",
              type: "scenario",
              prompt: "What's the smartest first move for Devon?",
              context:
                "Devon, a sophomore, has $60 left after covering rent and wants to start investing but is nervous about picking \"the wrong stock.\" He's never opened a brokerage account before.",
              options: [
                "Wait until he has $10,000 saved before investing anything",
                "Put all $60 into a single trending stock he saw on social media",
                "Open a brokerage account and put the $60 into a broad, low-cost index fund",
                "Avoid investing entirely since he might lose money",
              ],
              correctIndex: 2,
              explanation:
                "A broad index fund removes the pressure of picking one \"right\" company and lets Devon start with any amount, spreading risk across hundreds of businesses.",
              hint: "Think diversification over guessing single winners.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u1-l4-q3",
              type: "true-false",
              prompt: "Mutual funds and ETFs can both trade continuously throughout the trading day.",
              correctBool: false,
              explanation:
                "ETFs trade all day like stocks, but traditional mutual funds only price and execute trades once, after the market closes.",
              hint: "Only one of the two trades in real time.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u1-l4-q4",
              type: "fill-in",
              prompt: "Fill in the blank: A retirement account where qualified withdrawals in retirement are tax-free is called a Roth _____.",
              accept: ["ira", "roth ira"],
              explanation:
                "A Roth IRA is funded with after-tax money, so qualified withdrawals in retirement come out completely tax-free.",
              hint: "It's a three-letter acronym for Individual Retirement Account.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u1-l4-q5",
              type: "mcq",
              prompt: "Why might a college student prefer an ETF over a mutual fund when starting out?",
              options: [
                "ETFs are always guaranteed to earn more money",
                "ETFs often have no minimum investment and can be bought with any small amount, including fractional shares",
                "Mutual funds are illegal for anyone under 25",
                "ETFs can only be purchased once a year",
              ],
              correctIndex: 1,
              explanation:
                "ETFs typically have low barriers to entry, no large minimums and the ability to buy fractional shares, which fits a tight student budget.",
              hint: "Think about accessibility for someone starting with just a few dollars.",
              xp: 15,
            },
          ],
        },
      ],
    },
    // ────────────────────────────────────────────────────────────────
    // Unit 2: Building a Portfolio
    // ────────────────────────────────────────────────────────────────
    {
      id: "investing-u2",
      courseId: "investing",
      order: 2,
      title: "Building a Portfolio",
      subtitle: "Spreading risk, choosing an allocation, and investing on autopilot",
      lessons: [
        {
          id: "investing-u2-l1",
          unitId: "investing-u2",
          courseId: "investing",
          order: 1,
          title: "Diversification: Don't Bet It All on One",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 30,
          summary: "One stock can crash to zero. A diversified portfolio almost never does.",
          cards: [
            {
              kind: "teach",
              id: "investing-u2-l1-t1",
              title: "One stock is not a portfolio",
              body: "Putting all your money in a single company means your entire investment depends on that one business succeeding. If it struggles, has a scandal, or goes bankrupt, you could lose most or all of your money.",
              example:
                "During the 2008 financial crisis, some individual bank stocks like Lehman Brothers went to zero, wiping out investors who were concentrated in just that one company, while diversified index investors, though down sharply, still held stakes in hundreds of surviving companies.",
              analogy:
                "Diversification is like not putting all your exam grade on one question, spread your effort (or money) so one bad outcome doesn't sink you.",
            },
            {
              kind: "teach",
              id: "investing-u2-l1-t2",
              title: "How diversification actually reduces risk",
              body: "When you own many companies across different industries, a decline in one is often offset by stability or gains in others. You won't avoid all market swings, but you avoid the risk of a single company wiping you out.",
              example:
                "A diversified index fund holding hundreds of companies has never gone to zero, even though individual companies within it have failed over the decades.",
            },
            {
              kind: "question",
              id: "investing-u2-l1-q1",
              type: "mcq",
              prompt: "What is the main risk of investing 100% of your money in a single company's stock?",
              options: [
                "There's no extra risk compared to a diversified fund",
                "If that one company struggles or fails, you could lose most or all of your investment",
                "You're required to sell within 30 days by law",
                "Single stocks always underperform funds by definition",
              ],
              correctIndex: 1,
              explanation:
                "Concentrating all your money in one company ties your entire outcome to that single business, if it fails, there's nothing else in your portfolio to cushion the loss.",
              hint: "What happens to your money if that one company goes bankrupt?",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l1-q2",
              type: "true-false",
              prompt: "A well-diversified index fund of hundreds of companies has historically gone to zero the way individual companies sometimes do.",
              correctBool: false,
              explanation:
                "While individual companies can fail completely, a broad index fund spreading money across hundreds of businesses has never lost all its value, some companies failing gets offset by others thriving.",
              hint: "Think about the difference between one company failing and hundreds failing at once.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l1-q3",
              type: "scenario",
              prompt: "What's the biggest risk in Carlos's plan?",
              context:
                "Carlos is excited about a company he interned at and decides to put his entire $2,000 savings into that single stock, convinced it's \"going to blow up.\"",
              options: [
                "There is no real risk, companies he's worked at are always safe bets",
                "His entire financial outcome now depends on one company's performance, with nothing to cushion a decline",
                "The risk is that the stock will be too boring",
                "He should invest even more to reduce his risk",
              ],
              correctIndex: 1,
              explanation:
                "Concentrating all his savings in one stock means Carlos has zero diversification, a single piece of bad news could significantly hurt his entire portfolio.",
              hint: "Think about what happens if that one company has a bad year.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l1-q4",
              type: "fill-in",
              prompt: "Fill in the blank: Spreading your money across many different investments to reduce risk is called _____.",
              accept: ["diversification", "diversifying"],
              explanation:
                "Diversification reduces the impact any single investment's failure has on your overall portfolio.",
              hint: "It's the strategy behind \"don't put all your eggs in one basket.\"",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u2-l2",
          unitId: "investing-u2",
          courseId: "investing",
          order: 2,
          title: "Asset Allocation & Time Horizon",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 30,
          summary: "How much risk you can afford depends heavily on when you'll need the money.",
          cards: [
            {
              kind: "teach",
              id: "investing-u2-l2-t1",
              title: "Time horizon changes everything",
              body: "Asset allocation is how you split money between riskier assets (like stocks) and steadier ones (like bonds or cash). The more years until you need the money, the more time you have to ride out market dips.",
              example:
                "A 20-year-old investing for retirement 45 years away can afford to hold mostly stocks, since there's plenty of time to recover from downturns. A 60-year-old retiring soon typically shifts more into bonds to protect what they've already built.",
              analogy:
                "Investing time horizon is like a road trip, the longer the drive, the more detours and traffic jams (market dips) you can absorb and still arrive on time.",
            },
            {
              kind: "teach",
              id: "investing-u2-l2-t2",
              title: "Risk and reward are linked",
              body: "Stocks have historically grown faster than bonds or cash over long periods, but they also swing more sharply in the short term. Bonds and cash are steadier but tend to grow more slowly.",
              example:
                "A student investing money they won't touch for 40 years can typically absorb short-term stock volatility in exchange for higher long-term growth potential.",
            },
            {
              kind: "question",
              id: "investing-u2-l2-q1",
              type: "mcq",
              prompt: "Why might a 20-year-old typically hold a larger percentage of stocks than a 60-year-old nearing retirement?",
              options: [
                "Stocks are only legal to buy before age 30",
                "A longer time horizon means more time to recover from short-term market downturns",
                "20-year-olds are required by law to hold only stocks",
                "There's no real reason, age doesn't matter for investing",
              ],
              correctIndex: 1,
              explanation:
                "A longer time horizon lets younger investors ride out short-term volatility in exchange for stocks' historically higher long-term growth.",
              hint: "Think about who has more years to recover from a market dip.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l2-q2",
              type: "true-false",
              prompt: "Bonds and cash generally offer steadier, but historically lower, long-term returns compared to stocks.",
              correctBool: true,
              explanation:
                "Bonds and cash tend to be more stable but have historically grown more slowly than stocks over long periods, reflecting a lower risk, lower reward trade-off.",
              hint: "Think about the trade-off between stability and growth.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l2-q3",
              type: "scenario",
              prompt: "What should Aisha consider about her allocation?",
              context:
                "Aisha, 19, is investing money for retirement that she won't touch for over 40 years. She's nervous about stock market swings and is considering putting all of it into cash savings instead.",
              options: [
                "Cash is the best choice since it never loses value in any sense",
                "With a 40-year horizon, she has significant time to ride out stock market swings, and an all-cash approach likely means missing out on decades of growth",
                "It doesn't matter what she chooses since all options perform identically",
                "She should split it evenly between gold and lottery tickets",
              ],
              correctIndex: 1,
              explanation:
                "With decades before she needs the money, Aisha can typically afford more stock exposure for growth, since she has time to recover from any downturns along the way.",
              hint: "Think about her long time horizon and what it allows her to tolerate.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l2-q4",
              type: "fill-in",
              prompt: "Fill in the blank: The mix of stocks, bonds, and cash you choose to hold is called your asset _____.",
              accept: ["allocation"],
              explanation:
                "Asset allocation describes how your investments are divided among different asset classes based on goals and time horizon.",
              hint: "It's the word for how something is divided or assigned.",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u2-l3",
          unitId: "investing-u2",
          courseId: "investing",
          order: 3,
          title: "Dollar-Cost Averaging & Fees",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 35,
          summary: "Investing the same amount on a schedule, and why fees quietly eat your returns.",
          cards: [
            {
              kind: "teach",
              id: "investing-u2-l3-t1",
              title: "Dollar-cost averaging (DCA)",
              body: "Instead of trying to guess the \"best\" time to invest, DCA means investing a fixed amount on a regular schedule, no matter what prices are doing. Some months you buy more shares when prices are low; other months fewer when prices are high, it averages out.",
              example:
                "If you invest $50 every month regardless of price, you might buy 2 shares when the price is $25 and only 1 share when it rises to $50, smoothing out the ups and downs automatically.",
              analogy:
                "DCA is like buying gas the same day every week no matter the price, instead of trying to guess the cheapest day, over a year, it evens out.",
            },
            {
              kind: "teach",
              id: "investing-u2-l3-t2",
              title: "Expense ratios: tiny fees, huge impact",
              body: "An expense ratio is the annual fee a fund charges, shown as a percentage. A 1% fee sounds small, but over decades it can quietly consume tens of thousands of dollars compared to a low-cost 0.03% fund.",
              example:
                "On a $10,000 investment growing for 40 years at 8% annually, a 0.03% expense ratio fund could leave you with roughly $217,000, while a similar fund charging 1% might leave you closer to $150,000, a difference of tens of thousands of dollars from fees alone.",
            },
            {
              kind: "question",
              id: "investing-u2-l3-q1",
              type: "mcq",
              prompt: "What is the core idea behind dollar-cost averaging?",
              options: [
                "Investing a large lump sum only when you're certain prices will rise",
                "Investing a fixed dollar amount on a regular schedule regardless of the current price",
                "Only investing when the market is at an all-time high",
                "Waiting until you have $10,000 before investing anything",
              ],
              correctIndex: 1,
              explanation:
                "Dollar-cost averaging removes the guesswork of timing the market by investing consistently on a schedule, buying more shares when prices are low and fewer when high.",
              hint: "The key word is \"regular\" and \"fixed.\"",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l3-q2",
              type: "true-false",
              prompt: "A fund charging a 1% expense ratio instead of 0.03% can cost an investor tens of thousands of dollars over several decades.",
              correctBool: true,
              explanation:
                "Even small percentage fees compound over time, and the gap between a 1% and 0.03% expense ratio can add up to tens of thousands of dollars lost over 30-40 years.",
              hint: "Think about how compounding applies to fees, not just gains.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l3-q3",
              type: "scenario",
              prompt: "What is Tyler practicing by doing this?",
              context:
                "Tyler sets up an automatic transfer of $50 from every paycheck into an index fund, regardless of whether the market is up or down that week.",
              options: [
                "Market timing",
                "Dollar-cost averaging",
                "Day trading",
                "Short selling",
              ],
              correctIndex: 1,
              explanation:
                "Investing a consistent amount on a fixed schedule, regardless of price, is the definition of dollar-cost averaging.",
              hint: "It's the strategy of not trying to guess the \"best\" moment to buy.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u2-l3-q4",
              type: "fill-in",
              prompt: "Fill in the blank: The annual percentage fee a fund charges investors is called its expense _____.",
              accept: ["ratio", "expense ratio"],
              explanation:
                "The expense ratio is the yearly fee, expressed as a percentage of your investment, that a fund charges to cover its costs.",
              hint: "It's expressed as a percentage, like 0.03% or 1%.",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u2-l4",
          unitId: "investing-u2",
          courseId: "investing",
          order: 4,
          title: "Unit 2 Challenge: Building a Portfolio",
          difficulty: "Intermediate",
          kind: "challenge",
          xp: 85,
          summary: "Test your grasp on diversification, allocation, DCA, and fees together.",
          cards: [
            {
              kind: "teach",
              id: "investing-u2-l4-t1",
              title: "Quick recap",
              body: "Diversification protects you from any single company failing. Your allocation should shift with your time horizon. Dollar-cost averaging removes timing guesswork, and low fees compound in your favor over decades.",
            },
            {
              kind: "question",
              id: "investing-u2-l4-q1",
              type: "scenario",
              prompt: "What's the smarter move for Nia?",
              context:
                "Nia, 21, has $500 to invest and is deciding between putting it all into one hot tech stock her friend recommended, or splitting it into a diversified index fund and investing the rest via automatic $25 monthly deposits.",
              options: [
                "Put it all into the one hot stock for maximum potential upside",
                "Diversify with an index fund and automate ongoing contributions to smooth out price swings over time",
                "Keep all $500 in cash forever to avoid any risk",
                "Split it evenly between 20 random stocks she's never researched",
              ],
              correctIndex: 1,
              explanation:
                "Combining diversification with dollar-cost averaging reduces the risk of a single company's failure and removes the pressure of trying to time the market.",
              hint: "Think about combining two strategies from this unit.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u2-l4-q2",
              type: "mcq",
              prompt: "Which investor is likely best suited to hold a higher percentage of stocks vs. bonds?",
              options: [
                "Someone retiring next year who needs the money soon",
                "A 19-year-old investing for a goal 40 years away",
                "Someone who needs the cash for rent next month",
                "There's no difference, everyone should hold the same allocation",
              ],
              correctIndex: 1,
              explanation:
                "A longer time horizon allows more room to hold higher-growth, higher-volatility assets like stocks, since there's time to recover from downturns.",
              hint: "Longer time horizon = more room for stock volatility.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u2-l4-q3",
              type: "true-false",
              prompt: "Diversification guarantees that your portfolio will never lose value.",
              correctBool: false,
              explanation:
                "Diversification reduces the risk of a single company wiping you out, but a diversified portfolio can still decline in value when the broader market falls.",
              hint: "Diversification manages risk, it doesn't eliminate all risk.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u2-l4-q4",
              type: "fill-in",
              prompt: "Fill in the blank: Investing a fixed amount on a set schedule, regardless of price, is called dollar-cost _____.",
              accept: ["averaging"],
              explanation:
                "Dollar-cost averaging smooths out the price you pay over time by investing consistently rather than trying to time the market.",
              hint: "It's the second word in the strategy's name.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u2-l4-q5",
              type: "scenario",
              prompt: "Roughly how much more could the low-fee fund be worth after 40 years?",
              context:
                "Two students each invest $10,000 for 40 years at the same 8% average annual return. One picks a fund with a 0.03% expense ratio; the other picks a similar fund charging 1%.",
              options: [
                "About the same amount, fees under 1% don't matter",
                "Tens of thousands of dollars more for the low-fee fund",
                "The high-fee fund will actually end up worth more",
                "Fees only matter if you invest more than $1 million",
              ],
              correctIndex: 1,
              explanation:
                "Even a 1% annual fee compounds against you every year for 40 years, which can add up to tens of thousands of dollars less than a comparable low-cost fund.",
              hint: "Remember the $217,000 vs. $150,000 example from the lesson.",
              xp: 15,
            },
          ],
        },
      ],
    },
    // ────────────────────────────────────────────────────────────────
    // Unit 3: Long-Term Wealth
    // ────────────────────────────────────────────────────────────────
    {
      id: "investing-u3",
      courseId: "investing",
      order: 3,
      title: "Long-Term Wealth",
      subtitle: "Compounding, Roth IRAs, and staying invested when it's hard",
      lessons: [
        {
          id: "investing-u3-l1",
          unitId: "investing-u3",
          courseId: "investing",
          order: 1,
          title: "Compound Growth: Time Is Your Superpower",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 35,
          summary: "Starting a decade earlier can matter more than investing more money.",
          cards: [
            {
              kind: "teach",
              id: "investing-u3-l1-t1",
              title: "Compounding builds on itself",
              body: "Compound growth means your investment returns start earning their own returns. The earlier you start, the more years your money has to snowball, which is why time in the market often matters more than the amount you start with.",
              example:
                "Investing $100/month starting at age 20 and stopping at 30 (just $12,000 total invested), left to grow at 8% until age 65, can end up worth more than investing $100/month from age 30 all the way to 65 (a much larger $42,000 total invested), because the first investor's money had 10 extra early years to compound.",
              analogy:
                "Compounding is like a snowball rolling downhill, it starts small, but the longer the hill, the bigger it gets, and most of the size comes from the last stretch of rolling.",
            },
            {
              kind: "teach",
              id: "investing-u3-l1-t2",
              title: "Small numbers, big differences",
              body: "Because compounding is exponential, small differences in starting age or contribution amount lead to dramatically different outcomes decades later. This is why starting during college, even with tiny amounts, can matter.",
              example:
                "$100/month invested at 8% annual growth becomes roughly $30,000 after 10 years, but roughly $175,000 after 25 years, the growth accelerates the longer it compounds.",
            },
            {
              kind: "question",
              id: "investing-u3-l1-q1",
              type: "mcq",
              prompt: "Why can someone who invests $100/month from age 20-30 end up with more money at 65 than someone investing the same $100/month from age 30-65?",
              options: [
                "It's impossible, investing for fewer years always results in less money",
                "The first investor's money has significantly more total years to compound, even though they contributed less overall",
                "The stock market only grows for investors under 30",
                "The second investor made a math error",
              ],
              correctIndex: 1,
              explanation:
                "Compounding rewards time above almost everything else, starting a decade earlier can outweigh contributing far more money later, because those early dollars have decades longer to grow on themselves.",
              hint: "Focus on how many total years each dollar had to compound.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l1-q2",
              type: "true-false",
              prompt: "In compound growth, the majority of an investment's growth typically happens in the earliest years.",
              correctBool: false,
              explanation:
                "Compounding is exponential, meaning growth accelerates over time, the largest dollar gains typically happen in the later years, once the base amount has grown much larger.",
              hint: "Think about a snowball, is it bigger at the top or bottom of the hill?",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l1-q3",
              type: "scenario",
              prompt: "What's the key lesson from Sam's decision?",
              context:
                "Sam is a sophomore who starts investing $30/month from her part-time job now, even though it feels too small to matter. Her friend plans to wait until after graduation, when he'll have more money to invest at once.",
              options: [
                "Sam is wasting her time since $30/month is too small to matter",
                "Starting small now gives Sam's money more years to compound, which can matter more than her friend's larger but later contributions",
                "It makes no difference when either of them starts investing",
                "Her friend's plan is guaranteed to result in more money",
              ],
              correctIndex: 1,
              explanation:
                "Because of compounding, starting early, even with small amounts, gives money more time to grow, which can outweigh contributing more money later on.",
              hint: "Think about the power of extra compounding years, not just the dollar amount.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l1-q4",
              type: "fill-in",
              prompt: "Fill in the blank: When investment returns start earning their own returns over time, that's called _____ growth.",
              accept: ["compound", "compounding"],
              explanation:
                "Compound growth is the process of returns generating their own additional returns, accelerating growth the longer money stays invested.",
              hint: "It's the term used throughout this lesson, related to \"interest on interest.\"",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u3-l2",
          unitId: "investing-u3",
          courseId: "investing",
          order: 2,
          title: "The Roth IRA for Students",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 35,
          summary: "A tax-free retirement account you can open the moment you earn income.",
          cards: [
            {
              kind: "teach",
              id: "investing-u3-l2-t1",
              title: "How a Roth IRA works",
              body: "A Roth IRA is a retirement account you fund with money you've already paid taxes on. In exchange, your investments grow completely tax-free, and qualified withdrawals in retirement owe no tax at all, not even on the decades of growth.",
              example:
                "If you contribute $3,000 to a Roth IRA in college and it grows to $30,000 by retirement, you'd owe $0 in taxes on that entire $30,000 when you withdraw it in retirement, since it's already been taxed.",
              analogy:
                "A Roth IRA is like pre-paying sales tax on a seed before you plant it, the tree that grows from it, no matter how huge, is yours completely tax-free at harvest.",
            },
            {
              kind: "teach",
              id: "investing-u3-l2-t2",
              title: "Who can contribute, and how much",
              body: "You need earned income (like a job or internship, not gifts or allowance) to contribute to a Roth IRA. As of the mid-2020s, the annual contribution limit has been around $7,000 for people under 50, but you can never contribute more than you actually earned.",
              example:
                "A student who earns $4,000 from a summer internship could contribute up to that full $4,000 to a Roth IRA that year, since the contribution can't exceed earned income.",
            },
            {
              kind: "question",
              id: "investing-u3-l2-q1",
              type: "mcq",
              prompt: "What is the main tax advantage of a Roth IRA?",
              options: [
                "Contributions are tax-deductible now, and withdrawals are taxed later",
                "You contribute after-tax money now, and qualified withdrawals in retirement are completely tax-free",
                "There is no tax advantage compared to a regular savings account",
                "You avoid all taxes on any account by using a Roth IRA",
              ],
              correctIndex: 1,
              explanation:
                "A Roth IRA flips the usual order: you pay taxes on the money before contributing, so all future growth and qualified withdrawals come out completely tax-free.",
              hint: "Roth = taxed now, tax-free later.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l2-q2",
              type: "true-false",
              prompt: "You can contribute to a Roth IRA using birthday gift money even if you have no earned income from a job.",
              correctBool: false,
              explanation:
                "Roth IRA contributions require earned income, like wages from a job or self-employment, gifts, allowance, or investment income don't count.",
              hint: "Think about the word \"earned\" in earned income.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l2-q3",
              type: "scenario",
              prompt: "How much can Elena contribute to a Roth IRA this year?",
              context:
                "Elena earned $5,200 from her campus job this year. The annual Roth IRA contribution limit for her age group is $7,000.",
              options: [
                "$7,000, since that's the limit regardless of income",
                "$5,200, since she can't contribute more than she actually earned",
                "$0, because campus jobs don't count as earned income",
                "$12,200, by combining the limit and her earnings",
              ],
              correctIndex: 1,
              explanation:
                "You can never contribute more to a Roth IRA than your earned income for the year, even if that's below the annual limit.",
              hint: "The contribution is capped by whichever is lower: the limit or her actual earnings.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l2-q4",
              type: "fill-in",
              prompt: "Fill in the blank: To contribute to a Roth IRA, you must have _____ income, like wages from a job.",
              accept: ["earned"],
              explanation:
                "Roth IRA contributions must come from earned income, money from working, not gifts, allowances, or investment returns.",
              hint: "It's the opposite of unearned income like gifts.",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u3-l3",
          unitId: "investing-u3",
          courseId: "investing",
          order: 3,
          title: "Behavioral Traps: Your Own Worst Enemy",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 35,
          summary: "Panic selling and chasing hype quietly destroy more wealth than bad picks do.",
          cards: [
            {
              kind: "teach",
              id: "investing-u3-l3-t1",
              title: "Panic selling locks in losses",
              body: "When markets drop, it's tempting to sell to \"stop the bleeding.\" But selling after a decline turns a temporary paper loss into a permanent, real one, and you miss the recovery that historically follows.",
              example:
                "An investor who sold everything during a sharp market downturn and stayed in cash would have missed the strong rebound that often follows soon after, permanently locking in losses instead of recovering with the market.",
            },
            {
              kind: "teach",
              id: "investing-u3-l3-t2",
              title: "Time in the market beats timing the market",
              body: "Trying to predict the exact best moments to buy and sell almost never works consistently, even for professionals. Missing just a handful of the market's best days, which often cluster right after the worst days, can seriously hurt long-term returns.",
              example:
                "Studies of the S&P 500 have shown that missing just the 10 best trading days over a 20-year period can cut an investor's total returns roughly in half compared to staying fully invested the whole time.",
              analogy:
                "Timing the market is like trying to catch a specific rung on a moving ladder, miss it, and you've lost more ground than if you'd just held on the whole climb.",
            },
            {
              kind: "question",
              id: "investing-u3-l3-q1",
              type: "mcq",
              prompt: "What typically happens when an investor sells everything in a panic during a market downturn?",
              options: [
                "They protect all their money with zero downside",
                "They lock in a real, permanent loss and often miss the recovery that follows",
                "It has no effect on their long-term returns either way",
                "They automatically buy back in at the perfect moment",
              ],
              correctIndex: 1,
              explanation:
                "Selling during a downturn converts a temporary paper loss into a permanent, realized one, and historically, missing the recovery period that follows can significantly hurt long-term returns.",
              hint: "Think about the difference between a loss on paper and a loss you've locked in by selling.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l3-q2",
              type: "true-false",
              prompt: "Missing just a handful of the stock market's best days over a couple of decades can significantly reduce total returns.",
              correctBool: true,
              explanation:
                "The market's best days often occur close to its worst days, so investors who jump out during volatility risk missing the sharp rebounds, which can cut long-term returns substantially.",
              hint: "The best and worst days often cluster close together.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l3-q3",
              type: "scenario",
              prompt: "What behavioral trap is Marcus falling into?",
              context:
                "Marcus sees his index fund drop 15% in a month due to market volatility. Feeling anxious, he sells everything and moves it to cash, planning to \"buy back in once things calm down.\"",
              options: [
                "Diversification",
                "Dollar-cost averaging",
                "Panic selling, which locks in losses and risks missing the eventual recovery",
                "Rebalancing his portfolio responsibly",
              ],
              correctIndex: 2,
              explanation:
                "Selling out of fear during a downturn is panic selling, it locks in real losses and creates the risk of missing the rebound, since nobody can reliably predict \"when things calm down.\"",
              hint: "Think about what selling out of fear during a dip is typically called.",
              xp: 10,
            },
            {
              kind: "question",
              id: "investing-u3-l3-q4",
              type: "fill-in",
              prompt: "Fill in the blank: Selling investments out of fear during a market drop is commonly called panic _____.",
              accept: ["selling"],
              explanation:
                "Panic selling means selling investments out of fear during a downturn, which locks in losses and risks missing the eventual recovery.",
              hint: "It's the action taken, paired with the word \"panic.\"",
              xp: 10,
            },
          ],
        },
        {
          id: "investing-u3-l4",
          unitId: "investing-u3",
          courseId: "investing",
          order: 4,
          title: "Unit 3 Challenge: Long-Term Wealth",
          difficulty: "Advanced",
          kind: "challenge",
          xp: 100,
          summary: "Master-level check on compounding, Roth IRAs, and investor psychology.",
          cards: [
            {
              kind: "teach",
              id: "investing-u3-l4-t1",
              title: "Quick recap",
              body: "Compounding rewards time above almost everything else. A Roth IRA lets earned income grow completely tax-free for retirement. And the biggest threat to your returns is often your own behavior, panic selling and chasing hype.",
            },
            {
              kind: "question",
              id: "investing-u3-l4-q1",
              type: "scenario",
              prompt: "What's the wisest move for Kevin?",
              context:
                "Kevin, 20, earned $3,500 from a summer internship. He's debating between spending it all on a new gaming setup or contributing it to a Roth IRA, where it could grow tax-free for over 40 years before retirement.",
              options: [
                "Spend it all now, money now is always better than money later",
                "Contribute it to the Roth IRA, giving it decades to compound completely tax-free",
                "Put it in a checking account and let it sit with no growth",
                "It doesn't matter which he chooses",
              ],
              correctIndex: 1,
              explanation:
                "With over 40 years to compound tax-free in a Roth IRA, Kevin's $3,500 has enormous growth potential, a benefit that's much harder to replicate starting later in life.",
              hint: "Think about compounding time combined with tax-free growth.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u3-l4-q2",
              type: "true-false",
              prompt: "Consistently predicting the best days to buy and sell stocks is a reliable strategy that most successful long-term investors use.",
              correctBool: false,
              explanation:
                "Even professional investors struggle to consistently time the market. Historically, staying invested (\"time in the market\") has outperformed trying to time entries and exits.",
              hint: "Recall the lesson's core phrase about time vs. timing.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u3-l4-q3",
              type: "mcq",
              prompt: "Why does starting to invest at 20 instead of 30 often make such a large difference by retirement?",
              options: [
                "Because the stock market performs differently for younger people",
                "Because those extra 10 years let compounding work on the money for much longer",
                "Because younger investors get access to secret investment products",
                "It actually makes no difference at all",
              ],
              correctIndex: 1,
              explanation:
                "Compound growth is exponential, so extra years early on can matter more than larger contributions made later, since that money has more time to grow on itself.",
              hint: "Think back to the snowball analogy.",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u3-l4-q4",
              type: "fill-in",
              prompt: "Fill in the blank: The idea that staying invested consistently beats trying to guess market highs and lows is summarized as \"_____ in the market beats timing the market.\"",
              accept: ["time"],
              explanation:
                "\"Time in the market beats timing the market\" captures why staying invested consistently tends to outperform trying to guess the perfect entry and exit points.",
              hint: "It's a duration-related word, not \"timing.\"",
              xp: 15,
            },
            {
              kind: "question",
              id: "investing-u3-l4-q5",
              type: "scenario",
              prompt: "What is the healthiest response to this market drop?",
              context:
                "The market drops 20% over a few weeks. Priyanka, who has been dollar-cost averaging into an index fund for retirement 35 years away, feels tempted to stop her contributions and wait for things to \"look safer.\"",
              options: [
                "Stop contributing and wait indefinitely for a guaranteed safe signal",
                "Sell everything immediately to avoid further declines",
                "Continue her regular contributions as planned, since her time horizon is long and downturns are a normal part of investing",
                "Move all her money into a single trending stock instead",
              ],
              correctIndex: 2,
              explanation:
                "With a 35-year horizon, short-term drops are a normal part of investing. Continuing consistent contributions (dollar-cost averaging) through downturns, rather than trying to time a \"safe\" re-entry, has historically served long-term investors well.",
              hint: "Think about combining her long time horizon with the dollar-cost averaging strategy she's already using.",
              xp: 15,
            },
          ],
        },
      ],
    },
  ],
};
