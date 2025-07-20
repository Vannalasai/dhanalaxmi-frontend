import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  PackagePlus,
  LogOut,
  List,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // కొత్త లాగిన్ సిస్టమ్‌కు అనుగుణంగా లాగౌట్ ఫంక్షన్
  const handleLogout = (): void => {
    // యూజర్‌కు సంబంధించిన అన్ని వివరాలను localStorage నుండి తొలగించండి
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userMobile");
    localStorage.removeItem("userRole"); // ముఖ్యంగా రోల్‌ను తొలగించండి
    localStorage.removeItem("userVerified");

    window.dispatchEvent(new Event("tokenChange"));

    // సాధారణ లాగిన్ పేజీకి నావిగేట్ చేయండి
    navigate("/login");
  };

  // నావిగేషన్ ఐటెమ్స్‌ను సులభంగా నిర్వహించడానికి ఒక అర్రే
  const navItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/add-product", icon: PackagePlus, label: "Add Product" },
    { href: "/admin/all-products", icon: List, label: "All Products" },
  ];

  return (
    <div className="fixed w-64 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center py-2.5 px-4 rounded transition duration-200 ${
                  isActive ? "bg-primary text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center mt-8 w-full bg-red-600 hover:bg-red-700 py-2.5 px-4 rounded transition duration-200"
      >
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
