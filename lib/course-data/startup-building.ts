import type { Course } from "@/lib/types";

export const startupBuildingCourse: Course = {
  id: "startup-building",
  title: "Startup Building",
  tagline: "Go from a dorm-room idea to a startup that actually makes money.",
  description:
    "Most student startups die because founders build something nobody asked for, price it wrong, or split equity with a handshake they regret. This course walks you through finding a real problem, making the unit economics work, and launching without a business degree.",
  category: "Startups",
  icon: "Rocket",
  color: "from-fuchsia-500 to-violet-600",
  accent: "fuchsia-300",
  order: 5,
  unlockLevel: 2,
  units: [
    // ─────────────────────────────────────────────────────────────────
    // UNIT 1: Find a Real Problem
    // ─────────────────────────────────────────────────────────────────
    {
      id: "startup-building-u1",
      courseId: "startup-building",
      order: 1,
      title: "Find a Real Problem",
      subtitle: "Stop brainstorming ideas. Start finding problems people already pay to solve.",
      lessons: [
        {
          id: "startup-building-u1-l1",
          unitId: "startup-building-u1",
          courseId: "startup-building",
          order: 1,
          title: "Ideas vs. Problems",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 25,
          summary: "Why 'cool idea' startups fail and 'painful problem' startups survive.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u1-l1-t1",
              title: "An idea is not a business",
              body: "An idea is something you think would be cool. A problem is something people are already spending time, money, or duct tape trying to fix. Startups built on problems have a built-in customer; startups built on ideas have to convince people to care.",
              example:
                "'An app where people rate dorm food' is an idea. 'Students keep missing the last shuttle back from the library and paying $15 for a rideshare' is a problem, because it's already costing them money tonight.",
            },
            {
              kind: "teach",
              id: "startup-building-u1-l1-t2",
              title: "Look for existing hacks",
              body: "The best sign of a real problem isn't a survey, it's a workaround. If people are already jury-rigging a fix (spreadsheets, group chats, Venmo requests, sketchy Craigslist posts), that effort is proof of demand.",
              analogy:
                "A messy spreadsheet passed around a group chat is basically a five-star Yelp review for your future product, it means people cared enough to build something themselves.",
            },
            {
              kind: "question",
              id: "startup-building-u1-l1-q1",
              type: "mcq",
              prompt: "Which of these is a problem, not just an idea?",
              options: [
                "An app that shows motivational quotes every morning",
                "A shared laundry-machine tracker because students keep walking to the laundry room and finding all machines full",
                "A social network exclusively for people who like cats",
                "A website that shows you 'fun facts' about your major",
              ],
              correctIndex: 1,
              explanation:
                "The laundry tracker solves a recurring, annoying, real cost (wasted trips and time) that students already experience, that's a problem, not just a nice-to-have idea.",
              hint: "Ask: is someone losing time or money right now because this doesn't exist?",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l1-q2",
              type: "true-false",
              prompt:
                "If you personally find an idea exciting, that's enough evidence to start building it.",
              correctBool: false,
              explanation:
                "Founder excitement is not market demand. You need evidence that other people, not just you, are actively struggling with the problem.",
              hint: "Founders are usually the worst judges of whether their own idea is needed.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l1-q3",
              type: "scenario",
              context:
                "Priya wants to build an app for splitting group dinner bills. She notices her friend group already uses a shared Notes app and Venmo requests every single time they eat out, and it always causes an argument about who owes what.",
              prompt: "What's the strongest signal in this scenario that Priya found a real problem?",
              options: [
                "Her friends are always hungry",
                "They already have a manual workaround (Notes app + Venmo) that they use every time and that causes friction",
                "Splitting bills sounds like a fun feature to build",
                "Venmo already exists, so there's clearly a market",
              ],
              correctIndex: 1,
              explanation:
                "A recurring, painful workaround that people already do without being asked is the clearest signal of real, unmet demand.",
              hint: "Focus on what they're already doing, not what could theoretically be built.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u1-l2",
          unitId: "startup-building-u1",
          courseId: "startup-building",
          order: 2,
          title: "Customer Discovery Interviews",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 30,
          summary: "How to interview real people without leading them to lie to you.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u1-l2-t1",
              title: "Ask about the past, not the future",
              body: "'Would you use this?' is almost useless, people say yes to be nice. Instead, ask about specific things they've actually done: 'Tell me about the last time you dealt with X.' Past behavior predicts future behavior far better than a hypothetical opinion.",
              example:
                "Instead of 'Would you use a subletting app?', ask: 'Walk me through the last time you tried to sublet your apartment for the summer. What did you do first?'",
            },
            {
              kind: "teach",
              id: "startup-building-u1-l2-t2",
              title: "The Mom Test",
              body: "The Mom Test is a set of rules for asking questions even your mom couldn't lie to you about, because they're about her life, not your idea. Talk about their life, not your product. Ask about specifics, not opinions or generics. Talk less, listen more.",
              analogy:
                "It's like a detective interviewing a witness about what happened, not a salesperson pitching a witness on what should happen.",
            },
            {
              kind: "question",
              id: "startup-building-u1-l2-q1",
              type: "mcq",
              prompt: "Which question follows the Mom Test best?",
              options: [
                "Do you think a budgeting app for students is a good idea?",
                "Would you pay $5 a month for a budgeting app?",
                "Tell me about the last time you went over budget. What happened?",
                "Don't you hate how hard it is to budget in college?",
              ],
              correctIndex: 2,
              explanation:
                "Asking about a specific past event forces a factual, honest answer instead of a polite guess about hypothetical future behavior.",
              hint: "The best Mom Test questions can't be answered with a compliment or a lie.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l2-q2",
              type: "fill-in",
              prompt:
                "Fill in the blank: The Mom Test says to ask about specifics in the ___, not opinions about the future.",
              accept: ["past", "the past"],
              explanation:
                "Past specifics are facts you can verify; future opinions and hypotheticals are usually just politeness.",
              hint: "It's the opposite of 'would you' or 'will you' questions.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l2-q3",
              type: "true-false",
              prompt:
                "If 8 out of 10 people you interview say they 'would definitely use' your product, that's strong validation.",
              correctBool: false,
              explanation:
                "People are polite and want to encourage you. Verbal enthusiasm about a hypothetical is weak evidence, look for actions instead, like a preorder, a deposit, or them already paying for a workaround.",
              hint: "Politeness inflates 'would use' answers massively, this is one of the most common founder traps.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l2-q4",
              type: "scenario",
              context:
                "Jordan is testing an idea for a tutoring marketplace. In interviews, he keeps asking 'Do you think this would be helpful?' and everyone says yes enthusiastically, but nobody has signed up for the waitlist he mentions at the end.",
              prompt: "What should Jordan change about his interviews?",
              options: [
                "Ask people about specific past attempts to find a tutor and what they actually did",
                "Ask the question more times to more people",
                "Offer a bigger discount to get more 'yes' answers",
                "Stop interviewing and just start building",
              ],
              correctIndex: 0,
              explanation:
                "Jordan is getting polite hypothetical agreement, not real signal. Shifting to specific past behavior will reveal whether people actually search for and pay for tutors.",
              hint: "The gap between 'yes that sounds helpful' and 'no one joined the waitlist' is the tell.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u1-l3",
          unitId: "startup-building-u1",
          courseId: "startup-building",
          order: 3,
          title: "MVPs and Willingness to Pay",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 30,
          summary: "Build the smallest thing that tests your riskiest assumption, then get real money on the table.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u1-l3-t1",
              title: "MVP = smallest test of the riskiest assumption",
              body: "A Minimum Viable Product isn't a stripped-down version of your final app, it's the cheapest experiment that tests whether your biggest assumption is true. Often that means no code at all.",
              example:
                "Before building a meal-kit delivery app, one founder built a single landing page describing the service and DM'd 50 students to see if anyone would pay a $10 deposit. That took a weekend instead of a semester.",
            },
            {
              kind: "teach",
              id: "startup-building-u1-l3-t2",
              title: "Talk is cheap, money is honest",
              body: "The strongest form of validation is someone giving you money before the product fully exists: a preorder, a refundable deposit, or a signed letter of intent (LOI). If no one will put money down, you haven't found a real problem yet.",
              analogy:
                "Interviews tell you what people say; a deposit tells you what people mean.",
            },
            {
              kind: "question",
              id: "startup-building-u1-l3-q1",
              type: "mcq",
              prompt: "What is the main purpose of an MVP?",
              options: [
                "To launch a polished, feature-complete product",
                "To test your riskiest assumption as cheaply and quickly as possible",
                "To impress investors with a working app",
                "To copy a competitor's product exactly",
              ],
              correctIndex: 1,
              explanation:
                "An MVP exists to answer one question cheaply: is this assumption true? Everything else is wasted effort until that's validated.",
              hint: "Think 'cheapest experiment,' not 'smaller version of the final product.'",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l3-q2",
              type: "scenario",
              context:
                "Marcus wants to build a campus dog-walking marketplace app. Instead of hiring a developer, he posts flyers with his phone number and a Google Form, then personally matches walkers with dog owners by text for two weeks.",
              prompt: "What is Marcus doing?",
              options: [
                "Wasting time because he isn't building the real product",
                "Running a manual MVP to test demand before investing in an app",
                "Committing to the wrong business model",
                "Skipping validation entirely",
              ],
              correctIndex: 1,
              explanation:
                "Manually doing the matching himself (sometimes called a 'concierge MVP') lets Marcus test real demand and learn the workflow before spending money on software.",
              hint: "Doing things manually behind the scenes to fake a product is a classic, smart MVP move.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l3-q3",
              type: "true-false",
              prompt:
                "A $20 refundable deposit from a real student is stronger validation than 20 people saying 'that sounds cool' on Instagram.",
              correctBool: true,
              explanation:
                "Money on the table, even refundable, filters out politeness and shows genuine willingness to pay, social media likes and comments don't.",
              hint: "Which one costs the person something?",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u1-l3-q4",
              type: "fill-in",
              prompt:
                "A document where a potential customer states they intend to buy your product once it exists is called a letter of ___.",
              accept: ["intent", "loi", "letter of intent"],
              explanation:
                "An LOI (letter of intent) is a non-binding but meaningful signal that a customer is serious enough to put it in writing.",
              hint: "Abbreviated as LOI.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u1-l4",
          unitId: "startup-building-u1",
          courseId: "startup-building",
          order: 4,
          title: "Unit 1 Challenge: Finding a Real Problem",
          difficulty: "Beginner",
          kind: "challenge",
          xp: 70,
          summary: "Prove you can spot a real problem, run a good interview, and design a lean MVP.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u1-l4-t1",
              title: "Quick recap",
              body: "Real startups start with a painful, already-being-worked-around problem, not a cool idea. Validate it with Mom Test interviews about the past, then test willingness to pay with the cheapest possible MVP before you write a line of code.",
            },
            {
              kind: "question",
              id: "startup-building-u1-l4-q1",
              type: "scenario",
              context:
                "Ana pitches a 'social app for sharing study playlists.' In interviews, when she asks 'Would you use this?' everyone says yes. When she asks 'Tell me about the last time you shared a playlist with a study group,' most people can't remember ever doing it.",
              prompt: "What should Ana conclude?",
              options: [
                "She has strong validation because people said yes",
                "She likely hasn't found a real problem, past behavior shows no one actually does this",
                "She needs to ask more people the same 'would you use this' question",
                "She should build the full app to find out for sure",
              ],
              correctIndex: 1,
              explanation:
                "The mismatch between polite 'yes' answers and the absence of real past behavior is a red flag that this isn't a painful, real problem.",
              hint: "Trust the Mom Test answer, not the hypothetical one.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u1-l4-q2",
              type: "mcq",
              prompt: "Why are existing 'workarounds' (spreadsheets, group chats, Venmo) valuable signals?",
              options: [
                "They prove nobody has solved the problem well yet, and that people care enough to build a hacky fix themselves",
                "They prove the market is already saturated so you shouldn't enter it",
                "They mean the problem is too hard to solve",
                "They have no relevance to startup validation",
              ],
              correctIndex: 0,
              explanation:
                "A hacky workaround is free evidence that real people feel the pain enough to build something imperfect themselves, that's exactly the kind of problem worth solving well.",
              hint: "Effort spent on a bad DIY fix is effort you can capture with a better product.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u1-l4-q3",
              type: "true-false",
              prompt: "The goal of an MVP is to be as feature-rich as possible before showing it to anyone.",
              correctBool: false,
              explanation:
                "The goal is the opposite: the smallest, cheapest version that still tests your riskiest assumption. More features before validation just means more wasted work if the assumption is wrong.",
              hint: "MVP stands for 'minimum,' not 'maximum.'",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u1-l4-q4",
              type: "fill-in",
              prompt: "The set of interview rules for asking questions even your mom couldn't lie to you about is called the Mom ___.",
              accept: ["test", "mom test"],
              explanation:
                "The Mom Test focuses on specific past behavior instead of opinions, so even a biased loved one can't accidentally mislead you.",
              hint: "Two words, the second rhymes with 'best.'",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u1-l4-q5",
              type: "scenario",
              context:
                "Two founders each pitch you their validation. Founder A says '30 people told me on Instagram they loved the idea.' Founder B says '5 people each put down a refundable $15 deposit after a 10-minute call.'",
              prompt: "Whose validation should you trust more, and why?",
              options: [
                "Founder A, because more people responded",
                "Founder B, because real money committed by fewer people is stronger evidence than praise from more people",
                "Neither, social proof and deposits are equally weak",
                "Founder A, because Instagram reach predicts sales",
              ],
              correctIndex: 1,
              explanation:
                "Small numbers of people who put real money down are far more predictive of a viable business than large numbers of free compliments.",
              hint: "Weigh commitment (money), not volume (likes/comments).",
              xp: 15,
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────
    // UNIT 2: Make the Math Work
    // ─────────────────────────────────────────────────────────────────
    {
      id: "startup-building-u2",
      courseId: "startup-building",
      order: 2,
      title: "Make the Math Work",
      subtitle: "A great idea with bad unit economics is still a bad business.",
      lessons: [
        {
          id: "startup-building-u2-l1",
          unitId: "startup-building-u2",
          courseId: "startup-building",
          order: 1,
          title: "Unit Economics",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 30,
          summary: "What it actually costs you to deliver one sale, and what's left over.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u2-l1-t1",
              title: "Unit economics = profit per single sale",
              body: "Unit economics means looking at the revenue and cost of exactly one unit, one meal, one haircut, one subscription, to see if the business actually makes money before you scale it. Scaling a business that loses money per unit just loses money faster.",
              example:
                "A campus meal-prep startup sells a container for $12. Ingredients cost $7 and delivery costs $2. That leaves $3 of margin per meal, before any other costs like packaging or your own time.",
            },
            {
              kind: "teach",
              id: "startup-building-u2-l1-t2",
              title: "Margin is what's left, not what you charged",
              body: "Revenue is what a customer pays you. Margin (or contribution margin) is what's left after the direct costs of making that one sale. Founders who only look at revenue often don't notice they're losing money on every order.",
              analogy:
                "Revenue is your paycheck before taxes; margin is what actually lands in your bank account.",
            },
            {
              kind: "question",
              id: "startup-building-u2-l1-q1",
              type: "scenario",
              context:
                "A student runs a custom phone case business. Each case sells for $25. Materials cost $9, and shipping costs $4 per order.",
              prompt: "What is the margin per unit?",
              options: ["$25", "$16", "$12", "$9"],
              correctIndex: 2,
              explanation:
                "$25 revenue − $9 materials − $4 shipping = $12 margin per unit. That $12 has to cover everything else (ads, time, tools) before it's real profit.",
              hint: "Margin = price minus direct costs (materials + shipping).",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l1-q2",
              type: "true-false",
              prompt: "A business can have high revenue and still lose money on every single sale.",
              correctBool: true,
              explanation:
                "If the cost to deliver each unit is higher than the price charged, revenue can look impressive while the business bleeds cash, this is a classic negative unit economics trap.",
              hint: "Revenue and profit are not the same thing.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l1-q3",
              type: "mcq",
              prompt: "Why do investors and founders care about unit economics before scaling?",
              options: [
                "Because scaling automatically fixes bad margins",
                "Because a business that loses money per unit will lose more money the bigger it gets",
                "Because unit economics only matter after $1M in revenue",
                "Because it's required by law to calculate them",
              ],
              correctIndex: 1,
              explanation:
                "Scale multiplies whatever the unit economics already are, good margins get better with volume, but negative margins just mean bigger losses.",
              hint: "Think about what happens when you multiply a negative number by 10, then 1,000.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l1-q4",
              type: "fill-in",
              prompt: "What's left of the revenue after subtracting the direct cost of delivering one unit is called the ___.",
              accept: ["margin", "contribution margin", "profit margin"],
              explanation:
                "Margin (or contribution margin) is the money left per sale after direct costs, it's the foundation for whether a business model actually works.",
              hint: "It's also sometimes called 'contribution margin.'",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u2-l2",
          unitId: "startup-building-u2",
          courseId: "startup-building",
          order: 2,
          title: "Pricing Your Product",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 30,
          summary: "Cost-plus vs. value-based pricing, and why underpricing quietly kills student startups.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u2-l2-t1",
              title: "Cost-plus vs. value-based pricing",
              body: "Cost-plus pricing starts with your costs and adds a markup. Value-based pricing starts with how much the customer's problem is worth to them, regardless of your cost. Value-based pricing usually captures more money for the same product.",
              example:
                "A tutoring startup could price cost-plus ($15/hour to barely cover the tutor's pay) or value-based (charging $40/hour because it's the difference between passing and failing a class the student is paying $1,500 to retake).",
            },
            {
              kind: "teach",
              id: "startup-building-u2-l2-t2",
              title: "Underpricing is a silent killer",
              body: "New founders underprice out of fear that no one will pay. But a price too low to cover costs and leave a real margin means every sale digs the hole deeper, and it's much harder to raise prices later than to start higher and offer a discount.",
              analogy:
                "Underpricing is like running downhill fast, it feels great and easy, but you're accelerating toward a wall (running out of cash).",
            },
            {
              kind: "question",
              id: "startup-building-u2-l2-q1",
              type: "mcq",
              prompt: "What does value-based pricing focus on?",
              options: [
                "Matching whatever the cheapest competitor charges",
                "The customer's cost to make the product plus a small markup",
                "How much the problem being solved is worth to the customer",
                "Charging as little as possible to get more customers",
              ],
              correctIndex: 2,
              explanation:
                "Value-based pricing anchors the price to the customer's perceived benefit or savings, not to your internal costs, which is often much higher than cost-plus pricing.",
              hint: "Think about what the customer gains, not what you spend.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l2-q2",
              type: "scenario",
              context:
                "A resume-review side hustle charges $10 per resume because 'it only takes me 20 minutes.' Every client says yes immediately with zero pushback, and the founder is booked solid weeks in advance.",
              prompt: "What does the instant, universal 'yes' with a full waitlist most likely signal?",
              options: [
                "The price is perfectly optimized",
                "The price is probably too low relative to the value delivered",
                "Demand is about to collapse",
                "The founder should lower the price further to keep demand high",
              ],
              correctIndex: 1,
              explanation:
                "When literally everyone says yes instantly and you're overbooked, that's usually a sign you're leaving money on the table, a price with some friction and a few 'no's is often closer to the right level.",
              hint: "If nobody ever hesitates or says no, the price probably isn't testing the ceiling.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l2-q3",
              type: "true-false",
              prompt: "It's generally easier to lower a price later than to raise it after customers are used to a low one.",
              correctBool: true,
              explanation:
                "Customers resist price increases much more than they resist a discount, starting too low trains your market to expect it, making later increases painful and prone to churn.",
              hint: "Think about how you'd feel if a subscription you use suddenly got more expensive.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l2-q4",
              type: "fill-in",
              prompt: "Pricing based on your costs plus a markup, rather than customer value, is called ___ pricing.",
              accept: ["cost-plus", "cost plus"],
              explanation:
                "Cost-plus pricing is simple to calculate but often leaves money on the table compared to pricing based on the value delivered to the customer.",
              hint: "It's the pricing method that starts with your expenses, not the customer's benefit.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u2-l3",
          unitId: "startup-building-u2",
          courseId: "startup-building",
          order: 3,
          title: "CAC, LTV, Burn, and Runway",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 35,
          summary: "The four numbers that tell you if a startup can survive long enough to win.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u2-l3-t1",
              title: "CAC and LTV",
              body: "Customer Acquisition Cost (CAC) is what you spend, on average, to get one paying customer. Lifetime Value (LTV) is the total profit you'll earn from that customer over the whole relationship. For a healthy business, LTV should be roughly 3x CAC or more.",
              example:
                "You spend $200 on flyers and Instagram ads and get 20 paying customers. CAC = $200 ÷ 20 = $10 per customer. If each customer generates $40 in profit over time, your LTV:CAC ratio is 4:1, healthy.",
            },
            {
              kind: "teach",
              id: "startup-building-u2-l3-t2",
              title: "Burn rate and runway",
              body: "Burn rate is how much cash you lose each month. Runway is how many months of cash you have left before you hit zero: cash on hand divided by monthly burn. Runway tells you your real deadline.",
              analogy:
                "Runway is like the gas gauge on a road trip, burn rate is how fast you're using gas, and runway is how many more miles you can drive before you're stranded.",
            },
            {
              kind: "question",
              id: "startup-building-u2-l3-q1",
              type: "scenario",
              context:
                "A campus laundry-pickup startup spends $150 on posters and a campus newsletter ad in one month and signs up 15 new customers.",
              prompt: "What is the CAC?",
              options: ["$150", "$15", "$10", "$1,500"],
              correctIndex: 2,
              explanation:
                "CAC = total spend ÷ new customers acquired = $150 ÷ 15 = $10 per customer.",
              hint: "Divide total marketing spend by the number of new customers it produced.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l3-q2",
              type: "mcq",
              prompt: "A startup has $10 CAC and expects $15 LTV per customer. Is this healthy?",
              options: [
                "Yes, any LTV higher than CAC is great",
                "No, a 1.5:1 ratio is thin; most healthy startups target closer to 3:1 to cover overhead and risk",
                "It doesn't matter, only revenue matters",
                "No, LTV should always be lower than CAC",
              ],
              correctIndex: 1,
              explanation:
                "LTV barely above CAC leaves little room for overhead, support costs, refunds, or churn. A 3:1 ratio or better gives real breathing room.",
              hint: "Being 'profitable on paper' isn't the same as having a comfortable margin of safety.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l3-q3",
              type: "scenario",
              context:
                "A startup has $6,000 in the bank and is spending $1,500 more than it earns every month.",
              prompt: "How many months of runway does it have left?",
              options: ["6 months", "4 months", "1.5 months", "9 months"],
              correctIndex: 1,
              explanation:
                "Runway = cash on hand ÷ monthly burn = $6,000 ÷ $1,500 = 4 months before the business runs out of cash.",
              hint: "Divide total cash by how much cash disappears each month.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u2-l3-q4",
              type: "fill-in",
              prompt: "The number of months a startup can survive before running out of cash, given its current spending, is called its ___.",
              accept: ["runway"],
              explanation:
                "Runway = cash on hand ÷ monthly burn rate. It's the real clock every founder is racing against.",
              hint: "Think of an airport metaphor for 'how much room you have left before you're out of cash.'",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u2-l4",
          unitId: "startup-building-u2",
          courseId: "startup-building",
          order: 4,
          title: "Unit 2 Challenge: Make the Math Work",
          difficulty: "Intermediate",
          kind: "challenge",
          xp: 85,
          summary: "Prove you can calculate margin, price with intention, and evaluate CAC, LTV, and runway.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u2-l4-t1",
              title: "Quick recap",
              body: "Unit economics tell you if one sale is actually profitable. Price based on customer value, not just your costs. Then track CAC vs. LTV (aim for 3:1+) and watch your runway, cash on hand divided by monthly burn, like a countdown clock.",
            },
            {
              kind: "question",
              id: "startup-building-u2-l4-q1",
              type: "scenario",
              context:
                "A dorm-room cookie delivery business sells a dozen cookies for $18. Ingredients cost $6 and packaging plus delivery costs $3. The founder spends $80 on Instagram ads in a month and gets 16 new customers.",
              prompt: "What is the margin per dozen, and what is the CAC?",
              options: [
                "$9 margin, $5 CAC",
                "$12 margin, $5 CAC",
                "$9 margin, $16 CAC",
                "$18 margin, $80 CAC",
              ],
              correctIndex: 0,
              explanation:
                "Margin = $18 − $6 − $3 = $9 per dozen. CAC = $80 ÷ 16 customers = $5 per customer.",
              hint: "Calculate margin and CAC separately, then match the pair.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u2-l4-q2",
              type: "true-false",
              prompt: "A startup with $30,000 cash and a $5,000/month burn rate has 6 months of runway.",
              correctBool: true,
              explanation:
                "$30,000 ÷ $5,000 = 6 months of runway before the business runs out of cash at the current burn rate.",
              hint: "Runway = cash ÷ monthly burn.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u2-l4-q3",
              type: "mcq",
              prompt: "Which strategy is the biggest red flag for a student startup's long-term survival?",
              options: [
                "Pricing based on the value delivered to the customer",
                "Charging a price so low that margin per unit is negative just to win customers fast",
                "Tracking CAC and LTV monthly",
                "Calculating runway before running low on cash",
              ],
              correctIndex: 1,
              explanation:
                "Negative margin per unit means every new customer makes the business lose more money, no matter how good marketing or growth looks.",
              hint: "Growth accelerates whatever your unit economics already are, good or bad.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u2-l4-q4",
              type: "fill-in",
              prompt: "The metric comparing what a customer is worth over time to what it cost to acquire them is usually written as ___ : CAC.",
              accept: ["ltv", "ltv:cac", "ltv to cac"],
              explanation:
                "The LTV:CAC ratio is one of the most important health checks for any business, aim for roughly 3:1 or higher.",
              hint: "It's the other half of the CAC comparison.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u2-l4-q5",
              type: "scenario",
              context:
                "Two founders debate pricing a campus resume-editing service. Founder A wants to charge $8 'because it only takes 15 minutes.' Founder B points out clients are paying to improve their shot at a $60,000/year job offer.",
              prompt: "Whose pricing logic better reflects value-based pricing, and why?",
              options: [
                "Founder A, because time spent should set the price",
                "Founder B, because the price should reflect what the outcome is worth to the customer, not just the founder's time",
                "Neither, price should always match the cheapest competitor",
                "Founder A, because lower prices always win more customers",
              ],
              correctIndex: 1,
              explanation:
                "Value-based pricing anchors to the customer's benefit (a shot at a $60,000 job), which usually supports a much higher price than time-based cost-plus thinking.",
              hint: "Compare the outcome's worth to the customer, not the minutes the founder spends.",
              xp: 15,
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────
    // UNIT 3: Launch, Pitch, Own It
    // ─────────────────────────────────────────────────────────────────
    {
      id: "startup-building-u3",
      courseId: "startup-building",
      order: 3,
      title: "Launch, Pitch, Own It",
      subtitle: "Get your first customers, tell your story in 60 seconds, and protect your ownership.",
      lessons: [
        {
          id: "startup-building-u3-l1",
          unitId: "startup-building-u3",
          courseId: "startup-building",
          order: 1,
          title: "Early Traction, the Student Way",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 30,
          summary: "How to get your first 50 real customers without a marketing budget.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u3-l1-t1",
              title: "Go where dense communities already exist",
              body: "Campus clubs, group chats, Discord servers, and niche subreddits are pre-built communities with trust already established. Showing up there with a genuine, useful offer beats generic ads every time when you have zero budget.",
              example:
                "A note-sharing startup got its first 200 users by DMing every officer of pre-med clubs at three schools and offering free premium access in exchange for feedback, no ad spend required.",
            },
            {
              kind: "teach",
              id: "startup-building-u3-l1-t2",
              title: "Do things that don't scale",
              body: "Early on, doing unscalable things, handwriting notes to first customers, personally onboarding every user, delivering orders yourself, builds loyalty and teaches you what actually matters before you automate anything.",
              analogy:
                "It's like a chef personally serving the first few tables to learn what people actually order, before designing the menu for a hundred tables a night.",
            },
            {
              kind: "question",
              id: "startup-building-u3-l1-q1",
              type: "mcq",
              prompt: "Why do campus clubs and niche Discord servers work well for early traction?",
              options: [
                "They have huge follower counts like celebrity accounts",
                "They're dense, pre-existing communities with built-in trust that's cheaper to tap into than cold ads",
                "They guarantee viral growth automatically",
                "They require a marketing budget to access",
              ],
              correctIndex: 1,
              explanation:
                "Existing communities already trust each other, so a genuine, relevant offer spreads faster and cheaper there than through anonymous paid ads.",
              hint: "Think about where trust already exists versus where you'd have to build it from scratch.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l1-q2",
              type: "true-false",
              prompt: "Doing manual, unscalable tasks early on (like personally delivering every order) is usually a waste of a founder's time.",
              correctBool: false,
              explanation:
                "Early unscalable effort is often the fastest way to learn what customers actually want and to build loyalty, it becomes wasteful only if it never gets systematized later.",
              hint: "Many famous startups started by founders doing things by hand that later got automated.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l1-q3",
              type: "scenario",
              context:
                "A founder building a tutoring marketplace has $0 marketing budget but is an active member of four STEM clubs and a large class-notes Discord server with 800 members.",
              prompt: "What's the smartest first move for early traction?",
              options: [
                "Run paid Instagram ads targeting the whole city",
                "Wait until there's a marketing budget to do anything",
                "Personally reach out in the clubs and Discord server she's already trusted in, offering real value to the first users",
                "Buy a list of student emails and mass-email them",
              ],
              correctIndex: 2,
              explanation:
                "Leveraging existing trust in communities she's already part of costs nothing and converts far better than cold outreach or paid ads at this stage.",
              hint: "The cheapest, highest-trust channel is usually the one you're already inside of.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l1-q4",
              type: "fill-in",
              prompt: "Doing manual, non-automated work early on to serve your first customers is often called doing things that don't ___.",
              accept: ["scale"],
              explanation:
                "\"Do things that don't scale\" is a classic early-startup principle: manual effort now teaches lessons that automation can't.",
              hint: "The phrase describes actions that work for 10 customers but wouldn't work for 10,000.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u3-l2",
          unitId: "startup-building-u3",
          courseId: "startup-building",
          order: 2,
          title: "Pitching Your Startup",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 30,
          summary: "The 60-second pitch structure that works in a hallway, a pitch competition, or an investor's inbox.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u3-l2-t1",
              title: "Problem → Solution → Traction → Ask",
              body: "A strong short pitch has four beats: the problem (specific and painful), your solution (in one sentence), traction (proof it's working, even small), and the ask (what you need next, funding, users, feedback, an intro).",
              example:
                "\"Students miss $15+ in late shuttle rideshares every week. We built a shared ride-pooling app for the last shuttle run. In three weeks at one dorm, we've saved 40 students over $600 combined. We're looking for $5,000 to expand to two more dorms.\"",
            },
            {
              kind: "teach",
              id: "startup-building-u3-l2-t2",
              title: "Traction beats adjectives",
              body: "Judges and investors discount words like 'innovative,' 'revolutionary,' or 'huge market.' A single concrete number, users, revenue, retention, a signed LOI, is worth more than a paragraph of hype.",
              analogy:
                "One real data point is worth a thousand superlatives.",
            },
            {
              kind: "question",
              id: "startup-building-u3-l2-q1",
              type: "mcq",
              prompt: "What is the correct order of a strong 60-second pitch?",
              options: [
                "Ask → Traction → Solution → Problem",
                "Problem → Solution → Traction → Ask",
                "Solution → Ask → Problem → Traction",
                "Traction → Problem → Ask → Solution",
              ],
              correctIndex: 1,
              explanation:
                "Starting with the problem hooks the listener; the solution shows your answer; traction proves it works; the ask tells them exactly what to do next.",
              hint: "You have to make someone care about a problem before they'll care about your solution.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l2-q2",
              type: "scenario",
              context:
                "Two students pitch at a campus competition. Pitch A says: 'We're building a revolutionary, game-changing platform for the massive student market.' Pitch B says: 'We've signed 30 paying customers in 3 weeks at $8/month, and we're asking for $3,000 to hire one more developer.'",
              prompt: "Which pitch is stronger, and why?",
              options: [
                "Pitch A, because it sounds bigger and more ambitious",
                "Pitch B, because specific traction and a clear ask are far more convincing than vague hype adjectives",
                "They're equally strong",
                "Pitch A, because 'massive market' is a specific number",
              ],
              correctIndex: 1,
              explanation:
                "Pitch B gives concrete, verifiable numbers and a specific ask, which builds far more credibility than generic hype language.",
              hint: "Which pitch could you fact-check?",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l2-q3",
              type: "true-false",
              prompt: "A pitch should end with a vague, open-ended statement rather than a specific ask.",
              correctBool: false,
              explanation:
                "A strong pitch always ends with a specific, actionable ask, a dollar amount, an intro, feedback, or users, so the listener knows exactly how to help.",
              hint: "Vague endings make it hard for anyone to actually help you.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l2-q4",
              type: "fill-in",
              prompt: "The four-part structure for a short pitch is problem, solution, traction, and ___.",
              accept: ["ask", "the ask"],
              explanation:
                "The ask tells the listener exactly what you need from them, money, users, an introduction, or feedback.",
              hint: "It's the specific thing you want the listener to do after hearing the pitch.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u3-l3",
          unitId: "startup-building-u3",
          courseId: "startup-building",
          order: 3,
          title: "Equity, Vesting, and Entity Basics",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 35,
          summary: "How to split ownership fairly, protect it with vesting, and pick the right legal entity.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u3-l3-t1",
              title: "Vesting protects the team, not just the company",
              body: "A standard startup vesting schedule is 4 years with a 1-year cliff: a co-founder earns zero equity until they've been in for a full year, then earns the rest gradually, usually monthly, over the following three years. This protects everyone if a co-founder leaves early.",
              example:
                "Two co-founders split equity 50/50 with a 4-year vest and 1-year cliff. If one quits after 8 months, they leave with 0% equity, not 50% of a company they barely helped build.",
            },
            {
              kind: "teach",
              id: "startup-building-u3-l3-t2",
              title: "50/50 with a stranger is risky",
              body: "Splitting equity exactly 50/50 with someone you just met feels fair, but it can create deadlock when big decisions are contested and neither side has final say. Splits should reflect commitment, risk, and role, and always come with vesting, no exceptions, even for best friends.",
              analogy:
                "A 50/50 split without vesting is like signing a marriage contract with no way to separate finances if things fall apart in month two.",
            },
            {
              kind: "question",
              id: "startup-building-u3-l3-q1",
              type: "mcq",
              prompt: "In a standard 4-year vesting schedule with a 1-year cliff, how much equity does a co-founder have if they leave after 10 months?",
              options: [
                "50% of their total grant",
                "0%, because they haven't reached the 1-year cliff",
                "100%, because they helped start the company",
                "25% for each quarter worked",
              ],
              correctIndex: 1,
              explanation:
                "Before the 1-year cliff is reached, no equity has vested at all, this protects the company from a founder who leaves very early keeping a large ownership stake.",
              hint: "The word 'cliff' means nothing vests until that exact point is reached.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l3-q2",
              type: "true-false",
              prompt: "Vesting schedules are only necessary when co-founders don't trust each other.",
              correctBool: false,
              explanation:
                "Vesting is standard practice for every founding team, regardless of trust, it protects the company and remaining co-founders from unpredictable life events, not just bad intentions.",
              hint: "Even the closest friend co-founder teams use vesting.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l3-q3",
              type: "scenario",
              context:
                "Two roommates decide to start a company together after meeting a month ago. They agree to split equity 50/50 with no vesting, planning to 'figure it out later' if things don't work.",
              prompt: "What is the biggest risk in this plan?",
              options: [
                "There is no risk, 50/50 is always fair",
                "If one person leaves early or they can't agree on a decision, there's no mechanism to resolve the deadlock or reclaim unearned equity",
                "50/50 splits are illegal",
                "They should have split it 90/10 instead",
              ],
              correctIndex: 1,
              explanation:
                "Without vesting, someone who contributes little or leaves early keeps full equity forever, and a 50/50 split with no tie-breaker can deadlock important decisions.",
              hint: "Think about what happens with zero legal protection if the relationship sours.",
              xp: 10,
            },
            {
              kind: "question",
              id: "startup-building-u3-l3-q4",
              type: "fill-in",
              prompt: "The minimum time a co-founder must stay before any equity vests is called the ___.",
              accept: ["cliff", "1-year cliff", "one year cliff"],
              explanation:
                "The cliff is the initial waiting period (commonly 1 year) before any equity vests at all, protecting the company from very short-term co-founders.",
              hint: "It's the same word used for a steep drop-off edge.",
              xp: 10,
            },
          ],
        },
        {
          id: "startup-building-u3-l4",
          unitId: "startup-building-u3",
          courseId: "startup-building",
          order: 4,
          title: "Unit 3 Challenge: Launch, Pitch, Own It",
          difficulty: "Advanced",
          kind: "challenge",
          xp: 90,
          summary: "Prove you can drive early traction, deliver a tight pitch, and structure ownership responsibly.",
          cards: [
            {
              kind: "teach",
              id: "startup-building-u3-l4-t1",
              title: "Quick recap",
              body: "Early traction comes from existing trusted communities and manual, unscalable effort. Pitches win on problem, solution, traction, and a specific ask, not hype adjectives. And ownership should always be protected with a vesting schedule, even between best friends.",
            },
            {
              kind: "question",
              id: "startup-building-u3-l4-q1",
              type: "scenario",
              context:
                "A founder pitches: 'Campus tutoring is broken and our platform will disrupt the whole industry.' A second founder pitches: '12 students have booked sessions through us in 2 weeks, generating $340 in revenue, and we're asking for an intro to your career center.'",
              prompt: "Which pitch better follows the problem-solution-traction-ask structure, and why?",
              options: [
                "The first, because 'disrupt the industry' shows big ambition",
                "The second, because it includes concrete traction and a specific, actionable ask",
                "Neither pitch mentions a problem",
                "They're equally strong pitches",
              ],
              correctIndex: 1,
              explanation:
                "The second pitch backs up its claims with real numbers and closes with a specific ask, which is far more persuasive than vague disruption language.",
              hint: "Look for real numbers and a request that's easy to say yes to.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u3-l4-q2",
              type: "true-false",
              prompt: "Getting your first customers through campus clubs and Discord servers you're already part of is generally cheaper than paid advertising.",
              correctBool: true,
              explanation:
                "Existing communities come with built-in trust and zero acquisition cost beyond your time, making them one of the most efficient early channels for a student founder.",
              hint: "Compare a $0 channel where people already trust you to a paid channel targeting strangers.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u3-l4-q3",
              type: "mcq",
              prompt: "Why does a 4-year vesting schedule with a 1-year cliff protect a startup?",
              options: [
                "It guarantees all co-founders stay for exactly 4 years",
                "It prevents anyone from leaving the company ever",
                "It ensures equity is earned gradually over time and reclaims unearned equity from someone who leaves early",
                "It has no real protective effect, it's just tradition",
              ],
              correctIndex: 2,
              explanation:
                "Vesting ties ownership to time actually spent building the company, so someone who exits early doesn't keep a large stake they didn't earn.",
              hint: "Think about what happens to a co-founder's equity if they quit in month 3 versus year 3.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u3-l4-q4",
              type: "fill-in",
              prompt: "Manual, non-scalable early efforts to win your first customers are often summarized as doing things that don't ___.",
              accept: ["scale"],
              explanation:
                "This principle captures why founders should personally onboard, deliver, and support early customers even though it wouldn't work at 10,000 users.",
              hint: "Same phrase from the early-traction lesson.",
              xp: 15,
            },
            {
              kind: "question",
              id: "startup-building-u3-l4-q5",
              type: "scenario",
              context:
                "Three students form a startup at a pitch competition after meeting that weekend. Excited, they agree to split equity evenly with no vesting so they can 'move fast and not worry about paperwork.'",
              prompt: "What is the smartest next step for this team?",
              options: [
                "Proceed exactly as planned since speed matters most",
                "Put a standard vesting schedule (e.g., 4-year vest, 1-year cliff) in place immediately, even with an even split",
                "Skip equity discussions entirely until the company is profitable",
                "Give 100% of equity to whoever came up with the idea",
              ],
              correctIndex: 1,
              explanation:
                "Vesting can coexist with any split ratio, the key protection is tying equity to time and contribution, which matters most with a brand-new team that hasn't been tested yet.",
              hint: "Vesting isn't about the split ratio, it's about protecting against early exits.",
              xp: 15,
            },
          ],
        },
      ],
    },
  ],
};
