import React from "react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onShopNowClick: () => void;
}

export function HeroSection({ onShopNowClick }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Amazing Products
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Premium quality items at unbeatable prices. Shop the latest trends and bestsellers.
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-yellow-500 text-gray-900 font-semibold"
              onClick={onShopNowClick}
            >
              Shop Now
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Modern smartphone showcase"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Premium headphones"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
              alt="Fashion accessories collection"
              className="rounded-lg shadow-lg w-full h-full object-cover col-span-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
