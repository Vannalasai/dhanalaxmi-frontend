import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  Package,
  XCircle,
  CheckCircle,
  Truck,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  _id: string;
  orderedAt: string;
  user: {
    name: string;
    email: string;
  };
  totalAmount: number;
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    variantId: string;
    name: string;
    weight: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
}

const OrdersDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://dhanalaxmi-backend.onrender.com/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast({
        title: "Error",
        description: "Could not fetch orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://dhanalaxmi-backend.onrender.com/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");
      const updatedOrder = await res.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the order status.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://dhanalaxmi-backend.onrender.com/api/admin/orders/export",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to download file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Could not download the orders file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.orderStatus !== "Cancelled")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      totalRevenue: totalRevenue,
      totalOrders: orders.length,
      processing: orders.filter((o) => o.orderStatus === "Processing").length,
      shipped: orders.filter((o) => o.orderStatus === "Shipped").length,
      delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
      cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") {
      return orders;
    }
    return orders.filter((order) => order.orderStatus === statusFilter);
  }, [orders, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { label: "All", value: "All", count: stats.totalOrders },
    { label: "Processing", value: "Processing", count: stats.processing },
    { label: "Shipped", value: "Shipped", count: stats.shipped },
    { label: "Delivered", value: "Delivered", count: stats.delivered },
    { label: "Cancelled", value: "Cancelled", count: stats.cancelled },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              Total Revenue{" "}
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₹{stats.totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              Total Orders <Package className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              Processing <Loader2 className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.processing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              Cancelled <XCircle className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={statusFilter === btn.value ? "default" : "outline"}
              onClick={() => setStatusFilter(btn.value)}
            >
              {btn.label} ({btn.count})
            </Button>
          ))}
        </div>
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isDownloading ? "Downloading..." : "Download as CSV"}
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No orders found for this status.
        </p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row justify-between items-start bg-gray-50/50 p-4 border-b">
                <div>
                  <CardTitle>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.orderedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    User:{" "}
                    <span className="font-semibold">{order.user?.name}</span> (
                    {order.user?.email})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                  <div className="w-[150px] mt-2">
                    <Select
                      value={order.orderStatus}
                      onValueChange={(newStatus) =>
                        handleStatusChange(order._id, newStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Items Ordered</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {order.items.map((item) => (
                        <li key={item.variantId}>
                          <span className="font-medium">{item.name}</span> (
                          {item.weight}) x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <address className="not-italic text-sm text-gray-600">
                      {order.shippingAddress.name}
                      <br />
                      {order.shippingAddress.street}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.zip}
                      <br />
                      Ph: {order.shippingAddress.phone}
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
