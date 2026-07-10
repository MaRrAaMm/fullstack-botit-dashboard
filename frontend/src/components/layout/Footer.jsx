import { Link } from "react-router-dom";
import { Separator } from "#components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Separator />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Botit</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/products" className="hover:text-foreground">Products</Link></li>
              <li><Link to="/orders" className="hover:text-foreground">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@shophub.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Botit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
