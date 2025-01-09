import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error);
      return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
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
      console.error("Error fetching user data:", userError);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Unexpected error in GET:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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