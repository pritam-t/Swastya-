import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize user from either Supabase or mock to a consistent shape
  const normalizeUser = (rawUser) => {
    if (!rawUser) return null;
    return {
      id: rawUser.id || rawUser.email,
      email: rawUser.email,
      displayName: rawUser.user_metadata?.display_name || rawUser.email?.split('@')[0] || 'User',
    };
  };

  useEffect(() => {
    // Initialize: check for existing Supabase session
    const init = async () => {
      const session = await authService.getSession();
      setUser(session ? normalizeUser(session.user) : null);
      setLoading(false);
    };
    init();

    // Listen to Supabase auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setUser(session ? normalizeUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { user: rawUser, error } = await authService.signIn(email, password);
    if (rawUser && !error) {
      setUser(normalizeUser(rawUser));
      return { success: true, error: null };
    }
    return { success: false, error: error?.message || 'Sign in failed.' };
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    const { user: rawUser, error } = await authService.signUp(email, password, displayName);
    if (rawUser && !error) {
      setUser(normalizeUser(rawUser));
      return { success: true, error: null };
    }
    return { success: false, error: error?.message || 'Sign up failed.' };
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
