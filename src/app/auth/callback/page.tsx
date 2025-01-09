// app/auth/callback/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash.substring(1);
        const params = new URLSearchParams(hashFragment);
        
        // Extract tokens
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        
        if (!accessToken) {
          console.error('No access token found in URL');
          router.push('/auth');
          return;
        }

        // Set the session in Supabase
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          console.error('Error setting session:', error);
          router.push('/auth');
          return;
        }

        // Optional: Store additional data if needed
        if (expiresIn) {
          const expiresAt = new Date(Date.now() + parseInt(expiresIn) * 1000).toISOString();
          localStorage.setItem('expires_at', expiresAt);
        }

        // Redirect to home page
        router.push('/');
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/auth');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Processing authentication...</p>
      </div>
    </div>
  );
}