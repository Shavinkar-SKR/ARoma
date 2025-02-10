import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderPlacementPage from "./pages/order-placement";
import PaymentsPage from "./pages/PaymentsPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/order-placement" element={<OrderPlacementPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      {/* You can add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
