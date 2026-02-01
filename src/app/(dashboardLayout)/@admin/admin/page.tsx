"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Tag, ShoppingCart } from "lucide-react";
import Link from "next/link";

const adminFeatures = [
  {
    title: "Users Management",
    description: "View, manage, and ban/unban users",
    icon: Users,
    href: "/admin/users",
    color: "text-blue-600",
  },
  {
    title: "Orders Management",
    description: "View and update order statuses",
    icon: ShoppingCart,
    href: "/admin/orders",
    color: "text-purple-600",
  },
  {
    title: "Medicines Management",
    description: "View and delete medicines",
    icon: Package,
    href: "/admin/medicines",
    color: "text-green-600",
  },
  {
    title: "Categories Management",
    description: "Create, edit, and delete categories",
    icon: Tag,
    href: "/admin/categories",
    color: "text-orange-600",
  },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminFeatures.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <feature.icon className={`h-10 w-10 ${feature.color} mb-2`} />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
