import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CookingPot, 
  Bell, 
  CheckCircle, 
  ArrowLeft,
  Utensils,
  ShoppingBag,
  List
} from 'lucide-react';
import socket from '../socket';
import { toast, Toaster } from 'sonner';

type Order = {
  _id: string;
  cartItems: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  specialInstructions: string;
  total: number;
  tableNumber: string;
  status: 'received' | 'preparing' | 'ready' | 'complete';
};

// Status steps configuration
const STATUS_STEPS = [
  { 
    value: 'received', 
    label: 'Order Received', 
    icon: Clock, 
    color: 'blue',
    description: 'Your order has been received and is being processed.'
  },
  { 
    value: 'preparing', 
    label: 'Preparing', 
    icon: CookingPot, 
    color: 'yellow',
    description: 'Our chefs are preparing your delicious meal.'
  },
  { 
    value: 'ready', 
    label: 'Ready for Pickup', 
    icon: Bell, 
    color: 'green',
    description: 'Your order is ready! Please collect it from the counter.'
  },
  { 
    value: 'complete', 
    label: 'Completed', 
    icon: CheckCircle, 
    color: 'gray',
    description: 'Your order has been completed. Enjoy your meal!'
  }
];

function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllOrders, setShowAllOrders] = useState<boolean>(false);

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`http://localhost:5001/api/orders/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data);
        
        // Set current step based on order status
        const statusIndex = STATUS_STEPS.findIndex(step => step.value === data.status);
        setCurrentStep(statusIndex >= 0 ? statusIndex : 0);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Unable to load your order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Fetch all orders for the admin view
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch all orders');
        }
        
        const data = await response.json();
        setAllOrders(data);
      } catch (err) {
        console.error('Error fetching all orders:', err);
        // Don't set error state here as it would affect the main order view
      }
    };

    fetchAllOrders();
  }, []);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    if (!id) return;

    // Join the room for this specific order
    socket.emit('joinOrderRoom', id);
    
    // Listen for updates to this specific order
    socket.on('orderUpdated', (updatedOrder: Order) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
        
        // Update current step based on new status
        const statusIndex = STATUS_STEPS.findIndex(step => step.value === updatedOrder.status);
        setCurrentStep(statusIndex >= 0 ? statusIndex : 0);
        
        // Show toast notification
        toast.success(`Order status updated to ${updatedOrder.status}`);
      }
      
      // Also update the order in the allOrders array
      setAllOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });
    
    // Listen for new orders
    socket.on('newOrder', (newOrder: Order) => {
      setAllOrders(prevOrders => [newOrder, ...prevOrders]);
      toast.info('New order received');
    });
    
    // Listen for deleted orders
    socket.on('orderDeleted', (deletedOrderId: string) => {
      setAllOrders(prevOrders => prevOrders.filter(order => order._id !== deletedOrderId));
      
      // If the deleted order is the current one being viewed, show a message
      if (deletedOrderId === id) {
        toast.info('This order has been completed and removed from the system');
      }
    });
    
    // Cleanup function
    return () => {
      socket.emit('leaveOrderRoom', id);
      socket.off('orderUpdated');
      socket.off('newOrder');
      socket.off('orderDeleted');
    };
  }, [id]);

  // Get estimated time based on status
  const getEstimatedTime = (status: string): string => {
    switch (status) {
      case 'received':
        return '15-20 minutes';
      case 'preparing':
        return '10-15 minutes';
      case 'ready':
        return 'Ready now!';
      case 'complete':
        return 'Completed';
      default:
        return '15-20 minutes';
    }
  };

  // Get status badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'complete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the order you're looking for."}</p>
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get current status details
  const currentStatus = STATUS_STEPS[currentStep];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast container for notifications */}
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center text-red-600 hover:text-red-800 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center">
              <Utensils className="w-6 h-6 text-red-600 mr-2" />
              <span className="font-bold text-lg">Restaurant</span>
            </div>
            <button 
              onClick={() => setShowAllOrders(!showAllOrders)}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <List className="w-5 h-5 mr-2" />
              <span className="font-medium">{showAllOrders ? 'Hide All Orders' : 'View All Orders'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAllOrders ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">All Orders</h2>
              <p className="text-gray-600">Real-time view of all current orders</p>
            </div>
            
            <div className="p-6">
              {allOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders available at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      className={`bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${order._id === id ? 'ring-2 ring-red-500' : ''}`}
                      whileHover={{ y: -5 }}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Link 
                            to={`/order-status/${order._id}`}
                            className="font-semibold text-lg text-gray-800 hover:text-red-600"
                          >
                            Order #{order._id.substring(order._id.length - 6)}
                          </Link>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Table: {order.tableNumber}</p>
                        <p className="text-sm font-medium text-gray-800 mt-2">Total: ${order.total.toFixed(2)}</p>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Items:</h4>
                          <ul className="text-sm space-y-1">
                            {order.cartItems.slice(0, 3).map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-500">x {item.quantity}</span>
                              </li>
                            ))}
                            {order.cartItems.length > 3 && (
                              <li className="text-gray-500 text-xs italic">
                                +{order.cartItems.length - 3} more items
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Status Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-8 text-white">
              <h1 className="text-2xl font-bold mb-2">Order Status</h1>
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                <p className="font-medium">Order #{order._id.substring(order._id.length - 6)}</p>
              </div>
              <p className="mt-2">Table: {order.tableNumber}</p>
              <div className="mt-4 bg-white/10 rounded-lg px-4 py-3">
                <p className="font-medium">Estimated Time: {getEstimatedTime(order.status)}</p>
              </div>
            </div>

            {/* Status Tracker */}
            <div className="px-6 py-8">
              <div className="relative">
                {/* Progress Bar */}
                <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
                  <motion.div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>

                {/* Status Steps */}
                <div className="flex justify-between">
                  {STATUS_STEPS.map((step, index) => {
                    const StatusIcon = step.icon;
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div key={step.value} className="flex flex-col items-center relative">
                        <motion.div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive 
                              ? index === 3 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white' 
                              : 'bg-gray-200 text-gray-500'
                          } ${isCurrent ? 'ring-4 ring-red-100' : ''}`}
                          initial={{ scale: 1 }}
                          animate={{ scale: isCurrent ? [1, 1.1, 1] : 1 }}
                          transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 2 }}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </motion.div>
                        <p className={`mt-2 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Status Description */}
              <motion.div 
                className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentStatus.value}
              >
                <h3 className="font-medium text-lg flex items-center">
                  <currentStatus.icon className={`w-5 h-5 mr-2 text-${currentStatus.color}-500`} />
                  {currentStatus.label}
                </h3>
                <p className="mt-2 text-gray-600">{currentStatus.description}</p>
              </motion.div>
            </div>

            {/* Order Details */}
            <div className="px-6 py-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              
              <div className="space-y-4">
                {order.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Utensils className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              {order.specialInstructions && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-1">Special Instructions</h3>
                  <p className="text-yellow-700">{order.specialInstructions}</p>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span className="text-xl">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderStatus;