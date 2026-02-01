import { Route } from "@/types";

export const sellerRoute: Route[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/seller/dashboard",
      },
    ],
  },
  {
    title: "Product Management",
    items: [
      {
        title: "All Medicine",
        url: "/seller/medicines",
      },
      {
        title: "Create Medicine",
        url: "/seller/create-medicine",
      },
    ],
  },
  {
    title: "Orders",
    items: [
      {
        title: "Orders",
        url: "/seller/orders",
      },
    ],
  },
];