'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LibraryGameCardProps {
  title: string;
  lastPlayed: string;
  totalPlaytime: string;
  status: 'installed' | 'not_installed';
}

export function LibraryGameCard({ title, lastPlayed, totalPlaytime, status }: LibraryGameCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">
            Last played: {new Date(lastPlayed).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Total playtime: {totalPlaytime}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={status === "installed" ? "secondary" : "default"}>
            {status === "installed" ? "Play" : "Install"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}