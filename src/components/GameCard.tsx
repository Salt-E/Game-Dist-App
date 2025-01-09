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
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-card">
      <div className="aspect-video w-full bg-secondary/50 rounded-t-lg overflow-hidden">
        {/* Placeholder for game image */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/80">
          <span className="text-muted-foreground">Game Preview</span>
        </div>
      </div>
      
      <CardHeader className="space-y-2">
        <Link href={`/games/${id}`}>
          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </Link>
        <div className="flex flex-wrap gap-2">
          {genre.map((g) => (
            <Badge 
              key={g} 
              variant="secondary"
              className="bg-secondary/50 text-muted-foreground"
            >
              {g}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">
          {description || 'No description available'}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4 border-t border-border">
        <span className="text-lg font-bold text-primary">
          ${price.toFixed(2)}
        </span>
        <Button
          onClick={handlePurchase}
          disabled={isPurchasing || !onPurchase}
          aria-label={isPurchasing ? 'Processing purchase...' : 'Add to Cart'}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isPurchasing ? 'Processing...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};