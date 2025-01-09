'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const hashFragment = window.location.hash.substring(1);
        const params = new URLSearchParams(hashFragment);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) throw error;

        router.push('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth?error=auth_callback_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg">Authenticating...</p>
      </div>
    </div>
  );
}