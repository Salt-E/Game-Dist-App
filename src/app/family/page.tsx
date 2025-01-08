'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFamilyGroup } from '@/lib/hooks/useFamilyGroups';
import { familyService } from '@/services/familyService';
import { Button } from '@/components/ui/button';
// ... imports lainnya tetap sama

export default function FamilyPage() {
  const { user } = useAuth();
  const { familyGroup, members, loading } = useFamilyGroup(user?.id);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreateFamily = async (name: string) => {
    try {
      await familyService.createFamilyGroup(name, user?.id!);
    } catch (error) {
      console.error('Failed to create family:', error);
    }
  };

  const handleInviteMember = async () => {
    if (!familyGroup) return;
    try {
      await familyService.inviteMember(inviteEmail, familyGroup.id);
      setInviteEmail('');
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-6">
      {!familyGroup ? (
        <div>
          <h2>Create Family Group</h2>
          {/* Add form untuk membuat family group */}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Family Management</h1>
            <Button onClick={handleInviteMember}>
              <Users className="mr-2 h-4 w-4" />
              Invite Family Member
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Family Settings</CardTitle>
              <CardDescription>
                Manage your family group and sharing settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add family settings form */}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {members.map(member => (
              <FamilyMemberCard
                key={member.user_id}
                name={member.users.email}
                email={member.users.email}
                role={member.role}
                joinDate={new Date().toISOString()}
                onRemove={
                  member.role !== 'owner' 
                    ? () => familyService.removeMember(member.user_id, familyGroup.id)
                    : undefined
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}