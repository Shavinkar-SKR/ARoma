import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CdButton from "@/components/cd/CdButton";
import { FaBars, FaTimes, FaQuestionCircle } from "react-icons/fa";

const staticFAQs = [
  {
    section: "Navigating Home Page",
    video: "https://www.example.com/video-homepage", // Replace with actual video URL
    description: "Learn how to navigate the home page and find key features."
  },
  {
    section: "Browsing Restaurants",
    video: "https://www.example.com/video-restaurants",
    description: "A guide to exploring restaurants and finding the best meals."
  },
  {
    section: "Viewing Digital Menu",
    video: "https://www.example.com/video-menu",
    description: "How to check restaurant menus and filter items based on preferences."
  },
  {
    section: "Placing an Order",
    video: "https://www.example.com/video-order",
    description: "Step-by-step instructions for placing an order."
  },
  {
    section: "Making an Online Purchase",
    video: "https://www.example.com/video-payment",
    description: "Secure payment methods and completing your purchase."
  },
  {
    section: "Leaving Feedback",
    video: "https://www.example.com/video-feedback",
    description: "How to leave feedback about your order or experience."
  },
  {
    section: "How to Contact Us",
    video: "https://www.example.com/video-contact",
    description: "Ways to get in touch with our support team for assistance."
  }
];

const FAQPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <img src="/cd/logo.gif" alt="Aroma Logo" className="h-10 w-auto" />
          {/* App Name */}
          <span className="text-xl font-bold">Aroma</span> 
        </div>

        {/* Menu Toggle Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="bg-gray-800 text-white p-4 absolute top-16 left-0 w-full shadow-lg">
          {staticFAQs.map((faq, index) => (
            <p key={index} className="py-2 hover:underline cursor-pointer" onClick={() => setMenuOpen(false)}>
              {faq.section}
            </p>
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
        <p className="text-gray-600 mt-2">
          {/* Add detailed explanation about the app here later */}
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
          <Card key={index} className="mb-3">
            <CardHeader>
              <CardTitle>{faq.section}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center mb-2">
                <p className="text-gray-500">[Embed video here]</p>
              </div>
              <p>{faq.description}</p>
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
          {/* Dynamic Q&A (to be implemented later) */}
        </div>
      )}
    </div>
  );
};

export default FAQPage;
