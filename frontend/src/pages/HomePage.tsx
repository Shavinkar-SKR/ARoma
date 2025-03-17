import React from "react";
import Banner from "../components/Banner";
import Offers from "../components/Offers";
import AboutSection from "../components/AboutSection";
import RestaurantCarousel from "../components/RestaurantCarousel";
import Testimonials from "../components/Testimonials";
import BeforeSection from "../components/BeforeSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <Banner />
      <Offers />
      <AboutSection/>
      <RestaurantCarousel />
      <Testimonials />
      <BeforeSection />

    </div>
  );
};

export default HomePage;
