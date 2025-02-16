import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderPlacementPage from "./pages/order-placement";
import PaymentsPage from "./pages/PaymentsPage";
import OrderStatusPage from "./pages/order-status";
import AdminDashboard from "./pages/adimin-dashboard";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/order-placement" element={<OrderPlacementPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/order-status" element={<OrderStatusPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      
      {/* You can add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
