'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { searchParams, hash } = new URL(window.location.href);
        const code = searchParams.get('code');
        
        // Handle the OAuth callback
        const { error } = await supabase.auth.exchangeCodeForSession(code || '');

        if (error) {
          throw error;
        }

        // Fetch the user data after successful authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;

        if (user) {
          // Check if user exists in users table
          const { data: existingUser, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (dbError && dbError.code !== 'PGRST116') { // PGRST116 means no rows returned
            throw dbError;
          }

          // If user doesn't exist, create new user record
          if (!existingUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email,
                created_at: new Date().toISOString()
              });

            if (insertError) throw insertError;
          }
        }

        router.push('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Setting up your account...</p>
      </div>
    </div>
  );
}