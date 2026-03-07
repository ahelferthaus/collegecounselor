#!/usr/bin/env python3
"""
Generate comprehensive specification document for College Counselor AI
Outputs a Word document (.docx) with all business and technical specs
"""

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
import datetime

doc = Document()

# ============================================================
# STYLES
# ============================================================
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)
font.color.rgb = RGBColor(0x33, 0x33, 0x33)
paragraph_format = style.paragraph_format
paragraph_format.space_after = Pt(6)
paragraph_format.line_spacing = 1.15

# Helper function for adding styled headings
def add_heading(text, level=1):
    h = doc.add_heading(text, level=level)
    for run in h.runs:
        if level == 1:
            run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)  # Navy
            run.font.size = Pt(22)
        elif level == 2:
            run.font.color.rgb = RGBColor(0x7F, 0x56, 0xD9)  # Purple
            run.font.size = Pt(16)
        elif level == 3:
            run.font.color.rgb = RGBColor(0x14, 0xB8, 0xA6)  # Teal
            run.font.size = Pt(13)
    return h

def add_table(headers, rows, col_widths=None):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Light Grid Accent 1'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header row
    hdr_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        hdr_cells[i].text = header
        for p in hdr_cells[i].paragraphs:
            for run in p.runs:
                run.font.bold = True
                run.font.size = Pt(10)
    # Data rows
    for r_idx, row in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, cell_text in enumerate(row):
            row_cells[c_idx].text = str(cell_text)
            for p in row_cells[c_idx].paragraphs:
                for run in p.runs:
                    run.font.size = Pt(10)
    doc.add_paragraph()  # spacing
    return table

def add_bullet(text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    if bold_prefix:
        run = p.add_run(bold_prefix)
        run.bold = True
        p.add_run(f" {text}")
    else:
        p.add_run(text)
    return p

# ============================================================
# TITLE PAGE
# ============================================================
doc.add_paragraph()
doc.add_paragraph()
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('COLLEGE COUNSELOR AI')
run.font.size = Pt(36)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)

subtitle = doc.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = subtitle.add_run('Comprehensive Business & Technical Specification')
run.font.size = Pt(18)
run.font.color.rgb = RGBColor(0x7F, 0x56, 0xD9)

doc.add_paragraph()
meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
meta.add_run(f'Version 1.0  |  {datetime.date.today().strftime("%B %d, %Y")}').font.size = Pt(12)

doc.add_paragraph()
meta2 = doc.add_paragraph()
meta2.alignment = WD_ALIGN_PARAGRAPH.CENTER
meta2.add_run('Prepared for: Adrian Helferthaus / dReAm Team').font.size = Pt(12)

doc.add_paragraph()
meta3 = doc.add_paragraph()
meta3.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = meta3.add_run('CONFIDENTIAL')
run.font.size = Pt(14)
run.font.bold = True
run.font.color.rgb = RGBColor(0xCC, 0x00, 0x00)

doc.add_page_break()

# ============================================================
# TABLE OF CONTENTS (Manual)
# ============================================================
add_heading('Table of Contents', level=1)
toc_items = [
    "PART I: BUSINESS-FOCUSED SPECIFICATIONS",
    "  1. Executive Summary",
    "  2. Business Requirements Document (BRD)",
    "  3. Functional Requirements Document (FRD)",
    "  4. User Stories",
    "PART II: TECHNICAL SPECIFICATIONS",
    "  5. Technical Requirements Document (TRD)",
    "  6. System Architecture Document",
    "  7. Functional Specification Document (FSD)",
    "  8. API Documentation Plan",
    "PART III: COMPETITIVE & MARKET ANALYSIS",
    "  9. Competitive Landscape",
    "  10. Market Sizing & Opportunity",
    "PART IV: REVENUE MODELS & FINANCIAL ANALYSIS",
    "  11. Revenue Model Analysis (3 Models + Recommended)",
    "  12. Cost Structure & Unit Economics",
    "PART V: GAP ANALYSIS & PROJECT PLAN",
    "  13. Current State vs. Production Gap Analysis",
    "  14. Production Project Plan & Roadmap",
    "  15. Customer Demo Strategy",
    "APPENDICES",
    "  A. Current Codebase Inventory",
    "  B. Competitor Feature Matrix",
    "  C. Risk Register",
]
for item in toc_items:
    p = doc.add_paragraph(item)
    p.paragraph_format.space_after = Pt(2)
    for run in p.runs:
        run.font.size = Pt(11)
        if not item.startswith("  "):
            run.font.bold = True

doc.add_page_break()

# ============================================================
# PART I: BUSINESS-FOCUSED SPECIFICATIONS
# ============================================================
p = doc.add_paragraph()
run = p.add_run('PART I: BUSINESS-FOCUSED SPECIFICATIONS')
run.font.size = Pt(24)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# --- 1. EXECUTIVE SUMMARY ---
add_heading('1. Executive Summary', level=1)

doc.add_paragraph(
    'College Counselor AI is an AI-powered college admissions guidance platform that provides '
    'personalized, always-available counseling to students navigating the college application process. '
    'The platform combines large language model (LLM) technology with structured admissions data to deliver '
    'individualized advice on college selection, essay writing, application tracking, financial aid, '
    'interview preparation, and mental wellness support.'
)

doc.add_paragraph(
    'The US college admissions counseling market is valued at $2-4 billion, with school-based counseling '
    'software growing at 15-20% CAGR. The average public school counselor-to-student ratio is 400:1, '
    'far exceeding the recommended 250:1. This structural deficit creates massive demand for scalable, '
    'affordable guidance solutions. Meanwhile, private college counselors charge $3,000-$50,000+ per student, '
    'making quality guidance inaccessible to the majority of families.'
)

doc.add_paragraph(
    'College Counselor AI fills this gap by offering enterprise-grade AI counseling at consumer-friendly '
    'prices ($0-$49/month), making expert-level college guidance accessible to every student regardless '
    'of socioeconomic background. The platform is particularly focused on underserved populations including '
    'first-generation college students and families navigating financial aid for the first time.'
)

add_heading('Current State', level=3)
doc.add_paragraph(
    'The project currently consists of a fully-designed, animated marketing landing page built with '
    'React 19, TypeScript, Vite 7, Tailwind CSS, shadcn/ui, and GSAP animations. The landing page '
    'showcases the product vision, pricing model, feature set, testimonials, and FAQ. However, no '
    'backend, authentication, AI integration, database, or functional application features exist yet. '
    'All CTA buttons, forms, and interactive elements are non-functional beyond visual presentation.'
)

add_heading('Deployment Status', level=3)
add_bullet('GitHub Repository: github.com/ahelferthaus/collegecounselor')
add_bullet('GitHub Pages: ahelferthaus.github.io/collegecounselor/ (via GitHub Actions CI/CD)')
add_bullet('Vercel: collegecounselor.vercel.app (auto-deploy from main branch)')
add_bullet('Root directory for build: /app subfolder')

doc.add_page_break()

# --- 2. BRD ---
add_heading('2. Business Requirements Document (BRD)', level=1)

add_heading('2.1 Business Objectives', level=2)
doc.add_paragraph('The following are the core business objectives that College Counselor AI must achieve:')

objectives = [
    ("BO-1: Democratize College Counseling",
     "Make high-quality, personalized college admissions guidance accessible to every student, "
     "regardless of income, geography, or school resources. Target: serve 10,000+ students in Year 1."),
    ("BO-2: Achieve Product-Market Fit",
     "Validate that students and families will pay $29-$49/month for AI-powered college counseling "
     "by achieving >5% free-to-paid conversion rate and <8% monthly churn within 6 months of launch."),
    ("BO-3: Build a Sustainable Revenue Engine",
     "Reach $50K MRR within 12 months of paid launch through a combination of B2C subscriptions "
     "and B2B school/club partnerships."),
    ("BO-4: Establish Trust and Credibility",
     "Build brand recognition in the college counseling space through measurable student outcomes, "
     "counselor endorsements, and verified testimonials from accepted students."),
    ("BO-5: Create a Data Moat",
     "Accumulate proprietary admissions outcome data over time that improves AI recommendations "
     "and creates a defensible competitive advantage against AI wrappers."),
]

for title_text, desc in objectives:
    add_bullet(desc, bold_prefix=title_text)

add_heading('2.2 Problems Being Solved', level=2)

problems = [
    ("The Counselor Gap:",
     "Public school counselors are overwhelmed (400:1 ratio). Most students get less than "
     "20 minutes of college counseling per year. Students in underfunded schools may get none."),
    ("The Affordability Crisis:",
     "Private counselors cost $3,000-$50,000+. Wealthy families have a massive advantage. "
     "Free tools exist but lack personalization and depth."),
    ("Information Overload:",
     "4,000+ colleges, dozens of application platforms, complex financial aid forms (FAFSA, CSS Profile), "
     "and ever-changing requirements create paralysis and stress."),
    ("The Essay Challenge:",
     "Students struggle to find their authentic voice. Generic AI tools either write for them (academic "
     "dishonesty risk) or provide shallow feedback. No tool strikes the right balance."),
    ("First-Generation Blind Spots:",
     "First-gen students and their families lack the vocabulary, cultural knowledge, and process "
     "understanding that make college applications navigable. Most platforms assume baseline knowledge."),
    ("The Mental Health Crisis:",
     "College admissions is the #1 source of stress for high school juniors and seniors. No platform "
     "meaningfully addresses this beyond token acknowledgment."),
    ("Athletic Recruiting Fragmentation:",
     "Student-athletes must manage academic applications AND athletic recruiting on completely separate "
     "platforms, creating confusion and missed opportunities."),
    ("Campus Visit Inequity:",
     "In-person campus visits are a critical factor in college selection, but many students cannot afford "
     "to travel. Virtual tours exist at many colleges but are scattered across individual college websites "
     "with no centralized, curated directory. No platform aggregates virtual tours alongside college data "
     "and personalized recommendations."),
]

for title_text, desc in problems:
    add_bullet(desc, bold_prefix=title_text)

add_heading('2.3 Desired Outcomes', level=2)

add_table(
    ['Outcome', 'Metric', 'Target', 'Timeline'],
    [
        ['Student engagement', 'Weekly active users', '5,000+', '6 months post-launch'],
        ['Conversion rate', 'Free to paid', '>5%', '6 months post-launch'],
        ['Retention', 'Monthly churn rate', '<8%', 'Ongoing'],
        ['Revenue', 'Monthly Recurring Revenue', '$50K MRR', '12 months post-launch'],
        ['Outcomes', '% students accepted to top 3 choices', '>80%', '18 months post-launch'],
        ['NPS Score', 'Net Promoter Score', '>50', 'Ongoing'],
        ['Essay satisfaction', 'Users rating essay help 4+/5', '>85%', 'Ongoing'],
        ['First-gen success', 'First-gen student completion rate', '>70%', '18 months post-launch'],
    ]
)

add_heading('2.4 Stakeholders', level=2)

add_table(
    ['Stakeholder', 'Role', 'Primary Interest'],
    [
        ['High School Students (Grades 9-12)', 'Primary User', 'Personalized guidance, essay help, stress reduction'],
        ['Parents/Guardians', 'Secondary User / Buyer', 'Visibility into progress, financial aid help, peace of mind'],
        ['School Counselors', 'Channel Partner', 'Tools to augment their capacity, student outcome tracking'],
        ['Club/Team Coaches', 'Channel Partner', 'Athletic recruiting support, team-wide college prep'],
        ['High Schools / Districts', 'B2B Customer', 'Affordable counseling at scale, outcome reporting'],
        ['Clubs/Athletic Organizations', 'B2B Customer', 'Value-add for members, recruiting pipeline'],
        ['College Admissions Officers', 'Ecosystem Partner', 'Better-prepared applicants, authentic essays'],
        ['Investors/Founders', 'Business Owner', 'Revenue growth, market share, sustainable unit economics'],
    ]
)

add_heading('2.5 Scope', level=2)

add_heading('In Scope (Phase 1 - MVP)', level=3)
in_scope = [
    'AI conversational college counselor (chat interface with context memory)',
    'Student profile creation and management',
    'College search and discovery with personalized recommendations',
    'Essay brainstorming, drafting guidance, and AI-powered feedback',
    'Application deadline tracking and reminders',
    'Basic financial aid guidance (FAFSA walkthrough, scholarship matching)',
    'Interview preparation practice sessions',
    'User authentication and account management',
    'Stripe payment integration (Free, Pro $29/mo, Family $49/mo)',
    'Parent dashboard (Family plan)',
    'Mobile-responsive web application',
    'Email notifications and reminders',
    'Virtual campus tour integration (embedded/linked tours from partner colleges)',
]
for item in in_scope:
    add_bullet(item)

add_heading('In Scope (Phase 2 - Growth)', level=3)
phase2 = [
    'School/district B2B licensing portal',
    'Club/team group management and recruiting tools',
    'Athletic recruiting profile builder and highlight reel integration',
    'College visit planner with itinerary builder',
    'Community features (peer forums, alumni mentors)',
    'Advanced analytics and admissions probability scoring',
    'Native mobile apps (iOS and Android via React Native)',
    'Integration with Common App and Coalition App',
    'SMS/text-based nudging and reminders',
]
for item in phase2:
    add_bullet(item)

add_heading('Out of Scope (Deferred)', level=3)
out_of_scope = [
    'Direct submission of college applications (users submit through official portals)',
    'Standardized test prep (SAT/ACT)',
    'Academic tutoring beyond college admissions',
    'College course registration or enrollment',
    'International admissions (Phase 3+)',
]
for item in out_of_scope:
    add_bullet(item)

doc.add_page_break()

# --- 3. FRD ---
add_heading('3. Functional Requirements Document (FRD)', level=1)

doc.add_paragraph(
    'This section defines what the system must do. Each functional requirement is categorized, '
    'prioritized (P1=Must Have, P2=Should Have, P3=Nice to Have), and tied to a business objective.'
)

add_heading('3.1 Authentication & User Management', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-100', 'Users can sign up with email/password or OAuth (Google, Apple)', 'P1', 'BO-1'],
        ['FR-101', 'Users can log in and maintain persistent sessions', 'P1', 'BO-1'],
        ['FR-102', 'Users can reset their password via email', 'P1', 'BO-1'],
        ['FR-103', 'Users have role-based access (Student, Parent, Counselor, Admin)', 'P1', 'BO-3'],
        ['FR-104', 'Parent accounts can link to 1-3 student profiles (Family plan)', 'P1', 'BO-3'],
        ['FR-105', 'Email verification required before full account access', 'P1', 'BO-4'],
        ['FR-106', 'Users can delete their account and all data (GDPR/CCPA compliance)', 'P2', 'BO-4'],
    ]
)

add_heading('3.2 Student Profile', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-200', 'Students can create a comprehensive profile (GPA, test scores, extracurriculars, interests, demographics)', 'P1', 'BO-1'],
        ['FR-201', 'Profile data is used to personalize all AI recommendations', 'P1', 'BO-1'],
        ['FR-202', 'Students can upload transcripts and documents', 'P2', 'BO-1'],
        ['FR-203', 'Profile includes college preferences (size, location, major, culture)', 'P1', 'BO-1'],
        ['FR-204', 'Students can indicate first-generation status for tailored guidance', 'P1', 'BO-1'],
        ['FR-205', 'Profile tracks application status for each school (researching, applying, submitted, accepted, rejected, enrolled)', 'P1', 'BO-2'],
        ['FR-206', 'Students can build an activities resume / extracurricular portfolio', 'P2', 'BO-1'],
    ]
)

add_heading('3.3 AI Counselor Chat', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-300', 'Users can have natural language conversations with the AI counselor', 'P1', 'BO-1'],
        ['FR-301', 'AI maintains conversation memory within a session', 'P1', 'BO-1'],
        ['FR-302', 'AI has access to student profile data for personalized responses', 'P1', 'BO-1'],
        ['FR-303', 'AI can provide college recommendations based on student profile', 'P1', 'BO-1'],
        ['FR-304', 'AI can help brainstorm essay topics and provide feedback on drafts', 'P1', 'BO-2'],
        ['FR-305', 'AI guides users through FAFSA and financial aid processes', 'P1', 'BO-1'],
        ['FR-306', 'AI provides interview practice with simulated Q&A', 'P2', 'BO-2'],
        ['FR-307', 'AI detects stress/anxiety signals and offers supportive responses', 'P2', 'BO-1'],
        ['FR-308', 'Conversation history is saved and accessible across sessions', 'P1', 'BO-2'],
        ['FR-309', 'AI never writes essays for students; it guides and provides feedback only', 'P1', 'BO-4'],
        ['FR-310', 'Free tier: 20 AI messages/day. Pro: unlimited. Family: unlimited for all profiles', 'P1', 'BO-3'],
        ['FR-311', 'AI provides plain-language explanations for first-gen students (no jargon mode)', 'P2', 'BO-1'],
    ]
)

add_heading('3.4 College Search & Discovery', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-400', 'Users can search colleges by name, location, major, size, selectivity, cost', 'P1', 'BO-1'],
        ['FR-401', 'System provides personalized "best fit" college recommendations', 'P1', 'BO-1'],
        ['FR-402', 'Users can save colleges to a favorites/watchlist', 'P1', 'BO-2'],
        ['FR-403', 'College profiles display key stats (acceptance rate, avg GPA, cost, popular majors)', 'P1', 'BO-1'],
        ['FR-404', 'Side-by-side college comparison tool (up to 4 schools)', 'P2', 'BO-2'],
        ['FR-405', 'Financial fit calculator (estimated net price based on family income)', 'P2', 'BO-1'],
        ['FR-406', 'Virtual campus tour integration - embed/link college-provided virtual tours for students who cannot travel for in-person visits', 'P1', 'BO-1'],
        ['FR-407', 'Virtual tour directory with search by college, region, and tour type (video, 360, interactive)', 'P2', 'BO-1'],
        ['FR-408', 'AI can recommend virtual tours based on student college list and suggest touring order', 'P2', 'BO-2'],
    ]
)

add_heading('3.5 Application Tracking & Deadlines', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-500', 'Dashboard showing all applications with status indicators', 'P1', 'BO-2'],
        ['FR-501', 'Automated deadline reminders via email and in-app notifications', 'P1', 'BO-2'],
        ['FR-502', 'Checklist for each application (essays, supplements, recommendations, transcripts)', 'P1', 'BO-2'],
        ['FR-503', 'Calendar view of all upcoming deadlines', 'P2', 'BO-2'],
        ['FR-504', 'Decision tracking (accepted, waitlisted, rejected) with outcome analytics', 'P2', 'BO-5'],
    ]
)

add_heading('3.6 Essay Support', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-600', 'In-app essay editor with rich text formatting', 'P1', 'BO-2'],
        ['FR-601', 'AI-powered essay feedback (structure, voice, clarity, impact)', 'P1', 'BO-2'],
        ['FR-602', 'Essay prompt library with school-specific requirements', 'P1', 'BO-1'],
        ['FR-603', 'Version history for essay drafts', 'P2', 'BO-2'],
        ['FR-604', 'Word count tracker with per-school limits', 'P1', 'BO-2'],
        ['FR-605', 'Free tier: 5 essay reviews/month. Pro/Family: unlimited', 'P1', 'BO-3'],
    ]
)

add_heading('3.7 Financial Aid & Scholarships', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-700', 'Step-by-step FAFSA completion guide', 'P1', 'BO-1'],
        ['FR-701', 'Scholarship search and matching based on student profile', 'P1', 'BO-1'],
        ['FR-702', 'Financial aid package comparison tool', 'P2', 'BO-2'],
        ['FR-703', 'Scholarship application tracker with deadlines', 'P2', 'BO-2'],
        ['FR-704', 'Net price calculator for saved colleges', 'P2', 'BO-1'],
    ]
)

add_heading('3.8 Payments & Subscriptions', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-800', 'Stripe integration for subscription billing', 'P1', 'BO-3'],
        ['FR-801', 'Three pricing tiers: Starter (Free), Pro ($29/mo), Family ($49/mo)', 'P1', 'BO-3'],
        ['FR-802', 'Annual billing option with 20% discount', 'P1', 'BO-3'],
        ['FR-803', 'Subscription management (upgrade, downgrade, cancel)', 'P1', 'BO-3'],
        ['FR-804', '7-day free trial for Pro and Family plans', 'P2', 'BO-3'],
        ['FR-805', 'No credit card required for Starter plan', 'P1', 'BO-2'],
    ]
)

add_heading('3.9 Parent Dashboard (Family Plan)', level=2)

add_table(
    ['ID', 'Requirement', 'Priority', 'Business Obj.'],
    [
        ['FR-900', 'Parents can view linked student progress and timelines', 'P1', 'BO-3'],
        ['FR-901', 'Parents see upcoming deadlines across all linked students', 'P1', 'BO-3'],
        ['FR-902', 'Parents can access financial aid resources and guides', 'P2', 'BO-1'],
        ['FR-903', 'Parents receive weekly email digest of student activity', 'P2', 'BO-3'],
    ]
)

doc.add_page_break()

# --- 4. USER STORIES ---
add_heading('4. User Stories', level=1)

doc.add_paragraph(
    'The following user stories are written in Agile format and organized by user persona. '
    'Each includes acceptance criteria and estimated story points (1-13 Fibonacci scale).'
)

add_heading('4.1 Student Stories', level=2)

student_stories = [
    ("US-001", "As a student, I want to create a profile with my academic info so that the AI can give me personalized advice.",
     "Student can enter GPA, test scores, extracurriculars, interests; profile persists across sessions; AI references profile data in conversations", "5"),
    ("US-002", "As a student, I want to chat with an AI counselor so that I can get instant answers to my college questions at any time.",
     "Chat interface loads in <2s; AI responds in <5s; conversation feels natural and personalized; chat history saved", "13"),
    ("US-003", "As a student, I want to get personalized college recommendations so that I can discover schools that fit my profile.",
     "System suggests 10+ schools based on profile; includes safety/match/reach categories; user can save favorites", "8"),
    ("US-004", "As a student, I want help brainstorming and refining my essays so that I can write compelling applications.",
     "AI suggests essay topics; provides structured feedback on drafts; never writes content for user; tracks word count", "13"),
    ("US-005", "As a student, I want to track all my application deadlines so that I never miss a submission date.",
     "Dashboard shows all deadlines; email reminders 7d, 3d, 1d before; checklist per application", "5"),
    ("US-006", "As a student, I want help understanding financial aid so that my family can afford college.",
     "Step-by-step FAFSA guide; scholarship matching; net price estimates per school", "8"),
    ("US-007", "As a student, I want to practice for interviews so that I feel confident on the day.",
     "AI simulates interviewer; provides feedback on responses; covers common question types", "8"),
    ("US-008", "As a first-gen student, I want plain-language explanations so that I understand the process without feeling overwhelmed.",
     "No-jargon mode toggle; tooltips for complex terms; guided walkthroughs for each major step", "5"),
    ("US-009", "As a student-athlete, I want to manage my athletic recruiting alongside academics so that I don't miss opportunities.",
     "Athletic profile section; recruiting timeline; coach communication tracking; NCAA eligibility checklist", "13"),
    ("US-010", "As a student, I want mental health support during the process so that I stay healthy and motivated.",
     "AI detects stress language; offers encouragement; provides breathing exercises; suggests breaks", "5"),
    ("US-011", "As a student who cannot afford to travel for campus visits, I want to take virtual tours of colleges so that I can still experience campuses before deciding.",
     "Virtual tour page per college; embedded 360/video tours from partner colleges; AI recommends tours based on college list; tour notes/impressions saved to profile", "5"),
]

for sid, story, criteria, points in student_stories:
    p = doc.add_paragraph()
    run = p.add_run(f'{sid}: ')
    run.bold = True
    p.add_run(story)
    p2 = doc.add_paragraph(f'   Acceptance Criteria: {criteria}')
    p2.paragraph_format.space_after = Pt(2)
    for r in p2.runs:
        r.font.size = Pt(10)
        r.font.italic = True
    p3 = doc.add_paragraph(f'   Story Points: {points}')
    p3.paragraph_format.space_after = Pt(8)
    for r in p3.runs:
        r.font.size = Pt(10)

add_heading('4.2 Parent Stories', level=2)

parent_stories = [
    ("US-101", "As a parent, I want to see my child's application progress so that I can support them without micromanaging.",
     "Parent dashboard with read-only view; progress indicators per school; deadline visibility", "5"),
    ("US-102", "As a parent, I want to understand financial aid options so that I can make informed decisions.",
     "Financial aid guide for parents; EFC calculator; aid package comparison tools", "5"),
    ("US-103", "As a parent, I want weekly updates so that I stay informed without constantly checking the app.",
     "Weekly email digest; configurable notification preferences; summary of key milestones", "3"),
]

for sid, story, criteria, points in parent_stories:
    p = doc.add_paragraph()
    run = p.add_run(f'{sid}: ')
    run.bold = True
    p.add_run(story)
    p2 = doc.add_paragraph(f'   Acceptance Criteria: {criteria}')
    p2.paragraph_format.space_after = Pt(2)
    for r in p2.runs:
        r.font.size = Pt(10)
        r.font.italic = True
    p3 = doc.add_paragraph(f'   Story Points: {points}')
    p3.paragraph_format.space_after = Pt(8)
    for r in p3.runs:
        r.font.size = Pt(10)

add_heading('4.3 School/Club Admin Stories', level=2)

admin_stories = [
    ("US-201", "As a school counselor, I want a dashboard showing all my students' progress so that I can intervene when students fall behind.",
     "Admin dashboard with student list; filterable by status; alerts for missed deadlines", "8"),
    ("US-202", "As a club director, I want to provide college counseling as a member benefit so that families see more value in our organization.",
     "Club admin portal; bulk student invitation; group analytics; branded experience", "8"),
    ("US-203", "As a school admin, I want outcome reporting so that I can demonstrate ROI to my district.",
     "Exportable reports; acceptance rates; scholarship dollars tracked; before/after comparisons", "5"),
]

for sid, story, criteria, points in admin_stories:
    p = doc.add_paragraph()
    run = p.add_run(f'{sid}: ')
    run.bold = True
    p.add_run(story)
    p2 = doc.add_paragraph(f'   Acceptance Criteria: {criteria}')
    p2.paragraph_format.space_after = Pt(2)
    for r in p2.runs:
        r.font.size = Pt(10)
        r.font.italic = True
    p3 = doc.add_paragraph(f'   Story Points: {points}')
    p3.paragraph_format.space_after = Pt(8)
    for r in p3.runs:
        r.font.size = Pt(10)

doc.add_page_break()

# ============================================================
# PART II: TECHNICAL SPECIFICATIONS
# ============================================================
p = doc.add_paragraph()
run = p.add_run('PART II: TECHNICAL SPECIFICATIONS')
run.font.size = Pt(24)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# --- 5. TRD ---
add_heading('5. Technical Requirements Document (TRD)', level=1)

add_heading('5.1 Current Technology Stack', level=2)

add_table(
    ['Layer', 'Technology', 'Version', 'Purpose'],
    [
        ['Frontend Framework', 'React', '19.2', 'Component-based UI'],
        ['Language', 'TypeScript', '5.9', 'Type-safe JavaScript'],
        ['Build Tool', 'Vite', '7.x', 'Fast dev server + optimized builds'],
        ['Styling', 'Tailwind CSS', '3.4', 'Utility-first CSS framework'],
        ['UI Components', 'shadcn/ui + Radix UI', 'Latest', '50+ accessible components'],
        ['Animations', 'GSAP 3 + ScrollTrigger', '3.14', 'Professional scroll animations'],
        ['Icons', 'Lucide React', '0.562', 'SVG icon library'],
        ['Forms', 'React Hook Form + Zod', 'Latest', 'Form management + validation'],
        ['Hosting (Primary)', 'Vercel', 'N/A', 'CDN + serverless deployment'],
        ['Hosting (Secondary)', 'GitHub Pages', 'N/A', 'Static site backup via Actions'],
        ['Version Control', 'Git + GitHub', 'N/A', 'Source code management'],
    ]
)

add_heading('5.2 Required Technology Additions for Production', level=2)

add_table(
    ['Layer', 'Recommended Technology', 'Alternative', 'Purpose'],
    [
        ['Backend / BaaS', 'Supabase', 'Firebase, AWS Amplify', 'Auth, database, real-time, storage'],
        ['Database', 'PostgreSQL (via Supabase)', 'PlanetScale (MySQL)', 'Relational data storage'],
        ['AI / LLM', 'Anthropic Claude API', 'OpenAI GPT-4o, both', 'Conversational AI counselor'],
        ['AI Orchestration', 'LangChain or Vercel AI SDK', 'LlamaIndex', 'Context management, RAG, streaming'],
        ['Vector Database', 'Supabase pgvector or Pinecone', 'Weaviate, Qdrant', 'Semantic search for college data'],
        ['Payments', 'Stripe', 'N/A', 'Subscriptions and billing'],
        ['Email', 'Resend or SendGrid', 'AWS SES', 'Transactional + marketing emails'],
        ['File Storage', 'Supabase Storage or S3', 'Cloudflare R2', 'Transcripts, essays, documents'],
        ['Caching', 'Redis (Upstash)', 'Vercel KV', 'Session cache, AI response cache'],
        ['Search', 'Algolia or Meilisearch', 'Elasticsearch', 'College search with faceted filtering'],
        ['Monitoring', 'Sentry + PostHog', 'Datadog, Mixpanel', 'Error tracking + product analytics'],
        ['CI/CD', 'GitHub Actions + Vercel', 'Already configured', 'Automated testing and deployment'],
        ['Mobile (Phase 2)', 'React Native or Expo', 'PWA', 'Native mobile apps'],
    ]
)

add_heading('5.3 Non-Functional Requirements', level=2)

add_table(
    ['ID', 'Requirement', 'Target', 'Notes'],
    [
        ['NFR-01', 'Page load time (LCP)', '<2.5 seconds', 'Core Web Vitals compliant'],
        ['NFR-02', 'AI response latency', '<5 seconds for first token', 'Streaming responses preferred'],
        ['NFR-03', 'Uptime', '99.9%', 'SLA for paid users'],
        ['NFR-04', 'Concurrent users', '1,000+', 'At launch; scale to 10,000+'],
        ['NFR-05', 'Data encryption', 'AES-256 at rest, TLS 1.3 in transit', 'FERPA compliance consideration'],
        ['NFR-06', 'Data residency', 'US-based servers', 'Student data protection'],
        ['NFR-07', 'Accessibility', 'WCAG 2.1 AA compliance', 'Inclusive design'],
        ['NFR-08', 'Browser support', 'Chrome, Firefox, Safari, Edge (last 2 versions)', 'Mobile-first responsive'],
        ['NFR-09', 'Backup frequency', 'Continuous (database), daily (full)', 'Point-in-time recovery'],
        ['NFR-10', 'GDPR/CCPA compliance', 'Full compliance', 'Data export, deletion rights'],
    ]
)

doc.add_page_break()

# --- 6. SYSTEM ARCHITECTURE ---
add_heading('6. System Architecture Document', level=1)

add_heading('6.1 High-Level Architecture', level=2)

doc.add_paragraph(
    'The system follows a modern JAMstack + BaaS architecture with AI integration:'
)

doc.add_paragraph(
    'CLIENT TIER (Browser/Mobile)\n'
    '  React 19 SPA + Tailwind CSS + shadcn/ui\n'
    '  Deployed to Vercel Edge Network (CDN)\n'
    '  Communicates via HTTPS REST/WebSocket to API tier\n'
    '\n'
    'API TIER (Serverless + BaaS)\n'
    '  Supabase (Auth, PostgreSQL, Realtime, Storage)\n'
    '  Vercel Serverless Functions (AI orchestration, Stripe webhooks)\n'
    '  Stripe API (payments and subscriptions)\n'
    '  Resend API (email delivery)\n'
    '\n'
    'AI TIER\n'
    '  Anthropic Claude API or OpenAI GPT-4o (primary LLM)\n'
    '  Vercel AI SDK (streaming, context management)\n'
    '  pgvector (Supabase) for semantic college data retrieval (RAG)\n'
    '  Redis/Upstash for conversation session caching\n'
    '\n'
    'DATA TIER\n'
    '  PostgreSQL (Supabase) - User profiles, applications, essays, conversations\n'
    '  Vector store (pgvector) - College database, scholarship data, admissions data\n'
    '  Object storage (S3/Supabase Storage) - Documents, transcripts, uploads\n'
    '  Redis (Upstash) - Session cache, rate limiting, AI response cache'
)

add_heading('6.2 Data Model (Core Entities)', level=2)

add_table(
    ['Entity', 'Key Fields', 'Relationships'],
    [
        ['User', 'id, email, role, plan_tier, stripe_customer_id', 'Has many: StudentProfiles, Conversations'],
        ['StudentProfile', 'id, user_id, gpa, test_scores, interests, grade_level, first_gen', 'Belongs to: User. Has many: Applications, Essays'],
        ['Application', 'id, student_id, college_id, status, deadline, checklist', 'Belongs to: StudentProfile, College'],
        ['College', 'id, name, location, acceptance_rate, cost, majors, size', 'Has many: Applications'],
        ['Essay', 'id, student_id, college_id, prompt, content, version, ai_feedback', 'Belongs to: StudentProfile. Has many: EssayVersions'],
        ['Conversation', 'id, user_id, messages[], created_at, context', 'Belongs to: User'],
        ['Scholarship', 'id, name, amount, criteria, deadline, url', 'Many-to-many: StudentProfile'],
        ['Subscription', 'id, user_id, stripe_sub_id, plan, status, period_end', 'Belongs to: User'],
        ['ParentLink', 'id, parent_user_id, student_profile_id, permissions', 'Links Parent User to StudentProfile'],
    ]
)

add_heading('6.3 Security Architecture', level=2)

security_items = [
    'Authentication via Supabase Auth (JWT-based, supports OAuth 2.0)',
    'Row Level Security (RLS) on all database tables - users can only access their own data',
    'API rate limiting via Redis (prevents abuse of AI endpoints)',
    'Stripe webhooks verified via signature validation',
    'CORS restricted to application domains only',
    'Environment variables for all secrets (never committed to git)',
    'FERPA compliance considerations for student educational records',
    'Content Security Policy (CSP) headers on all pages',
    'Input sanitization on all user-generated content',
    'AI prompt injection protection (system prompts not editable by users)',
]
for item in security_items:
    add_bullet(item)

doc.add_page_break()

# --- 7. FSD ---
add_heading('7. Functional Specification Document (FSD)', level=1)

add_heading('7.1 AI Counselor Chat - Detailed Logic Flow', level=2)

doc.add_paragraph(
    'The AI Counselor Chat is the core product experience. Here is the detailed logic flow:'
)

steps = [
    '1. User opens chat interface. System checks plan tier and daily message count.',
    '2. If message limit reached (Free: 20/day), show upgrade prompt.',
    '3. User types message. Client sends to /api/chat endpoint with session_id.',
    '4. Server retrieves: (a) student profile data, (b) conversation history (last 20 messages), (c) current applications/deadlines.',
    '5. System constructs AI prompt: system prompt (counselor persona) + student context + conversation history + user message.',
    '6. If query relates to specific colleges, perform RAG lookup against vector store for relevant college data.',
    '7. Stream AI response back to client via Server-Sent Events (SSE).',
    '8. Save complete exchange (user message + AI response) to conversation history.',
    '9. If AI detects actionable items (e.g., "add Stanford to my list"), present action buttons in UI.',
    '10. Log interaction for analytics (topic, duration, satisfaction).',
]
for step in steps:
    doc.add_paragraph(step)

add_heading('7.2 Essay Feedback Flow', level=2)

essay_steps = [
    '1. Student navigates to Essay Editor. Selects college and prompt from library (or enters custom).',
    '2. Student writes/pastes essay content in rich text editor.',
    '3. Student clicks "Get AI Feedback." System checks essay review quota (Free: 5/mo, Pro: unlimited).',
    '4. System sends essay + prompt + student profile to AI with specialized essay feedback prompt.',
    '5. AI returns structured feedback: (a) Overall impression, (b) Structure analysis, (c) Voice/authenticity, (d) Specific suggestions, (e) Strengths to amplify.',
    '6. Feedback displayed inline with highlighting. Student can ask follow-up questions in chat.',
    '7. Essay version saved automatically. Student can view version history and compare drafts.',
    '8. Word count displayed in real-time with target for selected school.',
]
for step in essay_steps:
    doc.add_paragraph(step)

add_heading('7.3 UI/UX Specifications', level=2)

doc.add_paragraph(
    'Design System (carried forward from landing page):\n'
    '- Primary: Purple (#7F56D9) + Teal (#14B8A6) gradient\n'
    '- Text: Navy (#1E2B4F) for headings, Gray-600 for body\n'
    '- Fonts: Poppins (headings), Inter (body)\n'
    '- Spacing: 8px grid system\n'
    '- Border Radius: 12px (buttons), 16px (cards), 24px (modals)\n'
    '- Shadows: Consistent shadow-sm through shadow-xl scale\n'
    '- Dark Mode: Planned for Phase 2 (class-based, next-themes ready)'
)

doc.add_paragraph(
    'Key Screen Inventory:\n'
    '1. Landing Page (existing, needs backend connection)\n'
    '2. Auth Pages (Sign Up, Sign In, Forgot Password)\n'
    '3. Onboarding Flow (Profile creation wizard, 4 steps)\n'
    '4. Student Dashboard (Applications overview, deadlines, quick actions)\n'
    '5. AI Chat (Full-screen conversational interface)\n'
    '6. College Search (Filtered search with cards/list view)\n'
    '7. College Detail (Stats, fit score, save/apply actions)\n'
    '8. Essay Editor (Rich text + AI feedback panel)\n'
    '9. Application Tracker (Kanban or list view by status)\n'
    '10. Financial Aid Hub (FAFSA guide, scholarship search, aid comparison)\n'
    '11. Parent Dashboard (Read-only progress view)\n'
    '12. Settings (Profile, Subscription, Notifications, Privacy)\n'
    '13. Pricing/Upgrade (Connected to Stripe checkout)'
)

doc.add_page_break()

# --- 8. API DOCUMENTATION PLAN ---
add_heading('8. API Documentation Plan', level=1)

doc.add_paragraph(
    'The following API endpoints will be needed for the production application. '
    'All endpoints use HTTPS, return JSON, and require JWT authentication (except auth routes).'
)

add_table(
    ['Method', 'Endpoint', 'Purpose', 'Auth Required'],
    [
        ['POST', '/api/auth/signup', 'Create new account', 'No'],
        ['POST', '/api/auth/signin', 'Authenticate user', 'No'],
        ['POST', '/api/auth/forgot-password', 'Send password reset email', 'No'],
        ['GET', '/api/profile', 'Get current user profile', 'Yes'],
        ['PUT', '/api/profile', 'Update user profile', 'Yes'],
        ['POST', '/api/chat', 'Send message to AI counselor (streaming SSE)', 'Yes'],
        ['GET', '/api/chat/history', 'Get conversation history', 'Yes'],
        ['GET', '/api/colleges/search', 'Search colleges with filters', 'Yes'],
        ['GET', '/api/colleges/:id', 'Get college details', 'Yes'],
        ['GET', '/api/colleges/recommended', 'Get AI-recommended colleges for user', 'Yes'],
        ['GET', '/api/applications', 'Get all user applications', 'Yes'],
        ['POST', '/api/applications', 'Create new application tracker', 'Yes'],
        ['PUT', '/api/applications/:id', 'Update application status', 'Yes'],
        ['GET', '/api/essays', 'Get all user essays', 'Yes'],
        ['POST', '/api/essays', 'Create new essay', 'Yes'],
        ['PUT', '/api/essays/:id', 'Update essay content', 'Yes'],
        ['POST', '/api/essays/:id/feedback', 'Get AI feedback on essay', 'Yes'],
        ['GET', '/api/scholarships/search', 'Search matching scholarships', 'Yes'],
        ['POST', '/api/subscriptions/create', 'Create Stripe checkout session', 'Yes'],
        ['POST', '/api/webhooks/stripe', 'Handle Stripe events', 'Webhook signature'],
        ['GET', '/api/parent/students', 'Get linked student profiles (parent)', 'Yes (Parent role)'],
        ['GET', '/api/admin/students', 'Get all students (school admin)', 'Yes (Admin role)'],
    ]
)

doc.add_page_break()

# ============================================================
# PART III: COMPETITIVE & MARKET ANALYSIS
# ============================================================
p = doc.add_paragraph()
run = p.add_run('PART III: COMPETITIVE & MARKET ANALYSIS')
run.font.size = Pt(24)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# --- 9. COMPETITIVE LANDSCAPE ---
add_heading('9. Competitive Landscape', level=1)

add_heading('9.1 Direct Competitors', level=2)

add_table(
    ['Platform', 'Model', 'Price', 'AI?', 'Strength', 'Weakness'],
    [
        ['Naviance (PowerSchool)', 'B2B School License', '$8-15/student/yr', 'Limited', 'Market leader, data moat', 'Outdated UX, expensive'],
        ['Scoir', 'B2B School + B2C', '$5-12/student/yr', 'Some', 'Modern UX, visual tools', 'Smaller data set'],
        ['CollegeVine', 'Freemium B2C + Lead Gen', 'Free (Pro paid)', 'Yes', 'Chancing engine, free tier', 'Sells student data to colleges'],
        ['Cialfo', 'B2B School License', 'Custom pricing', 'Some', 'Strong in Asia, global', 'Less US market presence'],
        ['SchooLinks', 'Freemium B2B', 'Free base + premium', 'Limited', 'Free for schools, career focus', 'Newer, less proven'],
        ['Collegewise', 'Premium Human B2C', '$3K-$7K/student', 'No', 'Expert human counselors', 'Not scalable, expensive'],
        ['BridgeU (Kaplan)', 'B2B School License', '$5-12/student/yr', 'Some', 'International/IB focus', 'Limited US market'],
        ['Khanmigo (Khan Academy)', 'Free (Philanthropic)', 'Free', 'Yes (GPT-4)', 'Free, massive brand', 'Limited depth, not specialized'],
    ]
)

add_heading('9.2 Athletic Recruiting Competitors', level=2)

add_table(
    ['Platform', 'Model', 'Price', 'Strength', 'Weakness'],
    [
        ['NCSA', 'Freemium B2C', '$300-$800+/yr premium', 'Largest network, 35K coaches', 'No academic admissions support'],
        ['FieldLevel', 'Free B2C', 'Free', '30+ sports, free model', 'No academic integration'],
        ['SportsRecruits', 'B2B to Clubs', 'Club license', 'Club-focused model', 'No academic counseling'],
        ['CaptainU', 'Freemium B2C', 'Free + premium', 'Video highlights', 'Limited features'],
    ]
)

add_heading('9.3 Competitive Positioning', level=2)

doc.add_paragraph(
    'College Counselor AI occupies a unique position in the market. The critical insight is that NO existing '
    'platform combines AI-powered academic admissions counseling WITH athletic recruiting into a unified experience. '
    'Student-athletes (8 million+ in the US) must currently use separate platforms for academic applications '
    '(Naviance/CollegeVine) and athletic recruiting (NCSA/FieldLevel), creating fragmentation, confusion, and '
    'missed opportunities.'
)

doc.add_paragraph(
    'Key differentiators:\n'
    '1. AI-native from day one (vs. legacy platforms bolting on AI)\n'
    '2. B2C ownership of the student relationship (vs. B2B platforms where schools own the relationship)\n'
    '3. $29/month fills the massive price gap between free tools and $5K+ human counselors\n'
    '4. First-gen and mental wellness focus is underserved by all competitors\n'
    '5. Unified academic + athletic recruiting (if built) would be genuinely unique\n'
    '6. Club/team group model creates viral distribution through existing communities'
)

doc.add_page_break()

# --- 10. MARKET SIZING ---
add_heading('10. Market Sizing & Opportunity', level=1)

add_heading('10.1 Total Addressable Market (TAM)', level=2)

add_table(
    ['Segment', 'Size', 'Notes'],
    [
        ['US high school students', '16.5 million', 'Grades 9-12'],
        ['Annual college applicants', '~4 million/year', 'Applying to 4-year institutions'],
        ['US EdTech market', '$85+ billion', 'And growing at 16% CAGR'],
        ['College counseling sub-market', '$2-4 billion', 'Private counseling + software'],
        ['Student-athletes', '8 million+', 'High school athletes in the US'],
    ]
)

add_heading('10.2 Serviceable Addressable Market (SAM)', level=2)

doc.add_paragraph(
    'Focusing on US-based, English-speaking college-bound students (Grades 10-12) who are '
    'digitally native and price-sensitive (unable to afford $3K+ private counselors): approximately '
    '3 million students per year. At an average revenue per user of $200/year (blended across free and '
    'paid tiers), the SAM is approximately $600 million annually.'
)

add_heading('10.3 Serviceable Obtainable Market (SOM) - Year 1', level=2)

doc.add_paragraph(
    'Realistic Year 1 target: 10,000 registered users with 500-1,000 paid subscribers. '
    'At blended ARPU of $30/month for paid users, this represents $180K-$360K ARR in Year 1, '
    'growing to $1-2M ARR by Year 2 with B2B school/club partnerships.'
)

doc.add_page_break()

# ============================================================
# PART IV: REVENUE MODELS & FINANCIAL ANALYSIS
# ============================================================
p = doc.add_paragraph()
run = p.add_run('PART IV: REVENUE MODELS & FINANCIAL ANALYSIS')
run.font.size = Pt(24)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# --- 11. REVENUE MODELS ---
add_heading('11. Revenue Model Analysis', level=1)

add_heading('11.1 Model A: Club/School-Pays (B2B License)', level=2)

doc.add_paragraph(
    'Description: Schools, clubs, or athletic organizations purchase a group license. '
    'The organization pays a per-student annual fee, and students/parents get access included '
    'in their membership or enrollment.'
)

add_table(
    ['Aspect', 'Details'],
    [
        ['Price Point', '$8-15/student/year (school), $5-10/athlete/year (club)'],
        ['Buyer', 'School administrators, club directors, athletic directors'],
        ['Sales Cycle', '3-9 months (school year budget cycle)'],
        ['Pros', 'Predictable revenue, larger deal sizes, lower churn, institutional credibility'],
        ['Cons', 'Long sales cycle, need sales team, procurement complexity, school budget constraints'],
        ['Revenue Potential (Year 1)', '20 schools x 200 students x $10 = $40K + 50 clubs x 100 athletes x $7 = $35K = $75K'],
        ['Revenue Potential (Year 3)', '200 schools + 500 clubs = $500K-$1M ARR'],
    ]
)

add_heading('11.2 Model B: Parent/Student-Pays (B2C Subscription)', level=2)

doc.add_paragraph(
    'Description: The current pricing model from the landing page. Individual students or families '
    'subscribe directly. Free tier for lead generation, paid tiers for premium features.'
)

add_table(
    ['Aspect', 'Details'],
    [
        ['Price Point', 'Free / $29/mo Pro / $49/mo Family (20% annual discount)'],
        ['Buyer', 'Parents (primary buyer), students (influencer)'],
        ['Sales Cycle', 'Self-serve, minutes to hours'],
        ['Pros', 'Fast to launch, self-serve, no sales team needed, direct customer relationship'],
        ['Cons', 'High CAC for consumer apps, price-sensitive audience, higher churn, hard to convert free users'],
        ['Revenue Potential (Year 1)', '10K free users, 5% convert = 500 paid at avg $35/mo = $210K ARR'],
        ['Revenue Potential (Year 3)', '100K free, 5% convert = 5K paid = $2.1M ARR'],
    ]
)

add_heading('11.3 Model C: Hybrid Club Platform + Parent Upsells', level=2)

doc.add_paragraph(
    'Description: Clubs/schools get a free or low-cost base platform (basic college counseling tools, '
    'deadline tracking). Parents/students can upgrade individually to premium AI features. The club benefits '
    'from offering a value-add to members; the platform monetizes through parent upsells.'
)

add_table(
    ['Aspect', 'Details'],
    [
        ['Price Point', 'Free for clubs (basic). Parents: $19/mo Premium, $39/mo Premium+'],
        ['Buyer', 'Club signs up for free; parents opt into paid upgrades'],
        ['Sales Cycle', 'Club: days (free). Parent: self-serve upsell'],
        ['Pros', 'Viral distribution through clubs, lower friction for both sides, larger potential base'],
        ['Cons', 'Free club tier costs money to serve, relies on parent conversion, complex to build'],
        ['Revenue Potential (Year 1)', '200 clubs x 50 families each, 10% parent upgrade = 1,000 paid at $25/mo avg = $300K ARR'],
        ['Revenue Potential (Year 3)', '2,000 clubs, 15% parent upgrade = 15K paid = $4.5M ARR'],
    ]
)

add_heading('11.4 RECOMMENDED: Hybrid B2B2C Model (Model D)', level=2)

p = doc.add_paragraph()
run = p.add_run('After deep analysis of the competitive landscape, market dynamics, and unit economics, '
    'the recommended revenue model is a Hybrid B2B2C approach that combines the best elements of all three models:')
run.font.italic = True

doc.add_paragraph(
    'The Hybrid B2B2C Model works as follows:\n\n'
    'TIER 1 - FREE CLUB/SCHOOL PLATFORM (Acquisition Engine)\n'
    'Clubs and schools get a free, white-labeled basic platform with:\n'
    '- Student roster management\n'
    '- Basic deadline tracking\n'
    '- Group announcements and updates\n'
    '- Limited AI chat (5 messages/day per student)\n'
    '- College search (basic)\n'
    'This serves as the viral acquisition channel. Clubs promote it as a free member benefit.\n\n'
    'TIER 2 - INDIVIDUAL PREMIUM ($19/month or $190/year)\n'
    'Students/parents upgrade individually for:\n'
    '- Unlimited AI counselor chat\n'
    '- Essay editor with AI feedback\n'
    '- Personalized college recommendations\n'
    '- Financial aid guidance\n'
    '- Interview prep\n'
    '- Scholarship matching\n\n'
    'TIER 3 - FAMILY PREMIUM ($34/month or $340/year)\n'
    'All Premium features plus:\n'
    '- Up to 3 student profiles\n'
    '- Parent dashboard\n'
    '- Family consultation guides\n'
    '- Dedicated success manager (email)\n\n'
    'TIER 4 - SCHOOL/DISTRICT LICENSE ($8-12/student/year)\n'
    'For schools that want institution-wide access:\n'
    '- All Premium features for every student\n'
    '- Counselor admin dashboard\n'
    '- Outcome reporting and analytics\n'
    '- SSO integration\n'
    '- Priority support'
)

doc.add_paragraph(
    'Why this model is optimal:\n'
    '1. VIRAL ACQUISITION: Free club tier creates organic distribution. Each club with 50-200 families '
    'becomes a zero-cost acquisition channel. No need for expensive consumer marketing.\n'
    '2. NATURAL UPSELL: Once students use the free tier and experience AI counseling (even limited), '
    'the upsell to Premium is compelling and friction-free.\n'
    '3. B2B BACKSTOP: School licenses provide stable, predictable revenue that de-risks the business.\n'
    '4. PRICE OPTIMIZATION: $19/month is more accessible than $29/month and aligns with what parents '
    'spend on SAT prep, tutoring apps, etc. The lower price point increases conversion.\n'
    '5. NETWORK EFFECTS: More students on the platform = more outcome data = better AI recommendations '
    '= stronger competitive moat over time.'
)

add_heading('Projected Revenue (Recommended Model)', level=3)

add_table(
    ['Metric', 'Year 1', 'Year 2', 'Year 3'],
    [
        ['Free club/school users', '5,000', '25,000', '100,000'],
        ['Individual Premium subscribers', '500', '3,000', '15,000'],
        ['Family Premium subscribers', '100', '800', '4,000'],
        ['School license students', '0', '2,000', '15,000'],
        ['Monthly Recurring Revenue', '$12K', '$85K', '$450K'],
        ['Annual Recurring Revenue', '$144K', '$1.0M', '$5.4M'],
    ]
)

doc.add_page_break()

# --- 12. COST STRUCTURE ---
add_heading('12. Cost Structure & Unit Economics', level=1)

add_heading('12.1 Monthly Operating Costs by Stage', level=2)

add_table(
    ['Category', 'Early (0-1K users)', 'Growth (5K-25K)', 'Scale (50K+)'],
    [
        ['Hosting (Vercel + Supabase)', '$45/mo', '$150-$450', '$500-$3,000'],
        ['AI API (Claude/GPT)', '$200-$2,000', '$2,000-$10,000', '$10,000-$50,000'],
        ['Email (Resend/SendGrid)', '$0-$20', '$50-$200', '$300-$1,000'],
        ['Search (Algolia)', '$0', '$50-$150', '$200-$500'],
        ['Monitoring (Sentry/PostHog)', '$0', '$30-$80', '$200-$500'],
        ['Domain + SSL', '$1', '$1', '$1'],
        ['Stripe fees', '2.9% + $0.30/tx', '2.9% + $0.30/tx', '2.9% + $0.30/tx'],
        ['TOTAL (excl. people)', '$250-$2,100/mo', '$2,500-$11,000/mo', '$12,000-$55,000/mo'],
    ]
)

add_heading('12.2 AI Cost Deep Dive', level=2)

doc.add_paragraph(
    'AI API costs are the single largest variable cost and the most important to manage:'
)

add_table(
    ['Usage Scenario', 'Model', 'Tokens/Session', 'Sessions/Mo', 'Monthly Cost'],
    [
        ['Light (500 users, 5 sessions each)', 'Claude 3.5 Sonnet', '~4,000', '2,500', '$25-$50'],
        ['Moderate (2K users, 10 sessions)', 'Claude 3.5 Sonnet', '~4,000', '20,000', '$200-$400'],
        ['Heavy (5K users, 15 sessions)', 'Claude 3.5 Sonnet', '~6,000', '75,000', '$675-$1,350'],
        ['Essay review (long context)', 'Claude 3.5 Sonnet', '~10,000', 'varies', '$0.05-$0.10/essay'],
    ]
)

doc.add_paragraph(
    'Cost management strategies:\n'
    '- Use Claude Haiku or GPT-4o-mini for simple queries (college facts, deadline info)\n'
    '- Reserve Sonnet/GPT-4o for complex advice (essay feedback, personalized recommendations)\n'
    '- Cache common questions and responses in Redis\n'
    '- Implement token limits per user per plan tier\n'
    '- Use RAG to reduce prompt sizes (retrieve relevant data instead of stuffing context)\n'
    '- Fine-tune smaller models for repetitive tasks as volume grows'
)

add_heading('12.3 Unit Economics', level=2)

add_table(
    ['Tier', 'Monthly Price', 'Est. AI Cost/User/Mo', 'Est. Infra Cost/User/Mo', 'Gross Margin'],
    [
        ['Free', '$0', '$0.50-$2.00', '$0.10', 'Negative (marketing cost)'],
        ['Individual Premium ($19)', '$19', '$3-$8', '$0.50', '55-82%'],
        ['Family Premium ($34)', '$34', '$5-$12', '$1.00', '62-82%'],
        ['School License (~$1/student/mo)', '$1', '$2-$5', '$0.10', 'Thin to negative (volume play)'],
    ]
)

doc.add_paragraph(
    'The key insight: the Individual Premium tier at $19/month has strong unit economics (55-82% gross margin), '
    'but the business depends on keeping free-tier AI costs low and achieving >5% free-to-paid conversion. '
    'The School License tier is a volume play with thin margins that builds the data moat and creates switching costs.'
)

doc.add_page_break()

# ============================================================
# PART V: GAP ANALYSIS & PROJECT PLAN
# ============================================================
p = doc.add_paragraph()
run = p.add_run('PART V: GAP ANALYSIS & PROJECT PLAN')
run.font.size = Pt(24)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# --- 13. GAP ANALYSIS ---
add_heading('13. Current State vs. Production Gap Analysis', level=1)

add_table(
    ['Component', 'Current State', 'Production Required', 'Gap Severity', 'Effort'],
    [
        ['Landing Page', 'Complete (animated, responsive)', 'Connect CTAs to auth/signup', 'Low', '1 week'],
        ['Authentication', 'None', 'Full auth with OAuth, roles, email verification', 'Critical', '2 weeks'],
        ['Database', 'None', 'PostgreSQL with full schema (10+ tables)', 'Critical', '2 weeks'],
        ['Student Profiles', 'None', 'Profile creation, editing, persistence', 'Critical', '2 weeks'],
        ['AI Chat', 'None', 'Full conversational AI with streaming, context, memory', 'Critical', '4 weeks'],
        ['College Search', 'None', 'Search with filters, college database, recommendations', 'Critical', '3 weeks'],
        ['Application Tracker', 'None', 'Dashboard, deadlines, reminders, checklists', 'High', '2 weeks'],
        ['Essay Editor', 'None', 'Rich text editor with AI feedback integration', 'High', '3 weeks'],
        ['Financial Aid', 'None', 'FAFSA guide, scholarship search, aid comparison', 'High', '2 weeks'],
        ['Payments', 'None', 'Stripe subscriptions, billing portal, webhooks', 'Critical', '2 weeks'],
        ['Parent Dashboard', 'None', 'Linked accounts, progress view, notifications', 'Medium', '2 weeks'],
        ['Email System', 'None', 'Transactional emails, reminders, weekly digests', 'High', '1 week'],
        ['Admin Panel', 'None', 'User management, analytics, content management', 'Medium', '2 weeks'],
        ['Mobile Optimization', 'Responsive landing', 'Full app responsiveness, PWA', 'Medium', '2 weeks'],
        ['Analytics', 'None', 'PostHog/Mixpanel, conversion tracking, product analytics', 'Medium', '1 week'],
        ['SEO/Marketing', 'Minimal', 'Meta tags, structured data, social cards, blog', 'Medium', '1 week'],
        ['Security', 'None', 'RLS, CORS, CSP, rate limiting, FERPA compliance', 'Critical', '2 weeks'],
        ['Testing', 'None', 'Unit, integration, E2E tests', 'High', '3 weeks (ongoing)'],
        ['Virtual Campus Tours', 'None', 'Embedded virtual tours from partner colleges; directory; AI-recommended touring', 'High', '2 weeks'],
        ['College Data', 'None', 'Comprehensive college database (4,000+ schools)', 'Critical', '2 weeks'],
        ['Documentation', 'README only', 'API docs, user guides, admin docs', 'Medium', '2 weeks'],
    ]
)

doc.add_page_break()

# --- 14. PROJECT PLAN ---
add_heading('14. Production Project Plan & Roadmap', level=1)

add_heading('Phase 0: Foundation (Weeks 1-4)', level=2)

doc.add_paragraph('Goal: Establish the technical foundation for the application.')
phase0 = [
    'Week 1-2: Set up Supabase (auth, database, RLS). Design and implement core database schema. Connect auth to landing page CTAs.',
    'Week 2-3: Set up Stripe integration (products, subscriptions, webhooks, billing portal). Create pricing page flow.',
    'Week 3-4: Build onboarding flow (student profile creation wizard). Set up email system (Resend). Deploy staging environment.',
]
for item in phase0:
    add_bullet(item)

add_heading('Phase 1: Core AI MVP (Weeks 5-10)', level=2)

doc.add_paragraph('Goal: Launch the core AI counselor chat experience.')
phase1 = [
    'Week 5-6: AI chat backend (Claude API integration, Vercel AI SDK, streaming, context management). Build chat UI.',
    'Week 7-8: College search and discovery (college database, search/filter, detail pages, favorites). RAG pipeline for AI college knowledge.',
    'Week 8-9: Application tracker (dashboard, deadline reminders, checklist per application). Email notification system.',
    'Week 9-10: Integration testing, bug fixes, performance optimization. Internal alpha testing.',
]
for item in phase1:
    add_bullet(item)

add_heading('Phase 2: Essay & Financial Aid (Weeks 11-14)', level=2)

doc.add_paragraph('Goal: Add essay support and financial aid features.')
phase2_items = [
    'Week 11-12: Essay editor (rich text, AI feedback, version history). Essay prompt library by school.',
    'Week 12-13: Financial aid hub (FAFSA guide, scholarship search/match, aid package comparison).',
    'Week 13-14: Parent dashboard (account linking, progress view, weekly digest). Interview prep module.',
]
for item in phase2_items:
    add_bullet(item)

add_heading('Phase 3: Beta Launch (Weeks 15-18)', level=2)

doc.add_paragraph('Goal: Launch to a limited beta audience and iterate.')
phase3 = [
    'Week 15: Security audit (pen testing, FERPA review, privacy policy). Load testing.',
    'Week 16: Beta launch to 100-500 users (friends, family, partner schools/clubs). Feedback collection.',
    'Week 17-18: Rapid iteration on feedback. Bug fixes. Performance improvements. Analytics setup.',
]
for item in phase3:
    add_bullet(item)

add_heading('Phase 4: Public Launch (Weeks 19-22)', level=2)

doc.add_paragraph('Goal: Public launch with marketing push.')
phase4 = [
    'Week 19: SEO optimization, social media profiles, content marketing (blog posts, TikTok/Instagram).',
    'Week 20: Public launch. PR outreach to education journalists. Product Hunt launch.',
    'Week 21-22: Monitor metrics, iterate on conversion funnels, customer support, retention improvements.',
]
for item in phase4:
    add_bullet(item)

add_heading('Phase 5: Growth & B2B (Months 6-12)', level=2)

phase5 = [
    'Club/school B2B portal development and sales outreach',
    'Athletic recruiting module (profile builder, highlight reels, NCAA eligibility)',
    'React Native mobile app (iOS + Android)',
    'Community features (peer forums, alumni mentors)',
    'Advanced analytics (admissions probability scoring with proprietary data)',
    'Integration with Common App / Coalition App (if API access available)',
    'SMS-based nudging and reminders',
    'International expansion (UK, Canada, Australia)',
]
for item in phase5:
    add_bullet(item)

doc.add_page_break()

# --- 15. CUSTOMER DEMO STRATEGY ---
add_heading('15. Customer Demo Strategy', level=1)

add_heading('15.1 Demo Audience Segments', level=2)

add_table(
    ['Segment', 'Demo Focus', 'Key Demo Moments', 'Success Metric'],
    [
        ['Individual Student', 'AI chat, college search, essay help', '"Ask the AI about your dream school" - show personalized response in <5s', 'Signs up for free account'],
        ['Parent', 'Parent dashboard, financial aid, family plan value', 'Show deadline visibility + financial aid savings calculator', 'Upgrades to Family plan'],
        ['School Counselor', 'Admin dashboard, student progress, outcome reporting', 'Show 30-student overview with at-risk alerts', 'Requests school pilot'],
        ['Club Director', 'Group management, member value-add, recruiting tools', 'Show how platform adds value to membership', 'Signs up club for free tier'],
        ['Investor / Advisor', 'Market size, competitive moat, unit economics, growth metrics', 'Live AI demo + revenue dashboard + user growth chart', 'Provides funding/advice'],
    ]
)

add_heading('15.2 Demo Script Outline', level=2)

demo_steps = [
    '1. HOOK (30 seconds): "400:1 counselor-to-student ratio. $5,000+ for private counseling. 4 million students applying each year. We are democratizing college counseling with AI."',
    '2. LIVE DEMO (3 minutes): Open the app. Create a quick profile. Ask the AI: "I have a 3.7 GPA, I love marine biology, and I want a medium-sized school on the coast. What are my best options?" Watch the AI deliver personalized, thoughtful recommendations in real-time.',
    '3. ESSAY DEMO (2 minutes): Paste a sample essay paragraph. Click "Get AI Feedback." Show structured feedback with strengths, suggestions, and specific improvements. Highlight: "We guide, we never write for you."',
    '4. PARENT VIEW (1 minute): Switch to parent dashboard. Show deadline visibility, progress tracking, financial aid resources.',
    '5. DIFFERENTIATION (1 minute): "Unlike Naviance (outdated, expensive, school-owned), CollegeVine (sells your data), or $5K private counselors, we provide expert-level AI guidance at $19/month."',
    '6. CLOSE (30 seconds): "We are launching beta next month. Sign up now for early access and help us build the future of college counseling."',
]
for step in demo_steps:
    doc.add_paragraph(step)

add_heading('15.3 Demo Environment Requirements', level=2)

demo_reqs = [
    'Pre-populated student profile with realistic data (avoid demo that requires account creation)',
    'AI must respond in <5 seconds (pre-warm the model, use streaming)',
    'At least 50 colleges in the demo database with real, accurate data',
    'Sample essays pre-loaded for feedback demo',
    'Parent dashboard with mock data showing 2-3 student timelines',
    'Works flawlessly on both desktop and mobile (demo on both)',
    'Offline fallback: Pre-recorded video demo as backup in case of connectivity issues',
]
for item in demo_reqs:
    add_bullet(item)

doc.add_page_break()

# ============================================================
# APPENDICES
# ============================================================
p = doc.add_paragraph()
run = p.add_run('APPENDICES')
run.font.size = Pt(24)
run.font.bold = True
run.font.color.rgb = RGBColor(0x1E, 0x2B, 0x4F)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph()

# --- APPENDIX A ---
add_heading('Appendix A: Current Codebase Inventory', level=1)

add_table(
    ['Category', 'Files', 'Status'],
    [
        ['Entry Point', 'index.html, main.tsx, App.tsx', 'Complete'],
        ['Sections (10)', 'Navigation, Hero, LogoMarquee, Features, HowItWorks, Testimonials, Pricing, FAQ, CTA, Footer', 'Complete (landing only)'],
        ['UI Components', '50+ shadcn/ui components in components/ui/', 'Imported but mostly unused'],
        ['Styling', 'App.css, index.css, tailwind.config.js, postcss.config.js', 'Complete'],
        ['Config', 'vite.config.ts, tsconfig.json, eslint.config.js, components.json', 'Complete'],
        ['CI/CD', '.github/workflows/deploy.yml', 'Complete (GitHub Pages)'],
        ['Images', '12 placeholder images in dist/ (hero, testimonials, CTA)', 'Placeholder quality'],
        ['Unused Dependencies', 'recharts, date-fns, react-hook-form, zod, next-themes, lenis', 'Should be removed or utilized'],
    ]
)

# --- APPENDIX B ---
add_heading('Appendix B: Competitor Feature Matrix', level=1)

add_table(
    ['Feature', 'Us (Planned)', 'Naviance', 'CollegeVine', 'Scoir', 'NCSA', 'Khanmigo'],
    [
        ['AI Chat Counselor', 'Yes (core)', 'No', 'Limited', 'No', 'No', 'Yes'],
        ['College Search', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'Basic'],
        ['Essay Feedback', 'Yes (AI)', 'No', 'Yes (AI)', 'No', 'No', 'Yes'],
        ['Application Tracking', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'No'],
        ['Scholarship Search', 'Yes', 'Yes', 'Yes', 'Some', 'No', 'No'],
        ['Financial Aid Guide', 'Yes', 'Limited', 'Limited', 'Limited', 'No', 'Yes'],
        ['Interview Prep', 'Yes', 'No', 'No', 'No', 'No', 'No'],
        ['Mental Wellness', 'Yes', 'No', 'No', 'No', 'No', 'No'],
        ['Parent Dashboard', 'Yes', 'Limited', 'No', 'Some', 'Some', 'No'],
        ['Athletic Recruiting', 'Planned', 'No', 'No', 'No', 'Yes (core)', 'No'],
        ['Virtual Campus Tours', 'Yes (integrated)', 'No', 'No', 'Some', 'No', 'No'],
        ['First-Gen Support', 'Yes (core)', 'No', 'Some', 'No', 'No', 'Some'],
        ['Price (Student)', 'Free-$19/mo', 'School pays', 'Free', 'School pays', '$0-$800/yr', 'Free'],
    ]
)

# --- APPENDIX C ---
add_heading('Appendix C: Risk Register', level=1)

add_table(
    ['Risk', 'Probability', 'Impact', 'Mitigation'],
    [
        ['AI costs scale faster than revenue', 'Medium', 'High', 'Tiered model usage, caching, fine-tuning, token limits per plan'],
        ['Khanmigo (free) captures market', 'Medium', 'High', 'Differentiate on depth, personalization, athletic integration, parent tools'],
        ['Low free-to-paid conversion (<3%)', 'Medium', 'High', 'Optimize free tier to demonstrate value; A/B test upgrade prompts; lower price point ($19)'],
        ['FERPA/privacy compliance issues', 'Low', 'Critical', 'Engage education privacy counsel early; implement RLS; data residency in US'],
        ['AI provides incorrect advice', 'Medium', 'High', 'Disclaimer in all AI responses; human review of edge cases; feedback mechanism; RAG for factual data'],
        ['Technical debt from rapid development', 'High', 'Medium', 'Invest in testing from Phase 0; code reviews; refactoring sprints every 6 weeks'],
        ['Difficulty sourcing college data', 'Medium', 'Medium', 'Use IPEDS (free federal data); partner with data providers; crowdsource from users'],
        ['Slow B2B school sales cycle', 'High', 'Medium', 'Focus on B2C first; use school pilots (free) to build case studies; sell in spring for fall'],
        ['Market timing (AI hype cycle)', 'Low', 'Medium', 'Build genuine product value, not just AI wrapper; focus on outcomes over technology'],
        ['Founder bandwidth (solo project)', 'High', 'High', 'Prioritize ruthlessly; outsource non-core; consider co-founder or contractor for backend'],
    ]
)

# ============================================================
# SAVE
# ============================================================
output_path = r"C:\Users\ahelf\OneDrive\Desktop\AI Projects\college\College_Counselor_AI_Specification.docx"
doc.save(output_path)
print(f"Document saved to: {output_path}")
print(f"Total pages estimated: 35-40")
