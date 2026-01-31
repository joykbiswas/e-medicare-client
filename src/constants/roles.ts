export const Role = {
    admin: "ADMIN",
    customer: "CUSTOMER",
    seller: "SELLER",
  } as const;
  
  export type UserRole = typeof Role[keyof typeof Role];