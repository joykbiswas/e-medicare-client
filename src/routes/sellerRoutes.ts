import { Route } from "@/types";

export const sellerRoute: Route[] = [
  {
    title: "Product Management",
    items: [
      {
        title: "My Products",
        url: "/seller-dashboard/products",
      },
      {
        title: "Add Product",
        url: "/seller-dashboard/add-product",
      },
      {
        title: "Orders",
        url: "/seller-dashboard/orders",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Sales Report",
        url: "/seller-dashboard/sales",
      },
      {
        title: "Revenue",
        url: "/seller-dashboard/revenue",
      },
    ],
  },
];