import { supabase } from './supabaseClient';
import { mergeProfile, type StudentProfile } from './profile';

function client() {
  if (!supabase) throw new Error('Supabase client unavailable');
  return supabase;
}

export async function fetchProfile(userId: string): Promise<StudentProfile | null> {
  const { data, error } = await client()
    .from('campus_profiles')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mergeProfile((data as { data: unknown }).data);
}

export async function saveProfileRow(
  userId: string,
  profile: StudentProfile,
): Promise<void> {
  const { error } = await client()
    .from('campus_profiles')
    .upsert(
      { user_id: userId, data: profile, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (error) throw error;
}
