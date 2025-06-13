import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log("Toggle wishlist for product:", product.id);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="hover:shadow-md transition-shadow overflow-hidden group cursor-pointer">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-3 right-3 bg-white rounded-full shadow-md hover:bg-gray-100"
            onClick={handleToggleWishlist}
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </Button>
          {product.isOnSale && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              Sale
            </Badge>
          )}
          {!product.isOnSale && product.isFeatured && (
            <Badge className="absolute top-3 left-3 bg-green-500 text-white">
              New
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 truncate">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(parseFloat(product.rating))
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-blue-700 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
