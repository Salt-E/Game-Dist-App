// app/family/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFamilyGroup } from '@/lib/hooks/useFamilyGroups';
import { familyService } from '@/services/familyService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { Loader2, Users, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function FamilyPage() {
  const { user } = useAuth();
  const { familyGroup, members, loading, error, refreshMembers } = useFamilyGroup(user?.id);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!user) {
    return (
      <div className="py-6 text-center">
        <p>Please sign in to manage your family group</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;

    try {
      setIsCreating(true);
      const { error } = await familyService.createFamilyGroup(newFamilyName, user.id);
      if (error) throw new Error(error);
      
      toast.success('Family group created successfully');
      refreshMembers();
    } catch (err) {
      toast.error('Failed to create family group');
    } finally {
      setIsCreating(false);
      setNewFamilyName('');
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyGroup || !inviteEmail.trim()) return;

    try {
      setIsInviting(true);
      const { error } = await familyService.inviteMember(inviteEmail, familyGroup.id);
      if (error) throw new Error(error);

      toast.success('Invitation sent successfully');
      refreshMembers();
    } catch (err) {
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
      setInviteEmail('');
    }
  };

  if (!familyGroup) {
    return (
      <div className="py-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Family Group</CardTitle>
            <CardDescription>
              Create a family group to share your games with family members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <Input
                placeholder="Family Group Name"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isCreating}
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Family Group
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Family Management</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{familyGroup.name}</CardTitle>
          <CardDescription>
            Manage your family group members and sharing settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInviteMember} className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter email to invite"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button 
              type="submit"
              disabled={isInviting}
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Invite Member
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {members.map((member) => (
          <FamilyMemberCard
            key={member.user_id}
            name={member.users.email}
            email={member.users.email}
            role={member.role}
            joinDate={member.created_at}
            onRemove={
              member.role !== 'owner'
                ? () => familyService.removeMember(member.user_id, familyGroup.id)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}