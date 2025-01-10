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
    // Get initial session and set up listener
    const initAuth = async () => {
      try {
        // First check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
        if (sessionError) throw sessionError;
    
        if (session?.user) {
          // Get full user data if we have a session (access from auth.users)
          const { data: userData, error: userError } = await supabase.auth.getUser()
    
          if (userError) throw userError;
          if (userData?.user?.id) {
            console.log("User ID fetched:", userData.user.id);
            setUser(userData.user ); // Pastikan ini hanya meng-assign `user`, bukan seluruh `userData`
          } // Type assertion added here
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userError) throw userError;
            
            setUser(userData as User); // Type assertion added here
            setLoading(false);
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/auth');
      }
    });

    // Initialize
    initAuth();

    // Cleanup subscription
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
