"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Package,
} from "lucide-react";
import { sellerService } from "@/services/seller.service";
import { toast } from "sonner";

export default function SellerMedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    const { data, error } = await sellerService.getMedicines();
    if (data) {
      setMedicines(data);
    } else if (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (medicineId: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    
    const { error } = await sellerService.deleteMedicine(medicineId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Medicine deleted");
      fetchMedicines();
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Medicine</h1>
          <p className="text-muted-foreground">
            Manage your medicines and stock
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showAddForm ? "Cancel" : "Add Medicine"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Medicine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Medicine Name" id="medicineName" />
              <Input placeholder="Description" id="medicineDescription" />
              <Input placeholder="Price" type="number" id="medicinePrice" />
              <Input placeholder="Stock" type="number" id="medicineStock" />
              <Input placeholder="Manufacturer" className="sm:col-span-2" id="medicineManufacturer" />
              <Button 
                className="sm:col-span-2" 
                onClick={() => toast.info("Form submission coming soon")}
              >
                Save Medicine
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Medicines ({filteredMedicines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No medicines found
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Manufacturer</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Price</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                      <th className="h-12 px-4 text-left align-middle font-medium hidden lg:table-cell">Status</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((medicine) => (
                      <tr key={medicine.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {medicine.imageUrl ? (
                              <img
                                src={medicine.imageUrl}
                                alt={medicine.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium">{medicine.name}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                          {medicine.manufacturer}
                        </td>
                        <td className="p-4 font-medium">৳{medicine.price}</td>
                        <td className="p-4">
                          <span className={medicine.stock === 0 ? "text-red-500" : medicine.stock < 10 ? "text-yellow-500" : ""}>
                            {medicine.stock}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <Badge variant={medicine.stock > 0 ? "default" : "destructive"}>
                            {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(medicine.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
