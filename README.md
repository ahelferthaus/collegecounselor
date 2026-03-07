# College Counselor AI

**An AI-powered college counseling platform that makes expert admissions guidance accessible to every student — regardless of income, location, or background.**

[![Live Site (Vercel)](https://img.shields.io/badge/Live%20Site-Vercel-black?logo=vercel)](https://collegecounselor.vercel.app)
[![GitHub Pages](https://img.shields.io/badge/Mirror-GitHub%20Pages-blue?logo=github)](https://ahelferthaus.github.io/collegecounselor/)

---

## The Problem

The college admissions system is fundamentally broken:

- **Counselor Shortage** — The national average is 1 counselor per 400+ students. Many students get less than 20 minutes of college guidance per year.
- **Equity Gap** — Wealthy families spend $5,000–$10,000+ on private counselors while first-generation and low-income students navigate a complex system alone.
- **Information Overload** — 4,000+ colleges, dozens of deadlines, financial aid forms, essays, interviews — it's overwhelming without expert help.
- **Mental Health Crisis** — College admissions is the #1 source of stress for high school juniors and seniors.
- **Campus Visit Inequity** — In-person campus visits are critical for college selection, but many students can't afford to travel.
- **Athletic Recruiting Fragmentation** — Student-athletes juggle academic applications and athletic recruiting on completely separate platforms.

**College Counselor AI solves this** by providing personalized, always-available, judgment-free AI counseling to every student for free or at an affordable price point.

---

## What We're Building

### Vision
A comprehensive AI counseling platform that combines the expertise of a top private counselor with the accessibility of technology — serving students, parents, coaches, and schools.

### Core Platform Features

| Feature | Description | Status |
|---------|-------------|--------|
| **AI Counselor Chat** | Personalized guidance via conversational AI that learns each student's profile, goals, and preferences | Planned |
| **College Discovery** | Smart search and AI-powered "best fit" recommendations across 4,000+ schools | Planned |
| **Essay Workshop** | AI-assisted brainstorming, drafting, and feedback (guides, never writes for you) | Planned |
| **Application Tracker** | Deadline management, checklists, and status tracking across all applications | Planned |
| **Financial Aid Guide** | FAFSA walkthrough, scholarship matching, net price estimation | Planned |
| **Interview Prep** | AI-simulated practice interviews with feedback | Planned |
| **Virtual Campus Tours** | Integrated virtual tours from partner colleges for students who can't travel | Planned |
| **Mental Wellness** | Stress detection, encouragement, breathing exercises, and break suggestions | Planned |
| **Parent Dashboard** | Progress monitoring, notifications, and family-level management | Planned |
| **First-Gen Support** | Plain-language mode, tooltips, and guided walkthroughs for the entire process | Planned |
| **Athletic Recruiting** | Unified academic + athletic profile, recruiting timelines, coach communication | Planned |

### What's Built Today

The project currently has a **fully designed, animated landing page** that showcases the product vision:

- 10 polished sections: Navigation, Hero, Logo Marquee, Features, How It Works, Testimonials, Pricing, FAQ, CTA, Footer
- Professional animations (GSAP + ScrollTrigger), smooth scrolling (Lenis), 3D effects
- Mobile-responsive design with custom design system
- Deployed on both Vercel and GitHub Pages

---

## Revenue Model

We're pursuing a **B2B2C hybrid model** — free tier for students, premium subscriptions, and school/district licensing:

| Plan | Price | Audience | Includes |
|------|-------|----------|----------|
| **Starter** | Free | All students | Basic college search, 5 essay reviews/mo, deadline tracker |
| **Pro** | $29/mo | Individual students | Unlimited AI chat, essay reviews, interview prep, financial aid, scholarships |
| **Family** | $49/mo | Families | Everything in Pro for up to 3 students + parent dashboard + dedicated support |
| **School License** | Custom | Schools & districts | Bulk licensing, counselor dashboard, analytics, custom branding |

Yearly plans available at 20% discount.

---

## Tech Stack

### Current (Landing Page)

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript (strict mode) |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 3 + custom design tokens |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Animation** | GSAP 3 + ScrollTrigger, Lenis smooth scroll |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod validation |
| **Deployment** | Vercel (primary) + GitHub Pages (mirror) |
| **CI/CD** | GitHub Actions |

### Planned (Full Platform)

| Layer | Technology |
|-------|-----------|
| **Backend** | Supabase (Auth, PostgreSQL, Realtime, Edge Functions) |
| **AI** | Anthropic Claude API (primary), OpenAI GPT-4 (fallback) |
| **Payments** | Stripe (subscriptions, metered billing) |
| **Email** | Resend / SendGrid (transactional + marketing) |
| **Analytics** | PostHog / Mixpanel |
| **College Data** | IPEDS / College Scorecard API + custom enrichment |
| **Search** | Supabase full-text search + pgvector for semantic matching |
| **File Storage** | Supabase Storage (essays, documents) |
| **Monitoring** | Sentry (error tracking), LogFlare (logs) |

### Design System

- **Fonts:** Poppins (headings), Inter (body) via Google Fonts
- **Colors:** Purple `#7F56D9`, Teal `#14B8A6`, Navy `#1E2B4F`
- **Dark mode** support (class-based toggle)
- **Mobile-first** responsive design

---

## Project Structure

```
college/
├── app/                          # Main application
│   ├── src/
│   │   ├── sections/             # Landing page sections
│   │   │   ├── Navigation.tsx    # Fixed navbar with scroll detection & mobile menu
│   │   │   ├── Hero.tsx          # Animated hero with typing effect & social proof
│   │   │   ├── LogoMarquee.tsx   # University logos infinite scroll
│   │   │   ├── Features.tsx      # Bento grid feature showcase
│   │   │   ├── HowItWorks.tsx    # 4-step process with scroll animations
│   │   │   ├── Testimonials.tsx  # Student testimonials (masonry layout)
│   │   │   ├── Pricing.tsx       # 3-tier pricing with monthly/yearly toggle
│   │   │   ├── FAQ.tsx           # Searchable accordion FAQs
│   │   │   ├── CTA.tsx           # Call-to-action with character stagger animation
│   │   │   └── Footer.tsx        # Links, newsletter signup, social links
│   │   ├── components/ui/        # shadcn/ui component library (50+ components)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities (cn helper, etc.)
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── public/                   # Static assets
│   ├── vite.config.ts            # Vite config (auto-detects Vercel vs GitHub Pages)
│   ├── tailwind.config.js        # Tailwind with custom theme
│   ├── tsconfig.json
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions → GitHub Pages deployment
├── generate_spec.py              # Script to generate the specification document
├── College_Counselor_AI_Specification.docx  # Full business & technical spec
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation & Development

```bash
cd app
npm install
npm run dev
```

Opens the dev server at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview    # preview the build locally
```

### Linting

```bash
npm run lint
```

---

## Deployment

The app auto-deploys to two environments:

| Environment | URL | Trigger |
|-------------|-----|---------|
| **Vercel** (primary) | [collegecounselor.vercel.app](https://collegecounselor.vercel.app) | Push to `main` |
| **GitHub Pages** (mirror) | [ahelferthaus.github.io/collegecounselor](https://ahelferthaus.github.io/collegecounselor/) | Push to `main` (via GitHub Actions) |

**Vercel config:** Root Directory = `app`, Framework = Vite, Build Command = `npm run build`

The Vite config automatically sets the correct base path per environment using `process.env.VERCEL`.

---

## Documentation

A comprehensive **Business & Technical Specification** document is included in this repo:

📄 **`College_Counselor_AI_Specification.docx`** (~40 pages)

This document covers:
- Business Requirements Document (BRD)
- Functional Requirements Document (FRD) with 40+ requirements
- User Stories with acceptance criteria and story points
- Technical Requirements Document (TRD)
- System Architecture & data models
- Full Stack Design (FSD)
- API documentation
- Competitive analysis (Naviance, Scoir, CollegeVine, Cialfo, Khanmigo, NCSA, etc.)
- Market sizing and gap analysis
- 3 revenue models + recommended B2B2C hybrid
- Cost estimates at scale (AI API, infrastructure, staffing)
- Production project plan (6 phases over 12 months)
- Customer demo strategy

The spec is generated by `generate_spec.py` (Python + python-docx) and can be regenerated at any time.

---

## Roadmap

### Phase 0 — Foundation (Weeks 1–3)
- [ ] Supabase setup (auth, database, RLS policies)
- [ ] Core database schema (users, profiles, conversations, colleges)
- [ ] Authentication flows (signup, login, OAuth)
- [ ] Connect auth to landing page CTAs

### Phase 1 — Core AI MVP (Weeks 4–8)
- [ ] AI counselor chat interface
- [ ] Student onboarding & profile builder
- [ ] College search & recommendation engine
- [ ] Basic essay feedback tool
- [ ] Application deadline tracker

### Phase 2 — Monetization (Weeks 9–12)
- [ ] Stripe integration (Free / Pro / Family tiers)
- [ ] Usage metering and tier enforcement
- [ ] Parent dashboard
- [ ] Email notification system

### Phase 3 — Growth Features (Weeks 13–18)
- [ ] Virtual campus tour integration
- [ ] Interview prep module
- [ ] Financial aid calculator & scholarship matcher
- [ ] First-gen support mode

### Phase 4 — B2B & Scale (Weeks 19–24)
- [ ] School/district licensing portal
- [ ] Counselor dashboard & analytics
- [ ] Athletic recruiting integration
- [ ] Club/team group management

### Phase 5 — Polish & Launch (Weeks 25–30)
- [ ] Mobile optimization (PWA)
- [ ] Admin panel
- [ ] FERPA compliance & security hardening
- [ ] Public launch & marketing

---

## Competitive Landscape

| Feature | College Counselor AI | Naviance | CollegeVine | Scoir | NCSA |
|---------|---------------------|----------|-------------|-------|------|
| AI Chat Counselor | ✅ Core | ❌ | ✅ Limited | ❌ | ❌ |
| Essay Feedback | ✅ AI-powered | ❌ | ✅ AI-powered | ❌ | ❌ |
| College Matching | ✅ AI + data | ✅ | ✅ | ✅ | ❌ |
| Application Tracking | ✅ | ✅ | ✅ | ✅ | ❌ |
| Financial Aid Guide | ✅ | Limited | Limited | Limited | ❌ |
| Interview Prep | ✅ | ❌ | ❌ | ❌ | ❌ |
| Mental Wellness | ✅ | ❌ | ❌ | ❌ | ❌ |
| Virtual Campus Tours | ✅ Integrated | ❌ | ❌ | Some | ❌ |
| Athletic Recruiting | ✅ Planned | ❌ | ❌ | ❌ | ✅ Core |
| First-Gen Support | ✅ Core | ❌ | Some | ❌ | ❌ |
| Parent Dashboard | ✅ | Limited | ❌ | Some | Some |
| Price (Student) | Free–$29/mo | School pays | Free | School pays | $0–$800/yr |

**Key differentiator:** No competitor unifies AI counseling, academic admissions, athletic recruiting, virtual tours, and mental wellness in one platform.

---

## Contributing

This is currently a private project. If you're interested in contributing, please reach out.

## License

All rights reserved.
