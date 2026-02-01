import { customerService } from "@/services/customer.service";

export default async function OrdersPage() {
  const { data: orders, error } = await customerService.getOrders();

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load orders
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-6">
        No orders found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Order ID</p>
              <p className="text-sm text-gray-500">{order.id}</p>
            </div>

            <span
              className={`px-3 py-1 text-sm rounded-full ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p>
            <strong>Shipping:</strong> {order.shippingAddress}
          </p>

          <p>
            <strong>Total:</strong> ৳{order.totalAmount}
          </p>

          <div className="border-t pt-3 space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.medicine.name}
                  </p>
                  <p className="text-gray-500">
                    Qty: {item.quantity} × ৳{item.price}
                  </p>
                </div>

                <p className="font-medium">
                  ৳{item.quantity * item.price}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            Ordered on:{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
