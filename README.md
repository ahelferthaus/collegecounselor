# College Counselor AI

An AI-powered college counseling platform that provides personalized guidance throughout the college admissions journey. Built as a modern, animated landing page showcasing the product's features, pricing, and value proposition.

## Overview

College Counselor AI helps students navigate every step of the college admissions process — from discovering dream schools and writing compelling essays to managing deadlines, understanding financial aid, and preparing for interviews. The platform combines AI personalization with a judgment-free, always-available counseling experience.

**Key Stats (as presented on the landing page):**
- 10,000+ students helped
- 94% get into at least one of their top 3 schools
- 4.9/5 average rating
- 50+ countries served
- 50,000+ essays reviewed

## Features

- **Personalized Guidance** — AI learns each student's unique story, interests, and goals
- **Essay Support** — Brainstorming, drafting, and refining with AI feedback (the AI guides, never writes for you)
- **Application Tracking** — Deadline reminders, checklists, and status tracking
- **Financial Aid Help** — FAFSA guidance, scholarship matching, and aid package explanations
- **Interview Preparation** — Practice sessions and confidence building
- **Mental Wellness** — Stress management and emotional support throughout the process
- **First-Generation Support** — Plain-language explanations for students and families new to college admissions

## Pricing Tiers

| Feature | Starter (Free) | Pro ($29/mo) | Family ($49/mo) |
|---|---|---|---|
| College search | Basic | Advanced AI | Advanced AI |
| Essay reviews | 5/month | Unlimited | Unlimited |
| Deadline tracker | Yes | Yes | Yes |
| Interview prep | — | Yes | Yes |
| Financial aid guidance | — | Yes | Yes |
| Scholarship matcher | — | Yes | Yes |
| Student profiles | 1 | 1 | Up to 3 |
| Parent dashboard | — | — | Yes |
| Support | Email | 24/7 chat | Dedicated manager |

Yearly plans available at 20% discount.

## Tech Stack

### Frontend
- **React 19** with TypeScript (strict mode)
- **Vite 7** — fast dev server and optimized builds
- **Tailwind CSS 3** — utility-first styling with custom design tokens

### UI Components
- **shadcn/ui** — 50+ pre-built, accessible components built on Radix UI primitives
- **Lucide React** — icon library
- **Embla Carousel** — carousel/slider components
- **Recharts** — data visualization
- **Sonner** — toast notifications
- **Vaul** — drawer component

### Animation & Interaction
- **GSAP 3** with ScrollTrigger — professional scroll-based animations
- **Lenis** — smooth scrolling
- 3D perspective transforms, parallax effects, glass morphism

### Forms & Validation
- **React Hook Form** — form state management
- **Zod** — TypeScript-first schema validation

### Design System
- **Fonts:** Poppins (headings), Inter (body) via Google Fonts
- **Colors:** Purple (#7F56D9), Teal (#14B8A6), Navy (#1E2B4F)
- **Dark mode** support (class-based)
- **Responsive** mobile-first design (breakpoint at 768px)

## Project Structure

```
app/
├── src/
│   ├── sections/           # Landing page sections
│   │   ├── Navigation.tsx   # Fixed navbar with mobile menu
│   │   ├── Hero.tsx         # Animated hero with social proof
│   │   ├── LogoMarquee.tsx  # University logos carousel
│   │   ├── Features.tsx     # Bento grid feature cards
│   │   ├── HowItWorks.tsx   # 4-step process flow
│   │   ├── Testimonials.tsx # Student testimonials (masonry)
│   │   ├── Pricing.tsx      # 3-tier pricing with toggle
│   │   ├── FAQ.tsx          # Accordion FAQs
│   │   ├── CTA.tsx          # Call-to-action
│   │   └── Footer.tsx       # Links, newsletter, socials
│   ├── components/ui/       # shadcn/ui component library
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (cn helper)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets (images)
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd app
npm install
```

### Development

```bash
npm run dev
```

Opens the dev server at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview   # preview the build locally
```

### Linting

```bash
npm run lint
```

## Deployment

The production build outputs to `app/dist/` as static files. Deploy to any static hosting provider:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **GitHub Pages**

## Planned / Roadmap

- [ ] Backend API integration (authentication, user profiles, AI chat)
- [ ] AI chat interface with conversation memory
- [ ] Student dashboard with application tracking
- [ ] Essay editor with real-time AI feedback
- [ ] College search and comparison tool
- [ ] Scholarship database and matcher
- [ ] Parent dashboard (Family plan)
- [ ] Payment integration (Stripe)
- [ ] Mobile app (React Native)

## License

All rights reserved.
