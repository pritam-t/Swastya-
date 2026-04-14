// ============================================
// AUTH SERVICE — Supabase (with mock fallback)
// Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to .env
// ============================================
import { supabase } from '../config/supabase';

const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url !== 'your_supabase_project_url';
};

export const authService = {
  /**
   * Sign in with email + password via Supabase.
   * @returns {{ user, error }}
   */
  async signIn(email, password) {
    if (!isSupabaseConfigured()) {
      // Mock fallback for dev without Supabase
      if (email === 'pritam123' && password === '12345678') {
        return { user: { email: 'pritam123', user_metadata: { display_name: 'Pritam' } }, error: null };
      }
      if (email.includes('@') && password.length >= 6) {
        return { user: { email, user_metadata: { display_name: email.split('@')[0] } }, error: null };
      }
      return { user: null, error: { message: 'Invalid credentials. Check your email and password.' } };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data?.user || null, error };
  },

  /**
   * Sign up a new user via Supabase.
   * @returns {{ user, error }}
   */
  async signUp(email, password, displayName) {
    if (!isSupabaseConfigured()) {
      return { user: { email, user_metadata: { display_name: displayName } }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    });
    return { user: data?.user || null, error };
  },

  /**
   * Sign out the current user.
   */
  async signOut() {
    if (!isSupabaseConfigured()) return;
    await supabase.auth.signOut();
  },

  /**
   * Get the current active Supabase session.
   */
  async getSession() {
    if (!isSupabaseConfigured()) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session || null;
  },

  /**
   * Subscribe to auth state changes.
   * @param {Function} callback - Called with (event, session)
   * @returns Supabase subscription object — call .unsubscribe() on cleanup
   */
  onAuthStateChange(callback) {
    if (!isSupabaseConfigured()) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
  },

  isSupabaseConfigured,
};
