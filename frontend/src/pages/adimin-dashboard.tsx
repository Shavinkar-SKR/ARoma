import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Utensils,
  Menu as MenuIcon
} from 'lucide-react';
import { toast } from 'sonner';

type Order = {
  _id: string;
  cartItems: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  specialInstructions: string;
  total: number;
  tableNumber: string;
  status: 'received' | 'preparing' | 'ready' | 'complete'; // Add the status field
};


function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Orders from API on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Fetched Orders:', data); // Debugging fetched data
        setOrders(data);  // Assume the API returns the order array
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Error fetching orders');
        toast.error('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleStatusUpdate = async (_order: Order, newStatus: Order['status']) => {
    const statusMessages = {
      received: '📝 Order marked as received',
      preparing: '👨‍🍳 Order is now being prepared',
      ready: '✅ Order is ready to serve',
      complete: '🎉 Order completed successfully',
    };

    toast.success(statusMessages[newStatus], {
      className: 'bg-gradient-to-r from-red-600 to-red-500 text-white',
    });

    try {
      const response = await fetch(`http://localhost:5001/api/orders/${_order._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };



  const sidebarItems = [
    { icon: ClipboardList, label: 'Orders', id: 'orders' },
    { icon: UtensilsCrossed, label: 'Menu', id: 'menu' },
    { icon: BarChart3, label: 'Reports', id: 'reports' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const filteredOrders = orders.filter((order) =>
    order.tableNumber.includes(searchQuery) || order.cartItems.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Toggle Button */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MenuIcon className="w-6 h-6 text-gray-700" />
      </motion.button>

      {/* Animated Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-white shadow-xl h-screen fixed z-40"
          >
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-500">
              <div className="flex items-center space-x-3">
                <Utensils className="w-8 h-8 text-white animate-float" />
                <h1 className="text-2xl font-bold text-white">Restaurant</h1>
              </div>
            </div>
            <nav className="mt-8">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ${
                    activeTab === item.id ? 'bg-red-50 text-red-600 border-r-4 border-red-600' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                    activeTab === item.id ? 'scale-110' : ''
                  }`} />
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                className="w-full flex items-center px-6 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 mt-auto transition-all duration-300"
                whileHover={{ x: 10, color: '#EF4444' }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="flex-1 overflow-auto"
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-8">
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Active Orders</h1>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              {loading ? (
                <div className="text-center py-6">Loading Orders...</div>
              ) : error ? (
                <div className="text-center py-6 text-red-600">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => {
                    console.log('Order:', order);  // Debugging individual orders
                    return (
                      <motion.div
                        key={order._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg text-gray-800">
                              Order #{order._id}
                            </h3>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Table: {order.tableNumber}</p>
                            <p>Special Instructions: {order.specialInstructions || 'None'}</p>
                            <p>Total: ${order.total}</p>
                            <div>
                              <h4>Items:</h4>
                              {order.cartItems.map((item, index) => (
                                <p key={index}>
                                  {item.name} x {item.quantity}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => handleStatusUpdate(order, 'preparing')}
                              className="w-full bg-blue-500 text-white py-2 rounded-lg"
                            >
                              Mark as Preparing
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
