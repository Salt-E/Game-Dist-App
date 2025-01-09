'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { useGames } from '@/lib/hooks/useGames';
import { LibraryGameCard } from "@/components/LibraryGameCard";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, GridIcon, ListIcon } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const { user } = useAuthContext();
  const { games, loading, error, refreshGames } = useGames(user?.id, {
    includeFamily: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your game library
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

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Game Library</h1>
            
            {/* Search and View Controls */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search library..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-secondary/50"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'secondary'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="w-10 h-10"
                >
                  <GridIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'secondary'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="w-10 h-10"
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load your library</p>
            <Button 
              onClick={refreshGames}
              variant="secondary"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <LibraryGameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  lastPlayed={null}
                  totalPlaytime="0 hours"
                  status="not_installed"
                  onInstall={async () => {
                    // Handle install
                  }}
                  onPlay={async () => {
                    // Handle play
                  }}
                />
              ))
            ) : (
              <div className="col-span-full bg-card rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'No games found matching your search'
                    : 'Your library is empty'
                  }
                </p>
                <Link href="/store">
                  <Button variant="secondary">
                    Browse Store
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}