'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FamilyMemberCardProps {
  name: string;
  email: string;
  role: 'owner' | 'member';
  joinDate: string;
}

export function FamilyMemberCard({ name, email, role, joinDate }: FamilyMemberCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">
            Joined: {new Date(joinDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={role === 'owner' ? 'default' : 'secondary'}>
            {role}
          </Badge>
          {role !== 'owner' && (
            <Button variant="outline" size="sm">
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}