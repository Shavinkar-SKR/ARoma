import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderPlacementPage from "./pages/order-placement";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/order-placement" element={<OrderPlacementPage />} />
    </Routes>
  );
};

export default AppRoutes;
