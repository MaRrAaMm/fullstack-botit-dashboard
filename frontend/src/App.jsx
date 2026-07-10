import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "#components/ui/tooltip";
import { AuthProvider } from "#contexts/AuthContext";
import { CartProvider } from "#contexts/CartContext";
import { Navbar } from "#components/layout/Navbar";
import { Footer } from "#components/layout/Footer";
import { AdminLayout } from "#components/layout/AdminLayout";
import { ProtectedRoute } from "#components/ProtectedRoute";
import { Products } from "#pages/Products";
import { ProductDetail } from "#pages/ProductDetail";
import { Cart } from "#pages/Cart";
import { Checkout } from "#pages/Checkout";
import { Login } from "#pages/Login";
import { Register } from "#pages/Register";
import { Orders } from "#pages/Orders";
import { AdminDashboard } from "#pages/admin/Dashboard";
import { AdminProducts } from "#pages/admin/Products";
import { AdminOrders } from "#pages/admin/Orders";
import { Toaster } from "#components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Routes>
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Navigate to="/products" replace />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminLayout>
                        <Routes>
                          <Route index element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

export default App;
