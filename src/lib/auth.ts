import { supabase } from '@/integrations/supabase/client';

export async function loginWithCredentials(username: string, password: string) {
  const email = `${username}@playbook.local`;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function createClientAuth(username: string, password: string) {
  // Use admin client to create user via edge function or directly
  const email = `${username}@playbook.local`;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function generatePassword(length = 16): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function brandToUsername(brandName: string): string {
  return brandName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
}
