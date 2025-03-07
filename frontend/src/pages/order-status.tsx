import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle2, ChefHat, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  status: 'received' | 'preparing' | 'ready' | 'complete';
}

type StatusKey = keyof typeof statusConfig;

const statusConfig = {
  received: {
    icon: ClipboardList,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Order Received',
    progress: 25,
    description: 'Your order has been received and is being processed',
  },
  preparing: {
    icon: ChefHat,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Preparing',
    progress: 50,
    description: 'Our chefs are preparing your delicious meal',
  },
  ready: {
    icon: Timer,
    color: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Ready for Pickup',
    progress: 75,
    description: 'Your order is ready to be served',
  },
  complete: {
    icon: CheckCircle2,
    color: 'text-red-900',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Completed',
    progress: 100,
    description: 'Enjoy your meal!',
  },
};

const OrderStatus: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [previousStatus, setPreviousStatus] = useState<StatusKey | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }
      const data: OrderDetails = await response.json();

      if (previousStatus && previousStatus !== data.status) {
        const statusKey = data.status as StatusKey;
        toast.success(`Order status updated to ${statusConfig[statusKey].label}`, {
          duration: 3000,
          icon: React.createElement(statusConfig[statusKey].icon, {
            className: statusConfig[statusKey].color,
          }),
        });

        if (data.status === 'complete') {
          setTimeout(() => {
            navigate('/restaurant-selection');
          }, 3000);
        }
      }

      setPreviousStatus(data.status as StatusKey);
      setOrder(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to fetch order status');
      toast.error('Failed to fetch order status', {
        duration: 3000,
      });
      console.error('Error fetching order status:', err);
    }
  };

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

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
            onClick={fetchOrderStatus}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            Retry
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
            Loading order details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const statusKey = order.status as StatusKey;
  const StatusIcon = statusConfig[statusKey].icon;
  const progress = statusConfig[statusKey].progress;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-red-50 to-white py-6 md:py-12 px-4 md:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-4xl mx-auto relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-100 overflow-hidden">
          <div className="p-6 md:p-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-900 to-red-600">
                Order Status
              </h1>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <motion.span
                  className="text-sm md:text-base bg-red-900 text-white px-6 py-2.5 rounded-2xl font-medium inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  Order #{order._id}
                </motion.span>
                <span className="text-sm text-red-600">
                  Last updated: {lastUpdated}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="relative mb-8 md:mb-12"
            >
              <div className="h-3 bg-red-100 rounded-full mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div
                className={`${statusConfig[statusKey].bgColor} border ${statusConfig[statusKey].borderColor} p-6 md:p-8 rounded-3xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg`}
              >
                <div className="flex items-center gap-6">
                  <div className={`${statusConfig[statusKey].bgColor} p-4 rounded-2xl`}>
                    <StatusIcon className={`h-8 w-8 md:h-10 md:w-10 ${statusConfig[statusKey].color}`} />
                  </div>
                  <div>
                    <span className={`font-bold ${statusConfig[statusKey].color} text-xl md:text-2xl block mb-2`}>
                      {statusConfig[statusKey].label}
                    </span>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-base md:text-lg text-gray-600"
                    >
                      {statusConfig[statusKey].description}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-red-900">Order Details</h2>
                  <motion.div
                    className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-red-50 transition-colors shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-lg text-red-700 mb-3">
                      Table Number: <span className="font-bold text-red-900">{order.tableNumber}</span>
                    </p>
                    <p className="text-lg text-red-700">
                      Total: <span className="font-bold text-red-900">€{order.total.toFixed(2)}</span>
                    </p>
                  </motion.div>
                </div>

                {order.specialInstructions && (
                  <motion.div layout>
                    <h2 className="text-2xl font-bold mb-4 text-red-900">Special Instructions</h2>
                    <motion.div
                      className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-red-50 transition-colors shadow-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-lg text-red-800 italic">"{order.specialInstructions}"</p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-red-900">Items</h2>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {order.cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-6 flex justify-between items-center gap-4 hover:bg-red-50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-red-100"
                    >
                      <div>
                        <p className="font-semibold text-lg text-red-900">{item.name}</p>
                        <p className="text-base text-red-700 mt-2">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-red-900">€{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-red-600 mt-2">€{item.price.toFixed(2)} each</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderStatus;