// app/api/family/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { name, userId } = await request.json();
    console.log("name:", name)
    console.log("userId:", userId)
    
    if (!name || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Start transaction
    const { data: familyGroup, error: familyError } = await supabase
      .from('family_groups')
      .insert({ name: name, owner_id: userId })
      .select()
      .single();
    
    if (familyError) {
      throw familyError;
    }

    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        user_id: userId,
        family_group_id: familyGroup.id,
        role: 'owner'
      });

    if (memberError) {
      // Rollback family group creation
      await supabase
        .from('family_groups')
        .delete()
        .eq('id', familyGroup.id);
      throw memberError;
    }

    return NextResponse.json(familyGroup);
  } catch (error) {
    console.error("[Family API Error]:", error);
    return NextResponse.json(
      { error: "Failed to create family group" },
      { status: 500 }
    );
  }
}