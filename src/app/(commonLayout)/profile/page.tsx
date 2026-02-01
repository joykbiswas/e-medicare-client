"use client";

import { useEffect, useState } from "react";
import { customerService } from "@/services/customer.service";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    customerService.getMe().then((res) => setUser(res.data));
  }, []);

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen  bg-muted/30 flex flex-col items-center p-6 space-y-8">
      {/* Profile Card */}
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h2>
          <Badge variant="outline">{user.role}</Badge>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <p className="text-gray-700 dark:text-gray-200">{user.email}</p>
          </div>
          <div>
            <Label>Phone</Label>
            <p className="text-gray-700 dark:text-gray-200">{user.phone}</p>
          </div>
          <div>
            <Label>Status</Label>
            <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
              {user.status}
            </Badge>
          </div>
          <div>
            <Label>Banned</Label>
            <Badge variant={user.isBanned ? "destructive" : "default"}>
              {user.isBanned ? "Yes" : "No"}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center space-x-4">
          <Button>Edit Profile</Button>
          <Button variant="outline">Change Password</Button>
        </CardFooter>
      </Card>

      {/* Optional Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <Card className="text-center">
          <CardContent>
            <p className="text-gray-400 dark:text-gray-300">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">12</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent>
            <p className="text-gray-400 dark:text-gray-300">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-500">3</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent>
            <p className="text-gray-400 dark:text-gray-300">Completed Orders</p>
            <p className="text-2xl font-bold text-green-500">9</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
