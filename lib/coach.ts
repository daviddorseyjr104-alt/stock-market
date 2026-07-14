// Capital Coach, educational AI tutor response engine.
//
// Ships with a high-quality offline knowledge base so the product works with
// zero API keys. If OPENAI_API_KEY / ANTHROPIC_API_KEY is configured, swap the
// `getCoachResponse` call site for a real completion, the shape is identical.

export interface CoachReply {
  answer: string[];
  recommendedLessonId?: string;
  recommendedLabel?: string;
  /** "offline" means the built-in keyword engine answered, not a live model.
   *  Surfaced so the UI can say so instead of passing it off as the real thing. */
  source?: "live" | "offline";
  /** Live questions left today, when the backend is metering them. */
  remaining?: number;
}

export const suggestedPrompts: string[] = [
  "I only have $50. Should I invest?",
  "What is an ETF?",
  "What should I do with internship money?",
  "How do Roth IRAs work?",
  "How risky is one stock?",
  "How do I start if I'm broke?",
];

interface KBEntry {
  keywords: string[];
  reply: CoachReply;
}

const KB: KBEntry[] = [
  {
    keywords: ["50", "$50", "small amount", "little money", "broke", "no money", "start if"],
    reply: {
      answer: [
        "Short answer: yes, $50 is enough to *start learning*, but make sure the basics are covered first.",
        "Before investing, check two things: (1) Do you have any high-interest debt, like a credit card balance? Paying that off is a guaranteed return that beats the market. (2) Do you have a small cushion ($300-$500) for emergencies?",
        "If those are handled, $50 is genuinely a great start. Thanks to fractional shares, you can put it into a broad, low-cost ETF and own a tiny slice of hundreds of companies. The point at this stage isn't the $50, it's building the habit and learning how it feels to be invested.",
        "Remember: this is education, not personalized financial advice. The goal is understanding, so your first *real* dollar is an informed one.",
      ],
      recommendedLessonId: "money-basics-u2-l3",
      recommendedLabel: "High-Yield Savings & Your First Emergency Fund",
    },
  },
  {
    keywords: ["etf", "basket", "index", "diversif"],
    reply: {
      answer: [
        "An ETF (exchange-traded fund) is a single investment that holds many others inside it, sometimes hundreds of stocks or bonds at once.",
        "Think of it like a combo meal instead of ordering à la carte. You buy one share of the ETF and instantly own a small slice of everything inside. That solves the biggest beginner risk: putting all your eggs in one basket.",
        "If one company in a broad ETF crashes, you're barely affected because it's a tiny piece of a large group. Many ETFs also have very low fees, which is why a broad, low-cost ETF is one of the most recommended starting points in all of investing.",
      ],
      recommendedLessonId: "investing-u1-l2",
      recommendedLabel: "ETFs, Index Funds & Mutual Funds",
    },
  },
  {
    keywords: ["internship", "paycheck", "first job", "summer money", "first paycheck"],
    reply: {
      answer: [
        "Congrats on the internship, first real paychecks are a big deal. Here's a student-friendly framework:",
        "1) Emergency fund first. Park $300-$500 somewhere safe and boring so a surprise can't push you into debt.",
        "2) Consider a Roth IRA. Because you have *earned income*, you can contribute, and since you're likely in a low tax bracket, that tax-free growth is incredibly valuable over decades.",
        "3) Automate a small amount. Even $20-$50 per paycheck into a broad index fund builds the habit that compounds.",
        "4) Enjoy some of it! This is about balance, not deprivation. A common split is 50% needs / 30% wants / 20% future.",
      ],
      recommendedLessonId: "investing-u3-l2",
      recommendedLabel: "The Roth IRA for Students",
    },
  },
  {
    keywords: ["roth", "ira", "retirement", "tax-free", "tax free"],
    reply: {
      answer: [
        "A Roth IRA is a retirement account where you invest money you've *already paid taxes on*, and in return, all the growth and your eventual withdrawals are completely tax-free.",
        "For students this is a powerful deal. You're likely in a low tax bracket now, so paying tax today is cheap. Then decades of growth happen tax-free.",
        "Two things to know: you need earned income (a job or internship counts) to contribute, and there's an annual limit, though as a student you rarely need to max it. Inside the Roth, you still choose investments, often a simple index fund.",
        "The Roth is the tax-advantaged *container*; the investments inside it do the growing.",
      ],
      recommendedLessonId: "investing-u3-l2",
      recommendedLabel: "The Roth IRA for Students",
    },
  },
  {
    keywords: ["one stock", "single stock", "risky", "risk", "individual stock"],
    reply: {
      answer: [
        "Putting money into a single stock is one of the riskier moves you can make, because your entire outcome rides on one company.",
        "A single stock can double, or get cut in half. There's no cushion. Compare that to a broad ETF holding hundreds of companies, where one bad name barely moves the whole basket.",
        "It's not that individual stocks are 'bad', they're just concentrated. A common approach: build a diversified core with ETFs or index funds first, then add small individual-stock positions once you understand what you own.",
        "A good rule of thumb: no single position should be large enough that its collapse wrecks your whole plan.",
      ],
      recommendedLessonId: "investing-u1-l1",
      recommendedLabel: "What Is a Stock, Really?",
    },
  },
  {
    keywords: ["compound", "snowball", "interest", "grow over time"],
    reply: {
      answer: [
        "Compound interest means your gains start generating their own gains. Earn 10% on $100 and you have $110, next year's 10% is on $110, not $100. Each step is bigger than the last.",
        "It feels slow at first, then accelerates dramatically. Most of the growth happens in the final years, which is exactly why starting in college, with decades ahead of you, is such a huge advantage.",
        "The enemies of compounding are interruptions and withdrawals. Every time you pull money out, you reset the snowball. The students who win usually aren't the best stock-pickers, they're the most consistent.",
      ],
      recommendedLessonId: "investing-u3-l1",
      recommendedLabel: "Compound Growth: Time Is Your Superpower",
    },
  },
  {
    keywords: ["budget", "spending", "aid", "financial aid", "save money"],
    reply: {
      answer: [
        "Budgeting isn't about restriction, it's about awareness. Most students don't overspend on purpose; they just lose track of where money went.",
        "A simple framework is 50/30/20: about 50% to needs (rent, food, transport), 30% to wants, and 20% toward saving and your future.",
        "If your aid arrives as one big lump sum, a budget turns it into a plan that lasts the whole semester instead of disappearing by midterms. The goal isn't a perfect budget, it's never being blindsided.",
      ],
      recommendedLessonId: "money-basics-u1-l2",
      recommendedLabel: "The 50/30/20 Rule",
    },
  },
  {
    keywords: ["debt", "loan", "student loan", "pay off", "credit card"],
    reply: {
      answer: [
        "Great question, and the answer depends on the interest rate. High-interest debt (like credit cards at 20%+) should usually be attacked before investing, because paying it off is a *guaranteed* return that beats what the market typically offers.",
        "Lower-rate debt (like many federal student loans) is less urgent, you can often invest alongside paying it down, especially to capture decades of compounding.",
        "The smart move is sequencing: knock out toxic high-interest debt, build a small emergency cushion, then let investing take over. Doing it in the right order is what separates stable wealth-building from a stressful gamble.",
      ],
      recommendedLessonId: "money-basics-u2-l3",
      recommendedLabel: "High-Yield Savings & Your First Emergency Fund",
    },
  },
];

const FALLBACK: CoachReply = {
  answer: [
    "Great question. I'm Capital Coach, here to make investing make sense through real student life.",
    "I can break down things like ETFs, Roth IRAs, compound interest, budgeting your financial aid, what to do with internship money, or whether you're even ready to invest yet.",
    "Try one of the suggested questions, or ask in your own words, for example, 'How do I start investing as a broke sophomore?'",
    "A quick reminder: everything here is educational, not personalized financial advice. Always do your own research before investing real money.",
  ],
  recommendedLessonId: "investing-u1-l1",
  recommendedLabel: "What Is a Stock, Really?",
};

/**
 * Resolve a coach reply for a question. Deterministic keyword matching keeps it
 * fast and offline. Replace the body with a real API call when a key is present.
 */
export function getCoachResponse(question: string): CoachReply {
  const q = question.toLowerCase();
  let best: { entry: KBEntry; score: number } | null = null;
  for (const entry of KB) {
    const score = entry.keywords.reduce(
      (s, k) => (q.includes(k.toLowerCase()) ? s + k.length : s),
      0,
    );
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  return best ? best.entry.reply : FALLBACK;
}
