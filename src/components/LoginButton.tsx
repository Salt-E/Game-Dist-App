'use client'

import { supabase } from '@/lib/supabase'

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
    >
      <img 
        className="w-6 h-6" 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        loading="lazy" 
        alt="google logo"
      />
      <span>Login with Google</span>
    </button>
  )
}
