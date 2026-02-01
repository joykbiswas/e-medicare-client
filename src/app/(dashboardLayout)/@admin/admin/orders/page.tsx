"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Package,
  Search,
  User,
  MapPin,
} from "lucide-react";
import { adminService, type AdminOrder } from "@/services/admin.service";
import { toast } from "sonner";
import Image from "next/image";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { orders: fetchedOrders, pagination: paginationData } =
        await adminService.getOrders(currentPage, pagination.limit);
      setOrders(fetchedOrders);
      setPagination(paginationData);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      setUpdatingOrder(orderId);
      await adminService.updateOrderStatus(orderId, status);
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            All Orders Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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

          {/* Orders List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Accordion type="single" collapsible className="w-full">
                {filteredOrders.map((order) => (
                  <AccordionItem key={order.id} value={order.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{order.customer.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{order.shippingAddress}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 space-y-4">
                        {/* Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Order ID</p>
                            <p className="font-mono">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Customer Email</p>
                            <p>{order.customer.email}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Customer Phone</p>
                            <p>{order.customer.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created At</p>
                            <p>{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Shipping Address</p>
                            <p>{order.shippingAddress}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  {item.medicine.imageUrl ? (
                                    <Image
                                      src={item.medicine.imageUrl}
                                      alt={item.medicine.name}
                                      width={48}
                                      height={48}
                                      className="rounded-md object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                      <Package className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{item.medicine.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.medicine.manufacturer}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Update Status */}
                        <div className="border-t pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Update Status:</span>
                            <Select
                              value={order.status}
                              onValueChange={(status) => handleStatusChange(order.id, status)}
                              disabled={updatingOrder === order.id}
                            >
                              <SelectTrigger className="w-[180px]">
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

              {/* Pagination */}
              <div className="flex items-center justify-between px-2 py-4 border-t mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min(((currentPage - 1) * pagination.limit) + 1, pagination.total)} to{" "}
                  {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}{" "}
                  orders
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
