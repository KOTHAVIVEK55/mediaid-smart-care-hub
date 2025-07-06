
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'staff';
  created_at: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'patient' | 'doctor' | 'staff') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, name: string, role: 'patient' | 'doctor' | 'staff') => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name,
          email,
          role
        });

      if (profileError) throw profileError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Type assertion to ensure role is properly typed
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Role-based navigation
  const navigateBasedOnRole = (role: string) => {
    switch (role) {
      case 'patient':
        if (window.location.pathname !== '/dashboard/patient') {
          window.location.href = '/dashboard/patient';
        }
        break;
      case 'doctor':
        if (window.location.pathname !== '/dashboard/doctor') {
          window.location.href = '/dashboard/doctor';
        }
        break;
      case 'staff':
        if (window.location.pathname !== '/dashboard/staff') {
          window.location.href = '/dashboard/staff';
        }
        break;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile from our users table
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
            
            // Navigate based on role if profile exists
            if (profile && window.location.pathname === '/') {
              navigateBasedOnRole(profile.role);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
          
          // Navigate based on role if profile exists
          if (profile && window.location.pathname === '/') {
            navigateBasedOnRole(profile.role);
          }
          
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    userProfile,
    session,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
