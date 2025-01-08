import { useState, useEffect } from 'react';
import { FamilyGroup, FamilyMember } from '@/types/types';
import { supabase } from '@/lib/supabase';

export function useFamilyGroup(userId?: string) {
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchFamilyData = async () => {
      try {
        // Get user's family group
        const { data: memberData, error: memberError } = await supabase
          .from('family_members')
          .select(
            `
            family_group_id,
            role,
            family_groups (
              id,
              owner_id,
              name
            )
          `
          )
          .eq('user_id', userId)
          .single(); // Ensure we get a single record

        if (memberError) {
          console.error('Error fetching family group:', memberError);
          setLoading(false);
          return;
        }

        // Validate and set family group
        if (memberData?.family_groups) {
          const group = memberData.family_groups as unknown as FamilyGroup; // Cast data to FamilyGroup
          setFamilyGroup(group);

          // Get all family members
          const { data: membersData, error: membersError } = await supabase
            .from('family_members')
            .select(
              `
              user_id,
              role,
              family_group_id,
              users (
                id,
                email
              )
            `
            )
            .eq('family_group_id', memberData.family_group_id);

          if (membersError) {
            console.error('Error fetching family members:', membersError);
          } else if (membersData) {
            // Map data to ensure compatibility with FamilyMember type
            const formattedMembers: FamilyMember[] = membersData.map((member) => ({
              user_id: member.user_id,
              family_group_id: member.family_group_id,
              role: member.role,
            }));
            setMembers(formattedMembers);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Unexpected error:', error);
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [userId]);

  return { familyGroup, members, loading };
}
