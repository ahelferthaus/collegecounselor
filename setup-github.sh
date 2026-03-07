#!/bin/bash

# GitHub Setup Script for College Counselor AI
# Run this script after downloading the project to your local machine

echo "🎓 College Counselor AI - GitHub Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Get GitHub username
echo "Enter your GitHub username:"
read GITHUB_USERNAME

# Get repository name
echo "Enter your desired repository name (default: college-counselor-ai):"
read REPO_NAME
REPO_NAME=${REPO_NAME:-college-counselor-ai}

echo ""
echo "Setting up repository: $GITHUB_USERNAME/$REPO_NAME"
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init --initial-branch=main
else
    echo "📦 Git repository already initialized"
fi

# Configure git user if not set
if [ -z "$(git config user.name)" ]; then
    echo "Enter your name for git commits:"
    read GIT_NAME
    git config user.name "$GIT_NAME"
fi

if [ -z "$(git config user.email)" ]; then
    echo "Enter your email for git commits:"
    read GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: College Counselor AI website

- React + TypeScript + Vite setup
- Tailwind CSS + shadcn/ui components  
- GSAP animations and scroll effects
- Hero, Features, Testimonials, Pricing, FAQ sections
- Responsive design with mobile support"

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "✅ Local setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Name it: $REPO_NAME"
echo "   (Don't initialize with README, .gitignore, or license)"
echo ""
echo "3. Then push your code:"
echo "   git push -u origin main"
echo ""
echo "🚀 After pushing, you can set up Claude Code:"
echo "   - Desktop app: /add /path/to/$REPO_NAME"
echo "   - Or: /github $GITHUB_USERNAME/$REPO_NAME"
echo ""
