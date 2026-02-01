"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Package, ShoppingCart, BarChart3, Loader2 } from "lucide-react";
import { sellerService, type SellerOrder } from "@/services/seller.service";

export default function SellerDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalMedicines: 0,
  });
  const [recentOrders, setRecentOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: ordersData, error } = await sellerService.getOrders();
    const { data: medicinesData } = await sellerService.getMedicines();

    if (ordersData) {
      const orders = ordersData.orders;
      setRecentOrders(orders.slice(0, 5));
      setStats({
        totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        totalOrders: orders.length,
        totalMedicines: medicinesData?.length || 0,
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your products and sales
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">৳{stats.totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medicines</p>
                <p className="text-2xl font-bold">{stats.totalMedicines}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-3">
              <Link
                href="/seller/medicines"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Manage Inventory</p>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove medicines</p>
                </div>
              </Link>
              <Link
                href="/seller/orders"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">View Orders</p>
                  <p className="text-sm text-muted-foreground">Process and update order status</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground">No recent orders</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""} - ৳{order.totalAmount}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-muted">{order.status}</span>
                  </div>
                ))}
                <Link
                  href="/seller/orders"
                  className="block text-center text-sm text-primary hover:underline mt-2"
                >
                  View all orders
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
