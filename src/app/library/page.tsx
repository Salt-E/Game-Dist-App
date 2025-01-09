// app/library/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGames } from '@/lib/hooks/useGames';
import { LibraryGameCard } from "@/components/LibraryGameCard";
import { Loader2 } from 'lucide-react';

export default function LibraryPage() {
  const { user } = useAuth();
  const { games, loading, error, refreshGames } = useGames(user?.id, {
    includeFamily: true
  });

  if (!user) {
    return (
      <div className="py-6 text-center">
        <p>Please sign in to view your library</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-red-600">Error: Failed to load your library</p>
        <button 
          onClick={refreshGames}
          className="mt-4 text-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {games.length > 0 ? (
            games.map((game) => (
              <LibraryGameCard
                key={game.id}
                title={game.title}
                lastPlayed={new Date().toISOString()} // Replace with actual last played date
                totalPlaytime="0 hours" // Replace with actual playtime
                status="not_installed" id={''}              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Your library is empty. Visit the store to find games!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
