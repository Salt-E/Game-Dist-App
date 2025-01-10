import { supabase } from '@/lib/supabase';
import { FamilyGroup, FamilyMember } from '@/types/types';

interface CreateFamilyGroupResponse {
  familyGroup?: FamilyGroup;
  error?: string;
}

interface InviteMemberResponse {
  member?: FamilyMember;
  error?: string;
}

interface RemoveMemberResponse {
  success: boolean;
  error?: string;
}

export const familyService = {
  async createFamilyGroup(
    name: string,
    userId: string
  ): Promise<CreateFamilyGroupResponse> {
    try {
      console.log("Request payload:", { name, userId });
      const response = await fetch('/api/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          error: errorText || 'Failed to create family group'
        };
      }

      const familyGroup = await response.json();
      return { familyGroup };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async inviteMember(
    email: string,
    familyGroupId: string
  ): Promise<InviteMemberResponse> {
    try {
      const response = await fetch('/api/family/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, familyGroupId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          error: errorText || 'Failed to invite member'
        };
      }

      const member = await response.json();
      return { member };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async removeMember(
    userId: string,
    familyGroupId: string
  ): Promise<RemoveMemberResponse> {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .match({
          user_id: userId,
          family_group_id: familyGroupId,
          role: 'member' // Prevent removing owners
        });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove member'
      };
    }
  }
};