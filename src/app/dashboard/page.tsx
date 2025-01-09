'use client';

import { GameCard } from "@/components/GameCard";  // Import komponen GameCard
import { useState } from "react";

export default function Dashboard() {
  const [games, setGames] = useState([
    // array contoh game, sesuaikan dengan data yang Anda miliki
    {
      id: "1",
      title: "The Legend of Zelda: Breath of the Wild",
      description: "Explore a vast open world in this action-adventure masterpiece",
      price: 59.99,
      genre: ["Action", "Adventure", "Open World"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "2",
      title: "Red Dead Redemption 2",
      description: "Epic tale of life in Americas unforgiving heartland",
      price: 59.99,
      genre: ["Action", "Adventure", "Open World"],
      created_at: new Date()
      ,
      owner_id: 'owner1' 
    },
    {
      id: "3",
      title: "God of War Ragnarök",
      description: "Join Kratos and Atreus on their Norse mythology adventure",
      price: 59.99,
      genre: ["Action", "Adventure"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "4",
      title: "Spider-Man 2",
      description: "Swing through New York as Peter Parker and Miles Morales",
      price: 69.99,
      genre: ["Action", "Adventure", "Open World"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "5",
      title: "Elden Ring",
      description: "Open-world action RPG by FromSoftware",
      price: 59.99,
      genre: ["Action", "RPG", "Open World"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "6",
      title: "Final Fantasy XVI",
      description: "Latest entry in the iconic RPG series",
      price: 69.99,
      genre: ["RPG", "Action"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "7",
      title: "FIFA 24",
      description: "Latest FIFA football game",
      price: 59.99,
      genre: ["Sports"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "8",
      title: "NBA 2K24",
      description: "Premium basketball simulation",
      price: 59.99,
      genre: ["Sports"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "9",
      title: "Civilization VI",
      description: "4X strategy game",
      price: 49.99,
      genre: ["Strategy", "4X"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "10",
      title: "Hades",
      description: "Roguelike action game",
      price: 24.99,
      genre: ["Indie", "Action", "Roguelike"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "11",
      title: "Resident Evil 4 Remake",
      description: "Horror survival classic reimagined",
      price: 59.99,
      genre: ["Horror", "Action"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "12",
      title: "Call of Duty: Modern Warfare III",
      description: "Military first-person shooter",
      price: 69.99,
      genre: ["FPS", "Action"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "13",
      title: "Street Fighter 6",
      description: "Latest Street Fighter entry",
      price: 59.99,
      genre: ["Fighting"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "14",
      title: "Microsoft Flight Simulator",
      description: "Realistic flight sim",
      price: 59.99,
      genre: ["Simulation"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    // Free to play games
    {
      id: "15",
      title: "Counter-Strike 2",
      description: "Competitive tactical shooter",
      price: 0,
      genre: ["FPS", "Tactical"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "16",
      title: "Overwatch 2",
      description: "Team-based hero shooter",
      price: 0,
      genre: ["FPS", "Hero Shooter"],
      created_at: new Date(),
      owner_id: 'owner1' 
    },
    {
      id: "17",
      title: "The Sims 4",
      description: "Life simulation game",
      price: 0,
      genre: ["Simulation", "Life Sim"],
      created_at: new Date(),
      owner_id: 'owner1' 
    }
    // ... more games can be added as needed
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