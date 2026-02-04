import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  getSession,
  setSession,
  clearSession,
  validateCredentials,
  createUser,
  type UserSession,
} from '../lib/auth';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  showAuthModal: (mode: 'login' | 'register') => void;
  hideAuthModal: () => void;
  authModalState: { isOpen: boolean; mode: 'login' | 'register' };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = validateCredentials(username, password);
    if (result.success && result.user) {
      const session: UserSession = {
        userId: result.user.id,
        username: result.user.username,
        displayName: result.user.displayName,
        loginAt: new Date().toISOString(),
      };
      setSession(session);
      setUser(session);
      setAuthModalState({ isOpen: false, mode: 'login' });
      return { success: true };
    }
    return { success: false, error: result.error || 'Invalid credentials' };
  }, []);

  const register = useCallback(async (username: string, password: string, displayName: string) => {
    const result = createUser(username, password, displayName);
    if (result.success && result.user) {
      // Auto-login after registration
      const session: UserSession = {
        userId: result.user.id,
        username: result.user.username,
        displayName: result.user.displayName,
        loginAt: new Date().toISOString(),
      };
      setSession(session);
      setUser(session);
      setAuthModalState({ isOpen: false, mode: 'login' });
      return { success: true };
    }
    return { success: false, error: result.error || 'Registration failed' };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const showAuthModal = useCallback((mode: 'login' | 'register') => {
    setAuthModalState({ isOpen: true, mode });
  }, []);

  const hideAuthModal = useCallback(() => {
    setAuthModalState({ isOpen: false, mode: 'login' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        showAuthModal,
        hideAuthModal,
        authModalState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
