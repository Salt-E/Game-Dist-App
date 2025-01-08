import { supabase } from '@/lib/supabase';
import { Game } from '@/types/types';

export const gameService = {
  async searchGames(query: string, genre?: string) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .ilike('title', `%${query}%`)
      .eq(genre && genre !== 'all' ? 'genre' : '', genre || '');
    
    if (error) throw error;
    return data;
  },

  async purchaseGame(gameId: string, userId: string) {
    const { data, error } = await supabase
      .from('game_purchases')
      .insert({
        game_id: gameId,
        owner_id: userId
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};