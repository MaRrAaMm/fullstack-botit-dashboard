import { Link } from "react-router-dom";
import { Button } from "#components/ui/button";
import { Badge } from "#components/ui/badge";
import { Card, CardContent } from "#components/ui/card";
import { ShoppingCart, ArrowRight, Truck, Shield, CreditCard, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "#lib/api";

export function Landing() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.products.getAll().then((res) => setFeatured(res.data.slice(0, 6))).catch(() => {});
  }, []);

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: CreditCard, title: "Easy Returns", desc: "30-day return policy" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,var(--primary)_0%,transparent_50%)] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-32 text-center sm:py-40">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">New Collection</Badge>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Discover Your <span className="text-primary">Perfect Style</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Shop from our curated collection of premium products. Quality meets affordability.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/products">
              <Button size="lg" className="px-8">
                Shop Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="px-8">Browse Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-5 rounded-xl border border-border/60 bg-card/50 p-8 transition-all hover:shadow-md hover:border-border">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="size-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl">Featured Products</h2>
              <Link to="/products">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`}>
                  <Card className="group overflow-hidden border-border/60 transition-all hover:shadow-lg hover:border-border pt-0">
                    <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center overflow-hidden">
                      <Package className="size-16 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="mb-2.5 text-xs">{product.category}</Badge>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          View details →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
