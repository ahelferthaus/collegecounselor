import { Link } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Trophy, UserRound, Map } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SyncMenu } from '@/components/map/SyncMenu';
import { AcademicsSection } from '@/components/profile/AcademicsSection';
import { ExtracurricularsSection } from '@/components/profile/ExtracurricularsSection';
import { WhoIAmSection } from '@/components/profile/WhoIAmSection';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

const STATUS_TEXT: Record<string, string> = {
  local: 'Saved on this device',
  loading: 'Saving…',
  synced: 'Synced to your account',
  error: 'Saved locally (sync error)',
};

export function ProfilePage() {
  const { userId, email, signInWithEmail, signOut } = useAuth();
  const { profile, status, update } = useProfile(userId);

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-700 transition-colors hover:bg-gray-100"
            aria-label="Back to College Counselor"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-base font-bold leading-tight text-navy-900">
              My Profile
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {STATUS_TEXT[status] ?? 'Saved on this device'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/map"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 sm:flex"
          >
            <Map className="h-4 w-4" /> Campus Map
          </Link>
          <SyncMenu
            configured={isSupabaseConfigured}
            email={email}
            status={status}
            onSignIn={signInWithEmail}
            onSignOut={signOut}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
        <div className="mb-5">
          <h2 className="font-heading text-2xl font-bold text-navy-900">
            Build your student profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The more complete this is, the better your fit suggestions, chances
            estimate, and personalized "how to improve" plan will be.
          </p>
        </div>

        <Tabs defaultValue="academics">
          <TabsList className="mb-5 grid w-full grid-cols-3 sm:w-auto sm:inline-grid">
            <TabsTrigger value="academics" className="gap-1.5">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">My </span>Academics
            </TabsTrigger>
            <TabsTrigger value="extracurriculars" className="gap-1.5">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">My </span>Activities
            </TabsTrigger>
            <TabsTrigger value="whoiam" className="gap-1.5">
              <UserRound className="h-4 w-4" />
              Who I Am
            </TabsTrigger>
          </TabsList>

          <TabsContent value="academics">
            <AcademicsSection profile={profile} update={update} />
          </TabsContent>
          <TabsContent value="extracurriculars">
            <ExtracurricularsSection profile={profile} update={update} />
          </TabsContent>
          <TabsContent value="whoiam">
            <WhoIAmSection profile={profile} update={update} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
