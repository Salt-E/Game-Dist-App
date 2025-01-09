import { supabase } from '@/lib/supabase';
import { Game } from '@/types/types';

interface SearchGamesResponse {
  games: Game[];
  total?: number;
  error?: string;
}

interface PurchaseGameResponse {
  success: boolean;
  error?: string;
}

export const gameService = {
  async searchGames(
    query: string,
    genre?: string,
    limit = 20,
    offset = 0
  ): Promise<SearchGamesResponse> {
    try {
      let supabaseQuery = supabase
        .from('games')
        .select('*', { count: 'exact' });

      if (query) {
        supabaseQuery = supabaseQuery.ilike('title', `%${query}%`);
      }

      if (genre && genre !== 'all') {
        supabaseQuery = supabaseQuery.contains('genre', [genre]);
      }

      const { data, error, count } = await supabaseQuery
        .range(offset, offset + limit - 1)
        .order('title', { ascending: true });

      if (error) throw error;

      return { 
        games: data as Game[],
        total: count ?? 0
      };
    } catch (error) {
      return {
        games: [],
        error: error instanceof Error ? error.message : 'Failed to search games'
      };
    }
  },

  async purchaseGame(
    gameId: string, 
    userId: string
  ): Promise<PurchaseGameResponse> {
    try {
      // Check if user already owns the game
      const { data: existing } = await supabase
        .from('game_purchases')
        .select('id')
        .eq('game_id', gameId)
        .eq('owner_id', userId)
        .single();

      if (existing) {
        return {
          success: false,
          error: 'You already own this game'
        };
      }

      const { error } = await supabase
        .from('game_purchases')
        .insert({
          game_id: gameId,
          owner_id: userId
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to purchase game'
      };
    }
  }
};