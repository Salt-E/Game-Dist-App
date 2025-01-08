// lib/hooks/useGames.ts
import { useState, useEffect } from 'react';
import { Game } from '@/types/types';
import { supabase } from '@/lib/supabase';

export function useGames(userId?: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchGames = async () => {
      try {
        // Pertama dapatkan semua game_id yang dimiliki user
        const { data: purchaseData, error: purchaseError } = await supabase
          .from('game_purchases')
          .select('game_id')
          .eq('owner_id', userId);

        if (purchaseError) throw purchaseError;

        if (purchaseData && purchaseData.length > 0) {
          // Kemudian ambil data game berdasarkan game_id
          const gameIds = purchaseData.map(purchase => purchase.game_id);
          
          const { data: gamesData, error: gamesError } = await supabase
            .from('games')
            .select('*')
            .in('id', gameIds);

          if (gamesError) throw gamesError;

          if (gamesData) {
            setGames(gamesData);
          }
        } else {
          setGames([]);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [userId]);

  return { games, loading };
}