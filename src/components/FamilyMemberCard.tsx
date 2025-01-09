'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// FamilyMemberCard.tsx
export interface FamilyMemberCardProps {
  name: string;
  email: string;
  role: 'owner' | 'member';
  joinDate: string;
  onRemove?: () => Promise<void>; // Tambahkan properti opsional
}

export function FamilyMemberCard({
  name,
  email,
  role,
  joinDate,
  onRemove,
}: FamilyMemberCardProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-gray-600">{email}</p>
        <p className="text-sm text-gray-500">Role: {role}</p>
        <p className="text-sm text-gray-500">Joined: {joinDate}</p>
      </div>
      {onRemove && (
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={onRemove}
        >
          Remove
        </button>
      )}
    </div>
  );
}
