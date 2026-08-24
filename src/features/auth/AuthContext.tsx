'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { getLocalScores } from '@/lib/progressLocal';
import { getLocalQuiz, markLocalQuizSynced } from '@/lib/quizLocal';

interface User {
  id: string;
  name: string;
  email: string;
  ageGroup: string;
  digitalConfidence: number;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  ageGroup: string;
  digitalConfidence: number;
}

const TOKEN_KEY = 'cyberescape:token';
const AUTH_EVENT_KEY = 'cyberescape:auth_event';
const PROTECTED_ROUTES = ['/hub', '/dashboard', '/profile', '/admin', '/rooms', '/certificate'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleSessionExpired = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setUser(null);
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
      router.replace('/login');
    }
  }, [pathname, router]);

  // Check if user is already authenticated on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response: any = await api.get('/auth/me');
        if (isMounted && response?.data?.user) {
          setUser(response.data.user);
          syncLocalData();
        }
      } catch {
        if (isMounted) {
          try {
            localStorage.removeItem(TOKEN_KEY);
          } catch {}
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // 1. Cross-tab synchronization via BroadcastChannel
    let authChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        authChannel = new BroadcastChannel('cyberescape_auth_channel');
        authChannel.onmessage = (event) => {
          if (event.data?.type === 'LOGOUT') {
            setUser(null);
            handleSessionExpired();
          } else if (event.data?.type === 'LOGIN') {
            checkAuth();
          }
        };
      }
    } catch {}

    // 2. Cross-tab fallback synchronization via StorageEvent
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_EVENT_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.type === 'LOGOUT') {
            setUser(null);
            handleSessionExpired();
          } else if (parsed.type === 'LOGIN') {
            checkAuth();
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. API 401 session expiration event
    const handleAuthExpiredEvent = () => {
      handleSessionExpired();
    };
    window.addEventListener('cyberescape:auth_expired', handleAuthExpiredEvent);

    return () => {
      isMounted = false;
      if (authChannel) {
        authChannel.close();
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cyberescape:auth_expired', handleAuthExpiredEvent);
    };
  }, [handleSessionExpired]);

  const broadcastAuthEvent = (type: 'LOGIN' | 'LOGOUT') => {
    try {
      localStorage.setItem(AUTH_EVENT_KEY, JSON.stringify({ type, timestamp: Date.now() }));
    } catch {}

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('cyberescape_auth_channel');
        channel.postMessage({ type, timestamp: Date.now() });
        channel.close();
      }
    } catch {}
  };

  const login = async (email: string, password: string) => {
    const response: any = await api.post('/auth/login', { email, password });
    const { user: authenticatedUser, token } = response.data;
    
    if (token) {
      try {
        localStorage.setItem(TOKEN_KEY, token);
      } catch {}
    }

    setUser(authenticatedUser);
    broadcastAuthEvent('LOGIN');
    syncLocalData();
    return authenticatedUser;
  };

  const register = async (data: RegisterData) => {
    const response: any = await api.post('/auth/register', data);
    const { user: registeredUser, token } = response.data;

    if (token) {
      try {
        localStorage.setItem(TOKEN_KEY, token);
      } catch {}
    }

    setUser(registeredUser);
    broadcastAuthEvent('LOGIN');
    syncLocalData();
    return registeredUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}

    try {
      localStorage.removeItem(TOKEN_KEY);
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch {}

    setUser(null);
    broadcastAuthEvent('LOGOUT');
    router.replace('/');
  };

  const syncLocalData = async () => {
    try {
      const preQuiz = getLocalQuiz('pre');
      if (preQuiz && !preQuiz.synced) {
        try {
          if (preQuiz.answers && preQuiz.answers.length > 0) {
            await api.post('/quiz', { type: 'pre', answers: preQuiz.answers });
          }
          markLocalQuizSynced('pre');
        } catch (e) {
          console.error('Failed to sync preQuiz', e);
        }
      }

      const postQuiz = getLocalQuiz('post');
      if (postQuiz && !postQuiz.synced) {
        try {
          if (postQuiz.answers && postQuiz.answers.length > 0) {
            await api.post('/quiz', { type: 'post', answers: postQuiz.answers });
          }
          markLocalQuizSynced('post');
        } catch (e) {
          console.error('Failed to sync postQuiz', e);
        }
      }

      const localScores = getLocalScores();
      if (localScores.length > 0) {
        let allSynced = true;
        for (const score of localScores) {
          try {
            await api.post('/scores', {
              roomId: score.roomId,
              score: score.score,
              maxScore: score.maxScore,
              hintsUsed: score.hintsUsed,
              timeSpent: score.timeSpent,
            });
          } catch (e) {
            console.error('Failed to sync score for room', score.roomId, e);
            allSynced = false;
          }
        }
        if (allSynced) {
          localStorage.removeItem('cyberescape:scores');
          localStorage.removeItem('cyberescape:progress');
        }
      }
    } catch (error) {
      console.error('Failed to execute syncLocalData', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
