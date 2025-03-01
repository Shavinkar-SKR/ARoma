import { useState, useEffect } from "react";
import {
  ChefHat,
  Clock,
  Package,
  PhoneCall,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const location = useLocation();
const estimatedTime = location.state?.estimatedTime || "Calculating...";

const steps = [
  {
    id: 1,
    name: "Order Received",
    icon: Package,
    completed: true,
    current: false,
  },
  {
    id: 2,
    name: "Food Being Prepared",
    icon: ChefHat,
    completed: true,
    current: true,
  },
  {
    id: 3,
    name: "Ready for Pickup",
    icon: Truck,
    completed: false,
    current: false,
  },
  {
    id: 4,
    name: "Order Complete",
    icon: ShoppingBag,
    completed: false,
    current: false,
  },
];

// Sample random restaurant-related messages with images
const randomMessages = [
  {
    id: 1,
    title: "A classic combo that never goes out of style!",
    image: "/images/img2.jpg",
  },
  {
    id: 2,
    title: "Indulge in a slice of happiness with every bite of this cake!",
    image: "/images/img4.jpg",
  },
  {
    id: 3,
    title: "Satisfy your cravings—one burger at a time!",
    image: "/images/img3.jpg",
  },
  {
    id: 4,
    title: "Donut worry, be happy!",
    image: "/images/img1.jpg",
  },
];

function App() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % randomMessages.length
      ); // Change message every 5 seconds
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const currentMessage = randomMessages[currentMessageIndex];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-red-600 mb-2">Aroma</h1>
              <h2 className="text-2xl font-bold text-gray-900">Order Status</h2>
              <p className="mt-1 text-sm text-gray-500">
                Track your order preparation in real-time
              </p>
            </div>
            <button
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="group flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <PhoneCall className="mr-2 h-5 w-5 animate-pulse" />
              Contact Staff
            </button>
          </div>

          {/* Contact Staff Modal */}
          {isContactOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 transform transition-all duration-300 animate-slideIn">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Restaurant Staff
                </h3>
                <p className="text-gray-600 mb-4">
                  Our staff is here to help you with your order.
                </p>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300">
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Call Restaurant
                  </button>
                  <button
                    onClick={() => setIsContactOpen(false)}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="h-1 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-1 bg-red-600 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 transform group-hover:scale-110 ${
                        step.completed
                          ? "bg-red-600"
                          : step.current
                          ? "bg-red-600 animate-pulse"
                          : "bg-gray-200"
                      }`}
                    >
                      <step.icon
                        className={`h-7 w-7 ${
                          step.completed || step.current
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {step.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preparation Time */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            {/*
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600 mr-4 animate-pulse" />
              <div>
                <h3 className="text-xl font-medium text-gray-900">
                  Preparation Time
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  20 minutes • Our chefs are preparing your meal
                </p>
              </div>
            </div>
            */}
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-red-500" />
              Estimated Time:{" "}
              <span className="text-red-600">{estimatedTime}</span>
            </div>
          </div>

          {/* Random Recommendation */}
          {currentMessage && (
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full h-64 flex flex-col justify-center mb-8 mx-auto relative">
              <img
                src={currentMessage.image}
                alt={currentMessage.title}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
              />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <h3 className="font-medium text-white text-lg text-center">
                  {currentMessage.title}
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
