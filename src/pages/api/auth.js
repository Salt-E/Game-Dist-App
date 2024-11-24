import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

// Inisialisasi Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AuthPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Pantau status autentikasi
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
        router.push('/dashboard'); // Redirect ke dashboard setelah login
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    const getRedirectUrl = () => {
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
        return 'https://game-dist-app.vercel.app/auth';
      }
      return 'http://localhost:3000/auth';
    };

    // Ambil sesi saat komponen dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
    });

    return () => authListener.unsubscribe();
  }, [router]);

  // Fungsi untuk login
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });
    if (error) console.error('Login error:', error.message);
  };

  // Fungsi untuk logout
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Logout error:', error.message);
  };

  return (
    <div className="auth-page">
      <h1>Authentication Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Please sign in using Google</p>
          <button onClick={handleSignIn}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
}
