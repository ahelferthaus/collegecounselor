import { Plus, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Activity,
  type ActivityCategory,
  type StudentProfile,
  ACTIVITY_CATEGORIES,
  GRADE_LEVELS,
  newActivity,
} from '@/lib/profile';
import { cn } from '@/lib/utils';

interface Props {
  profile: StudentProfile;
  update: (updater: (p: StudentProfile) => StudentProfile) => void;
}

export function ExtracurricularsSection({ profile, update }: Props) {
  const list = profile.extracurriculars;

  const setList = (next: Activity[]) =>
    update((p) => ({ ...p, extracurriculars: next }));
  const patch = (id: string, p: Partial<Activity>) =>
    setList(list.map((a) => (a.id === id ? { ...a, ...p } : a)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          List activities, jobs, sports, and service — most important first.
          Colleges value <span className="font-medium text-navy-700">depth and
          impact</span> over a long list.
        </p>
        <Button
          onClick={() => setList([...list, newActivity()])}
          className="shrink-0 bg-gradient-purple-teal text-white hover:opacity-90"
        >
          <Plus className="mr-1 h-4 w-4" /> Add activity
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          <Trophy className="h-8 w-8 text-gray-300" />
          No activities yet. Add your first one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a, i) => (
            <div key={a.id} className="rounded-2xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={i === 0}
                    onClick={() => {
                      const next = [...list];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      setList(next);
                    }}
                    aria-label="Move up"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={i === list.length - 1}
                    onClick={() => {
                      const next = [...list];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      setList(next);
                    }}
                    aria-label="Move down"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setList(list.filter((x) => x.id !== a.id))}
                    aria-label="Remove activity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <Label className="text-xs">Activity</Label>
                  <Input
                    value={a.name}
                    placeholder="e.g. Varsity Robotics Team"
                    onChange={(e) => patch(a.id, { name: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-4">
                  <Label className="text-xs">Role / position</Label>
                  <Input
                    value={a.role}
                    placeholder="e.g. Team Captain"
                    onChange={(e) => patch(a.id, { role: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={a.category}
                    onValueChange={(v) =>
                      patch(a.id, { category: v as ActivityCategory })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-5">
                  <Label className="text-xs">Organization</Label>
                  <Input
                    value={a.organization}
                    placeholder="School, club, employer…"
                    onChange={(e) => patch(a.id, { organization: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs">Hrs / week</Label>
                  <Input
                    type="number"
                    min="0"
                    value={a.hoursPerWeek ?? ''}
                    onChange={(e) =>
                      patch(a.id, {
                        hoursPerWeek:
                          e.target.value === '' ? null : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs">Wks / year</Label>
                  <Input
                    type="number"
                    min="0"
                    value={a.weeksPerYear ?? ''}
                    onChange={(e) =>
                      patch(a.id, {
                        weeksPerYear:
                          e.target.value === '' ? null : parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label className="text-xs">Grades involved</Label>
                  <div className="flex h-9 items-center gap-1">
                    {GRADE_LEVELS.map((gl) => {
                      const on = a.gradeLevels.includes(gl);
                      return (
                        <button
                          key={gl}
                          type="button"
                          onClick={() =>
                            patch(a.id, {
                              gradeLevels: on
                                ? a.gradeLevels.filter((g) => g !== gl)
                                : [...a.gradeLevels, gl].sort(),
                            })
                          }
                          className={cn(
                            'h-8 w-8 rounded-md border text-xs font-semibold transition-colors',
                            on
                              ? 'border-purple-600 bg-purple-600 text-white'
                              : 'border-border text-navy-700 hover:bg-gray-50',
                          )}
                        >
                          {gl}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:col-span-12">
                  <Label className="text-xs">What you did / impact</Label>
                  <Textarea
                    value={a.description}
                    rows={2}
                    placeholder="Describe responsibilities, accomplishments, and measurable impact…"
                    onChange={(e) => patch(a.id, { description: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-12">
                  <Label className="text-xs">Awards / recognition</Label>
                  <Input
                    value={a.awards}
                    placeholder="e.g. State finalist, Employee of the Month"
                    onChange={(e) => patch(a.id, { awards: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
