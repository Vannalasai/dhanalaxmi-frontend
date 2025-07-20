import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Cart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
    itemCount,
  } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Authentication check is handled by the router (App.tsx), so this can be simplified.

  // Show empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-muted/20">
        <Card className="p-8 text-center max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some delicious spices to get started!
          </p>
          <Link to="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            Shopping Cart ({itemCount} items)
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              clearCart();
              toast({ title: "Cart cleared" });
            }}
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              // 1. కీ হিসাবে variantId ని వాడండి (Use variantId as the key)
              <Card key={item.variantId}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Link to={`/product/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.productId}`}
                      className="hover:underline"
                    >
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                    </Link>
                    {/* 2. వేరియంట్ బరువును చూపించండి (Display the variant's weight) */}
                    <p className="text-sm text-muted-foreground">
                      {item.weight}
                    </p>
                    <p className="text-primary font-bold mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        // 3. updateQuantity కి variantId పంపండి (Send variantId to updateQuantity)
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="px-4 text-center font-bold">
                        {item.quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        // 3. updateQuantity కి variantId పంపండి (Send variantId to updateQuantity)
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-9 w-9"
                      onClick={() => {
                        // 4. removeFromCart కి variantId పంపండి (Send variantId to removeFromCart)
                        removeFromCart(item.variantId);
                        toast({ title: `${item.name} removed from cart` });
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary Section */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full text-base py-6"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
