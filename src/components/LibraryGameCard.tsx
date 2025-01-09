// components/LibraryGameCard.tsx
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Download, Clock, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export interface LibraryGameCardProps {
  id: string;
  title: string;
  lastPlayed: string | null;
  totalPlaytime: string;
  status: 'installed' | 'not_installed';
  onInstall?: () => Promise<void>;
  onPlay?: () => Promise<void>;
}

export function LibraryGameCard({
  id,
  title,
  lastPlayed,
  totalPlaytime,
  status,
  onInstall,
  onPlay
}: LibraryGameCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      if (status === 'installed' && onPlay) {
        await onPlay();
        toast.success(`Launching ${title}`);
      } else if (status === 'not_installed' && onInstall) {
        await onInstall();
        toast.success(`Installing ${title}`);
      }
    } catch (error) {
      toast.error(
        status === 'installed' 
          ? `Failed to launch ${title}` 
          : `Failed to install ${title}`
      );
      console.error('Game action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{totalPlaytime}</span>
              </div>

              {lastPlayed && (
                <div className="flex items-center gap-1">
                  <RotateCcw className="h-4 w-4" />
                  <span>
                    Last played: {new Date(lastPlayed).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <Badge variant={status === 'installed' ? 'default' : 'secondary'}>
                {status === 'installed' ? 'Installed' : 'Not Installed'}
              </Badge>
            </div>
          </div>

          <Button
            variant={status === 'installed' ? 'default' : 'secondary'}
            onClick={handleAction}
            disabled={isLoading || (!onInstall && !onPlay)}
            className="ml-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === 'installed' ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Install
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}