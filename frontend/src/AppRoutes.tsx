import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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
import ForYou from "./pages/foryou";
import HomePage from "./pages/HomePage";
import Terms from "./pages/terms";
import Security from "./pages/security";
import Privacy from "./pages/privacy";
import SignUpDialog from "./pages/signUpDialog";
import SignIn from "./pages/signIn";
import Contact from "./pages/contact";
import ResetPassword from "./pages/ResetPassword";
import ARView from "./pages/ar-view";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/order-placement" element={<OrderPlacementPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
        <Route
          path="/adminServiceRequestPanel"
          element={<AdminServiceRequestPanel />}
        />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/service" element={<ServiceRequest />} />
        <Route
          path="/salesAnalyticsStaffManagement"
          element={<SalesAnalyticsStaffManagement />}
        />
        <Route path="/foryou" element={<ForYou />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="restaurant-selection"
          element={<RestaurantSelectionPage />}
        />
        <Route
          path="/digital-menu/:restaurantId"
          element={<DigitalMenuPage />}
        />
        <Route path="/digital-menu/" element={<DigitalMenuPage />} />

        <Route
          path="restaurant-selection"
          element={<RestaurantSelectionPage />}
        />
        <Route
          path="/digital-menu/:restaurantId"
          element={<DigitalMenuPage />}
        />
        <Route path="/ar-view" element={<ARView />} />

        {/* You can add other routes here */}
      </Route>
      <Route path="/signUpDialog" element={<SignUpDialog />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
