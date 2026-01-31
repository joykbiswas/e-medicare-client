import { Route } from "@/types";

export const customerRoute: Route[] = [
  {
    title: "My Orders",
    items: [
      {
        title: "My Orders",
        url: "/customer-dashboard/orders",
      },
      {
        title: "Order History",
        url: "/customer-dashboard/history",
      },
    ],
  },
  {
    title: "My Account",
    items: [
      {
        title: "Profile",
        url: "/customer-dashboard/profile",
      },
      {
        title: "Addresses",
        url: "/customer-dashboard/addresses",
      },
    ],
  },
];