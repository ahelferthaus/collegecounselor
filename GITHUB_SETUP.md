# GitHub Setup Guide for College Counselor AI

## Step 1: Download the Project

First, download the project files from the sandbox to your local machine.

## Step 2: Initialize Git Repository

Open a terminal in the project folder and run:

```bash
# Navigate to the project folder
cd /path/to/college-counselor-ai

# Initialize git
git init --initial-branch=main

# Configure git (if not already done)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 3: Create .gitignore

Create a `.gitignore` file in the root:

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Build outputs
dist
dist-ssr
*.local

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Testing
coverage
.nyc_output

# Temporary files
*.tmp
*.temp
.cache
```

## Step 4: Commit Files

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: College Counselor AI website

- React + TypeScript + Vite setup
- Tailwind CSS + shadcn/ui components
- GSAP animations and scroll effects
- Hero, Features, Testimonials, Pricing, FAQ sections
- Responsive design with mobile support"
```

## Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Name your repository (e.g., `college-counselor-ai`)
3. Make it Public or Private
4. **Do NOT initialize with README, .gitignore, or license**
5. Click "Create repository"

## Step 6: Push to GitHub

After creating the repo, GitHub will show you commands. Run:

```bash
# Add the remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/college-counselor-ai.git

# Push to GitHub
git push -u origin main
```

## Step 7: Set Up for Claude Code

### Option A: Using Claude Code Desktop App

1. Install Claude Code from https://claude.ai/code
2. Open Claude Code
3. Run: `/add /path/to/college-counselor-ai`
4. Claude Code will now have access to your project

### Option B: Using Claude Code with GitHub

1. In Claude Code, run: `/github YOUR_USERNAME/college-counselor-ai`
2. Claude will clone and analyze the repository

### Option C: Using Cursor or Other AI Editors

The project is ready to use with any AI-powered editor:
- Cursor
- GitHub Copilot
- Windsurf
- Continue.dev

## Project Structure

```
college-counselor-ai/
├── src/
│   ├── sections/           # Page sections
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── LogoMarquee.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── components/ui/      # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── public/                 # Static assets
│   ├── hero-student.jpg
│   ├── cta-students.jpg
│   ├── review-*.jpg
│   └── testimonial-*.jpg
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Technologies

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn/ui
- **Animations**: GSAP + ScrollTrigger
- **Icons**: Lucide React

## Claude Code Tips

When working with Claude Code, you can ask it to:

1. **Add new sections**: "Add a blog section with article cards"
2. **Modify components**: "Make the Hero section more minimal"
3. **Add features**: "Add a dark mode toggle"
4. **Fix issues**: "Fix the mobile navigation menu"
5. **Optimize**: "Optimize the images and animations"
6. **Add integrations**: "Add a contact form with email functionality"

## Environment Variables (Optional)

Create a `.env.local` file for API keys:

```env
# Example for future integrations
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=your-analytics-id
```

## Deployment

The project is already set up for easy deployment:

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

### GitHub Pages
See: https://vitejs.dev/guide/static-deploy.html#github-pages

---

## Need Help?

- **Claude Code docs**: https://docs.anthropic.com/en/docs/claude-code
- **Vite docs**: https://vitejs.dev/guide/
- **shadcn/ui docs**: https://ui.shadcn.com/docs
- **Tailwind docs**: https://tailwindcss.com/docs
