// app/api/family/members/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
      const { email, familyGroupId } = await req.json();
  
      // Get user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single();
  
      if (userError) throw userError;
  
      // Add member to family group
      const { data: member, error: memberError } = await supabase
        .from('family_members')
        .insert({
          user_id: user.id,
          family_group_id: familyGroupId,
          role: 'member'
        })
        .select()
        .single();
  
      if (memberError) throw memberError;
  
      return NextResponse.json(member);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to add family member' }, { status: 500 });
    }
  }
  