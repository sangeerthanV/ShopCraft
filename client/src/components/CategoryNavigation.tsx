import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Grid3X3, Laptop, Shirt, Home, Dumbbell } from "lucide-react";
import type { Category } from "@shared/schema";

interface CategoryNavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  all: Grid3X3,
  electronics: Laptop,
  fashion: Shirt,
  home: Home,
  sports: Dumbbell,
};

export function CategoryNavigation({ selectedCategory, onCategoryChange }: CategoryNavigationProps) {
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const allCategories = [
    { id: 0, name: "All Products", slug: "all", icon: "Grid3X3" },
    ...categories,
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 py-4 overflow-x-auto">
          {allCategories.map((category) => {
            const IconComponent = categoryIcons[category.slug] || Grid3X3;
            const isSelected = selectedCategory === category.slug;
            
            return (
              <Button
                key={category.slug}
                variant="ghost"
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  isSelected
                    ? "text-primary font-medium border-b-2 border-primary pb-2"
                    : "text-gray-600 hover:text-primary pb-2"
                }`}
                onClick={() => onCategoryChange(category.slug)}
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
