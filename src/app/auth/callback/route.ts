// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/lib/database.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

//   if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL('/dashboard', request.url));
    }
//     console.log("berhasil autentikasi")
//   }
//   else{
//     console.log("gagal autentikasi")
//   }

  // URL untuk redirect setelah autentikasi berhasil
//   return NextResponse.redirect(new URL('/', request.url));
}