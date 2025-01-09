// app/api/games/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Get user's family group
    const { data: familyMember } = await supabase
      .from('family_members')
      .select('family_group_id')
      .eq('user_id', userId)
      .single();

    // Get games owned by user or family group members
    const { data: games, error } = await supabase
      .from('game_purchases')
      .select(`
        games (*),
        owner_id
      `)
      .or(`owner_id.eq.${userId}${familyMember ? `,owner_id.in.(
        select user_id from family_members 
        where family_group_id = '${familyMember.family_group_id}'
      )` : ''}`);

    if (error) throw error;

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}