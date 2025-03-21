import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Offers from "../components/Offers";
import AboutSection from "../components/AboutSection";
import RestaurantCarousel from "../components/RestaurantCarousel";
import Testimonials from "../components/Testimonials";
import BeforeSection from "../components/BeforeSection";

const HomePage: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");
    
    if (loginSuccess) {
      setShowToast(true);
      localStorage.removeItem("loginSuccess"); // Remove flag after showing once
      setTimeout(() => setShowToast(false), 3000);
    }
  }, []);

  return (
    <div>
      <div className="relative">
        {/* Banner Section */}
        <Banner />

        {/* Success Toast Message */}
        {showToast && (
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg text-lg font-semibold">
            ✅ Login successful!
          </div>
        )}
      </div>

      <Offers />
      <AboutSection />
      <RestaurantCarousel />
      <Testimonials />
      <BeforeSection />
    </div>
  );
};

export default HomePage;
