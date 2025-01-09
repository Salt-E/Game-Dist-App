'use client';

import { GameCard } from "@/components/GameCard";  // Import komponen GameCard
import { useState } from "react";

export default function Dashboard() {
  const [games, setGames] = useState([
    // array contoh game, sesuaikan dengan data yang Anda miliki
    { id: '1', title: 'Game 1', description: 'Fun game', price: 10.99, genre: ['Action'], owner_id: 'owner1' },
    { id: '2', title: 'Game 2', description: 'Adventure game', price: 15.99, genre: ['Adventure'], owner_id: 'owner2' }
  ]);

  const handlePurchase = async (gameId: string) => {
    // logika untuk handle purchase
    console.log('Purchased:', gameId);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {games.map(game => (
        <GameCard 
          key= {game.id}
          id={game.id}
          title={game.title}
          description={game.description}
          price={game.price}
          genre={game.genre}
          owner_id={game.owner_id}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  );
}