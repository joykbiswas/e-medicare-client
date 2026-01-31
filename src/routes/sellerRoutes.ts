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
        title: "Inventory",
        url: "/seller/medicines",
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