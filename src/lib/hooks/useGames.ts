// useGames.ts
import { useState, useEffect, useCallback } from 'react';
import { Game } from '@/types/types';
import { supabase } from '@/lib/supabase';

interface UseGamesOptions {
  includeFamily?: boolean;
  genre?: string;
  searchTerm?: string;
}

export function useGames(userId?: string, options: UseGamesOptions = {}) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGames = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('game_purchases')
        .select(`
          games (
            id,
            title,
            description,
            price,
            genre,
            owner_id
          ),
          owner_id
        `);

      // Build the query based on options
      if (options.includeFamily) {
        const { data: familyMember } = await supabase
          .from('family_members')
          .select('family_group_id')
          .eq('user_id', userId)
          .single();

        if (familyMember) {
          query = query.or(
            `owner_id.eq.${userId},owner_id.in.(
              select user_id from family_members 
              where family_group_id = '${familyMember.family_group_id}'
            )`
          );
        } else {
          query = query.eq('owner_id', userId);
        }
      } else {
        query = query.eq('owner_id', userId);
      }

      const { data, error: gamesError } = await query;

      if (gamesError) throw gamesError;

      // Transform and filter the games based on options
      let filteredGames = data
        .map(purchase => purchase.games)
        .filter(Boolean) as unknown as Game[];

      if (options.genre && options.genre !== 'all') {
        filteredGames = filteredGames.filter(game => 
          game.genre.includes(options.genre!)
        );
      }

      if (options.searchTerm) {
        const term = options.searchTerm.toLowerCase();
        filteredGames = filteredGames.filter(game =>
          game.title.toLowerCase().includes(term) ||
          game.description?.toLowerCase().includes(term)
        );
      }

      setGames(filteredGames);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch games'));
    } finally {
      setLoading(false);
    }
  }, [userId, options.includeFamily, options.genre, options.searchTerm]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const purchaseGame = async (gameId: string): Promise<{ error?: string }> => {
    if (!userId) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('game_purchases')
        .insert({
          game_id: gameId,
          owner_id: userId
        });

      if (error) throw error;

      await fetchGames(); // Refresh the games list
      return {};
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to purchase game'
      };
    }
  };

  return { games, loading, error, purchaseGame, refreshGames: fetchGames };
}

