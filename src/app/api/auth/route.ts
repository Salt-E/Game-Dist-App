// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (userError) {
      throw userError;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[Auth API Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.action) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    if (body.action === "logout") {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
      }
      return NextResponse.json({ message: "Logged out successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Unexpected error in POST:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}