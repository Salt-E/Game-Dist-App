// app/api/family/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { name, userId } = await req.json();
    
    // Verify user exists in auth.users
    const { data: user, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Create family group
    const { data: familyGroup, error: familyError } = await supabase
      .from('family_groups')
      .insert({ name, owner_id: userId })
      .select()
      .single();
    
    if (familyError) throw familyError;

    // Add owner as family member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        user_id: userId,
        family_group_id: familyGroup.id,
        role: 'owner'
      });

    if (memberError) throw memberError;

    return NextResponse.json(familyGroup);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create family group' }, { status: 500 });
  }
}