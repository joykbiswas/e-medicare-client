"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Tag } from "lucide-react";
import { adminService, type AdminCategory } from "@/services/admin.service";
import { toast } from "sonner";
import Swal from "sweetalert2";
import Link from "next/link";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [category, setCategory] = useState<AdminCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const categories = await adminService.getCategories();
      const found = categories.find((c) => c.id === resolvedParams.id);
      if (found) {
        setCategory(found);
        setCategoryName(found.name);
      } else {
        toast.error("Category not found");
        router.push("/admin/categories");
      }
    } catch (error) {
      toast.error("Failed to fetch category");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [resolvedParams.id]);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.updateCategory(resolvedParams.id, categoryName);
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete "${category?.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteCategory(resolvedParams.id);
        
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
        
        router.push("/admin/categories");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete category.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/admin/categories">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Edit Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Category
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={submitting}
              >
                Delete Category
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
