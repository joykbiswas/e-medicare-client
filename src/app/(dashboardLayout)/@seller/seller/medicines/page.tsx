"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Package,
} from "lucide-react";
import { sellerService } from "@/services/seller.service";
import Swal from "sweetalert2";

interface Medicine {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  manufacturer: string;
  imageUrl: string | null;
  categoryId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SellerMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMedicines(currentPage);
  }, [currentPage]);

  const fetchMedicines = async (page: number) => {
    setLoading(true);
    const { data, error } = await sellerService.getMedicines({ page, limit: 10 });
    if (data) {
      setMedicines(data.medicines);
      setPagination(data.pagination);
    }
    setLoading(false);
  };

  const handleDelete = async (medicineId: string, medicineName: string) => {
    const result = await Swal.fire({
      title: "Delete Medicine?",
      text: `Are you sure you want to delete "${medicineName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const { error } = await sellerService.deleteMedicine(medicineId);
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Medicine has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchMedicines(currentPage);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && medicines.length === 0) {
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
            Manage your medicines and stock ({pagination.total} total)
          </p>
        </div>
        <Link href="/seller/create-medicine">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Medicine
          </Button>
        </Link>
      </div>

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
            Your Medicines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No medicines found
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Category</th>
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
                            {medicine.category?.name || "-"}
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
                              <Link href={`/seller/medicines/${medicine.id}`}>
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(medicine.id, medicine.name)}
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

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4 border-t mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
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
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
