import type { Course } from "@/lib/types";

export const careerCapitalCourse: Course = {
  id: "career-capital",
  title: "Career Capital",
  tagline: "Turn your college years into a resume, a network, and an offer letter that actually pays.",
  description:
    "Most students graduate with a GPA and no idea how to talk about it. This course teaches you to build proof of your work, survive the internship-to-offer pipeline, and make smart money moves the day you get hired. No fluff, just the tactics recruiters and new grads wish someone had told them sooner.",
  category: "Career",
  icon: "Briefcase",
  color: "from-violet-400 to-indigo-500",
  accent: "violet-300",
  order: 7,
  unlockLevel: 1,
  units: [
    // ────────────────────────────────────────────────────────────────
    // UNIT 1, Resume & Story
    // ────────────────────────────────────────────────────────────────
    {
      id: "career-capital-u1",
      courseId: "career-capital",
      order: 1,
      title: "Resume & Story",
      subtitle: "Turn what you did into proof of what you can do",
      lessons: [
        {
          id: "career-capital-u1-l1",
          unitId: "career-capital-u1",
          courseId: "career-capital",
          order: 1,
          title: "Weak Bullet vs. Strong Bullet",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 25,
          summary: "Why 'helped with' loses to numbers every time.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u1-l1-t1",
              title: "Recruiters skim, they don't read",
              body: "A recruiter spends about 7 seconds on a first resume pass. Vague tasks disappear; specific, numbered results jump out.",
              example:
                "\"Helped with social media\" gets skipped. \"Grew club Instagram 40% to 2,100 followers in one semester\" gets a second look.",
            },
            {
              kind: "teach",
              id: "career-capital-u1-l1-t2",
              title: "Every bullet needs a number",
              body: "The number doesn't have to be sales or revenue, it can be people reached, hours saved, percent improved, or dollars managed. A number proves scale; a verb alone doesn't.",
              analogy:
                "Think of a bullet without a number like a receipt with no total, technically information, but useless for judging size.",
            },
            {
              kind: "question",
              id: "career-capital-u1-l1-q1",
              type: "mcq",
              prompt: "Which bullet is stronger for a resume?",
              options: [
                "Responsible for helping the marketing team with projects",
                "Built a weekly email newsletter that grew open rate from 12% to 34% over 3 months",
                "Assisted with various tasks as needed",
                "Worked on marketing team",
              ],
              correctIndex: 1,
              explanation:
                "It names the deliverable (newsletter), the action (built), and a measurable before/after result, that's what recruiters can actually evaluate.",
              hint: "Look for the option with a specific, measurable outcome.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l1-q2",
              type: "true-false",
              prompt:
                "A bullet point can still be strong even without a number, as long as it sounds impressive.",
              correctBool: false,
              explanation:
                "Impressive-sounding language without a number is unverifiable and easy to skim past. Numbers are what make a claim credible and specific.",
              hint: "Would a recruiter be able to compare this to another candidate's claim?",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l1-q3",
              type: "scenario",
              prompt: "What's the best way to strengthen this bullet?",
              context:
                "Jordan tutored 3 classmates in calculus every week for a semester, and all 3 improved their grade by at least one letter grade. Their current resume bullet reads: \"Tutored classmates in calculus.\"",
              options: [
                "Leave it as is, tutoring is impressive enough on its own",
                "\"Tutored 3 classmates weekly in calculus for a semester, each improving by at least one letter grade\"",
                "\"Helped friends with math homework sometimes\"",
                "Remove it since tutoring isn't a real job",
              ],
              correctIndex: 1,
              explanation:
                "This version adds frequency (weekly), duration (a semester), scope (3 classmates), and a measurable result (one letter grade), turning a vague task into proof of impact.",
              hint: "Pull the specific numbers Jordan already has: 3 classmates, weekly, one letter grade.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u1-l2",
          unitId: "career-capital-u1",
          courseId: "career-capital",
          order: 2,
          title: "The XYZ Formula",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 25,
          summary: "One formula to write every bullet on your resume.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u1-l2-t1",
              title: "Accomplished X, measured by Y, by doing Z",
              body: "The XYZ formula forces you to name the result (X), quantify it (Y), and explain how you did it (Z). It works for almost any experience, including class projects and clubs.",
              example:
                "X: Increased event attendance. Y: measured by 65 to 140 attendees. Z: by launching a targeted email campaign and partnering with 4 other clubs.",
            },
            {
              kind: "teach",
              id: "career-capital-u1-l2-t2",
              title: "Start with the verb, end with the method",
              body: "Lead with a strong action verb (built, launched, negotiated, analyzed), put the number in the middle, and close with the 'how' so the reader understands your actual contribution.",
            },
            {
              kind: "question",
              id: "career-capital-u1-l2-q1",
              type: "fill-in",
              prompt:
                "In the XYZ formula (Accomplished X, measured by Y, by doing Z), what does the 'Y' stand for?",
              accept: ["measured by", "metric", "number", "measurement", "the number"],
              explanation:
                "Y is the quantified proof, the metric that shows how big the accomplishment (X) actually was.",
              hint: "It's the part of the sentence that always includes a number or percentage.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l2-q2",
              type: "mcq",
              prompt:
                "Using the XYZ formula, which bullet best describes: led a bake sale that raised $850, up from $400 last year, by pre-selling on Instagram?",
              options: [
                "Led a bake sale for the club",
                "Raised $850 (up from $400 last year) for club bake sale by pre-selling items on Instagram",
                "In charge of Instagram and bake sale stuff",
                "Was part of the bake sale committee",
              ],
              correctIndex: 1,
              explanation:
                "This bullet hits all three parts: the result (raised $850), the measurement (up from $400), and the method (pre-selling on Instagram).",
              hint: "Find the option that has a result, a comparison number, and a method.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l2-q3",
              type: "scenario",
              prompt: "Write the strongest bullet structure for this situation.",
              context:
                "Maya redesigned her fraternity's budgeting spreadsheet so treasurers could close monthly books in 2 hours instead of 8. She's applying for a finance internship and wants this on her resume.",
              options: [
                "\"Did the budget spreadsheet for the fraternity\"",
                "\"Rebuilt the fraternity's monthly budget spreadsheet, cutting close-out time from 8 hours to 2, by automating recurring entries\"",
                "\"Responsible for budgeting-related duties\"",
                "\"Fraternity treasurer helper\"",
              ],
              correctIndex: 1,
              explanation:
                "This follows XYZ exactly: the accomplishment (rebuilt the spreadsheet), the measurable result (8 hours to 2), and the method (automating recurring entries), directly relevant to a finance internship.",
              hint: "Look for the option with a clear before/after time comparison and a method.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u1-l3",
          unitId: "career-capital-u1",
          courseId: "career-capital",
          order: 3,
          title: "Tailoring & Proof Beyond the Resume",
          difficulty: "Beginner",
          kind: "lesson",
          xp: 30,
          summary: "Mirror the job description and build proof recruiters can click on.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u1-l3-t1",
              title: "Mirror the job description's keywords",
              body: "Many companies run resumes through an ATS (applicant tracking system) that scans for keywords from the job posting before a human ever sees it. If the posting says 'financial modeling' and your resume says 'spreadsheet work,' the system may never surface your resume.",
              example:
                "A posting lists 'Excel, SQL, financial modeling.' If you have those skills, use those exact words on your resume, not 'data stuff' or 'analysis tools.'",
            },
            {
              kind: "teach",
              id: "career-capital-u1-l3-t2",
              title: "Build proof beyond the resume",
              body: "A resume is a list of claims; a portfolio, GitHub, or personal site is evidence. Even one small project you can link to makes you more credible than a bullet point alone.",
              analogy:
                "A resume bullet says 'I can cook.' A portfolio is the plate in front of the interviewer.",
            },
            {
              kind: "question",
              id: "career-capital-u1-l3-q1",
              type: "true-false",
              prompt:
                "Many companies use software (an ATS) to scan resumes for keywords before a human reviews them.",
              correctBool: true,
              explanation:
                "ATS (applicant tracking systems) filter and rank resumes by matching keywords from the job description, so tailoring your language matters even before a human reads it.",
              hint: "Think about how large companies handle thousands of applications.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l3-q2",
              type: "mcq",
              prompt:
                "A job posting for a marketing internship asks for 'content strategy' and 'campaign analytics' experience. What should you do on your resume?",
              options: [
                "Ignore it, your experience is your experience regardless of wording",
                "Use those exact phrases where they honestly apply to your experience",
                "List every skill you've ever heard of to be safe",
                "Only mention it in the cover letter, never the resume",
              ],
              correctIndex: 1,
              explanation:
                "Mirroring the exact phrasing (when honest) helps both ATS keyword matching and a human skimmer instantly recognize the fit.",
              hint: "The goal is matching language, not inventing experience.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l3-q3",
              type: "scenario",
              prompt: "What's the best next step for Devon?",
              context:
                "Devon is a sophomore applying for their first software internship. They've only had one CS class but built a small budgeting app for personal use over winter break. Their resume otherwise has no technical experience listed.",
              options: [
                "Leave the app off since it wasn't for a job or class",
                "Put the app on GitHub, add a short README, and link it on the resume as a project",
                "Wait until they have a 'real' job before showing any code",
                "Describe the app only in vague terms so it sounds bigger than it is",
              ],
              correctIndex: 1,
              explanation:
                "A linked, documented project is real proof of skill for a student with limited work history, it lets a recruiter see actual code instead of just taking a claim on faith.",
              hint: "Recruiters value evidence they can click on, especially for students with thin resumes.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u1-l3-q4",
              type: "fill-in",
              prompt:
                "What is the common name for the software many companies use to automatically scan resumes for keywords before a human reads them?",
              accept: ["ats", "applicant tracking system", "applicant tracking software"],
              explanation:
                "ATS stands for applicant tracking system, it's why matching the job posting's language matters, not just having the right experience.",
              hint: "It's an acronym, three letters.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u1-l4",
          unitId: "career-capital-u1",
          courseId: "career-capital",
          order: 4,
          title: "Unit 1 Challenge: Build Your Proof",
          difficulty: "Beginner",
          kind: "challenge",
          xp: 75,
          summary: "Prove you can turn any experience into a strong, tailored resume bullet.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u1-l4-t1",
              title: "Quick recap",
              body: "Strong resumes replace vague duties with numbered results (XYZ formula), mirror the job posting's language for ATS and human skimmers, and back claims up with a linkable project when possible.",
            },
            {
              kind: "question",
              id: "career-capital-u1-l4-q1",
              type: "scenario",
              prompt: "Which rewrite best follows the XYZ formula?",
              context:
                "Priya's original bullet: \"Worked at the campus coffee shop.\" She actually trained 5 new baristas and cut average order time from 4 minutes to 2.5 minutes by reorganizing the prep station.",
              options: [
                "\"Worked at the campus coffee shop part-time\"",
                "\"Trained 5 new baristas and cut average order time from 4 to 2.5 minutes by reorganizing the prep station\"",
                "\"Responsible for coffee shop operations\"",
                "\"Helped out at coffee shop when needed\"",
              ],
              correctIndex: 1,
              explanation:
                "This bullet names the accomplishment (trained baristas, cut order time), the measurement (4 to 2.5 minutes), and the method (reorganizing the prep station).",
              hint: "Look for the option with both a number and a method.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u1-l4-q2",
              type: "true-false",
              prompt: "A 7-second first pass means recruiters mostly notice numbers and specifics, not general phrases.",
              correctBool: true,
              explanation:
                "In such a short window, specific and numbered bullets are what stand out; vague phrases like 'helped with' or 'responsible for' blend together and get skipped.",
              hint: "Think about what's visually and mentally easy to catch while skimming.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u1-l4-q3",
              type: "mcq",
              prompt:
                "You're applying to a data analytics internship that lists 'SQL' and 'dashboarding' as required skills. You have both skills but call them 'database stuff' and 'reports' on your resume. What's the risk?",
              options: [
                "No risk, meaning matters more than wording",
                "An ATS or skimming recruiter may not match your resume to the posting's requirements",
                "It makes your resume more original and memorable",
                "It only matters for graduate school applications, not internships",
              ],
              correctIndex: 1,
              explanation:
                "Both ATS systems and time-pressured recruiters look for the specific terms in the posting. Using different words for the same skill can cause a real match to be missed.",
              hint: "Think about keyword matching, not just honesty.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u1-l4-q4",
              type: "fill-in",
              prompt: "What are the three parts of the XYZ resume formula, in order? (one word each, comma-separated is fine, but just name the first one)",
              accept: ["accomplishment", "x", "result", "achievement"],
              explanation:
                "XYZ = Accomplished X (the result), measured by Y (the metric), by doing Z (the method). X always comes first: what you accomplished.",
              hint: "X is the very first thing named in the sentence.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u1-l4-q5",
              type: "scenario",
              prompt: "What should Sam do before submitting this application?",
              context:
                "Sam has a strong resume with numbered bullets, but none of the wording matches the internship posting, which repeatedly uses the phrases 'stakeholder communication' and 'cross-functional.' Sam has genuinely done both but described them differently.",
              options: [
                "Submit as-is since the resume is already strong",
                "Revise relevant bullets to include 'stakeholder communication' and 'cross-functional' where honestly accurate",
                "Add those phrases everywhere, even where they don't apply",
                "Remove numbers and focus purely on matching keywords",
              ],
              correctIndex: 1,
              explanation:
                "A resume can be both numbered and tailored, the goal is to accurately use the posting's language where your real experience supports it, maximizing both ATS match and human clarity.",
              hint: "The best resume combines strong numbers AND matching language, it's not either/or.",
              xp: 15,
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // UNIT 2, Internships & Interviews
    // ────────────────────────────────────────────────────────────────
    {
      id: "career-capital-u2",
      courseId: "career-capital",
      order: 2,
      title: "Internships & Interviews",
      subtitle: "Get in the pipeline, then walk into the room prepared",
      lessons: [
        {
          id: "career-capital-u2-l1",
          unitId: "career-capital-u2",
          courseId: "career-capital",
          order: 1,
          title: "Recruiting Timelines Are Earlier Than You Think",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 30,
          summary: "Some industries recruit almost a year before the internship starts.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u2-l1-t1",
              title: "Finance and consulting recruit 9-12 months early",
              body: "Investment banking, private equity, and consulting firms often finalize their summer internship classes 9-12 months before the internship even starts. Waiting until spring of your sophomore year can mean missing the cycle entirely.",
              example:
                "A firm hiring summer 2027 interns may open applications in fall 2026, during your sophomore fall if you're targeting a junior-summer internship.",
            },
            {
              kind: "teach",
              id: "career-capital-u2-l1-t2",
              title: "The junior-summer internship is the real interview",
              body: "For many industries, the junior-year summer internship functions as an extended interview for a full-time return offer. Landing that internship early, often via freshman/sophomore 'diversity' or leadership programs, matters more than people realize.",
            },
            {
              kind: "question",
              id: "career-capital-u2-l1-q1",
              type: "mcq",
              prompt:
                "For finance and consulting, how far in advance do firms often finalize their summer internship classes?",
              options: ["1-2 weeks before", "1 month before", "9-12 months before", "The day the internship starts"],
              correctIndex: 2,
              explanation:
                "These industries often run recruiting cycles 9-12 months ahead, meaning a student aiming for a junior-summer internship should often start preparing and applying during sophomore year.",
              hint: "Think in terms of months, not weeks.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l1-q2",
              type: "true-false",
              prompt:
                "Every industry recruits on the same timeline, so there's no need to research your target industry's schedule.",
              correctBool: false,
              explanation:
                "Timelines vary widely by industry, finance and consulting recruit far earlier than many tech, nonprofit, or smaller-company roles. Researching your specific industry's calendar is essential.",
              hint: "Compare a bank's recruiting calendar to a local nonprofit's.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l1-q3",
              type: "scenario",
              prompt: "What should Alex do?",
              context:
                "Alex is a sophomore who wants a junior-summer investment banking internship. It's currently October of sophomore year, and Alex just learned that most bulge-bracket banks will finalize their summer intern classes by February.",
              options: [
                "Wait until junior year to start preparing, since the internship is still far away",
                "Start networking, polishing the resume, and applying now, since the window closes in a few months",
                "Assume it's too late and skip finance recruiting entirely",
                "Only apply to firms with no stated deadline",
              ],
              correctIndex: 1,
              explanation:
                "With finalized classes by February, Alex has a narrow window right now to network, tailor a resume, and apply, waiting until junior year would mean missing the cycle.",
              hint: "Work backward from the February deadline mentioned in the scenario.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u2-l2",
          unitId: "career-capital-u2",
          courseId: "career-capital",
          order: 2,
          title: "The STAR Method",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 30,
          summary: "Answer any behavioral interview question with one structure.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u2-l2-t1",
              title: "Situation, Task, Action, Result",
              body: "STAR gives behavioral answers ('Tell me about a time when...') a clear shape: set the scene (Situation), state your responsibility (Task), describe what you specifically did (Action), and close with the measurable outcome (Result).",
              example:
                "Q: 'Tell me about a conflict on a team.' Situation: group project with an unresponsive teammate. Task: I needed the slides done in 48 hours. Action: I split remaining work, set a hard deadline, and looped in the professor when the teammate stayed silent. Result: we submitted on time and got an A-.",
            },
            {
              kind: "teach",
              id: "career-capital-u2-l2-t2",
              title: "Action gets the most airtime",
              body: "Interviewers care most about what YOU did, not the team or the situation. Spend roughly half your answer on the Action step, specific decisions and steps you personally took.",
              analogy:
                "STAR is like a movie trailer: quick setup, then most of the runtime on the hero's actions, then a satisfying resolution.",
            },
            {
              kind: "question",
              id: "career-capital-u2-l2-q1",
              type: "fill-in",
              prompt: "What does the 'R' in the STAR interview method stand for?",
              accept: ["result", "results"],
              explanation:
                "Result is the outcome of your action, ideally something measurable, like 'we hit the deadline' or 'sales rose 15%.'",
              hint: "It's the part of the story that comes last, the payoff.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l2-q2",
              type: "mcq",
              prompt:
                "In a STAR answer, which part should typically get the most detail and time?",
              options: ["Situation", "Task", "Action", "Result"],
              correctIndex: 2,
              explanation:
                "Action is what shows the interviewer your specific judgment and skills, it's the part of the story that's actually about you.",
              hint: "Which part answers 'what did YOU personally do'?",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l2-q3",
              type: "scenario",
              prompt: "Which answer best uses the STAR method?",
              context:
                "An interviewer asks Kayla: 'Tell me about a time you had to meet a tight deadline.' Kayla is deciding how to structure her answer.",
              options: [
                "Talk generally about how she's always been good with deadlines",
                "Briefly set up the situation, state her specific task, describe her exact actions in detail, then share the measurable result",
                "List every deadline she's ever met, without much detail on any one",
                "Only describe the result, since that's what matters most",
              ],
              correctIndex: 1,
              explanation:
                "This follows STAR's full arc, quick context, clear responsibility, detailed personal actions, and a concrete outcome, which is far more convincing than a vague or results-only answer.",
              hint: "STAR is a complete story, not just a highlight.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l2-q4",
              type: "true-false",
              prompt:
                "You should prepare STAR stories in advance, before walking into a behavioral interview.",
              correctBool: true,
              explanation:
                "Having 4-6 flexible STAR stories ready (about teamwork, conflict, failure, leadership, etc.) means you're not improvising the structure under pressure during the actual interview.",
              hint: "Would you rather build the story on the spot or adapt one you already practiced?",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u2-l3",
          unitId: "career-capital-u2",
          courseId: "career-capital",
          order: 3,
          title: "Prep, Questions to Ask, and Follow-Up",
          difficulty: "Intermediate",
          kind: "lesson",
          xp: 35,
          summary: "Technical prep basics, smart questions, and the thank-you note that closes the loop.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u2-l3-t1",
              title: "Technical and case prep is a rehearsed skill",
              body: "Whether it's a coding problem, a finance case, or a consulting case study, these formats are learnable through repetition, practicing 15-20 problems or cases out loud is far more effective than reading about them.",
              example:
                "A consulting candidate who practices 10 mock cases with a friend will usually outperform one who only read case-prep books, because case interviews reward talking through structure live.",
            },
            {
              kind: "teach",
              id: "career-capital-u2-l3-t2",
              title: "Always ask a real question, and always follow up",
              body: "When asked 'do you have any questions for us?', ask something specific you couldn't Google, it signals genuine interest. Then send a short, specific thank-you email within 24 hours referencing something from the conversation.",
              analogy: "A generic thank-you note is a form letter. A specific one is a callback that shows you were actually listening.",
            },
            {
              kind: "question",
              id: "career-capital-u2-l3-q1",
              type: "mcq",
              prompt: "Which question is the strongest one to ask an interviewer at the end of the interview?",
              options: [
                "\"What does your company do?\"",
                "\"How much does this role pay?\"",
                "\"You mentioned the team is rebuilding the onboarding process, what's the biggest challenge in that project so far?\"",
                "\"Do you have any more questions for me?\"",
              ],
              correctIndex: 2,
              explanation:
                "This question references something specific from the conversation and shows genuine curiosity about real work, rather than something easily found on the company website.",
              hint: "Look for the option that references specific details from the conversation.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l3-q2",
              type: "true-false",
              prompt: "You should send a thank-you email within about 24 hours of an interview.",
              correctBool: true,
              explanation:
                "Sending it promptly (within a day) while the conversation is fresh shows professionalism and keeps you top of mind during the decision process.",
              hint: "Think about how memory fades and how decisions move quickly after interviews.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l3-q3",
              type: "scenario",
              prompt: "What's the best way for Marcus to prepare for his upcoming case interview?",
              context:
                "Marcus has a consulting first-round case interview in 2 weeks. He's read two case-prep books cover to cover but has never talked through a case out loud with another person.",
              options: [
                "Read a third case-prep book to be extra thorough",
                "Practice several mock cases out loud with a friend or club, simulating the real format",
                "Skip further prep since he's already read two books",
                "Memorize case frameworks word-for-word and recite them verbatim",
              ],
              correctIndex: 1,
              explanation:
                "Case interviews are a live, verbal skill, practicing out loud builds the structuring and communication muscle that reading alone doesn't, and is generally the highest-leverage prep left.",
              hint: "Reading and doing are different skills, which one matches the actual interview format?",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u2-l3-q4",
              type: "fill-in",
              prompt:
                "About how many hours after an interview should you aim to send a thank-you email?",
              accept: ["24", "24 hours", "one day", "1 day"],
              explanation:
                "Within 24 hours keeps the conversation fresh for both you and the interviewer, and shows you're organized and enthusiastic.",
              hint: "It's a single day, expressed in hours.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u2-l4",
          unitId: "career-capital-u2",
          courseId: "career-capital",
          order: 4,
          title: "Unit 2 Challenge: Ace the Pipeline",
          difficulty: "Intermediate",
          kind: "challenge",
          xp: 85,
          summary: "Test your grasp of recruiting timelines, STAR answers, and interview etiquette.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u2-l4-t1",
              title: "Quick recap",
              body: "Know your industry's recruiting timeline (some start 9-12 months early), structure behavioral answers with STAR while emphasizing Action, rehearse technical/case prep out loud, and always close interviews with a specific question and a prompt thank-you note.",
            },
            {
              kind: "question",
              id: "career-capital-u2-l4-q1",
              type: "scenario",
              prompt: "Rewrite Elena's plan using what you now know about STAR.",
              context:
                "Elena is prepping for 'Tell me about a time you failed.' Her draft answer spends 4 sentences on background, 1 sentence on what she did, and no mention of what happened afterward.",
              options: [
                "Keep the answer as-is; failure stories don't need a result",
                "Trim the background, expand significantly on the specific actions she took, and add a clear result or lesson learned",
                "Remove the actions section entirely since failure stories are embarrassing",
                "Make the background even longer for context",
              ],
              correctIndex: 1,
              explanation:
                "A strong STAR answer keeps Situation/Task brief, spends the most time on Action, and always closes with a Result, even a failure story needs to show what was learned or changed afterward.",
              hint: "Which part of Elena's draft is oversized, and which part is missing?",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u2-l4-q2",
              type: "mcq",
              prompt:
                "A student wants a junior-summer finance internship but is currently a sophomore in March. What's the most accurate takeaway?",
              options: [
                "It's already too late to plan for finance recruiting",
                "They likely need to start networking and applying soon, since many finance firms finalize classes 9-12 months ahead",
                "Finance recruiting always happens the summer before the internship, so there's no rush",
                "Recruiting timelines don't matter as long as the resume is strong",
              ],
              correctIndex: 1,
              explanation:
                "Given the 9-12 month lead time common in finance recruiting, a sophomore in March should treat the coming months as prime time to network and apply.",
              hint: "Count backward from a typical junior-summer internship start date.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u2-l4-q3",
              type: "true-false",
              prompt:
                "Asking 'What does your company do?' at the end of an interview is a strong way to show interest.",
              correctBool: false,
              explanation:
                "That information is easily found online before the interview, it can signal a lack of preparation. Specific, conversation-referencing questions land far better.",
              hint: "Would this question have required Googling the company beforehand?",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u2-l4-q4",
              type: "fill-in",
              prompt: "What four letters make up the behavioral interview framework covered in this unit?",
              accept: ["star"],
              explanation:
                "STAR = Situation, Task, Action, Result, a structure for answering 'tell me about a time when...' questions clearly and persuasively.",
              hint: "It's also the name of a shape in the sky.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u2-l4-q5",
              type: "scenario",
              prompt: "What should Tyler do right after his interview ends?",
              context:
                "Tyler just finished a first-round interview for a summer analyst role. The interviewer mentioned she recently led a project switching the team to a new data platform. Tyler has the interviewer's email address.",
              options: [
                "Wait a week or two so he doesn't seem overeager",
                "Send a short thank-you email within a day, mentioning the data platform project specifically",
                "Send a generic thank-you template with no specific details",
                "Skip the thank-you note since the interview already happened",
              ],
              correctIndex: 1,
              explanation:
                "A prompt, specific thank-you (within about 24 hours, referencing the data platform conversation) reinforces genuine interest and keeps Tyler memorable during the decision process.",
              hint: "Combine both timing (soon) and specificity (reference the actual conversation).",
              xp: 15,
            },
          ],
        },
      ],
    },

    // ────────────────────────────────────────────────────────────────
    // UNIT 3, First-Job Money Moves
    // ────────────────────────────────────────────────────────────────
    {
      id: "career-capital-u3",
      courseId: "career-capital",
      order: 3,
      title: "First-Job Money Moves",
      subtitle: "Read the offer, claim the free money, and negotiate with confidence",
      lessons: [
        {
          id: "career-capital-u3-l1",
          unitId: "career-capital-u3",
          courseId: "career-capital",
          order: 1,
          title: "Reading an Offer Letter",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 30,
          summary: "Base salary is just one line on the offer, learn to read all of them.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u3-l1-t1",
              title: "An offer has more parts than base salary",
              body: "Total compensation can include base salary, a signing bonus (often one-time), relocation assistance, and equity (stock that usually vests over several years). Comparing two offers by base salary alone can be misleading.",
              example:
                "Offer A: $70,000 base, no bonus. Offer B: $65,000 base, $5,000 signing bonus, $2,000 relocation. In year one, Offer B actually pays more total cash.",
            },
            {
              kind: "teach",
              id: "career-capital-u3-l1-t2",
              title: "Equity usually vests over time",
              body: "If an offer includes stock or equity, check the vesting schedule, commonly 4 years with a 1-year 'cliff,' meaning you get nothing if you leave before year one. Equity promised isn't the same as equity owned yet.",
              analogy: "Unvested equity is like a gift card that only activates after you've stuck around a while.",
            },
            {
              kind: "question",
              id: "career-capital-u3-l1-q1",
              type: "mcq",
              prompt: "Which of these is typically a ONE-TIME payment rather than an ongoing part of pay?",
              options: ["Base salary", "Signing bonus", "Annual raise", "401(k) match"],
              correctIndex: 1,
              explanation:
                "A signing bonus is usually a single upfront payment for accepting the offer, unlike base salary or an ongoing match, which recur.",
              hint: "Which of these do you only receive once, right when you join?",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l1-q2",
              type: "true-false",
              prompt:
                "Comparing two job offers by base salary alone gives you the full picture of which one pays more.",
              correctBool: false,
              explanation:
                "Signing bonuses, relocation assistance, equity, and benefits can meaningfully change total compensation, a lower base salary can sometimes come with a higher total package.",
              hint: "Think about all the other lines that can appear on an offer letter.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l1-q3",
              type: "scenario",
              prompt: "Which offer has the higher total first-year cash value?",
              context:
                "Offer A: $72,000 base salary, no signing bonus, no relocation. Offer B: $68,000 base salary, $6,000 signing bonus, $1,500 relocation stipend.",
              options: [
                "Offer A ($72,000 total)",
                "Offer B ($75,500 total)",
                "They're exactly equal",
                "There's not enough information to compare",
              ],
              correctIndex: 1,
              explanation:
                "Offer B totals $68,000 + $6,000 + $1,500 = $75,500 in year one, which is $3,500 more than Offer A's $72,000 base alone, a good reminder to add up every line, not just base salary.",
              hint: "Add up all three numbers for Offer B, then compare to Offer A's single number.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u3-l2",
          unitId: "career-capital-u3",
          courseId: "career-capital",
          order: 2,
          title: "The 401(k) Match Is Free Money",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 30,
          summary: "Not contributing enough to get the full match means leaving cash on the table.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u3-l2-t1",
              title: "A match is your employer doubling part of your savings",
              body: "A '4% match' typically means your employer adds an amount equal to up to 4% of your salary into your 401(k), but only if you personally contribute at least that much. If you contribute less, you don't get the full match.",
              example:
                "On a $70,000 salary with a 4% match, contributing 4% ($2,800) yourself means your employer adds another $2,800, an instant 100% return before any investment growth.",
            },
            {
              kind: "teach",
              id: "career-capital-u3-l2-t2",
              title: "Contribute at least up to the match",
              body: "A common rule of thumb: always contribute at least enough to get the full employer match before prioritizing other savings goals, since it's an immediate, guaranteed return no investment can promise.",
            },
            {
              kind: "question",
              id: "career-capital-u3-l2-q1",
              type: "fill-in",
              prompt:
                "On a $70,000 salary with a 4% employer 401(k) match, how much money (in dollars) does the employer contribute per year if you contribute at least 4% yourself?",
              accept: ["2800", "$2,800", "2,800", "2800 dollars"],
              explanation:
                "4% of $70,000 is $2,800, that's the employer's matching contribution, on top of your own $2,800, for $5,600 total going into the account that year.",
              hint: "Calculate 4% of $70,000.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l2-q2",
              type: "true-false",
              prompt:
                "If you contribute 0% to your 401(k), you still receive the full employer match.",
              correctBool: false,
              explanation:
                "Most employer matches require you to contribute your own money first, the employer is matching your contribution, not giving it away for free regardless of your participation.",
              hint: "The word 'match' implies you have to put something in too.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l2-q3",
              type: "scenario",
              prompt: "What's the best move for Nia in her first month on the job?",
              context:
                "Nia just started a job with a $60,000 salary and a 401(k) plan that matches 100% of contributions up to 4% of salary. She's deciding whether to contribute 0%, 2%, or 4% of her paycheck.",
              options: [
                "Contribute 0% so she has more cash now",
                "Contribute 2%, since some savings is better than none",
                "Contribute at least 4%, to capture the full employer match",
                "Wait a year before contributing anything to the 401(k)",
              ],
              correctIndex: 2,
              explanation:
                "Contributing 2% instead of the full 4% would mean giving up part of the free employer match, at 4%, Nia gets the entire match, an instant guaranteed return equal to 100% of what she puts in.",
              hint: "The match is only 'full' at one specific contribution level, what is it?",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u3-l3",
          unitId: "career-capital-u3",
          courseId: "career-capital",
          order: 3,
          title: "Negotiating & Benefits Literacy",
          difficulty: "Advanced",
          kind: "lesson",
          xp: 35,
          summary: "Politely ask for more, and understand what's actually in your benefits package.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u3-l3-t1",
              title: "Most people who negotiate get something",
              body: "Studies and recruiter surveys consistently show that most candidates who politely ask for more, citing market research or a competing offer, receive at least a partial increase. Simply not asking guarantees you get nothing extra.",
              example:
                "A polite ask like: \"I'm excited about this offer. Based on my research on similar roles, is there flexibility on base salary or a signing bonus?\" costs nothing to send.",
            },
            {
              kind: "teach",
              id: "career-capital-u3-l3-t2",
              title: "An early raise compounds for decades",
              body: "An extra $5,000 negotiated at your first job doesn't just add $5,000 once, it can raise your baseline for future raises, bonuses, and job-hopping increases, compounding into well over six figures of extra lifetime earnings.",
              analogy: "Negotiating your starting salary is like setting the interest rate on decades of future raises, a small early bump grows a lot over time.",
            },
            {
              kind: "question",
              id: "career-capital-u3-l3-q1",
              type: "mcq",
              prompt: "What's the best evidence to cite when politely negotiating a starting salary?",
              options: [
                "Personal financial needs like rent or debt",
                "Market data on similar roles, or a competing offer",
                "How much you want the job",
                "Nothing, negotiation only works with silence",
              ],
              correctIndex: 1,
              explanation:
                "Employers respond best to objective evidence like market salary data or a competing offer, it reframes the ask as fair market value rather than a personal favor.",
              hint: "Employers care about market comparisons more than personal budgets.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l3-q2",
              type: "true-false",
              prompt: "Politely negotiating a starting offer often results in getting at least some improvement.",
              correctBool: true,
              explanation:
                "Most candidates who politely negotiate, with reasonable evidence, receive at least a partial improvement, while candidates who don't ask receive nothing extra by default.",
              hint: "Compare the outcome of asking versus not asking at all.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l3-q3",
              type: "scenario",
              prompt: "Which HSA vs. FSA fact is correct for Ben's situation?",
              context:
                "Ben is choosing his benefits during onboarding. He's comparing an HSA (Health Savings Account) and an FSA (Flexible Spending Account) to help pay for medical expenses, and wants to know a key difference.",
              options: [
                "An FSA's unused funds always roll over indefinitely, while an HSA's do not",
                "An HSA typically requires a high-deductible health plan and its funds generally roll over year to year, while FSA funds are often 'use it or lose it'",
                "HSAs and FSAs are identical in every way",
                "Only full-time employees over 40 can use either account",
              ],
              correctIndex: 1,
              explanation:
                "HSAs are usually paired with high-deductible health plans and roll over indefinitely, while many FSAs have 'use it or lose it' rules each year, an important distinction when picking benefits.",
              hint: "Think about which account is tied to a specific type of health plan.",
              xp: 10,
            },
            {
              kind: "question",
              id: "career-capital-u3-l3-q4",
              type: "fill-in",
              prompt:
                "What's the term for paid time away from work (vacation, sick days, etc.) that's usually listed as a benefit in an offer?",
              accept: ["pto", "paid time off"],
              explanation:
                "PTO (paid time off) is a core benefit to compare across offers, along with health insurance, 401(k) match, and other perks.",
              hint: "It's commonly abbreviated as three letters.",
              xp: 10,
            },
          ],
        },
        {
          id: "career-capital-u3-l4",
          unitId: "career-capital-u3",
          courseId: "career-capital",
          order: 4,
          title: "Unit 3 Challenge: First Paycheck, First Smart Moves",
          difficulty: "Advanced",
          kind: "challenge",
          xp: 90,
          summary: "Prove you can read an offer, claim the match, and negotiate wisely.",
          cards: [
            {
              kind: "teach",
              id: "career-capital-u3-l4-t1",
              title: "Quick recap",
              body: "Compare total compensation, not just base salary. Contribute at least enough to get your full 401(k) match, it's an instant return. Negotiate politely with market data or a competing offer, and understand your benefits (HSA vs. FSA, PTO) before picking them.",
            },
            {
              kind: "question",
              id: "career-capital-u3-l4-q1",
              type: "scenario",
              prompt: "Which offer actually has the higher first-year total cash value?",
              context:
                "Offer A: $80,000 base, no bonus, no relocation. Offer B: $74,000 base, $5,000 signing bonus, $2,500 relocation stipend.",
              options: [
                "Offer A ($80,000)",
                "Offer B ($81,500)",
                "They're equal",
                "Cannot be determined",
              ],
              correctIndex: 1,
              explanation:
                "Offer B totals $74,000 + $5,000 + $2,500 = $81,500, which is $1,500 more than Offer A's $80,000, always add every line of an offer, not just base salary.",
              hint: "Add up all of Offer B's components before comparing.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u3-l4-q2",
              type: "fill-in",
              prompt:
                "On a $50,000 salary with a 4% employer 401(k) match, how much (in dollars) does the employer contribute per year if you contribute at least 4% yourself?",
              accept: ["2000", "$2,000", "2,000", "2000 dollars"],
              explanation:
                "4% of $50,000 is $2,000, that's what the employer contributes when you contribute at least 4% yourself, effectively doubling that portion of your savings instantly.",
              hint: "Calculate 4% of $50,000.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u3-l4-q3",
              type: "true-false",
              prompt: "Negotiating a slightly higher starting salary is unlikely to matter much over a full career.",
              correctBool: false,
              explanation:
                "Because raises, bonuses, and future job offers are often based off your current salary, even a modest early negotiation (e.g., $5,000) can compound into well over six figures of extra lifetime earnings.",
              hint: "Think about how future raises are usually calculated, as a percentage of what?",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u3-l4-q4",
              type: "mcq",
              prompt:
                "Priya is about to accept an offer without negotiating because she's worried about seeming difficult. What does the research on polite negotiation suggest?",
              options: [
                "She should never negotiate under any circumstances",
                "Polite negotiation using market data rarely works and often backfires",
                "Most candidates who politely negotiate with reasonable evidence get at least some improvement, while not asking guarantees no extra",
                "Only senior executives are allowed to negotiate offers",
              ],
              correctIndex: 2,
              explanation:
                "A respectful ask backed by market data is a normal, expected part of the hiring process for most roles, it costs nothing to try, while staying silent guarantees leaving potential money on the table.",
              hint: "Compare the realistic downside of asking versus the guaranteed outcome of not asking.",
              xp: 15,
            },
            {
              kind: "question",
              id: "career-capital-u3-l4-q5",
              type: "scenario",
              prompt: "What's the smartest combined first move for Diego?",
              context:
                "Diego just got his first full-time offer: $65,000 base with a 401(k) that matches 100% up to 3% of salary. He's excited and ready to sign immediately without reviewing the numbers further or asking any questions.",
              options: [
                "Sign immediately without any further review or questions",
                "Consider a polite, evidence-based negotiation on base salary, and plan to contribute at least 3% to capture the full 401(k) match once he starts",
                "Negotiate aggressively for double the salary with no supporting data",
                "Skip the 401(k) entirely to keep more cash today",
              ],
              correctIndex: 1,
              explanation:
                "A reasonable, evidence-based negotiation attempt costs nothing, and contributing at least 3% ($1,950/year here) captures the full employer match, both are simple, low-risk moves that compound in Diego's favor.",
              hint: "Combine the lesson on negotiation with the lesson on capturing the full match.",
              xp: 15,
            },
          ],
        },
      ],
    },
  ],
};
