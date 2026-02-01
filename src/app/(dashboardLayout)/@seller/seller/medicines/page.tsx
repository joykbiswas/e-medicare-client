import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function SellerMedicinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your medicines and stock
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Medicine list table - will be implemented with actual data */}
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Price</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Paracetamol 500mg</td>
                    <td className="p-4">৳10.00</td>
                    <td className="p-4">150</td>
                    <td className="p-4">
                      <Badge variant="default">In Stock</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="icon" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Amoxicillin 250mg</td>
                    <td className="p-4">৳25.00</td>
                    <td className="p-4">0</td>
                    <td className="p-4">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="icon" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
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
