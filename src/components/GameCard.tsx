'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";

interface GameCardProps {
  id: string;
  title: string;
  description: string | null;
  price: number;
  genre: string[];
  owner_id: string;
  onPurchase: (gameId: string) => Promise<void>;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
  price,
  genre,
  onPurchase,
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Use useCallback to memoize the handlePurchase function
  const handlePurchase = useCallback(async () => {
    if (!onPurchase) return;
    try {
      setIsPurchasing(true);
      await onPurchase(id);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  }, [id, onPurchase]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Link href={`/games/${id}`}>
          <CardTitle className="text-xl hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </Link>
        <CardDescription className="flex flex-wrap gap-2">
          {genre.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">
          {description || 'No description available'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-lg font-bold">${price.toFixed(2)}</span>
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing || !onPurchase}
          aria-label={isPurchasing ? 'Processing purchase...' : 'Add to Cart'}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isPurchasing ? 'Processing...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
