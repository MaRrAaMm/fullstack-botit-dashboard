import { useState, useEffect } from "react";
import { api } from "#lib/api";
import { useSocket } from "#hooks/use-socket";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Skeleton } from "#components/ui/skeleton";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.products.getAll(), api.orders.getAll()])
      .then(([productsRes, ordersRes]) => {
        const orders = ordersRes.data;
        setStats({
          products: productsRes.data.length,
          orders: orders.length,
          revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const socketRef = useSocket();

  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    const onDataChange = () => {
      Promise.all([api.products.getAll(), api.orders.getAll()])
        .then(([productsRes, ordersRes]) => {
          const orders = ordersRes.data;
          setStats({
            products: productsRes.data.length,
            orders: orders.length,
            revenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
          });
          setRecentOrders(orders.slice(0, 5));
        })
        .catch(() => {});
    };

    socket.on("orderCreated", onDataChange);
    socket.on("orderUpdated", onDataChange);
    socket.on("orderDeleted", onDataChange);
    socket.on("productCreated", onDataChange);
    socket.on("productUpdated", onDataChange);
    socket.on("productDeleted", onDataChange);

    return () => {
      socket.off("orderCreated", onDataChange);
      socket.off("orderUpdated", onDataChange);
      socket.off("orderDeleted", onDataChange);
      socket.off("productCreated", onDataChange);
      socket.off("productUpdated", onDataChange);
      socket.off("productDeleted", onDataChange);
    };
  }, [socketRef.current]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const cards = [
    { title: "Products", value: stats.products, icon: Package },
    { title: "Orders", value: stats.orders, icon: ShoppingCart },
    { title: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {order.customerName || order.user?.name || "Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
