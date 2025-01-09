'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFamilyGroup } from '@/lib/hooks/useFamilyGroups';
import { familyService } from '@/services/familyService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { Loader2, Users, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function FamilyPage() {
  const { user } = useAuth();
  const { familyGroup, members, loading, error, refreshMembers } = useFamilyGroup(user?.id);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to manage family sharing
          </p>
          <Link href="/auth">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </Link>
        </div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!familyGroup) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Create Family Group</CardTitle>
              <CardDescription className="text-muted-foreground">
                Share your games with family members and friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateFamily} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter family group name"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="bg-secondary/50"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isCreating}
                >
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Plus className="mr-2 h-4 w-4" />
                  Create Family Group
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card border-border max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Family Group</h2>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <Button
                onClick={refreshMembers}
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{familyGroup.name}</h1>
              <p className="text-muted-foreground">Manage your family group and sharing settings</p>
            </div>
            <form onSubmit={handleInviteMember} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter email to invite"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-secondary/50 flex-1"
                required
              />
              <Button 
                type="submit"
                disabled={isInviting}
                className="whitespace-nowrap"
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
          </div>
        </div>

        {/* Members List */}
        <div className="grid gap-4">
          {members.length > 0 ? (
            members.map((member) => (
              <FamilyMemberCard
                key={member.user_id}
                name={member.users.email}
                email={member.users.email}
                role={member.role}
                joinDate={member.created_at}
                onRemove={
                  member.role !== 'owner' && member.user_id !== user.id
                    ? () => familyService.removeMember(member.user_id, familyGroup.id)
                    : undefined
                }
              />
            ))
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No members in your family group yet.<br />
                    Invite someone to start sharing games!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sharing Settings */}
        <Card className="bg-card border-border mt-8">
          <CardHeader>
            <CardTitle>Sharing Settings</CardTitle>
            <CardDescription>Configure how your games are shared with family members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add sharing settings controls here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}