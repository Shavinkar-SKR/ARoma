import { useState, useEffect, useRef } from "react";
import bghero from '../assets/bghero.jpg';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false); // State to track visibility
  const sectionRef = useRef(null); // Ref for the section

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state based on whether the section is in view
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current); // Start observing the section
    }

    // Cleanup the observer on unmount
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} // Attach the ref to the section
      className="min-h-screen py-32 flex flex-col md:flex-row justify-between items-center relative overflow-hidden bg-fixed" 
      style={{ 
        backgroundImage: `url(${bghero})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-16">
          {/* Apply animation when section is visible */}
          <h2 
            className={`text-4xl md:text-5xl font-bold text-white uppercase mb-8 md:mb-0 transition-all duration-1000 ease-out ${
              isVisible ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            About Us
          </h2>
          
          {/* Apply animation when section is visible */}
          <div 
            className={`max-w-2xl transition-all duration-1000 ease-out ${
              isVisible ? "animate-slide-in-right" : "opacity-0"
            }`}
          >
            <p className="text-xl text-yellow-400 font-semibold leading-relaxed">
              From elegant fine dining to hidden gems with mouthwatering flavors, 
              <strong className="text-white"> ARoma</strong> brings it all to you. 
              Immerse yourself in AR food previews, enjoy real-time order tracking, 
              and explore customized menu options—all designed to make your dining 
              experience seamless and unforgettable!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;