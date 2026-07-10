import { Link } from "react-router-dom";
import { useAuth } from "#contexts/AuthContext";
import { useCart } from "#contexts/CartContext";
import { Button } from "#components/ui/button";
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, Package } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "#components/ui/sheet";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/products", label: "Products" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/products" className="text-xl font-bold tracking-tight">
            Botit
          </Link>
          <div className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="size-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="ghost" size="sm">
                  Orders
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 p-6">
              <Link to="/products" className="text-xl font-bold" onClick={() => setOpen(false)}>
                Botit
              </Link>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="mr-2 inline size-4" />
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="border-t pt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link to="/cart" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" onClick={() => setOpen(false)}>
                      <ShoppingCart className="size-4" />
                      Cart ({cartCount})
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" onClick={() => setOpen(false)}>
                      <Package className="size-4" />
                      My Orders
                    </Link>
                    <p className="px-3 text-sm text-muted-foreground">{user?.email}</p>
                    <Button variant="ghost" className="justify-start" onClick={() => { logout(); setOpen(false); }}>
                      <LogOut className="mr-2 size-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
