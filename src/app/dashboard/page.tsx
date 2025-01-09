'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export interface GameCardProps {
  id: string;
  title: string;
  description: string | null;
  price: number;
  genre: string[];
  owner_id: string;
  onPurchase: (gameId: string) => Promise<void>;
}

export function GameCard({ 
  id, 
  title, 
  description, 
  price, 
  genre,
  onPurchase 
}: GameCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Link href={`/games/${id}`}>
          <CardTitle className="text-xl hover:text-primary">{title}</CardTitle>
        </Link>
        <CardDescription>
          {genre.map((g) => (
            <Badge key={g} variant="secondary" className="mr-2 mb-2">
              {g}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{description || 'No description available'}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-lg font-bold">${price}</span>
        <Button onClick={() => onPurchase(id)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}