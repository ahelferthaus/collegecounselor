import { useState } from 'react';
import {
  CheckCircle2,
  Cloud,
  Loader2,
  LogOut,
  Mail,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SyncStatus } from '@/hooks/useSchools';
import { cn } from '@/lib/utils';

interface SyncMenuProps {
  configured: boolean;
  email: string | null;
  status: SyncStatus;
  onSignIn: (email: string) => Promise<void>;
  onSignOut: () => Promise<void>;
}

export function SyncMenu({
  configured,
  email,
  status,
  onSignIn,
  onSignOut,
}: SyncMenuProps) {
  const [open, setOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!configured) return null;

  const signedIn = Boolean(email);

  async function handleSend() {
    const value = emailInput.trim();
    if (!value || !value.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await onSignIn(value);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the link.');
    } finally {
      setSending(false);
    }
  }

  function openDialog() {
    setSent(false);
    setError(null);
    setEmailInput(email ?? '');
    setOpen(true);
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={openDialog}
        className={cn(
          'gap-1.5',
          signedIn && 'border-teal-200 text-teal-700',
        )}
        title={signedIn ? `Synced as ${email}` : 'Sync across devices'}
      >
        {status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : signedIn ? (
          <CheckCircle2 className="h-4 w-4 text-teal-600" />
        ) : (
          <Cloud className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">{signedIn ? 'Synced' : 'Sync'}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          {signedIn ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">
                  Synced across your devices
                </DialogTitle>
                <DialogDescription>
                  Your schools are saved to your account and stay in sync
                  everywhere you sign in.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3 rounded-lg bg-teal-50 p-3 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" />
                <div className="min-w-0">
                  <p className="font-medium text-teal-800">Signed in</p>
                  <p className="truncate text-teal-700">{email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  await onSignOut();
                  setOpen(false);
                }}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : sent ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">
                  Check your inbox
                </DialogTitle>
                <DialogDescription>
                  We sent a one-tap sign-in link to{' '}
                  <span className="font-medium text-navy-800">{emailInput}</span>
                  . Open it on this device to finish signing in — then your
                  schools will sync everywhere.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3 text-sm text-purple-800">
                <Mail className="h-5 w-5 shrink-0" />
                The link expires in about an hour. You can close this dialog.
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">
                  Sync across devices
                </DialogTitle>
                <DialogDescription>
                  Sign in with your email to back up your map and pick up where
                  you left off on your phone, laptop, or tablet. No password —
                  we email you a one-tap link.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="sync-email">Email</Label>
                <Input
                  id="sync-email"
                  type="email"
                  value={emailInput}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <Button
                onClick={handleSend}
                disabled={sending}
                className="w-full bg-gradient-purple-teal text-white hover:opacity-90"
              >
                {sending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send sign-in link
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
