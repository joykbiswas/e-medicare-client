"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Tag } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.createCategory(categoryName);
      toast.success("Category created successfully");
      router.push("/admin/categories");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create category";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

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
            Create New Category
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
                Create Category
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
