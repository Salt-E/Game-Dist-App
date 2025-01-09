'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";

interface SearchBarProps {
  onSearch: (query: string, genre: string) => void;
  initialQuery?: string;
  initialGenre?: string;
}

export function SearchBar({ 
  onSearch = () => {}, // Provide default empty function
  initialQuery = '', 
  initialGenre = 'all' 
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);

  // Debounce search to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string, genre: string) => {
      onSearch(query, genre);
    }, 300),
    [onSearch] // Added proper dependencies
  );

  useEffect(() => {
    debouncedSearch(searchTerm, selectedGenre);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, selectedGenre, debouncedSearch]);

  return (
    <div className="flex gap-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
        <Input
          type="search"
          placeholder="Search games..."
          className="pl-8 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search games"
        />
      </div>
      <Select 
        value={selectedGenre} 
        onValueChange={setSelectedGenre}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          <SelectItem value="action">Action</SelectItem>
          <SelectItem value="adventure">Adventure</SelectItem>
          <SelectItem value="rpg">RPG</SelectItem>
          <SelectItem value="strategy">Strategy</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="simulation">Simulation</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}