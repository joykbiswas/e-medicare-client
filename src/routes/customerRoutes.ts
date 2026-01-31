import { Route } from "@/types";

export const customerRoute: Route[] = [
  {
    title: "My Account",
    items: [
      {
        title: "Cart",
        url: "/cart",
      },
      {
        title: "Checkout",
        url: "/checkout",
      },
      {
        title: "My Orders",
        url: "/orders",
      },
      {
        title: "Profile",
        url: "/profile",
      },
    ],
  },
];