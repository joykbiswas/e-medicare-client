"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Package } from "lucide-react";
import { sellerService } from "@/services/seller.service";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { z } from "zod";

const editMedicineSchema = z.object({
  price: z.string().min(1, "Price is required").transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) throw new Error("Price must be greater than 0");
    return num;
  }),
  stock: z.string().min(1, "Stock is required").transform((val) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) throw new Error("Stock must be a non-negative integer");
    return num;
  }),
  manufacturer: z.string().min(2, "Manufacturer name must be at least 2 characters"),
});

type EditMedicineFormData = z.infer<typeof editMedicineSchema>;

interface FormData {
  price: string;
  stock: string;
  manufacturer: string;
}

export default function EditMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const medicineId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    price: "",
    stock: "",
    manufacturer: "",
  });

  useEffect(() => {
    if (medicineId) {
      fetchMedicine();
    }
  }, [medicineId]);

  const fetchMedicine = async () => {
    setFetching(true);
    const { data, error } = await sellerService.getMedicines();
    if (data) {
      const found = data.find((m: any) => m.id === medicineId);
      if (found) {
        setFormData({
          price: found.price.toString(),
          stock: found.stock.toString(),
          manufacturer: found.manufacturer,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "Medicine not found",
        });
        router.push("/seller/medicines");
      }
    } else if (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    }
    setFetching(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    try {
      editMedicineSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const zodError = error as typeof error & { errors?: Array<{ path: string[]; message: string }> };
      if (zodError.errors) {
        const fieldErrors: Record<string, string> = {};
        zodError.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    const validatedData = editMedicineSchema.parse(formData);

    const { error } = await sellerService.updateMedicine(medicineId, validatedData);

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: error,
      });
    } else {
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Medicine updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/seller/medicines");
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Medicine</h1>
          <p className="text-muted-foreground">
            Update medicine details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Update Medicine
          </CardTitle>
          <CardDescription>
            Only price, stock, and manufacturer can be updated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  placeholder="e.g., Beximco Pharma"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                  className={errors.manufacturer ? "border-red-500" : ""}
                />
                {errors.manufacturer && <p className="text-sm text-red-500">{errors.manufacturer}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Update Medicine
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
