
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'user'; // Default fallback
      }
      
      console.log('User role fetched:', data?.role);
      return data?.role || 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user'; // Default fallback
    }
  };

  // Separate effect for role fetching to avoid auth callback deadlocks
  useEffect(() => {
    if (user?.id && !userRole) {
      console.log('Fetching role for authenticated user:', user.id);
      // Use setTimeout to defer the role fetching and avoid blocking
      setTimeout(async () => {
        const role = await fetchUserRole(user.id);
        setUserRole(role);
        console.log('User role set to:', role);
      }, 0);
    } else if (!user) {
      setUserRole(null);
    }
  }, [user?.id, userRole]);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener - NO async operations here to prevent deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Always set loading to false after auth state changes
        setLoading(false);
        
        // Clear role when user logs out
        if (!session?.user) {
          console.log('No user, clearing role');
          setUserRole(null);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('Attempting to sign up:', email);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
