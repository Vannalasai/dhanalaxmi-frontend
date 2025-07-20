import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, AlertTriangle } from "lucide-react"; // ఐకాన్ ఇంపోర్ట్ చేయండి
import { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";

interface Props {
  product: Product;
}

const SpiceProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Login Required", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (!defaultVariant || !product.inStock) return;

    addToCart({
      productId: product.id,
      variantId: defaultVariant._id,
      name: product.name,
      price: defaultVariant.price,
      weight: defaultVariant.weight,
      image: product.image,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} (${defaultVariant.weight}) added.`,
    });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "Login Required", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: defaultVariant?.price || 0,
        image: product.image,
      });
    }
  };

  const discountPercent = defaultVariant?.originalPrice
    ? Math.round(
        ((defaultVariant.originalPrice - defaultVariant.price) /
          defaultVariant.originalPrice) *
          100
      )
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <Card className="group overflow-hidden relative border-2 border-transparent hover:border-primary transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* === ఇమేజ్ పైన కనిపించే బాడ్జ్‌లు === */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercent > 0 && (
              <Badge variant="destructive">{discountPercent}% OFF</Badge>
            )}

            {/* === కొత్తగా యాడ్ చేసిన "Low Stock" హెచ్చరిక === */}
            {defaultVariant &&
              defaultVariant.quantity > 0 &&
              defaultVariant.quantity <= 10 && (
                <Badge
                  variant="secondary"
                  className="bg-orange-500 text-white border-orange-600 animate-pulse"
                >
                  <AlertTriangle className="h-3 w-3 mr-1.5" />
                  Only {defaultVariant.quantity} left!
                </Badge>
              )}

            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full"
              onClick={handleWishlistClick}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isInWishlist(product.id)
                    ? "text-red-500 fill-current"
                    : "text-gray-600"
                }`}
              />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              className="w-full bg-primary/90 text-primary-foreground"
              onClick={handleCartClick}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        <CardContent className="p-4 flex-grow flex flex-col">
          <p className="text-xs text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-base mb-2 flex-grow">
            {product.name}
          </h3>

          {product.variants && product.variants.length && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                Available in:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((variant) => (
                  <Badge
                    key={variant._id}
                    variant="secondary"
                    className="font-normal"
                  >
                    {variant.weight}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-end mt-auto pt-2">
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">
                Starting from
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  ₹{defaultVariant?.price.toFixed(2)}
                </span>
                {defaultVariant?.originalPrice && (
                  <span className="line-through text-sm text-muted-foreground">
                    ₹{defaultVariant.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < product.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SpiceProductCard;
