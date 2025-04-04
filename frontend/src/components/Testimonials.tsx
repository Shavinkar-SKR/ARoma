import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import LastImage from "../assets/last.jpg";

// Interface for testimonial data
interface Testimonial {
  id: string;
  comment: string;
  rating: number;
  username: string;
  restaurantName: string;
  createdAt: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // Removed unused isVisible state

  // Fetch testimonials data from backend API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/feedback'); 
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials, activeIndex]);

  // Removed scroll effect logic as isVisible state is not used

  return (
    <section 
      className="py-20 relative overflow-hidden bg-cover">
      <div className="absolute inset-0 bg-black bg-opacity-70">
        <img
            src={LastImage}
            alt="Test-Last"
            className=" shadow-2xl object-cover w-full h-full opacity-90"
        />
      </div>
      
     
      <div className="container mx-auto px-4 relative z-10 justify-center">
        <h2 className="text-6xl font-bold text-center mb-12 text-white ">
        
          What Our Users Say
         
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-all duration-500 px-4 ${index === activeIndex ? 'opacity-100 translate-x-0' : 'absolute opacity-0 translate-x-20'}`}
              >
              <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-6 md:p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                    <div>
                      <h3 className="font-bold text-xl flex justify-center">{testimonial.username}</h3>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                      <div>
                      <h4 className="font-bold text-white-600 text-xl flex justify-center ">{testimonial.restaurantName}</h4>
                   </div> 
                    </div>
                  </div>

                  
                  <blockquote className="text-lg italic mb-8 flex justify-center">
                    "{testimonial.comment}"
                  </blockquote>
                  
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`mx-1 h-3 w-3 rounded-full transition-colors duration-300 ${index === activeIndex ? 'bg-restaurant-primary' : 'bg-gray-500'}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
