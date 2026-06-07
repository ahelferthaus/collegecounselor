import { supabase } from './supabaseClient';
import type { NewSchool } from '@/hooks/useSchools';
import type { Quality, School, Status } from './schools';

// Shape of a row in the public.schools table.
interface SchoolRow {
  id: string;
  user_id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  ranking: number;
  quality: Quality | null;
  status: Status;
  notes: string;
  metrics: Record<string, number> | null;
  created_at: string;
}

function rowToSchool(r: SchoolRow): School {
  return {
    id: r.id,
    name: r.name,
    location: r.location ?? '',
    lat: r.lat,
    lng: r.lng,
    ranking: r.ranking ?? 0,
    quality: r.quality ?? null,
    status: r.status ?? 'considering',
    notes: r.notes ?? '',
    metrics: r.metrics ?? {},
    createdAt: r.created_at ? Date.parse(r.created_at) : Date.now(),
  };
}

function toRowFields(data: NewSchool, userId: string) {
  return {
    user_id: userId,
    name: data.name,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    ranking: data.ranking,
    quality: data.quality,
    status: data.status,
    notes: data.notes,
    metrics: data.metrics,
  };
}

function client() {
  if (!supabase) throw new Error('Supabase client unavailable');
  return supabase;
}

export async function fetchSchools(userId: string): Promise<School[]> {
  const { data, error } = await client()
    .from('schools')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as SchoolRow[]).map(rowToSchool);
}

export async function insertSchool(
  userId: string,
  data: NewSchool,
): Promise<School> {
  const { data: row, error } = await client()
    .from('schools')
    .insert(toRowFields(data, userId))
    .select()
    .single();
  if (error) throw error;
  return rowToSchool(row as SchoolRow);
}

export async function updateSchoolRow(
  id: string,
  data: Partial<NewSchool>,
): Promise<void> {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) patch[k] = v;
  const { error } = await client().from('schools').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteSchoolRow(id: string): Promise<void> {
  const { error } = await client().from('schools').delete().eq('id', id);
  if (error) throw error;
}

// Bulk insert (used to migrate local schools into a freshly signed-in account).
export async function insertMany(
  userId: string,
  schools: NewSchool[],
): Promise<School[]> {
  if (schools.length === 0) return [];
  const { data, error } = await client()
    .from('schools')
    .insert(schools.map((s) => toRowFields(s, userId)))
    .select();
  if (error) throw error;
  return (data as SchoolRow[]).map(rowToSchool);
}

// Replace the whole account with an imported set.
export async function replaceAll(
  userId: string,
  schools: NewSchool[],
): Promise<School[]> {
  const { error: delErr } = await client()
    .from('schools')
    .delete()
    .eq('user_id', userId);
  if (delErr) throw delErr;
  return insertMany(userId, schools);
}

export async function deleteAll(userId: string): Promise<void> {
  const { error } = await client()
    .from('schools')
    .delete()
    .eq('user_id', userId);
  if (error) throw error;
}
