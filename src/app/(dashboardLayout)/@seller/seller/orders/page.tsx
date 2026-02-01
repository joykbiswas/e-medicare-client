"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Package,
  Search,
  Loader2,
  User,
  MapPin,
  X,
} from "lucide-react";
import { sellerService, type SellerOrder } from "@/services/seller.service";
import { toast } from "sonner";
import Image from "next/image";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await sellerService.getOrders();
    if (data) {
      setOrders(data.orders);
    } else if (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    const { error } = await sellerService.updateOrderStatus(orderId, newStatus);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Order status updated");
      fetchOrders();
    }
    setUpdatingOrder(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PLACED: "default",
      PROCESSING: "secondary",
      SHIPPED: "outline",
      DELIVERED: "default",
      CANCELLED: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and update order statuses
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PLACED">Placed</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredOrders.map((order) => (
                <AccordionItem key={order.id} value={order.id}>
                  <AccordionTrigger className="hover:no-underline px-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full text-left">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {order.customer.name} ({order.customer.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">৳{order.totalAmount}</span>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-4 space-y-4">
                      {/* Customer Info */}
                      <div className="grid gap-4 sm:grid-cols-2 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Customer</p>
                            <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Shipping Address</p>
                            <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Medicine Items */}
                      <div className="space-y-3">
                        <p className="font-medium">Order Items</p>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 border rounded-lg"
                          >
                            {item.medicine.imageUrl ? (
                              <Image
                                src={item.medicine.imageUrl}
                                alt={item.medicine.name}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-[60px] w-[60px] rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{item.medicine.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.medicine.manufacturer}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ৳{item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">৳{item.quantity * item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Update Status */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Order ID: {order.id}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Update Status:</span>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                            disabled={updatingOrder === order.id}
                          >
                            <SelectTrigger className="w-36 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PLACED">Placed</SelectItem>
                              <SelectItem value="PROCESSING">Processing</SelectItem>
                              <SelectItem value="SHIPPED">Shipped</SelectItem>
                              <SelectItem value="DELIVERED">Delivered</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingOrder === order.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
