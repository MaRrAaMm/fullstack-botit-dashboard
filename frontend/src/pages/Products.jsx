import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "#lib/api";
import { Card, CardContent } from "#components/ui/card";
import { Badge } from "#components/ui/badge";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Skeleton } from "#components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { Search, Package } from "lucide-react";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    api.products
      .getAll({
        page: currentPage,
        limit: itemsPerPage,
        search,
        category,
        sort,
      })
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [currentPage, search, category, sort]);

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-muted-foreground">Browse our collection</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams({ page: 1 });
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setSearchParams({ page: 1 });
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value);
            setSearchParams({ page: 1 });
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center">
          <Package className="mx-auto size-12 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg pt-0">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Package className="size-12 text-muted-foreground/40" />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={() =>
            setSearchParams({
              page: currentPage - 1,
            })
          }
        >
          Previous
        </Button>

        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant={currentPage === index + 1 ? "default" : "outline"}
            onClick={() =>
              setSearchParams({
                page: index + 1,
              })
            }
          >
            {index + 1}
          </Button>
        ))}

        <Button
          disabled={currentPage === totalPages}
          onClick={() => setSearchParams({ page: currentPage + 1 })}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
