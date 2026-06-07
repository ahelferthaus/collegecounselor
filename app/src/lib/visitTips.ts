// Original campus-visit guidance (written for this app — not copied from any
// publication). Organized by phase, with a questions checklist.

export interface VisitTip {
  title: string;
  body: string;
}

export interface TipPhase {
  phase: string;
  tips: VisitTip[];
}

export const VISIT_TIPS: TipPhase[] = [
  {
    phase: 'Before you go',
    tips: [
      {
        title: 'Book the official visit + info session',
        body: 'Register on the admissions site for a tour and info session. At many schools, signing up is also a way to show "demonstrated interest," which can matter in admissions.',
      },
      {
        title: 'Time it well',
        body: 'Visit when class is in session if you can — a campus feels very different on a quiet summer day. Spring of junior year or fall of senior year is ideal.',
      },
      {
        title: 'Do your homework first',
        body: "Skim the student newspaper, the school subreddit, and the department page for your intended major. You'll ask sharper questions and notice more.",
      },
      {
        title: 'Plan to see your academic department',
        body: 'Email a professor or department office ahead of time to ask about sitting in on a class or meeting briefly. Seeing your actual major up close is the highest-signal part of a visit.',
      },
    ],
  },
  {
    phase: 'On campus',
    tips: [
      {
        title: 'Take the tour — then wander on your own',
        body: 'Tours are curated. Afterward, walk the campus without a guide. Read the bulletin boards: the flyers tell you what students actually do here.',
      },
      {
        title: 'Talk to real students (not just the tour guide)',
        body: 'Ask a few students what they love and what they\'d change. The tour guide is paid to be positive; candid answers come from people in the dining hall or library.',
      },
      {
        title: 'Eat in a dining hall & sit in the student center',
        body: 'Food and common spaces shape daily life. Grab a meal, feel the vibe, and notice whether students seem happy and engaged.',
      },
      {
        title: 'Spend time in the library & study spaces',
        body: 'See where you\'d actually work. Are there enough quiet spots, group rooms, and late hours? Is it busy and alive, or empty?',
      },
      {
        title: 'Tour the dorms',
        body: 'Ask to see real first-year housing, not just a model room. Where you live affects your first year more than almost anything.',
      },
      {
        title: 'Walk the surrounding town',
        body: "You're choosing a place to live, not just a campus. Explore the neighborhood — transit, coffee shops, safety, things to do on a weekend.",
      },
      {
        title: 'Check safety for real',
        body: 'Note lighting, blue-light phones, and how secure dorms are. Ask about campus police, the alert system, and look up the school\'s Clery Act crime report.',
      },
      {
        title: 'Visit financial aid in person',
        body: 'Stop by the aid office with specific questions about merit scholarships, need-based aid, and the net price for your situation. A quick conversation can be worth thousands.',
      },
      {
        title: 'Ask about accessibility & support',
        body: 'If you need accommodations (learning, physical, medical, mental health), visit the disability/wellness office and ask exactly how support works and what it costs.',
      },
      {
        title: 'Find your people',
        body: 'Drop in on a club fair, a practice, a rehearsal, or a religious/cultural center tied to your interests. Picturing your community matters as much as academics.',
      },
    ],
  },
  {
    phase: "Can't visit in person?",
    tips: [
      {
        title: 'Do a great virtual visit',
        body: 'Take the official virtual tour plus a student-made YouTube tour, join a virtual info session, and email admissions or a department to ask your questions. You can learn a lot without the plane ticket.',
      },
    ],
  },
];

export const QUESTIONS_TO_ASK: string[] = [
  'What do students do on a typical weekend?',
  'How easy is it to get the classes you want, and how big are intro classes?',
  'How accessible are professors outside of class?',
  'What support exists for advising, tutoring, and mental health?',
  'What\'s the housing guarantee, and where do upperclassmen live?',
  'What does the average financial-aid or merit package actually look like?',
  'How strong is advising and recruiting for my intended career?',
  'What would you change about this school if you could?',
  'How safe do students feel on and around campus at night?',
  'What kinds of students thrive here — and who doesn\'t?',
];
