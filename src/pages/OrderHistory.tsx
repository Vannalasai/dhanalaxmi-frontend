import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  orderedAt: string;
  items: { name: string; quantity: number; price: number; image: string }[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://dhanalaxmi-backend.onrender.com/api/orders/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch order history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen text-center py-10">
        <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.orderedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {order.orderStatus}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {order.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 py-2 border-b last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
