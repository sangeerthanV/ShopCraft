import React, { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryNavigation } from "@/components/CategoryNavigation";
import { HeroSection } from "@/components/HeroSection";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { ShoppingCartSidebar } from "@/components/ShoppingCartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [] as string[],
    brands: [] as string[],
    rating: null as number | null,
  });

  const { isCartOpen, setIsCartOpen } = useCart();

  const scrollToProducts = () => {
    const productsSection = document.querySelector('main');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryNavigation 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <HeroSection onShopNowClick={scrollToProducts} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          <ProductGrid
            category={selectedCategory}
            searchQuery={searchQuery}
            filters={filters}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      <Footer />

      <ShoppingCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}
