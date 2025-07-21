import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
}

const SpiceHeader: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Close mobile menus when the page route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Effect for fetching profile data on auth change
  useEffect(() => {
    const fetchProfileData = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      if (token) {
        setProfile({
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        });
      } else {
        setProfile(null);
      }
    };

    fetchProfileData();
    window.addEventListener("tokenChange", fetchProfileData);
    return () => window.removeEventListener("tokenChange", fetchProfileData);
  }, []);

  // Effect for closing user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".user-dropdown-container")) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.toLowerCase().includes("user") || key === "token") {
        localStorage.removeItem(key);
      }
    });
    window.dispatchEvent(new Event("tokenChange"));
    toast({ title: "Logged out successfully!" });
    navigate("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const mainNavLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Logo, Search, Icons */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dexsr3yj6/image/upload/v1751994448/dhanalaxmi_t9obga.jpg"
              alt="Logo"
              className="h-8 w-8 rounded-full"
            />
            <span className="md:text-2xl text-lg font-bold">
              DhanaLaxmi Foods
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search spices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-gray-800 px-4 py-2 pr-10 rounded-full border focus:ring-2 focus:ring-secondary"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </form>
          </div>

          {/* Right-side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/wishlist" className="relative">
                    <Heart className="h-6 w-6" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  <div className="relative user-dropdown-container">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      <User className="h-6 w-6" />
                    </button>
                    {isUserDropdownOpen && profile && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border text-gray-800">
                        <div className="p-4 border-b">
                          <p className="font-bold text-lg">{profile.name}</p>
                          <p className="text-sm text-gray-500">
                            {profile.email}
                          </p>
                        </div>
                        <nav className="py-2">
                          <Link
                            to="/order-history"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <ListOrdered className="w-4 h-4 mr-2" /> My Orders
                          </Link>
                        </nav>
                        <div className="p-2">
                          <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600"
                          >
                            Logout
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Cart Icon (Visible on all screen sizes) */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Icons */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen((v) => !v)}
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Inline Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-white/20">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search for spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 text-gray-800 px-4 py-2 pr-10 rounded-full border"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Navigation Links (second row) */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-2 border-t border-white/20">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="hover:text-secondary transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu (slide out) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-primary z-40 shadow-lg">
          <nav className="container mx-auto px-4 pt-2 pb-4 border-t border-white/20 flex flex-col">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 text-base border-b border-white/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/order-history"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 text-base"
                  >
                    <ListOrdered className="mr-3 h-5 w-5" />
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 text-base"
                  >
                    <Heart className="mr-3 h-5 w-5" />
                    My Wishlist
                  </Link>
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start px-0 text-base"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SpiceHeader;
