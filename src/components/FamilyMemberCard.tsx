// components/FamilyMemberCard.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserMinus, Mail, UserCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export interface FamilyMemberCardProps {
  name: string;
  email: string;
  role: 'owner' | 'member';
  joinDate: string;
  onRemove?: () => Promise<{ error?: string }>;
}

export function FamilyMemberCard({
  name,
  email,
  role,
  joinDate,
  onRemove,
}: FamilyMemberCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (!onRemove || !confirm('Are you sure you want to remove this family member?')) {
      return;
    }

    try {
      setIsRemoving(true);
      const { error } = await onRemove();
      
      if (error) {
        throw new Error(error);
      }

      toast.success(`${name} has been removed from the family group`);
    } catch (error) {
      toast.error('Failed to remove family member');
      console.error('Remove member error:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-lg">{name}</h3>
              <Badge 
                variant={role === 'owner' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {role}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Joined {new Date(joinDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {onRemove && (
            <div>
              <Button
                size="sm"
                onClick={handleRemove}
                disabled={isRemoving}
                className="flex items-center gap-2"
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserMinus className="h-4 w-4" />
                )}
                <span className="sr-only">Remove member</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}