'use client';
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const getRedirectUrl = () => {
    // const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    // if (vercelUrl) {
    //   return `https://${vercelUrl}/auth`;
    // }
    console.log("origin:", window.location.origin);
    return `${window.location.origin}/auth/callback`;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getRedirectUrl() },
    });
    if (error) console.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication</h1>
        <div className="text-center">
          <p className="mb-4 text-gray-600">Sign in to continue</p>
          <button
            onClick={signInWithGoogle}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
