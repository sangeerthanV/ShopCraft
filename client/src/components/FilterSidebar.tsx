import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    priceRange: string[];
    brands: string[];
    rating: number | null;
  };
  onFiltersChange: (filters: any) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const handlePriceRangeChange = (range: string, checked: boolean) => {
    const newPriceRange = checked
      ? [...filters.priceRange, range]
      : filters.priceRange.filter((r) => r !== range);
    
    onFiltersChange({ ...filters, priceRange: newPriceRange });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);
    
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    onFiltersChange({ 
      ...filters, 
      rating: checked ? rating : null 
    });
  };

  return (
    <aside className="lg:w-64">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <div className="space-y-2">
              {[
                { label: "$0 - $50", value: "0-50" },
                { label: "$50 - $100", value: "50-100" },
                { label: "$100 - $200", value: "100-200" },
                { label: "$200+", value: "200+" },
              ].map((range) => (
                <div key={range.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${range.value}`}
                    checked={filters.priceRange.includes(range.value)}
                    onCheckedChange={(checked) =>
                      handlePriceRangeChange(range.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`price-${range.value}`} className="text-sm">
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="font-medium mb-3">Brand</h4>
            <div className="space-y-2">
              {[
                "TechPro",
                "FitTech", 
                "StyleCraft",
                "KeyMaster",
                "SunStyle",
                "BrewMaster",
                "GameTech",
                "YogaLife",
              ].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand, checked as boolean)
                    }
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="font-medium mb-3">Rating</h4>
            <div className="space-y-2">
              {[4, 3].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onCheckedChange={(checked) =>
                      handleRatingChange(rating, checked as boolean)
                    }
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                    {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
