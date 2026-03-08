import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, GraduationCap, Users, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWaitlist } from '@/context/WaitlistContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['student', 'parent', 'counselor'], {
    error: 'Please select your role',
  }),
});

type FormData = z.infer<typeof schema>;

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: "I'm applying to college" },
  { value: 'parent', label: 'Parent', icon: Users, desc: "I'm supporting my child" },
  { value: 'counselor', label: 'Counselor', icon: Sparkles, desc: "I work with students" },
] as const;

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;

async function submitToWaitlist(data: FormData): Promise<void> {
  if (FORMSPREE_ID) {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Submission failed');
  } else {
    // No endpoint configured — simulate network delay for demo
    await new Promise((r) => setTimeout(r, 1200));
  }
}

export function WaitlistModal() {
  const { open, closeWaitlist } = useWaitlist();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      await submitToWaitlist(data);
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleClose = () => {
    closeWaitlist();
    // Reset after close animation finishes
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
        {/* Gradient header bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 to-teal-500" />

        <div className="p-8">
          {submitted ? (
            <SuccessState onClose={handleClose} />
          ) : (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                    Early Access
                  </span>
                </div>
                <DialogTitle className="text-2xl font-bold text-navy-900 font-heading">
                  Join the Waitlist
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Be first in line when we launch. No spam — just your spot in line.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Role selector */}
                <div>
                  <p className="text-sm font-medium text-navy-700 mb-2">I am a...</p>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('role', value, { shouldValidate: true })}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all ${
                          selectedRole === value
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{label}</span>
                        <span className="text-[10px] text-gray-400 leading-tight hidden sm:block">
                          {desc}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Alex Johnson"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="alex@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:opacity-90 transition-opacity py-6 text-base font-semibold rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reserving your spot...
                    </>
                  ) : (
                    'Reserve My Spot →'
                  )}
                </Button>

                <p className="text-center text-xs text-gray-400">
                  No credit card required · Unsubscribe anytime
                </p>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-teal-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-navy-900 font-heading mb-2">
        You're on the list!
      </h3>
      <p className="text-gray-500 mb-6 max-w-xs mx-auto">
        We'll email you the moment early access opens. Expect something great.
      </p>
      <div className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-50 rounded-xl mb-6">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 border-2 border-white"
            />
          ))}
        </div>
        <span className="text-sm text-navy-700 font-medium">
          Joining 10,000+ students already waiting
        </span>
      </div>
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl py-5"
      >
        Close
      </Button>
    </div>
  );
}
