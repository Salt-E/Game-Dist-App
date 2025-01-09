// app/store/page.tsx
'use client';

import { useState } from 'react';
import { GameCard } from "@/components/GameCard";
import { SearchBar } from "@/components/SearchBar";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const handleSearch = (query: string, genre: string) => {
    setSearchQuery(query);
    setSelectedGenre(genre);
    // Implement search/filter logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Game Store</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Game cards will be rendered here */}
        </div>
      </div>
    </div>
  );
}
