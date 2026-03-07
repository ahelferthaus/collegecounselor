# College Counselor AI

An AI-powered college counseling platform that provides personalized guidance, essay support, application tracking, and proactive reminders to help students navigate the college admissions journey with confidence.

![College Counselor AI](https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200)

## Features

- **Personalized Guidance** - AI that learns your unique story and aspirations
- **Essay Support** - Brainstorm, draft, and refine with AI-powered feedback
- **Application Tracking** - Never miss a deadline with smart reminders
- **Financial Aid Help** - Navigate FAFSA, scholarships, and aid packages
- **Mental Wellness** - Stress management throughout your journey

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Animations**: GSAP + ScrollTrigger
- **Icons**: Lucide React
- **Smooth Scroll**: Lenis

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/college-counselor-ai.git

# Navigate to project
cd college-counselor-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Project Structure

```
src/
├── sections/           # Page sections
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── LogoMarquee.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── Testimonials.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── components/ui/      # shadcn/ui components
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Design System

### Colors
- **Primary Purple**: `#7F56D9`
- **Primary Teal**: `#14B8A6`
- **Dark Navy**: `#1E2B4F`
- **Soft Lavender**: `#E0E7FF`
- **Light Mint**: `#D1FAE5`

### Typography
- **Headings**: Poppins
- **Body**: Inter

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ for students everywhere.
