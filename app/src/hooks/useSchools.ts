import { useCallback, useState } from 'react';
import {
  type School,
  createId,
  loadSchools,
  saveSchools,
  sampleSchools,
  SEED_FLAG_KEY,
} from '@/lib/schools';

export type NewSchool = Omit<School, 'id' | 'createdAt'>;

// Load schools from storage, seeding sample data on the very first visit.
function initSchools(): School[] {
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

export function useSchools() {
  const [schools, setSchools] = useState<School[]>(initSchools);

  const persist = useCallback((next: School[]) => {
    setSchools(next);
    saveSchools(next);
  }, []);

  const addSchool = useCallback(
    (data: NewSchool): School => {
      const school: School = {
        ...data,
        id: createId(),
        createdAt: Date.now(),
      };
      setSchools((prev) => {
        const next = [...prev, school];
        saveSchools(next);
        return next;
      });
      return school;
    },
    [],
  );

  const updateSchool = useCallback((id: string, data: Partial<NewSchool>) => {
    setSchools((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
      saveSchools(next);
      return next;
    });
  }, []);

  const removeSchool = useCallback((id: string) => {
    setSchools((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSchools(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    persist([]);
    localStorage.setItem(SEED_FLAG_KEY, '1');
  }, [persist]);

  const importSchools = useCallback((incoming: School[]) => {
    persist(incoming);
    localStorage.setItem(SEED_FLAG_KEY, '1');
  }, [persist]);

  return {
    schools,
    addSchool,
    updateSchool,
    removeSchool,
    clearAll,
    importSchools,
  };
}
