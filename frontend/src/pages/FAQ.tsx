import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CdButton from "@/components/cd/CdButton";
import { 
  FaBars, 
  FaTimes, 
  FaQuestionCircle, 
  FaInstagram, 
  FaTiktok, 
  FaEnvelope, 
  FaLinkedin, 
  FaFacebook
} from "react-icons/fa";

const staticFAQs = [
  {
    section: "Navigating Home Page",
    video: "https://www.example.com/video-homepage",
    description: "Learn how to navigate the home page and find key features."
  },
  {
    section: "Browsing Restaurants and menus",
    video: "https://www.example.com/video-restaurants",
    description: "A guide to exploring restaurants and finding the best meals."
  },

  {
  section: "placing an order",
  video: "howto_order.mp4", 
  description: "Learn how to leave feedback about your order or experience.",
  content: (
    <div className="space-y-6 flex flex-col md:flex-row items-center md:items-start p-6 md:space-x-10">

      {/* Video (Left Side) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-70 h-120 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <video
            controls
            className="w-full h-full object-cover"
            src="/cd/howto_order.mp4"
            title="how to place an order"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Instructions (Right Side) */}
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          How to place an order
        </h3>
        <ul className="list-none text-gray-700 space-y-2">
          <li>
            <strong className="text-lg">Step 1:</strong> select a restuarant of choice 
			and click view menu 
          </li>
          <li>
            <strong className="text-lg">Step 2:</strong> pick a dish and click add to cart
          </li>
          <li>
            <strong className="text-lg">Step 3:</strong> view cart 
          </li>
		  <li>
            <strong className="text-lg">Step 4:</strong> edit the order in the cart (optional)
          </li>
		  <li>
            <strong className="text-lg">Step 5:</strong> proceed to checkout
          </li>
		  <li>
            <strong className="text-lg">Step 6:</strong> give your table number 
			and instructions (optional). 
		  </li>
		  <li>
            <strong className="text-lg">Step 7:</strong> click process payment  
		  </li>
        </ul>
      </div>
    </div>
  ),
},

  
  //
  {
  section: "Leaving Feedback",
  video: "/cd/howto_feedback.mp4", // Ensure the correct video path
  description: "Learn how to leave feedback about your order or experience.",
  content: (
    <div className="space-y-6 flex flex-col md:flex-row items-center md:items-start p-6 md:space-x-10">

      {/* Video (Left Side) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-70 h-120 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <video
            controls
            className="w-full h-full object-cover"
            src="/cd/howto_feedback.mp4"
            title="Leaving Feedback Tutorial"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Instructions (Right Side) */}
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          How to Leave a Feedback
        </h3>
        <ul className="list-none text-gray-700 space-y-2">
          <li>
            <strong className="text-lg">Step 1:</strong> Fill the submit form.
          </li>
          <li>
            <strong className="text-lg">Step 2:</strong> Click the submit button.
          </li>
          <li>
            <strong className="text-lg">Step 3:</strong> Check for a successful submission message.
          </li>
        </ul>
      </div>
    </div>
  ),
},

//


  {
    section: "How to Contact Us",
    video: "https://www.example.com/video-contact",
    description: "Ways to get in touch with our support team for assistance."
  }
];

const FAQPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/cd/logo.gif" alt="Aroma Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold">Aroma</span> 
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="bg-gray-800 text-white p-4 absolute top-16 left-0 w-full shadow-lg">
          {staticFAQs.map((faq, index) => (
            <a
              key={index}
              href={`#${faq.section.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={handleMenuClick}
              className="block py-2 hover:underline cursor-pointer"
            >
              {faq.section}
            </a>
          ))}
        </div>
      )}

      {/* Red Bar */}
      <div className="bg-red-600 text-white text-center py-2 font-semibold">
        Learn How to Use Our App
      </div>

      {/* Branding Section */}
      <div className="text-center p-6">
        <div className="flex justify-center items-center gap-2">
          <img src="/cd/logo.gif" alt="Aroma Logo" className="h-12 w-auto" />
          <h1 className="text-4xl font-bold">Aroma</h1>
        </div>
        <p className="text-gray-700 mt-2 text-lg font-semibold">
          Bringing Digitalized Solutions to Your Dining Experience
        </p>
      </div>

      {/* Intro Section */}
      <div className="max-w-3xl mx-auto text-center p-6">
        <h1 className="text-3xl font-bold mb-4">How to Use Aroma</h1>
        <p className="text-gray-700 mb-4">Watch the video below to understand how our app works.</p>
        <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
          <p className="text-gray-500">[Embed video here]</p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-3xl mx-auto p-6">
        {staticFAQs.map((faq, index) => (
          <Card key={index} id={faq.section.replace(/\s+/g, "-").toLowerCase()} className="mb-3">
            <CardHeader>
              <CardTitle>{faq.section}</CardTitle>
            </CardHeader>
            <CardContent>
              {faq.content || ( // Render custom content if available
                <>
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center mb-2">
                    <p className="text-gray-500">[Embed video here]</p>
                  </div>
                  <p>{faq.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating FAQ Button */}
      <CdButton 
        onClick={() => setFaqOpen(!faqOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
      >
        <FaQuestionCircle size={24} />
      </CdButton>

      {/* FAQ Sidebar */}
      {faqOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <button onClick={() => setFaqOpen(false)} className="text-2xl float-right">
            <FaTimes />
          </button>
          <h2 className="text-xl font-bold mb-4">Live FAQ</h2>
          <p className="text-gray-600">Ask a question or browse previous FAQs.</p>
        </div>
      )}

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white text-center p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">
          <a href="/about" className="text-blue-400 hover:underline">
            About Us
          </a>
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          We provide digitalized solutions to enhance your dining experience.
        </p>
        <div className="flex justify-center gap-6">
          <a href="https://www.instagram.com/aroma_offcial/?igsh=YzljYTk1ODg3Zg%3D%3D#" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} className="cursor-pointer hover:text-gray-400 transition duration-300" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={24} className="cursor-pointer hover:text-gray-400 transition duration-300" />
          </a>
          <a href="#">
            <FaEnvelope size={24} className="cursor-pointer hover:text-gray-400 transition duration-300" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} className="cursor-pointer hover:text-gray-400 transition duration-300" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={24} className="cursor-pointer hover:text-gray-400 transition duration-300" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;