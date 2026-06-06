import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type StudentProfile, type WhoIAm, HOOKS } from '@/lib/profile';
import { cn } from '@/lib/utils';

interface Props {
  profile: StudentProfile;
  update: (updater: (p: StudentProfile) => StudentProfile) => void;
}

export function WhoIAmSection({ profile, update }: Props) {
  const w = profile.whoIAm;
  const setW = (patch: Partial<WhoIAm>) =>
    update((p) => ({ ...p, whoIAm: { ...p.whoIAm, ...patch } }));

  const toggleHook = (h: string) =>
    setW({
      hooks: w.hooks.includes(h)
        ? w.hooks.filter((x) => x !== h)
        : [...w.hooks, h],
    });

  return (
    <div className="space-y-6">
      <Group title="The basics">
        <Grid>
          <Field label="High school" span={6}>
            <Input
              value={w.highSchool}
              placeholder="Your high school"
              onChange={(e) => setW({ highSchool: e.target.value })}
            />
          </Field>
          <Field label="Location" span={4}>
            <Input
              value={w.location}
              placeholder="City, State"
              onChange={(e) => setW({ location: e.target.value })}
            />
          </Field>
          <Field label="Graduation year" span={2}>
            <Input
              value={w.gradYear}
              placeholder="2027"
              onChange={(e) => setW({ gradYear: e.target.value })}
            />
          </Field>
        </Grid>
      </Group>

      <Group title="Academic & career direction">
        <Grid>
          <Field label="Intended major(s)" span={6}>
            <Input
              value={w.intendedMajors}
              placeholder="e.g. Mechanical Engineering, Undecided"
              onChange={(e) => setW({ intendedMajors: e.target.value })}
            />
          </Field>
          <Field label="Career interests" span={6}>
            <Input
              value={w.careerInterests}
              placeholder="e.g. Aerospace, medicine, startups"
              onChange={(e) => setW({ careerInterests: e.target.value })}
            />
          </Field>
          <Field label="Academic interests & passions" span={12}>
            <Textarea
              value={w.academicInterests}
              rows={2}
              placeholder="Subjects you love, topics you explore on your own, what you'd study for fun…"
              onChange={(e) => setW({ academicInterests: e.target.value })}
            />
          </Field>
        </Grid>
      </Group>

      <Group
        title="Context & identity"
        note="Optional and private — this helps tailor advice and surface schools and programs that fit. Share only what you're comfortable with."
      >
        <Label className="text-xs">Background (select any that apply)</Label>
        <div className="mb-3 mt-1.5 flex flex-wrap gap-2">
          {HOOKS.map((h) => {
            const on = w.hooks.includes(h);
            return (
              <button
                key={h}
                type="button"
                onClick={() => toggleHook(h)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  on
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-border text-navy-700 hover:bg-gray-50',
                )}
              >
                {h}
              </button>
            );
          })}
        </div>
        <Grid>
          <Field label="Personal context / circumstances" span={12}>
            <Textarea
              value={w.background}
              rows={3}
              placeholder="Anything about your background, challenges, responsibilities, or environment that shaped you…"
              onChange={(e) => setW({ background: e.target.value })}
            />
          </Field>
          <Field label="What I value / care about" span={12}>
            <Textarea
              value={w.values}
              rows={2}
              placeholder="Causes, communities, beliefs, and the kind of impact you want to have…"
              onChange={(e) => setW({ values: e.target.value })}
            />
          </Field>
        </Grid>
      </Group>

      <Group title="What I want in a college">
        <Grid>
          <Field label="Preferences" span={8}>
            <Textarea
              value={w.collegePreferences}
              rows={2}
              placeholder="Size, setting (urban/rural), distance from home, vibe, weather, programs…"
              onChange={(e) => setW({ collegePreferences: e.target.value })}
            />
          </Field>
          <Field label="Budget / financial notes" span={4}>
            <Textarea
              value={w.budget}
              rows={2}
              placeholder="Target net price, need for aid/scholarships…"
              onChange={(e) => setW({ budget: e.target.value })}
            />
          </Field>
        </Grid>
      </Group>

      <Group title="My story">
        <Field label="In your own words, who are you?" span={12}>
          <Textarea
            value={w.story}
            rows={4}
            placeholder="A few sentences about your story — what makes you, you. This becomes raw material for essays and helps personalize recommendations."
            onChange={(e) => setW({ story: e.target.value })}
          />
        </Field>
      </Group>
    </div>
  );
}

function Group({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <h3 className="font-heading text-sm font-semibold text-navy-900">{title}</h3>
      {note && (
        <p className="mb-3 mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" />
          {note}
        </p>
      )}
      <div className={note ? '' : 'mt-3'}>{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">{children}</div>;
}

function Field({
  label,
  span,
  children,
}: {
  label: string;
  span: number;
  children: React.ReactNode;
}) {
  const spanClass: Record<number, string> = {
    2: 'sm:col-span-2',
    4: 'sm:col-span-4',
    6: 'sm:col-span-6',
    8: 'sm:col-span-8',
    12: 'sm:col-span-12',
  };
  return (
    <div className={spanClass[span] ?? 'sm:col-span-12'}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
