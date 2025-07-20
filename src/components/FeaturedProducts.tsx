// src/components/FeaturedProducts.tsx
import React, { useState, useEffect } from "react";
import { fetchProducts, Product } from "@/lib/api";
import SpiceProductCard from "./SpiceProductCard";
import { useToast } from "@/hooks/use-toast";

const FeaturedProducts: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts()
      .then((ps) => setItems(ps.slice(0, 4)))
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load featured",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-16">Loading featured…</p>;

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Featured Spices</h2>
        <p className="text-lg text-muted-foreground mb-12">
          Discover our premium organic spices and traditional powders
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((p) => (
            <SpiceProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
