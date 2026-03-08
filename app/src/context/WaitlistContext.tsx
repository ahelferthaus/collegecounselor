import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface WaitlistContextType {
  open: boolean;
  openWaitlist: () => void;
  closeWaitlist: () => void;
}

const WaitlistContext = createContext<WaitlistContextType | null>(null);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <WaitlistContext.Provider
      value={{
        open,
        openWaitlist: () => setOpen(true),
        closeWaitlist: () => setOpen(false),
      }}
    >
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be used within WaitlistProvider');
  return ctx;
}
