import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type StudentProfile,
  emptyProfile,
  loadProfile,
  saveProfile,
} from '@/lib/profile';
import { supabase } from '@/lib/supabaseClient';
import { fetchProfile, saveProfileRow } from '@/lib/profileRepo';
import type { SyncStatus } from './useSchools';

/**
 * Single student-profile document.
 * - Signed out: persisted in localStorage.
 * - Signed in:  loaded from Supabase and written back (debounced). The first
 *   sign-in pushes any existing local profile into the account.
 * Writes always hit localStorage immediately so nothing is ever lost.
 */
export function useProfile(userId: string | null) {
  const cloud = userId != null && supabase != null;
  const [profile, setProfile] = useState<StudentProfile>(
    () => loadProfile() ?? emptyProfile(),
  );
  const [status, setStatus] = useState<SyncStatus>(cloud ? 'loading' : 'local');
  const profileRef = useRef(profile);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from the account on sign-in (and migrate local data if cloud is empty).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!cloud || !userId) {
      setStatus('local');
      return;
    }
    let active = true;
    setStatus('loading');
    (async () => {
      try {
        const remote = await fetchProfile(userId);
        if (!active) return;
        if (remote) {
          profileRef.current = remote;
          setProfile(remote);
          saveProfile(remote);
        } else {
          // No cloud profile yet — seed it from whatever is local.
          await saveProfileRow(userId, profileRef.current);
        }
        setStatus('synced');
      } catch {
        if (active) setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [cloud, userId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Flush pending debounced save on unmount.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const persist = useCallback(
    (next: StudentProfile) => {
      profileRef.current = next;
      setProfile(next);
      saveProfile(next); // local cache, immediate
      if (!cloud || !userId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setStatus('loading');
      saveTimer.current = setTimeout(async () => {
        try {
          await saveProfileRow(userId, next);
          setStatus('synced');
        } catch {
          setStatus('error');
        }
      }, 800);
    },
    [cloud, userId],
  );

  // Apply a partial update via an updater over the current profile.
  const update = useCallback(
    (updater: (p: StudentProfile) => StudentProfile) => {
      const next = { ...updater(profileRef.current), updatedAt: Date.now() };
      persist(next);
    },
    [persist],
  );

  return { profile, status, update };
}
