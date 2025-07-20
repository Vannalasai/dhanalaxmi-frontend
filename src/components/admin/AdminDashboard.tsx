// src/pages/AdminDashboard.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const loginTime = localStorage.getItem("adminTokenLoginTime");
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    console.log("Dashboard - token:", token, "loginTime:", loginTime);

    if (!token || !loginTime || Date.now() - Number(loginTime) > sevenDays) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminTokenLoginTime");
      window.dispatchEvent(new Event("tokenChange"));
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-dark-green mb-4">
        Admin Dashboard
      </h1>
      <p>Welcome to the admin panel. Manage your products here.</p>
    </div>
  );
};

export default AdminDashboard;
