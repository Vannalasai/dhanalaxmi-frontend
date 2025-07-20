import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProduct, Product, Variant } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react"; // AlertTriangle ఐకాన్ ఇంపోర్ట్ చేయండి

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(id)
      .then((p) => {
        setProduct(p);
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }
      })
      .catch((e) => setError(e.message || "Failed to load product details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart({
      productId: product.id,
      variantId: selectedVariant._id,
      name: product.name,
      price: selectedVariant.price,
      weight: selectedVariant.weight,
      image: product.image,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedVariant.weight}) has been added.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error || "Product not found"}</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <Link to="/shop" className="inline-flex items-center mb-6 text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <Badge variant="outline">{product.category}</Badge>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < product.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-muted-foreground text-sm">
                ({product.rating.toFixed(1)} rating)
              </span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="text-muted-foreground"
            />
            <div className="pt-4">
              <label className="text-lg font-semibold mb-3 block">
                Select Weight:
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <Button
                    key={variant._id}
                    variant={
                      selectedVariant?._id === variant._id
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.quantity === 0}
                    className="text-base px-6 py-4"
                  >
                    {variant.weight}
                    {variant.quantity === 0 && " (Out of Stock)"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-3 pt-4">
              <span className="text-4xl font-bold text-primary">
                ₹{selectedVariant?.price.toFixed(2)}
              </span>
              {selectedVariant?.originalPrice && (
                <span className="line-through text-2xl text-muted-foreground">
                  ₹{selectedVariant.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* === కొత్తగా యాడ్ చేసిన సెక్షన్: "Low Stock" హెచ్చరిక కోసం === */}
            {selectedVariant &&
              selectedVariant.quantity > 0 &&
              selectedVariant.quantity <= 10 && (
                <div className="p-3 bg-destructive/60 border-l-4 border-destructive text-destructive-foreground rounded-r-lg flex items-center gap-3 animate-pulse">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-semibold text-sm">
                    Hurry! Only {selectedVariant.quantity} left in stock!
                  </p>
                </div>
              )}

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full text-lg"
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant ||
                  selectedVariant.quantity === 0 ||
                  !product.inStock
                }
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {selectedVariant && selectedVariant.quantity > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
