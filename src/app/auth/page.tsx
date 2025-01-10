'use client';

import { useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Separate component for the auth content
function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuthContext();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get('redirectTo') || '/dashboard';
      router.push(redirectTo);
    }
  }, [user, router, searchParams]);

  const getRedirectUrl = () => {
    return `${window.location.origin}/auth/callback`;
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { 
          redirectTo: getRedirectUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (loading || user) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Authentication</h1>
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">Sign in to continue</p>
        <Button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <img 
            src="/google-logo.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function AuthLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// Main page component
export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={<AuthLoading />}>
        <AuthContent />
      </Suspense>
    </div>
  );
}