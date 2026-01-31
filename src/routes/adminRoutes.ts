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
      {
        title: "Categories",
        url: "/admin/categories",
      },
    ],
  },
];