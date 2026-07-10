import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "#contexts/CartContext";
import { api } from "#lib/api";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Textarea } from "#components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Separator } from "#components/ui/separator";
import { toast } from "sonner";
import { Package, CheckCircle } from "lucide-react";

export function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    shippingAddress: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.orders.checkout(form);
      await clearCart();
      setSuccess(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <CheckCircle className="mx-auto size-16 text-green-500" />
        <h2 className="mt-6 text-2xl font-bold">Order Confirmed!</h2>
        <p className="mt-2 text-muted-foreground">Thank you for your purchase</p>
        <Button className="mt-6" onClick={() => navigate("/orders")}>
          View My Orders
        </Button>
      </div>
    );
  }

  if (!cart.products || cart.products.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  placeholder="123 Main St, City, Country"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.products.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded bg-muted">
                      <Package className="size-4 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Placing Order..." : `Place Order — $${(cartTotal + (cartTotal >= 50 ? 0 : 4.99)).toFixed(2)}`}
          </Button>
        </form>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{cartTotal >= 50 ? "Free" : "$4.99"}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${(cartTotal + (cartTotal >= 50 ? 0 : 4.99)).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
