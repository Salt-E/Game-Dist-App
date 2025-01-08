'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  genres: string[];
}

export function GameCard({ id, title, description, price, genres }: GameCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Link href={`/games/${id}`}>
          <CardTitle className="text-xl hover:text-primary">{title}</CardTitle>
        </Link>
        <CardDescription>
          {genres.map((genre) => (
            <Badge key={genre} variant="secondary" className="mr-2 mb-2">
              {genre}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-lg font-bold">${price}</span>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
