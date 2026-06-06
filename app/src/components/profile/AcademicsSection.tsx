import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Course,
  type StudentProfile,
  type GradeLevel,
  type LetterGrade,
  type SubjectArea,
  type CourseLevel,
  type TestType,
  COURSE_LEVELS,
  GRADE_LEVELS,
  GRADE_LEVEL_LABELS,
  LETTER_GRADES,
  SUBJECT_AREAS,
  TEST_TYPES,
  computeGpa,
  gpaByYear,
  gradeColor,
  newCourse,
  newTest,
} from '@/lib/profile';

interface Props {
  profile: StudentProfile;
  update: (updater: (p: StudentProfile) => StudentProfile) => void;
}

export function AcademicsSection({ profile, update }: Props) {
  const { courses, tests, weighted } = profile.academics;
  const overall = computeGpa(courses);
  const byYear = gpaByYear(courses);

  const setCourses = (next: Course[]) =>
    update((p) => ({ ...p, academics: { ...p.academics, courses: next } }));
  const patchCourse = (id: string, patch: Partial<Course>) =>
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const addCourse = (gl: GradeLevel) =>
    setCourses([...courses, newCourse(gl)]);
  const removeCourse = (id: string) =>
    setCourses(courses.filter((c) => c.id !== id));

  return (
    <div className="space-y-6">
      {/* GPA summary */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-purple-50 to-teal-50 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            <Stat
              label={weighted ? 'Weighted GPA' : 'Unweighted GPA'}
              value={(weighted ? overall.weighted : overall.unweighted).toFixed(2)}
              big
            />
            <Stat
              label={weighted ? 'Unweighted' : 'Weighted'}
              value={(weighted ? overall.unweighted : overall.weighted).toFixed(2)}
            />
            <Stat label="Graded credits" value={String(overall.gradedCredits)} />
            <Stat label="Courses" value={String(overall.totalCourses)} />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-navy-700">
            <Switch
              checked={weighted}
              onCheckedChange={(v) =>
                update((p) => ({
                  ...p,
                  academics: { ...p.academics, weighted: v },
                }))
              }
            />
            Show weighted
          </label>
        </div>
        {byYear.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {byYear.map(({ gradeLevel, summary }) => (
              <span
                key={gradeLevel}
                className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-navy-700"
              >
                {GRADE_LEVEL_LABELS[gradeLevel].split(' · ')[0]}:{' '}
                {(weighted ? summary.weighted : summary.unweighted).toFixed(2)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Courses grouped by year */}
      {GRADE_LEVELS.map((gl) => {
        const yearCourses = courses.filter((c) => c.gradeLevel === gl);
        return (
          <div key={gl}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-navy-900">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                {GRADE_LEVEL_LABELS[gl]}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700"
                onClick={() => addCourse(gl)}
              >
                <Plus className="mr-1 h-4 w-4" /> Add course
              </Button>
            </div>
            {yearCourses.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                No courses added for this year yet.
              </p>
            ) : (
              <div className="space-y-2">
                {yearCourses.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-end"
                  >
                    <div className="col-span-2 sm:col-span-4">
                      <Label className="text-xs">Course</Label>
                      <Input
                        value={c.name}
                        placeholder="e.g. AP Chemistry"
                        onChange={(e) => patchCourse(c.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Subject</Label>
                      <Select
                        value={c.subject}
                        onValueChange={(v) =>
                          patchCourse(c.id, { subject: v as SubjectArea })
                        }
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SUBJECT_AREAS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Level</Label>
                      <Select
                        value={c.level}
                        onValueChange={(v) =>
                          patchCourse(c.id, { level: v as CourseLevel })
                        }
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {COURSE_LEVELS.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Grade</Label>
                      <Select
                        value={c.grade || undefined}
                        onValueChange={(v) =>
                          patchCourse(c.id, { grade: v as LetterGrade })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          {LETTER_GRADES.map((g) => (
                            <SelectItem key={g} value={g}>
                              <span
                                className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                                style={{ backgroundColor: gradeColor(g) }}
                              />
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2 sm:col-span-2">
                      <div className="flex-1">
                        <Label className="text-xs">Credits</Label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          value={c.credits}
                          onChange={(e) =>
                            patchCourse(c.id, {
                              credits: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeCourse(c.id)}
                        aria-label="Remove course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Test scores */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-navy-900">
            Test scores
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:text-purple-700"
            onClick={() =>
              update((p) => ({
                ...p,
                academics: { ...p.academics, tests: [...tests, newTest()] },
              }))
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Add score
          </Button>
        </div>
        {tests.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            Add SAT/ACT, AP, or other scores (optional).
          </p>
        ) : (
          <div className="space-y-2">
            {tests.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-end"
              >
                <div className="sm:col-span-3">
                  <Label className="text-xs">Test</Label>
                  <Select
                    value={t.type}
                    onValueChange={(v) =>
                      update((p) => ({
                        ...p,
                        academics: {
                          ...p.academics,
                          tests: tests.map((x) =>
                            x.id === t.id ? { ...x, type: v as TestType } : x,
                          ),
                        },
                      }))
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TEST_TYPES.map((tt) => (
                        <SelectItem key={tt} value={tt}>{tt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-5">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={t.label}
                    placeholder="e.g. Superscore, AP Chemistry"
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        academics: {
                          ...p.academics,
                          tests: tests.map((x) =>
                            x.id === t.id ? { ...x, label: e.target.value } : x,
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label className="text-xs">Score</Label>
                  <Input
                    value={t.score}
                    placeholder="e.g. 1480 / 5"
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        academics: {
                          ...p.academics,
                          tests: tests.map((x) =>
                            x.id === t.id ? { ...x, score: e.target.value } : x,
                          ),
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex justify-end sm:col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        academics: {
                          ...p.academics,
                          tests: tests.filter((x) => x.id !== t.id),
                        },
                      }))
                    }
                    aria-label="Remove score"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div>
      <div
        className={
          big
            ? 'font-heading text-3xl font-bold text-gradient'
            : 'font-heading text-xl font-bold text-navy-900'
        }
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
