// useFamilyGroups.ts
import { useState, useEffect } from 'react';
import { FamilyGroup, FamilyMember } from '@/types/types';
import { supabase } from '@/lib/supabase';

export function useFamilyGroup(userId?: string) {
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFamilyData = async () => {
      try {
        const { data: memberData, error: memberError } = await supabase
          .from('family_members')
          .select(`
            family_group_id,
            role,
            family_groups (
              id,
              owner_id,
              name
            )
          `)
          .eq('user_id', userId)
          .single();

        if (memberError) throw memberError;

        if (memberData?.family_groups) {
          setFamilyGroup(memberData.family_groups as unknown as FamilyGroup);

          const { data: membersData, error: membersError } = await supabase
            .from('family_members')
            .select(`
              user_id,
              role,
              family_group_id,
              users (
                id,
                email
              )
            `)
            .eq('family_group_id', memberData.family_group_id);

          if (membersError) throw membersError;

          setMembers(membersData as unknown as FamilyMember[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch family data'));
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [userId]);

  const refreshMembers = async () => {
    if (!familyGroup) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          user_id,
          role,
          family_group_id,
          users (
            id,
            email
          )
        `)
        .eq('family_group_id', familyGroup.id);

      if (error) throw error;
      setMembers(data as unknown as FamilyMember[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh members'));
    } finally {
      setLoading(false);
    }
  };

  return { familyGroup, members, loading, error, refreshMembers };
}