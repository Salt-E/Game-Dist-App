import { supabase } from '@/lib/supabase';

export const familyService = {
  async createFamilyGroup(name: string, userId: string) {
    const response = await fetch('/api/family', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create family group');
    }
    
    return response.json();
  },

  async inviteMember(email: string, familyGroupId: string) {
    const response = await fetch('/api/family/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, familyGroupId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to invite member');
    }
    
    return response.json();
  },

  async removeMember(userId: string, familyGroupId: string) {
    const { error } = await supabase
      .from('family_members')
      .delete()
      .match({ user_id: userId, family_group_id: familyGroupId });
    
    if (error) throw error;
  }
};