// app/api/games/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const id = new URL(request.url).pathname.split('/').pop();

    // Get game details
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select(`
        id,
        title,
        description,
        price,
        genre,
        created_at,
        game_purchases(owner_id)
      `)
      .eq('id', id)
      .single();

    if (gameError) throw gameError;

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Check if user or their family members own the game
    const { data: familyMember } = await supabase
      .from('family_members')
      .select('family_group_id')
      .eq('user_id', session.user.id)
      .single();

    let isOwned = false;
    let owner = null;

    if (game.game_purchases && game.game_purchases.length > 0) {
      const ownerIds = game.game_purchases.map(p => p.owner_id);

      // Check if user owns the game
      if (ownerIds.includes(session.user.id)) {
        isOwned = true;
        owner = session.user.id;
      }
      // Check if any family member owns the game
      else if (familyMember) {
        const { data: familyMembers } = await supabase
          .from('family_members')
          .select('user_id')
          .eq('family_group_id', familyMember.family_group_id);

        if (familyMembers) {
          const familyUserIds = familyMembers.map(member => member.user_id);

          const { data: familyOwnership } = await supabase
            .from('game_purchases')
            .select('owner_id')
            .eq('game_id', id)
            .in('owner_id', familyUserIds)
            .single();

          if (familyOwnership) {
            isOwned = true;
            owner = familyOwnership.owner_id;
          }
        }
      }
    }

    return NextResponse.json({
      ...game,
      is_owned: isOwned,
      owner_id: owner
    });
  } catch (error) {
    console.error("[Game API Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch game details" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const id = new URL(request.url).pathname.split('/').pop();
    const body = await request.json();

    // Update game details
    const { data, error } = await supabase
      .from('games')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Game Update Error]:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const id = new URL(request.url).pathname.split('/').pop();

    // Delete game
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error("[Game Delete Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
