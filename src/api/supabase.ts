import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utyvtruyonihomampwjc.supabase.co'; // Remplace par ton URL Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eXZ0cnV5b25paG9tYW1wd2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjgxOTksImV4cCI6MjA2NzI0NDE5OX0.hTvUxydDdOoIObXHEfpCCLwuQYcOpX7u_xBQE1Lb1sI'; // Remplace par ta clé anonyme

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, name: string, lastname: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, lastname } } });
  if (error) throw new Error(error.message);
  // Vérifier que data.user existe avant d'accéder à son id
  if (data.user && data.user.id) {
    await supabase.from('profiles').insert([{ user_id: data.user.id, credit_balance: 1, plan: 'free' }]);
  } else {
    throw new Error('User information is missing after sign up.');
  }
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export async function incrementGenerationCount(userId: string) {
  const { data, error } = await supabase.rpc('increment_generation_count', { user_id: userId });
  return { data, error };
}

export async function checkUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('credit_balance, plan')
    .eq('user_id', userId) // ou 'id' selon ta structure
    .single();
  return { data, error };
}