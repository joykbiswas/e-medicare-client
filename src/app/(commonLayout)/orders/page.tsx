"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { customerService, type Pagination } from "@/services/customer.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Package,
  ChevronRight,
  CircleCheck,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState<Pagination | null>(null);

  const fetchOrders = async (pageNum: number) => {
    setLoading(true);
    const res = await customerService.getOrders({ page: pageNum, limit });
    
    if (res.data) {
      setOrders(res.data);
      if (res.pagination) {
        setPaginationInfo(res.pagination);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.total);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CircleCheck className="h-4 w-4" />;
      case "PROCESSING":
        return <Clock className="h-4 w-4" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-600 bg-green-50 border-green-200";
      case "PROCESSING":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "SHIPPED":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 animate-spin" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">My Orders</h1>
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "order" : "orders"} found
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                You haven't placed any orders yet. Start shopping to see your
                orders here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <CardContent className="p-0">
                    {/* Main Info Row */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Medicine Preview */}
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item: any) => (
                              <div
                                key={item.id}
                                className="w-12 h-12 rounded-lg border-2 border-background overflow-hidden bg-background shadow-sm flex items-center justify-center"
                              >
                                {item.medicine?.imageUrl ? (
                                  <img
                                    src={item.medicine.imageUrl}
                                    alt={item.medicine.name || "Medicine"}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-muted-foreground/50" />
                                )}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground font-mono">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">
                              {order.items[0]?.medicine?.name || "Unknown Product"}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </span>
                          </div>
                        </div>

                        {/* Right: Status & Amount */}
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1.5 px-2.5 py-1 ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="text-xs font-medium">{order.status}</span>
                          </Badge>
                          <div className="text-right">
                            <div className="flex items-center gap-1 font-semibold">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>{order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Info Row */}
                    <div className="px-4 py-3 bg-muted/30 border-t flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalItems)} of {totalItems} orders
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="h-9 px-3"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-9 w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-2 text-muted-foreground">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="h-9 w-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="h-9 px-3"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
