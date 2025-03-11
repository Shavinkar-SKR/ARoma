import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderPlacementPage from "./pages/order-placement";
import PaymentsPage from "./pages/PaymentsPage";
import OrderStatusPage from "./pages/order-status";
import AdminDashboard from "./pages/adimin-dashboard";
import RestaurantSelectionPage from "./pages/restaurant-selection";
import DigitalMenuPage from "./pages/digital-menu";
import FeedbackPage from "./pages/feedback";
import FAQPage from "./pages/FAQ";
import ServiceRequest from "./pages/service";
import AdminServiceRequestPanel from "./pages/adminServiceRequestPanel";
import SalesAnalyticsStaffManagement from "./pages/salesAnalyticsStaffManagement";
import SignIn from "./pages/signIn";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/order-placement" element={<OrderPlacementPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/service" element={<ServiceRequest />} />
      <Route path="/adminServiceRequestPanel" element={<AdminServiceRequestPanel />} />
      <Route path="/salesAnalyticsStaffManagement" element={<SalesAnalyticsStaffManagement />} />
      <Route path="/signIn" element={<SignIn/>} />
      
      <Route
        path="restaurant-selection"
        element={<RestaurantSelectionPage />}
      />
      <Route path="/digital-menu/:restaurantId" element={<DigitalMenuPage />} />

      {/* You can add other routes here */}
    </Routes>
  );
};

export default AppRoutes;
