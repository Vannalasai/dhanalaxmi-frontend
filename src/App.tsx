// src/App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

import SpiceHeader from "@/components/SpiceHeader";
import Sidebar from "@/components/admin/Sidebar";
import Footer from "@/components/Footer";

// మీ పేజీలను ఇంపోర్ట్ చేసుకోండి
import Home from "@/pages/Home";
import About from "@/pages/About";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import Checkout from "@/pages/Checkout";
import OrderPlaced from "@/pages/OrderPlaced";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import OrderHistory from "@/pages/OrderHistory";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// AdminLogin ను తొలగించండి
// import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AddProduct from "@/components/admin/AddProduct";
import UsersDashboard from "@/components/admin/UsersDashboard";
import OrdersDashboard from "@/components/admin/OrdersDashboard";
import AllProducts from "@/components/admin/AllProducts";
import EditProduct from "@/components/admin/EditProduct";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const AppRoutes: React.FC = () => {
  const loc = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      setIsAuth(!!token);
      // యూజర్ లాగిన్ అయి, వారి రోల్ 'admin' అయితేనే isAdmin true అవుతుంది
      setIsAdmin(!!token && role === "admin");
    };

    checkAuthStatus();
    window.addEventListener("tokenChange", checkAuthStatus);

    return () => {
      window.removeEventListener("tokenChange", checkAuthStatus);
    };
  }, []);

  // Admin రక్షిత రూట్స్
  if (loc.pathname.startsWith("/admin")) {
    // లాగిన్ అవ్వకపోతే, లాగిన్ పేజీకి పంపండి
    if (!isAuth) return <Navigate to="/login" replace />;
    // లాగిన్ అయి, అడ్మిన్ కాకపోతే, హోమ్ పేజీకి పంపండి
    if (!isAdmin) return <Navigate to="/" replace />;

    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-64 w-full p-6">
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/users" element={<UsersDashboard />} />
            <Route path="/admin/orders" element={<OrdersDashboard />} />
            <Route path="/admin/all-products" element={<AllProducts />} />
            <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            <Route
              path="/admin/*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </div>
      </div>
    );
  }

  // సాధారణ మరియు యూజర్ రూట్స్
  return (
    <div className="flex flex-col min-h-screen">
      <SpiceHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route
            path="/cart"
            element={isAuth ? <Cart /> : <Navigate to="/login" />}
          />
          <Route
            path="/wishlist"
            element={isAuth ? <Wishlist /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkout"
            element={isAuth ? <Checkout /> : <Navigate to="/login" />}
          />
          <Route
            path="/order-placed"
            element={isAuth ? <OrderPlaced /> : <Navigate to="/login" />}
          />
          <Route
            path="/order-history"
            element={isAuth ? <OrderHistory /> : <Navigate to="/login" />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={!isAuth ? <Login /> : <Navigate to="/" replace />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/signup"
            element={!isAuth ? <Signup /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
