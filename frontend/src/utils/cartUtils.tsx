// This file contains helper functions for cart calculations and updates

export const calculateSubtotal = (cartItems: { price: number; quantity: number }[]): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  
  export const calculateTotal = (subtotal: number, serviceFee: number): number => {
    return subtotal + serviceFee;
  };
  