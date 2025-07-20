import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // URL నుండి పారామీటర్స్ చదవడానికి
import { fetchProducts, Product } from "@/lib/api";
import SpiceProductCard from "@/components/SpiceProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<
    "name" | "price-low" | "price-high" | "rating"
  >("name");
  const { toast } = useToast();

  // 1. URL నుండి సెర్చ్ పారామీటర్‌ను పొందండి
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => {
        toast({ title: "Error Loading Products", variant: "destructive" });
        setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [toast]);

  // 2. సెర్చ్, ఫిల్టర్, మరియు సార్ట్ లాజిక్‌ను అప్లై చేయండి
  const processedProducts = React.useMemo(() => {
    let filtered = [...products];

    // సెర్చ్ ఫిల్టర్
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // కేటగిరీ ఫిల్టర్
    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    // సార్టింగ్
    return filtered.sort((a, b) => {
      const variantA = a.variants?.[0];
      const variantB = b.variants?.[0];
      switch (sortBy) {
        case "price-low":
          return (variantA?.price ?? 0) - (variantB?.price ?? 0);
        case "price-high":
          return (variantB?.price ?? 0) - (variantA?.price ?? 0);
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchQuery, category, sortBy]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Our Spice Collection</h1>
        {searchQuery && (
          <p className="text-lg text-muted-foreground mb-6">
            Showing results for:{" "}
            <span className="font-semibold text-primary">"{searchQuery}"</span>
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="md:ml-auto w-full md:w-auto">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as any)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedProducts.map((p) => (
              <SpiceProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No products found {searchQuery ? `for "${searchQuery}"` : ""}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
