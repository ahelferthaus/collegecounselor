import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type School,
  createId,
  loadSchools,
  saveSchools,
  sampleSchools,
  SEED_FLAG_KEY,
} from '@/lib/schools';
import { supabase } from '@/lib/supabaseClient';
import {
  deleteAll,
  deleteSchoolRow,
  fetchSchools,
  insertMany,
  insertSchool,
  replaceAll,
  updateSchoolRow,
} from '@/lib/schoolsRepo';

export type NewSchool = Omit<School, 'id' | 'createdAt'>;

function toNew(s: School): NewSchool {
  return {
    name: s.name,
    location: s.location,
    lat: s.lat,
    lng: s.lng,
    ranking: s.ranking,
    quality: s.quality,
    status: s.status,
    notes: s.notes,
    metrics: s.metrics ?? {},
  };
}

// Load schools from storage, seeding sample data on the very first visit.
function initLocal(): School[] {
  const existing = loadSchools();
  const seeded = localStorage.getItem(SEED_FLAG_KEY);
  if (existing.length === 0 && !seeded) {
    const seed = sampleSchools();
    saveSchools(seed);
    localStorage.setItem(SEED_FLAG_KEY, '1');
    return seed;
  }
  return existing;
}

export type SyncStatus = 'local' | 'loading' | 'synced' | 'error';

/**
 * Source-of-truth for tagged schools.
 * - Signed out: persisted in localStorage (works offline, no account).
 * - Signed in:  persisted in Supabase and kept live across devices via realtime.
 *   On the first sign-in, any local schools are migrated into the account.
 */
export function useSchools(userId: string | null) {
  const cloud = userId != null && supabase != null;
  const [schools, setSchools] = useState<School[]>(() =>
    cloud ? [] : initLocal(),
  );
  const [status, setStatus] = useState<SyncStatus>(cloud ? 'loading' : 'local');
  // Mirror to a ref so async cloud handlers always see the latest list.
  // Every state write goes through `apply`, which keeps the ref in sync.
  const schoolsRef = useRef(schools);

  const apply = useCallback(
    (next: School[], cache: boolean) => {
      schoolsRef.current = next;
      setSchools(next);
      if (cache) saveSchools(next); // keep a local cache for offline / sign-out
    },
    [],
  );

  // Synchronize with Supabase (an external system) whenever the signed-in user
  // changes — load the account's schools and subscribe to live updates. The
  // synchronous state writes here are the intended "sync with external system"
  // use of an effect.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!cloud || !userId || !supabase) {
      apply(initLocal(), false);
      setStatus('local');
      return;
    }
    const sb = supabase;

    let active = true;
    setStatus('loading');

    (async () => {
      try {
        let remote = await fetchSchools(userId);
        // First sign-in: lift existing local schools into the cloud account.
        const local = loadSchools();
        if (remote.length === 0 && local.length > 0) {
          remote = await insertMany(userId, local.map(toNew));
        }
        if (!active) return;
        apply(remote, true);
        setStatus('synced');
      } catch {
        if (!active) return;
        apply(loadSchools(), false); // fall back to cached copy
        setStatus('error');
      }
    })();

    const channel = sb
      .channel(`schools-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schools',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          try {
            const fresh = await fetchSchools(userId);
            if (active) apply(fresh, true);
          } catch {
            /* ignore transient realtime refetch errors */
          }
        },
      )
      .subscribe();

    return () => {
      active = false;
      sb.removeChannel(channel);
    };
  }, [cloud, userId, apply]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const addSchool = useCallback(
    async (data: NewSchool): Promise<School> => {
      if (cloud && userId) {
        const created = await insertSchool(userId, data);
        apply([...schoolsRef.current, created], true);
        return created;
      }
      const created: School = { ...data, id: createId(), createdAt: Date.now() };
      apply([...schoolsRef.current, created], true);
      return created;
    },
    [cloud, userId, apply],
  );

  const updateSchool = useCallback(
    async (id: string, data: Partial<NewSchool>) => {
      apply(
        schoolsRef.current.map((s) => (s.id === id ? { ...s, ...data } : s)),
        true,
      );
      if (cloud && userId) await updateSchoolRow(id, data);
    },
    [cloud, userId, apply],
  );

  const removeSchool = useCallback(
    async (id: string) => {
      apply(
        schoolsRef.current.filter((s) => s.id !== id),
        true,
      );
      if (cloud && userId) await deleteSchoolRow(id);
    },
    [cloud, userId, apply],
  );

  const clearAll = useCallback(async () => {
    apply([], true);
    localStorage.setItem(SEED_FLAG_KEY, '1');
    if (cloud && userId) await deleteAll(userId);
  }, [cloud, userId, apply]);

  const importSchools = useCallback(
    async (incoming: School[]) => {
      localStorage.setItem(SEED_FLAG_KEY, '1');
      if (cloud && userId) {
        const saved = await replaceAll(userId, incoming.map(toNew));
        apply(saved, true);
      } else {
        apply(incoming, true);
      }
    },
    [cloud, userId, apply],
  );

  return {
    schools,
    status,
    addSchool,
    updateSchool,
    removeSchool,
    clearAll,
    importSchools,
  };
}
