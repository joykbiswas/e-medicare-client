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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Search,
  User,
} from "lucide-react";
import { adminService, type AdminUser } from "@/services/admin.service";
import { toast } from "sonner";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { users: fetchedUsers, pagination: paginationData } =
        await adminService.getUsers(currentPage, pagination.limit);
      setUsers(fetchedUsers);
      setPagination(paginationData);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Single handler for both status changes and ban toggles
  const handleStatusChange = async (
    userId: string,
    status?: string,
    isBanned?: boolean,
  ) => {
    try {
      setUpdatingUser(userId);

      // Find the current user
      const currentUser = users.find((user) => user.id === userId);
      if (!currentUser) return;

      // Use provided values or keep current ones
      let newStatus = status !== undefined ? status : currentUser.status;
      let newIsBanned =
        isBanned !== undefined ? isBanned : currentUser.isBanned;

      // Automatically set ban status based on new status
      if (status !== undefined) {
        if (status === "INACTIVE") {
          newIsBanned = true;
        } else if (status === "ACTIVE") {
          newIsBanned = false;
        }
      }

      await adminService.updateUser(userId, newStatus, newIsBanned);

      // Show appropriate success message
      if (status !== undefined && isBanned !== undefined) {
        toast.success("User status and ban status updated successfully");
      } else if (status !== undefined) {
        toast.success("User status updated successfully");
      } else if (isBanned !== undefined) {
        toast.success(
          `User ${newIsBanned ? "banned" : "unbanned"} successfully`,
        );
      }

      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    } finally {
      setUpdatingUser(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "SELLER":
        return "bg-blue-100 text-blue-800";
      case "CUSTOMER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            All Users Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SELLER">Seller</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium">Name</th>
                      <th className="h-10 px-4 text-left font-medium">Email</th>
                      <th className="h-10 px-4 text-left font-medium">Role</th>
                      <th className="h-10 px-4 text-left font-medium">
                        Status
                      </th>
                      <th className="h-10 px-4 text-left font-medium">
                        Banned
                      </th>
                      <th className="h-10 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                              user.role,
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                              user.status,
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {user.isBanned ? (
                            <span className="text-red-600 font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="text-green-600">No</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.status}
                              onValueChange={(status) =>
                                handleStatusChange(
                                  user.id,
                                  status,
                                  user.isBanned,
                                )
                              }
                              disabled={updatingUser === user.id}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant={
                                user.isBanned ? "destructive" : "default"
                              }
                              size="sm"
                              onClick={() =>
                                handleStatusChange(
                                  user.id,
                                  user.status,
                                  !user.isBanned,
                                )
                              }
                              disabled={updatingUser === user.id}
                            >
                              {updatingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : user.isBanned ? (
                                "Ban"
                              ) : (
                                "Unban"
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
