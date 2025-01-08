'use client';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  return (
    <div className="flex gap-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search games..."
          className="pl-8 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={selectedGenre} onValueChange={setSelectedGenre}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          <SelectItem value="action">Action</SelectItem>
          <SelectItem value="rpg">RPG</SelectItem>
          <SelectItem value="strategy">Strategy</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}