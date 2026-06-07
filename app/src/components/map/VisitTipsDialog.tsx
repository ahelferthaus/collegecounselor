import { useState } from 'react';
import { Lightbulb, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VISIT_TIPS, QUESTIONS_TO_ASK } from '@/lib/visitTips';

/** Button + scrollable dialog of campus-visit tips and questions to ask. */
export function VisitTipsDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Campus visit tips"
        title="Campus visit tips"
      >
        <Lightbulb className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Tips for a great campus visit
            </DialogTitle>
            <DialogDescription>
              Make the most of every visit — and know what to look for.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {VISIT_TIPS.map((phase) => (
              <div key={phase.phase}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                  {phase.phase}
                </h3>
                <ul className="space-y-2.5">
                  {phase.tips.map((tip) => (
                    <li key={tip.title} className="flex gap-2.5">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">{tip.title}</p>
                        <p className="text-sm text-muted-foreground">{tip.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-xl bg-muted/60 p-3">
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                <HelpCircle className="h-4 w-4 text-purple-500" /> Questions to ask
              </h3>
              <ul className="space-y-1">
                {QUESTIONS_TO_ASK.map((q) => (
                  <li key={q} className="flex gap-2 text-sm text-navy-800">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
