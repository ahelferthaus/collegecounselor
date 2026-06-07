import { useState } from 'react';
import { KeyRound, ShieldCheck, Trash2 } from 'lucide-react';
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
import { getAiKey, hasAiKey, maskKey, setAiKey } from '@/lib/aiKey';
import { cn } from '@/lib/utils';

/** Button + dialog for managing an optional personal Anthropic API key. */
export function ApiKeySettings() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(hasAiKey());

  function openDialog() {
    setValue(getAiKey());
    setSaved(hasAiKey());
    setOpen(true);
  }

  function save() {
    setAiKey(value.trim());
    setSaved(value.trim().length > 0);
    setOpen(false);
  }

  function clear() {
    setAiKey('');
    setValue('');
    setSaved(false);
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={openDialog}
        aria-label="AI key settings"
        title={saved ? 'Personal AI key saved on this device' : 'Add your Anthropic API key'}
        className={cn(saved && 'border-teal-200 text-teal-700')}
      >
        <KeyRound className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Your Anthropic API key</DialogTitle>
            <DialogDescription>
              Optional backup for the AI features. The app prefers a secure
              server-side key; if none is set, it falls back to the key you enter
              here.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="ai-key">API key</Label>
            <Input
              id="ai-key"
              type="password"
              value={value}
              placeholder="sk-ant-..."
              autoComplete="off"
              onChange={(e) => setValue(e.target.value)}
            />
            {saved && !value && (
              <p className="text-xs text-teal-700">
                A key is currently saved ({maskKey(getAiKey())}).
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            <span>
              Stored <strong>only in this browser</strong> — never saved to our
              database. It's sent solely to your own backend over HTTPS when you
              generate a plan. Get a key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:underline"
              >
                console.anthropic.com
              </a>
              .
            </span>
          </div>

          <div className="flex justify-between gap-2">
            {saved ? (
              <Button
                variant="ghost"
                onClick={clear}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-1.5 h-4 w-4" /> Remove
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={save}
                className="bg-gradient-purple-teal text-white hover:opacity-90"
              >
                Save key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
