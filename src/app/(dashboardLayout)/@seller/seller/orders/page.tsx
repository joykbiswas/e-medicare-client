import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Truck, CheckCircle, Clock } from "lucide-react";

export default function SellerOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and update order statuses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Order items - will be implemented with actual data */}
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Items</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Total</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">#ORD-001</td>
                    <td className="p-4">John Doe</td>
                    <td className="p-4">3 items</td>
                    <td className="p-4">৳450.00</td>
                    <td className="p-4">2024-01-15</td>
                    <td className="p-4">
                      <Badge variant="secondary">Pending</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm">
                        <Truck className="mr-2 h-4 w-4" />
                        Process
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">#ORD-002</td>
                    <td className="p-4">Jane Smith</td>
                    <td className="p-4">1 item</td>
                    <td className="p-4">৳120.00</td>
                    <td className="p-4">2024-01-15</td>
                    <td className="p-4">
                      <Badge variant="secondary">Pending</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm">
                        <Truck className="mr-2 h-4 w-4" />
                        Process
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">#ORD-003</td>
                    <td className="p-4">Mike Johnson</td>
                    <td className="p-4">5 items</td>
                    <td className="p-4">৳890.00</td>
                    <td className="p-4">2024-01-14</td>
                    <td className="p-4">
                      <Badge variant="default">Processing</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
