import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Loader2, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

/**
 * Gate for the private tools. Sends signed-out visitors to /login, and shows a
 * "not authorized" screen for a valid session whose email isn't allowlisted.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, email, allowed, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowed) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <h1 className="font-heading text-lg font-bold text-navy-900">
            Not authorized
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-navy-800">{email}</span> isn't on
            the access list for this app yet.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
          <Link
            to="/"
            className="mt-3 inline-block text-xs text-muted-foreground hover:text-navy-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
