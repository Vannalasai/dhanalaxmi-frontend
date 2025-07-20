// src/pages/Wishlist.tsx

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { fetchProduct } from "@/lib/api"; // పూర్తి ప్రొడక్ట్ వివరాల కోసం

const Wishlist = () => {
  const { toast } = useToast();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (productId: string) => {
    try {
      // పూర్తి ప్రొడక్ట్ వివరాలను (వేరియంట్స్‌తో సహా) ఫెచ్ చేయండి
      const product = await fetchProduct(productId);
      const defaultVariant =
        product.variants && product.variants.length > 0
          ? product.variants[0]
          : null;

      if (!defaultVariant) {
        toast({ title: "Product variant not found", variant: "destructive" });
        return;
      }

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
        description: `${product.name} (${defaultVariant.weight}) has been added.`,
      });
      // ఐటెంను విష్‌లిస్ట్ నుండి తొలగించవచ్చు
      removeFromWishlist(productId);
    } catch (error) {
      toast({
        title: "Failed to add to cart",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // ... మీ ఇతర లాజిక్

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
            <Link to="/shop">
              <Button>Browse Spices</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <CardContent className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-xl mb-4">
                      ₹{(item.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      className="flex-1"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                    </Button>
                    <Link to={`/product/${item.id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
