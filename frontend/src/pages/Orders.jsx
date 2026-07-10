import { useState, useEffect } from "react";
import { api } from "#lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import { Separator } from "#components/ui/separator";
import { Skeleton } from "#components/ui/skeleton";
import { Package, Calendar, DollarSign } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.getUserOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <div className="py-24 text-center">
          <Package className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <Badge className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="size-3" />
                    {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{item.product?.name || "Product"}</span>
                      <span className="text-muted-foreground">
                        x{item.quantity} — ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {order.shippingAddress && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm text-muted-foreground">
                      Shipping to: {order.shippingAddress}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
