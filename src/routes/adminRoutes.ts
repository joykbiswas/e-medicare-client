import { Route } from "@/types";

export const adminRoute: Route[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        url: "/admin/users",
      },
      {
        title: "Orders",
        url: "/admin/orders",
      },
      
    ],
  },
  {
    title: "Categories",
    items: [
      {
        title: "All Categories",
        url: "/admin/categories",
      },
      {
        title: "Create-Category",
        url: "/admin/create-category",
      },
    ],
  },
  {
    title: "Home",
    items: [
      {
        title: "Home",
        url: "/",
      },
    ],
  },
];