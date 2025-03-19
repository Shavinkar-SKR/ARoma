import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChefHat,
  Timer,
  Package,
  PhoneCall,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetails {
  _id: string;
  cartItems: CartItem[];
  specialInstructions: string;
  total: number;
  tableNumber: string;
  status: "received" | "preparing" | "ready" | "complete";
}

type StatusKey = keyof typeof statusConfig;

const statusConfig = {
  received: {
    icon: Package,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Order Received",
    progress: 25,
    description: "Your order has been received and is being processed",
    estimatedTime: "5-10 minutes",
  },
  preparing: {
    icon: ChefHat,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Preparing",
    progress: 50,
    description: "Our chefs are preparing your delicious meal",
    estimatedTime: "15-20 minutes",
  },
  ready: {
    icon: Timer,
    color: "text-red-800",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Ready for Pickup",
    progress: 75,
    description: "Your order is ready to be served",
    estimatedTime: "2-5 minutes",
  },
  complete: {
    icon: CheckCircle2,
    color: "text-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Completed",
    progress: 100,
    description: "Enjoy your meal!",
    estimatedTime: "Completed",
  },
};

// Sample random restaurant-related messages
const randomMessages = [
  {
    id: 1,
    title: "A classic combo that never goes out of style!",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Indulge in a slice of happiness with every bite!",
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Satisfy your cravings—one bite at a time!",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "Fresh ingredients, amazing flavors!",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
  },
];

const OrderStatus: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [, setIsConnected] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const location = useLocation();
  const estimatedTime = location.state?.estimatedTime || "Calculating...";
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % randomMessages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const setupEventSource = () => {
      eventSourceRef.current = new EventSource(
        `http://localhost:5001/order-events/${orderId}`
      );

      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        setError("");
      };

      eventSourceRef.current.addEventListener("initial", (event) => {
        const data = JSON.parse((event as MessageEvent).data);
        setOrder(data);
      });

      eventSourceRef.current.addEventListener("update", (event) => {
        const data = JSON.parse((event as MessageEvent).data);
        setOrder((prev) => {
          if (!prev) return data;

          const newStatus = data.status;
          if (prev.status !== newStatus) {
            const statusKey = newStatus as StatusKey;
            toast.success(
              `Order status updated to ${statusConfig[statusKey].label}`,
              {
                icon: React.createElement(statusConfig[statusKey].icon, {
                  className: statusConfig[statusKey].color,
                }),
              }
            );

            if (newStatus === "complete") {
              setTimeout(() => navigate("/restaurant-selection"), 3000);
            }
          }
          return data;
        });
      });

      eventSourceRef.current.addEventListener("error", (event) => {
        console.error("SSE Error:", event);
        setIsConnected(false);
        setError("Connection lost - reconnecting...");
        eventSourceRef.current?.close();
        setTimeout(setupEventSource, 3000);
      });
    };

    setupEventSource();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [orderId, navigate]);

  const handleRetry = () => {
    setError("");
    eventSourceRef.current?.close();
    const newEventSource = new EventSource(
      `http://localhost:5001/order-events/${orderId}`
    );
    eventSourceRef.current = newEventSource;
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4"
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl text-red-700 shadow-2xl border border-red-100 transform hover:scale-105 transition-transform w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            Reconnect
          </button>
        </div>
      </motion.div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative text-center"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-red-200 rounded-full animate-spin relative">
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-red-600 rounded-full"></div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-red-600 font-semibold"
          >
            Connecting to order updates...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const statusKey = order.status as StatusKey;
  const progress = statusConfig[statusKey].progress;
  const currentMessage = randomMessages[currentMessageIndex];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 to-white">
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
              <PhoneCall className="mr-2 h-5 w-5" />
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

          {/* Preparation Time */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-red-500" />
              Estimated Time:{" "}
              <span className="text-red-600">{estimatedTime}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="h-1 w-full bg-gray-200 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-1 bg-red-600 rounded-full"
                  ></motion.div>
                </div>
              </div>
              <div className="relative flex justify-between">
                {Object.entries(statusConfig).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center group">
                    <motion.div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300
                        ${
                          order.status === key
                            ? "bg-red-600"
                            : progress >=
                              statusConfig[key as StatusKey].progress
                            ? "bg-red-600"
                            : "bg-gray-200"
                        }`}
                      whileHover={{ scale: 1.1 }}
                      animate={
                        order.status === key
                          ? {
                              scale: [1, 1.1, 1],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }
                          : {}
                      }
                    >
                      {React.createElement(value.icon, {
                        className: `h-7 w-7 ${
                          progress >= statusConfig[key as StatusKey].progress
                            ? "text-white"
                            : "text-gray-500"
                        }`,
                      })}
                    </motion.div>
                    <p className="mt-3 text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {value.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details and Estimated Time */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-xl font-medium text-gray-900">
                    Order Details
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Table {order.tableNumber} • Total: €{order.total.toFixed(2)}
                  </p>
                </div>
              </div>
              {order.specialInstructions && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-700 font-medium">
                    Special Instructions:
                  </p>
                  <p className="mt-2 text-gray-700">
                    {order.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Random Recommendation */}
          {currentMessage && (
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg overflow-hidden h-64 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={currentMessage.image}
                alt={currentMessage.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 h-full flex items-center justify-center">
                <motion.h3
                  className="text-white text-2xl font-bold text-center px-4 py-2 bg-black bg-opacity-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentMessage.title}
                </motion.h3>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
