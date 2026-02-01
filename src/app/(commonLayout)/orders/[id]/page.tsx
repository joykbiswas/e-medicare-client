"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { customerService } from "@/services/customer.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  Package,
  CircleCheck,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  orderId: string;
  medicineId: string;
  quantity: number;
  price: number;
  medicine: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    manufacturer: string;
    imageUrl: string;
    categoryId: string;
    sellerId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Order {
  id: string;
  customerId: string;
  status: "PROCESSING" | "DELIVERED" | "CANCELLED" | "SHIPPED" | "PENDING";
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          credentials: "include",
        });
        const result = await res.json();
        
        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.message || "Failed to fetch order details");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CircleCheck className="h-5 w-5" />;
      case "PROCESSING":
        return <Clock className="h-5 w-5" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "from-green-300 to-green-400";
      case "PROCESSING":
        return "from-blue-300 to-blue-400";
      case "SHIPPED":
        return "from-orange-300 to-orange-400";
      case "CANCELLED":
        return "from-red-300 to-red-400";
      default:
        return "from-gray-300 to-gray-400";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 animate-spin" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );

  if (error || !order)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Package className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold">Order not found</h2>
        <p className="text-muted-foreground">{error || "The order you're looking for doesn't exist."}</p>
        <Button onClick={() => router.push("/orders")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="p-2.5 rounded-xl bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Order Details</h1>
            <p className="text-sm text-muted-foreground font-mono">
              #{order.id.toUpperCase()}
            </p>
          </div>
          <div className="ml-auto">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-2 px-3 py-1.5 ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              <span className="font-medium">{order.status}</span>
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Order Summary Card */}
          <Card className="bg-gradient-to-r text-white border-0 overflow-hidden">
            <div className={`bg-gradient-to-r ${getStatusBgColor(order.status)} p-6`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total Amount</p>
                    <p className="text-3xl font-bold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 opacity-70" />
                    <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-background border shadow-sm flex-shrink-0 flex items-center justify-center">
                      {item.medicine?.imageUrl ? (
                        <img
                          src={item.medicine.imageUrl}
                          alt={item.medicine.name || "Medicine"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-10 w-10 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {item.medicine?.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.medicine?.description || "No description available"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>× ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-lg">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4 border-l-2 border-muted-foreground/20 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] p-1 bg-primary rounded-full">
                    <CircleCheck className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {order.status !== "PENDING" && (
                  <div className="relative">
                    <div className={`absolute -left-[21px] p-1 rounded-full ${
                      order.status === "PROCESSING" ? "bg-blue-500" : "bg-muted"
                    }`}>
                      <Clock className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">
                      Your order is being prepared
                    </p>
                  </div>
                )}
                {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
                  <div className="relative">
                    <div className={`absolute -left-[21px] p-1 rounded-full ${
                      order.status === "SHIPPED" ? "bg-orange-500" : "bg-muted"
                    }`}>
                      <Truck className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium">Shipped</p>
                    <p className="text-xs text-muted-foreground">
                      Your order is on the way
                    </p>
                  </div>
                )}
                {order.status === "DELIVERED" && (
                  <div className="relative">
                    <div className="absolute -left-[21px] p-1 bg-green-500 rounded-full">
                      <CircleCheck className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium">Delivered</p>
                    <p className="text-xs text-muted-foreground">
                      Your order has been delivered
                    </p>
                  </div>
                )}
                {order.status === "CANCELLED" && (
                  <div className="relative">
                    <div className="absolute -left-[21px] p-1 bg-red-500 rounded-full">
                      <XCircle className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium">Cancelled</p>
                    <p className="text-xs text-muted-foreground">
                      This order has been cancelled
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
