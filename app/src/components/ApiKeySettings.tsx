import { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
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
import {
  getAiKey,
  getScorecardKey,
  hasAiKey,
  setAiKey,
  setScorecardKey,
} from '@/lib/aiKey';
import { cn } from '@/lib/utils';

/** Button + dialog for managing optional personal API keys (device-only). */
export function ApiKeySettings() {
  const [open, setOpen] = useState(false);
  const [aiValue, setAiValue] = useState('');
  const [scValue, setScValue] = useState('');
  const [saved, setSaved] = useState(hasAiKey() || getScorecardKey().length > 0);

  function openDialog() {
    setAiValue(getAiKey());
    setScValue(getScorecardKey());
    setSaved(hasAiKey() || getScorecardKey().length > 0);
    setOpen(true);
  }

  function save() {
    setAiKey(aiValue.trim());
    setScorecardKey(scValue.trim());
    setSaved(aiValue.trim().length > 0 || scValue.trim().length > 0);
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={openDialog}
        aria-label="API key settings"
        title="API keys"
        className={cn(saved && 'border-teal-200 text-teal-700')}
      >
        <KeyRound className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">API keys</DialogTitle>
            <DialogDescription>
              Optional keys for the AI and college-data features. Stored only in
              this browser — never saved to our database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="ai-key">Anthropic API key (AI plan & suggestions)</Label>
            <Input
              id="ai-key"
              type="password"
              value={aiValue}
              placeholder="sk-ant-..."
              autoComplete="off"
              onChange={(e) => setAiValue(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Get one at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:underline"
              >
                console.anthropic.com
              </a>
              . Used as a fallback when no server key is set.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sc-key">College Scorecard key (rankings & fit data)</Label>
            <Input
              id="sc-key"
              type="password"
              value={scValue}
              placeholder="your data.gov key"
              autoComplete="off"
              onChange={(e) => setScValue(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              Free, instant signup at{' '}
              <a
                href="https://api.data.gov/signup/"
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 hover:underline"
              >
                api.data.gov/signup
              </a>
              . Lifts the shared DEMO_KEY rate limit (needed to load 200 schools).
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            <span>
              Both keys live <strong>only in this browser</strong>. The Anthropic
              key is sent solely to your own backend over HTTPS; the Scorecard key
              is used for public, non-sensitive college data.
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={save}
              className="bg-gradient-purple-teal text-white hover:opacity-90"
            >
              Save keys
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
