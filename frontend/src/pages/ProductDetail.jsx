import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "#lib/api";
import { useAuth } from "#contexts/AuthContext";
import { useCart } from "#contexts/CartContext";
import { Button } from "#components/ui/button";
import { Badge } from "#components/ui/badge";
import { Skeleton } from "#components/ui/skeleton";
import { Separator } from "#components/ui/separator";
import { ShoppingCart, ArrowLeft, Package, Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.products.getById(id)
      .then((res) => setProduct(res.data))
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, quantity);
      setAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted">
          <Package className="size-24 text-muted-foreground/40" />
        </div>

        <div>
          <Badge variant="secondary" className="mb-3">{product.category}</Badge>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>

          <Separator className="my-6" />

          <p className="text-muted-foreground">
            High-quality {product.name.toLowerCase()} from our {product.category} collection.
            Perfect for everyday use.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="size-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="size-3" />
              </Button>
            </div>
          </div>

          <Button size="lg" className="mt-6 w-full" onClick={handleAddToCart} disabled={added}>
            {added ? (
              <>
                <Check className="mr-2 size-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 size-4" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
