export interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    imageUrl: string;
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    tokenNumber: string;
    customerName: string;
    timestamp: Date;
    amount: number;
    status: 'received' | 'preparing' | 'ready' | 'completed';
    items: {
      menuItem: MenuItem;
      quantity: number;
    }[];
  }
  
  export type ToastType = 'success' | 'error' | 'info';
  
  export interface Toast {
    id: string;
    message: string;
    type: ToastType;
  }
  