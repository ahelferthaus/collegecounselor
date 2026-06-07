// Student profile model: Academics, Extracurriculars, and "Who I Am".
// This structured data is the foundation for fit suggestions, admission
// banding, and "how to improve my chances" recommendations.
import { createId } from './schools';

export type GradeLevel = 9 | 10 | 11 | 12;
export const GRADE_LEVELS: GradeLevel[] = [9, 10, 11, 12];
export const GRADE_LEVEL_LABELS: Record<GradeLevel, string> = {
  9: '9th · Freshman',
  10: '10th · Sophomore',
  11: '11th · Junior',
  12: '12th · Senior',
};

export type CourseLevel = 'Regular' | 'Honors' | 'AP' | 'IB' | 'Dual Enrollment';
export const COURSE_LEVELS: CourseLevel[] = [
  'Regular',
  'Honors',
  'AP',
  'IB',
  'Dual Enrollment',
];

export const SUBJECT_AREAS = [
  'English',
  'Math',
  'Science',
  'Social Studies',
  'World Language',
  'Arts',
  'Computer Science',
  'Elective',
  'Other',
] as const;
export type SubjectArea = (typeof SUBJECT_AREAS)[number];

export type LetterGrade =
  | 'A+' | 'A' | 'A-'
  | 'B+' | 'B' | 'B-'
  | 'C+' | 'C' | 'C-'
  | 'D+' | 'D' | 'D-'
  | 'F' | 'P' | 'NP';
export const LETTER_GRADES: LetterGrade[] = [
  'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'P', 'NP',
];

export interface Course {
  id: string;
  name: string;
  subject: SubjectArea;
  level: CourseLevel;
  grade: LetterGrade | '';
  gradeLevel: GradeLevel;
  credits: number;
}

export type TestType = 'SAT' | 'ACT' | 'PSAT' | 'AP Exam' | 'IB Exam' | 'TOEFL' | 'Other';
export const TEST_TYPES: TestType[] = ['SAT', 'ACT', 'PSAT', 'AP Exam', 'IB Exam', 'TOEFL', 'Other'];
export interface TestScore {
  id: string;
  type: TestType;
  label: string; // e.g. "AP Chemistry" or "Superscore"
  score: string;
  date: string;
}

export type ActivityCategory =
  | 'Academic'
  | 'Athletics'
  | 'Arts & Music'
  | 'Clubs'
  | 'Community Service'
  | 'Work / Internship'
  | 'Research'
  | 'Leadership'
  | 'Cultural / Religious'
  | 'Entrepreneurship'
  | 'Family Responsibility'
  | 'Other';
export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  'Academic',
  'Athletics',
  'Arts & Music',
  'Clubs',
  'Community Service',
  'Work / Internship',
  'Research',
  'Leadership',
  'Cultural / Religious',
  'Entrepreneurship',
  'Family Responsibility',
  'Other',
];

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  role: string;
  organization: string;
  description: string;
  gradeLevels: GradeLevel[];
  hoursPerWeek: number | null;
  weeksPerYear: number | null;
  awards: string;
}

export const HOOKS = [
  'First-generation college student',
  'Recruited athlete',
  'Legacy',
  'Underrepresented background',
  'Rural / small town',
  'Low-income / Pell-eligible',
  'Military / veteran family',
  'International student',
] as const;

export interface WhoIAm {
  highSchool: string;
  gradYear: string;
  location: string;
  intendedMajors: string;
  careerInterests: string;
  academicInterests: string;
  hooks: string[];
  background: string;
  values: string;
  collegePreferences: string;
  budget: string;
  story: string;
}

export type ScholarshipStatus =
  | 'researching'
  | 'applying'
  | 'applied'
  | 'awarded'
  | 'rejected';
export type ScholarshipScope = 'general' | 'school' | 'state' | 'federal' | 'other';

export const SCHOLARSHIP_STATUS_LABELS: Record<ScholarshipStatus, string> = {
  researching: 'Researching',
  applying: 'Applying',
  applied: 'Applied',
  awarded: 'Awarded',
  rejected: 'Not selected',
};

export const SCHOLARSHIP_SCOPE_LABELS: Record<ScholarshipScope, string> = {
  general: 'National',
  school: 'School-specific',
  state: 'State',
  federal: 'Federal',
  other: 'Other',
};

export interface SavedScholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  url: string;
  eligibility: string;
  scope: ScholarshipScope;
  status: ScholarshipStatus;
  notes: string;
  schoolName: string;
  createdAt: number;
}

export interface StudentProfile {
  academics: {
    courses: Course[];
    tests: TestScore[];
    weighted: boolean;
  };
  extracurriculars: Activity[];
  whoIAm: WhoIAm;
  scholarships: SavedScholarship[];
  updatedAt: number;
}

export function newScholarship(
  partial: Partial<SavedScholarship> = {},
): SavedScholarship {
  return {
    id: createId(),
    name: '',
    provider: '',
    amount: '',
    deadline: '',
    url: '',
    eligibility: '',
    scope: 'general',
    status: 'researching',
    notes: '',
    schoolName: '',
    createdAt: Date.now(),
    ...partial,
  };
}

export const PROFILE_STORAGE_KEY = 'cc_student_profile_v1';

export function emptyProfile(): StudentProfile {
  return {
    academics: { courses: [], tests: [], weighted: true },
    extracurriculars: [],
    scholarships: [],
    whoIAm: {
      highSchool: '',
      gradYear: '',
      location: '',
      intendedMajors: '',
      careerInterests: '',
      academicInterests: '',
      hooks: [],
      background: '',
      values: '',
      collegePreferences: '',
      budget: '',
      story: '',
    },
    updatedAt: Date.now(),
  };
}

export function newCourse(gradeLevel: GradeLevel = 9): Course {
  return {
    id: createId(),
    name: '',
    subject: 'English',
    level: 'Regular',
    grade: '',
    gradeLevel,
    credits: 1,
  };
}

export function newTest(): TestScore {
  return { id: createId(), type: 'SAT', label: '', score: '', date: '' };
}

export function newActivity(): Activity {
  return {
    id: createId(),
    name: '',
    category: 'Clubs',
    role: '',
    organization: '',
    description: '',
    gradeLevels: [],
    hoursPerWeek: null,
    weeksPerYear: null,
    awards: '',
  };
}

// --- GPA -----------------------------------------------------------------

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, A: 4.0, 'A-': 3.7,
  'B+': 3.3, B: 3.0, 'B-': 2.7,
  'C+': 2.3, C: 2.0, 'C-': 1.7,
  'D+': 1.3, D: 1.0, 'D-': 0.7,
  F: 0,
};

const LEVEL_WEIGHT: Record<CourseLevel, number> = {
  Regular: 0,
  Honors: 0.5,
  AP: 1,
  IB: 1,
  'Dual Enrollment': 1,
};

export function isGraded(c: Course): boolean {
  return c.grade !== '' && GRADE_POINTS[c.grade] !== undefined;
}

export interface GpaSummary {
  unweighted: number;
  weighted: number;
  gradedCredits: number;
  totalCourses: number;
}

export function computeGpa(courses: Course[]): GpaSummary {
  let uw = 0;
  let w = 0;
  let credits = 0;
  for (const c of courses) {
    if (!isGraded(c)) continue;
    const base = GRADE_POINTS[c.grade as string];
    const cr = c.credits > 0 ? c.credits : 1;
    uw += base * cr;
    // Weighted bump only applies to passing work, capped at 5.0.
    const bump = base > 0 ? LEVEL_WEIGHT[c.level] : 0;
    w += Math.min(base + bump, 5.0) * cr;
    credits += cr;
  }
  return {
    unweighted: credits ? uw / credits : 0,
    weighted: credits ? w / credits : 0,
    gradedCredits: credits,
    totalCourses: courses.length,
  };
}

export function gpaByYear(
  courses: Course[],
): { gradeLevel: GradeLevel; summary: GpaSummary }[] {
  return GRADE_LEVELS.map((gl) => ({
    gradeLevel: gl,
    summary: computeGpa(courses.filter((c) => c.gradeLevel === gl)),
  })).filter((r) => r.summary.gradedCredits > 0);
}

// --- Local persistence ---------------------------------------------------

export function loadProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return mergeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveProfile(p: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

// Defensively merge a stored/remote object onto the current shape so older or
// partial documents don't crash the UI.
export function mergeProfile(data: unknown): StudentProfile {
  const base = emptyProfile();
  if (!data || typeof data !== 'object') return base;
  const d = data as Partial<StudentProfile>;
  return {
    academics: {
      courses: Array.isArray(d.academics?.courses) ? d.academics!.courses : [],
      tests: Array.isArray(d.academics?.tests) ? d.academics!.tests : [],
      weighted: d.academics?.weighted ?? true,
    },
    extracurriculars: Array.isArray(d.extracurriculars) ? d.extracurriculars : [],
    scholarships: Array.isArray(d.scholarships) ? d.scholarships : [],
    whoIAm: { ...base.whoIAm, ...(d.whoIAm ?? {}) },
    updatedAt: typeof d.updatedAt === 'number' ? d.updatedAt : Date.now(),
  };
}

export function gradeColor(grade: LetterGrade | ''): string {
  if (grade === '') return '#94A3B8';
  const p = GRADE_POINTS[grade];
  if (p === undefined) return '#94A3B8'; // P/NP
  if (p >= 3.7) return '#14B8A6';
  if (p >= 3.0) return '#22C55E';
  if (p >= 2.0) return '#F59E0B';
  return '#EF4444';
}
