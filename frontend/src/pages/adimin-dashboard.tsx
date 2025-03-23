import React from 'react';
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
  Menu as MenuIcon,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  X,
  ChefHat,
  Sparkles,
  Edit,
  CheckCircle,
  Clock,
  CookingPot,
  Bell,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import socket from '../socket'; // Relative path

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

type Restaurant = {
  _id: string;
  name: string;
  cuisine: string;
  address: string;
  image?: string;
  location?: string;
  rating?: number;
  priceRange?: string;
  reviews?: number;
};

type MenuItem = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  restaurantId: string;
  dietary?: string[]; // Array of strings
  hasARPreview?: boolean;
};

// Type for the form data dietary options
type DietaryOptions = {
  isVegan: boolean;
  isNutFree: boolean;
  isGlutenFree: boolean;
};

const CATEGORIES = [
  'Appetizer',
  'Main Course',
  'Dessert',
  'Beverage',
  'Side Dish',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Special'
];

// Status options for order status dropdown
const STATUS_OPTIONS = [
  { value: 'received', label: 'Received', icon: Clock, color: 'blue' },
  { value: 'preparing', label: 'Preparing', icon: CookingPot, color: 'yellow' },
  { value: 'ready', label: 'Ready', icon: Bell, color: 'green' },
  { value: 'complete', label: 'Complete', icon: CheckCircle, color: 'gray' }
];

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<{[key: string]: boolean}>({});
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    dietary: { 
      isVegan: false,
      isNutFree: false,
      isGlutenFree: false,
    } as DietaryOptions,
    hasARPreview: false
  });

  // Fetch Orders from API on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError('Error fetching orders');
        toast.error('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  // Set up WebSocket listeners for real-time order updates
  useEffect(() => {
    // Listen for order updates
    socket.on('orderUpdated', (updatedOrder: Order) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      
      // Show toast notification for status change
      const statusLabel = STATUS_OPTIONS.find(option => option.value === updatedOrder.status)?.label || updatedOrder.status;
      toast.success(`Order #${updatedOrder._id.substring(updatedOrder._id.length - 6)} status updated to ${statusLabel}`);
    });

    // Listen for new orders
    socket.on('newOrder', (newOrder: Order) => {
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      toast.success(`New order received: #${newOrder._id.substring(newOrder._id.length - 6)}`);
    });

    // Listen for deleted orders
    socket.on('orderDeleted', (deletedOrderId: string) => {
      setOrders(prevOrders => prevOrders.filter(order => order._id !== deletedOrderId));
      toast.info(`Order #${deletedOrderId.substring(deletedOrderId.length - 6)} has been removed`);
    });

    // Cleanup function to remove event listeners
    return () => {
      socket.off('orderUpdated');
      socket.off('newOrder');
      socket.off('orderDeleted');
    };
  }, []);

  // Fetch Restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/restaurants');
        if (!response.ok) throw new Error('Failed to fetch restaurants');
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError('Error fetching restaurants');
        toast.error('Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'menu') {
      fetchRestaurants();
    }
  }, [activeTab]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Handle clicking on a restaurant to fetch its menu
  const handleRestaurantClick = async (restaurantId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setSelectedRestaurant(data.restaurant);
      setMenuItems(data.menuItems);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError('Error fetching menu items');
      toast.error('Failed to fetch menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDietaryChange = (diet: keyof DietaryOptions) => {
    setFormData(prev => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [diet]: !prev.dietary[diet], // Toggle the boolean value
      },
    }));
  };

  // Convert dietary object to array for API
  const dietaryObjectToArray = (dietaryObj: DietaryOptions): string[] => {
    const result: string[] = [];
    if (dietaryObj.isVegan) result.push('Vegan');
    if (dietaryObj.isNutFree) result.push('Nut-Free');
    if (dietaryObj.isGlutenFree) result.push('Gluten-Free');
    return result;
  };

  // Convert dietary array to object for form
  const dietaryArrayToObject = (dietaryArr: string[] | undefined): DietaryOptions => {
    // Ensure dietaryArr is an array, if not, use an empty array
    const safeArray = Array.isArray(dietaryArr) ? dietaryArr : [];
    
    return {
      isVegan: safeArray.includes('Vegan'),
      isNutFree: safeArray.includes('Nut-Free'),
      isGlutenFree: safeArray.includes('Gluten-Free'),
    };
  };

  // Add a new menu item to a specific restaurant
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    setLoading(true);
    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        dietary: dietaryObjectToArray(formData.dietary), // Convert to array for API
        hasARPreview: formData.hasARPreview,
        restaurantId: selectedRestaurant._id
      };

      const response = await fetch(`http://localhost:5001/api/restaurants/${selectedRestaurant._id}/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error('Failed to add menu item');

      const result = await response.json();
      const newMenuItem = { 
        ...itemData, 
        _id: result.menuItem,
        restaurantId: selectedRestaurant._id
      };
      
      setMenuItems([...menuItems, newMenuItem as MenuItem]);
      setShowAddForm(false);
      resetForm();
      toast.success('Menu item added successfully');
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error('Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing menu item
  const handleUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemId) return;

    setLoading(true);
    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        dietary: dietaryObjectToArray(formData.dietary),
        hasARPreview: formData.hasARPreview
      };

      const response = await fetch(`http://localhost:5001/api/restaurants/menus/${editingItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error('Failed to update menu item');

      // Update the menu items list with the updated item
      setMenuItems(menuItems.map(item => 
        item._id === editingItemId 
          ? { 
              ...item, 
              ...itemData, 
              price: parseFloat(formData.price),
              dietary: dietaryObjectToArray(formData.dietary)
            } 
          : item
      ));

      setIsEditing(false);
      setEditingItemId(null);
      setShowAddForm(false);
      resetForm();
      toast.success('Menu item updated successfully');
    } catch (err) {
      console.error("Error updating menu item:", err);
      toast.error('Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  // Delete a menu item
  const handleDeleteMenuItem = async (menuItemId: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/restaurants/menus/${menuItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete menu item');

      setMenuItems(menuItems.filter(item => item._id !== menuItemId));
      toast.success('Menu item deleted successfully');
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error('Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  // Handle marking an order as completed (delete the order)
  const handleCompleteOrder = async (orderId: string) => {
    if (!window.confirm('Mark this order as completed? This will remove it from the system.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to complete order');

      // Remove the order from the state
      setOrders(orders.filter(order => order._id !== orderId));
      toast.success('Order marked as completed');
    } catch (err) {
      console.error('Error completing order:', err);
      toast.error('Failed to complete order');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // Set loading state for this specific order
    setStatusLoading(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const response = await fetch(`http://localhost:5001/api/orders/update-order-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');

      // No need to update state manually as the WebSocket will handle it
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
      
      // If there's an error, we need to refresh the orders to ensure consistency
      if (activeTab === 'orders') {
        const response = await fetch('http://localhost:5001/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      }
    } finally {
      // Clear loading state for this specific order
      setStatusLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Handle edit button click
  const handleEditMenuItem = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      image: item.image || '',
      category: item.category || '',
      dietary: dietaryArrayToObject(item.dietary),
      hasARPreview: item.hasARPreview || false
    });
    setIsEditing(true);
    setEditingItemId(item._id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      dietary: {
        isVegan: false,
        isNutFree: false,
        isGlutenFree: false,
      },
      hasARPreview: false
    });
    setIsEditing(false);
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    resetForm();
  };

  const sidebarItems = [
    { icon: ClipboardList, label: 'Orders', id: 'orders' },
    { icon: UtensilsCrossed, label: 'Menu', id: 'menu' },
    { icon: BarChart3, label: 'Reports', id: 'reports' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const filteredOrders = orders.filter(
    (order) =>
      (order.tableNumber && order.tableNumber.includes(searchQuery)) ||
      (order.cartItems &&
        order.cartItems.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  ));

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast container for notifications */}
      <Toaster position="top-right" />
      
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
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 bg-white shadow-xl h-screen fixed z-40"
          >
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-500">
              <div className="flex items-center space-x-3">
                <Utensils className="w-8 h-8 text-white" />
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
                  <item.icon
                    className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                      activeTab === item.id ? 'scale-110' : ''
                    }`}
                  />
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
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading Orders...</p>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-600">{error}</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600">No orders available</p>
                  <p className="text-gray-500 mt-2">All orders have been completed</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      whileHover={{ y: -5 }}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-lg text-gray-800">
                            Order #{order._id.substring(order._id.length - 6)}
                          </h3>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                              getStatusBadgeClass(order.status)
                            }`}>
                              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Received'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Table: {order.tableNumber}</p>
                          <p>Special Instructions: {order.specialInstructions || 'None'}</p>
                          <p className="font-medium text-gray-800 mt-2">Total: ${order.total.toFixed(2)}</p>
                          <div className="mt-3">
                            <h4 className="font-medium mb-2">Items:</h4>
                            <ul className="space-y-1">
                              {order.cartItems.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{item.name}</span>
                                  <span className="text-gray-500">x {item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-col space-y-3">
                            <div className="flex justify-between items-center">
                              <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700">
                                Update Status:
                              </label>
                              <select
                                id={`status-${order._id}`}
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className="ml-2 block w-2/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                disabled={statusLoading[order._id]}
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => handleCompleteOrder(order._id)}
                              className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                              disabled={loading || statusLoading[order._id]}
                            >
                              {statusLoading[order._id] ? (
                                <div className="w-4 h-4 mr-2 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                              )}
                              Mark Completed
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {!selectedRestaurant ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Restaurants</h1>
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search restaurants..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline"> {error}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {restaurants.map((restaurant) => (
                        <motion.div
                          key={restaurant._id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleRestaurantClick(restaurant._id)}
                        >
                          <div className="h-48 bg-gray-200 relative">
                            {restaurant.image ? (
                              <img 
                                src={restaurant.image} 
                                alt={restaurant.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Utensils size={64} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                            <p className="text-gray-600 mb-2">{restaurant.cuisine} Cuisine</p>
                            <p className="text-gray-500 text-sm">{restaurant.address}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <button 
                    onClick={() => setSelectedRestaurant(null)}
                    className="mb-6 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back to Restaurants
                  </button>
                  
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="h-64 bg-gray-200 relative">
                      {selectedRestaurant.image ? (
                        <img 
                          src={selectedRestaurant.image} 
                          alt={selectedRestaurant.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Utensils size={80} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h1 className="text-3xl font-bold mb-2">{selectedRestaurant.name}</h1>
                      <p className="text-xl text-gray-600 mb-2">{selectedRestaurant.cuisine} Cuisine</p>
                      <p className="text-gray-500">{selectedRestaurant.address}</p>
                    </div>
                  </div>
                  
                  <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Menu Items</h2>
                    <button 
                      onClick={() => {
                        setShowAddForm(true);
                        resetForm();
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                    >
                      <Plus size={16} className="mr-2" /> Add Menu Item
                    </button>
                  </div>
                  
                  {showAddForm && (
                    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold mb-4">
                        {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
                      </h3>
                      <form onSubmit={isEditing ? handleUpdateMenuItem : handleAddMenuItem} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              id="price"
                              name="price"
                              min="0"
                              step="0.01"
                              value={formData.price}
                              onChange={handleChange}
                              required
                              className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                          <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          >
                            <option value="">Select a category</option>
                            {CATEGORIES.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-2">Dietary Options</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.dietary.isVegan}
                                onChange={() => handleDietaryChange('isVegan')}
                                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Vegan</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.dietary.isNutFree}
                                onChange={() => handleDietaryChange('isNutFree')}
                                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Nut-Free</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.dietary.isGlutenFree}
                                onChange={() => handleDietaryChange('isGlutenFree')}
                                className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Gluten-Free</span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="hasARPreview"
                              checked={formData.hasARPreview}
                              onChange={handleCheckboxChange}
                              className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Has AR Preview</span>
                          </label>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            disabled={loading}
                          >
                            <X size={16} className="mr-2" /> Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <div className="w-4 h-4 mr-2 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                {isEditing ? 'Updating...' : 'Saving...'}
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" /> {isEditing ? 'Update' : 'Save'}
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                      </div>
                    ) : menuItems.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600">No menu items available</p>
                        <p className="text-gray-500 mt-2">Add your first menu item to get started</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 bg-gray-200 relative">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <ChefHat size={48} className="text-gray-400" />
                                </div>
                              )}
                              {item.hasARPreview && (
                                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs flex items-center">
                                  <Sparkles size={12} className="mr-1" /> AR Preview
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <span className="font-bold text-green-600">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1 mb-2">{item.category}</p>
                              <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                              
                              {item.dietary && item.dietary.length > 0 && (
                                <div className="mb-3">
                                  {item.dietary.map(diet => (
                                    <span key={diet} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                                      {diet}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex justify-end mt-2 space-x-2">
                                <button 
                                  onClick={() => handleEditMenuItem(item)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMenuItem(item._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">Reports functionality coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600">Settings functionality coming soon...</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;