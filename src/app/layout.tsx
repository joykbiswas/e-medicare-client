import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeWrapper } from "@/providers/ThemeWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "E-Medicare ",
  description: "Get genuine medicines delivered to your doorstep. Fast, secure, and reliable healthcare solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeWrapper>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster richColors />
            </CartProvider>
          </AuthProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
