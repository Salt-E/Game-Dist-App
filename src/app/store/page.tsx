'use client';

import { useState, useEffect } from 'react';
import { GameCard } from "@/components/GameCard";
import { SearchBar } from "@/components/SearchBar";
import { gameService } from '@/services/gameService';
import { Game } from '@/types/types';
import { useAuthContext } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const response = await gameService.searchGames(searchQuery, selectedGenre);
      setGames(response.games);
      setLoading(false);
    };

    fetchGames();
  }, [searchQuery, selectedGenre]);

  const handleSearch = (query: string, genre: string) => {
    setSearchQuery(query);
    setSelectedGenre(genre);
  };

  const handlePurchase = async (gameId: string) => {
    if (!user) {
      return;
    }
    
    const result = await gameService.purchaseGame(gameId, user.id);
    if (!result.error) {
      // Handle successful purchase
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to browse and purchase games
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

  return (
    <div className="min-h-screen bg-background">
      {/* Featured Games Banner */}
      <div className="w-full bg-secondary/50 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-foreground mb-2">Featured & Recommended</h1>
          <p className="text-muted-foreground">Discover new and popular games</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-card p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-foreground">Browse Games</h2>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.length > 0 ? (
              games.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  price={game.price}
                  genre={game.genre}
                  owner_id={game.owner_id}
                  onPurchase={handlePurchase}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  No games found matching your criteria
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}