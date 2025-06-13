import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  category: string;
  searchQuery: string;
  filters: {
    priceRange: string[];
    brands: string[];
    rating: number | null;
  };
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ProductGrid({ category, searchQuery, filters, sortBy, onSortChange }: ProductGridProps) {
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (category && category !== "all") {
      params.append("category", category);
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (filters.rating) {
      params.append("rating", filters.rating.toString());
    }
    
    // Handle price range filters
    if (filters.priceRange.length > 0) {
      const minPrices: number[] = [];
      const maxPrices: number[] = [];
      
      filters.priceRange.forEach(range => {
        if (range === "0-50") {
          minPrices.push(0);
          maxPrices.push(50);
        } else if (range === "50-100") {
          minPrices.push(50);
          maxPrices.push(100);
        } else if (range === "100-200") {
          minPrices.push(100);
          maxPrices.push(200);
        } else if (range === "200+") {
          minPrices.push(200);
          maxPrices.push(10000);
        }
      });
      
      if (minPrices.length > 0) {
        params.append("minPrice", Math.min(...minPrices).toString());
        params.append("maxPrice", Math.max(...maxPrices).toString());
      }
    }
    
    return params.toString();
  };

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: [`/api/products?${buildQueryParams()}`],
  });

  // Filter by brand client-side (since it's a specific filter not handled by API)
  const filteredProducts = products.filter(product => {
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  if (error) {
    return (
      <main className="flex-1">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load products. Please try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {category === "all" ? "Featured Products" : `${category.charAt(0).toUpperCase() + category.slice(1)} Products`}
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Sort by: Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination - Simple implementation */}
          {sortedProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button className="bg-primary text-white">1</Button>
                <Button variant="outline" disabled>2</Button>
                <Button variant="outline" disabled>3</Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </main>
  );
}
