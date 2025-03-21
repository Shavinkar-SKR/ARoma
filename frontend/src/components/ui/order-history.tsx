import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OrderHistoryProps {
  orders: any[];
  onReorder: (orderId: string) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onReorder }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border-b py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order._id}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                  <p className="text-sm text-gray-600">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
                <Button onClick={() => onReorder(order._id)}>Reorder</Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;