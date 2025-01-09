// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User } from '@/types/types';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initUser = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('auth.users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;
          
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // Set up realtime subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      
      if (session?.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('auth.users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;
          
          setUser(userData);
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err instanceof Error ? err : new Error('Authentication state change error'));
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
      
      // Handle sign out
      if (event === 'SIGNED_OUT') {
        router.push('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      router.push('/auth');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error('Logout error'));
    }
  };

  return { user, loading, error, logout };
}