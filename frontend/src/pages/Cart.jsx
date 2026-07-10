import { Link, useNavigate } from "react-router-dom";
import { useCart } from "#contexts/CartContext";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Separator } from "#components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { toast } from "sonner";

export function Cart() {
  const { cart, updateQuantity, removeItem, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (!cart.products || cart.products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-16 text-muted-foreground/40" />
        <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add some products to get started</p>
        <Link to="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart ({cartCount} items)</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.products.map((item) => (
            <Card key={item.product._id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Package className="size-8 text-muted-foreground/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product._id}`}
                    className="font-semibold hover:text-primary transition-colors truncate block"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="mt-1 font-semibold">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={async () => {
                      if (item.quantity <= 1) {
                        await removeItem(item.product._id);
                      } else {
                        await updateQuantity(item.product._id, item.quantity - 1);
                      }
                    }}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
                <p className="font-semibold w-20 text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive"
                  onClick={async () => {
                    await removeItem(item.product._id);
                    toast.success("Removed from cart");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button className="w-full" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
