"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Medicine } from "@/types/medicine.type";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  
  console.log("Medicine Card - user:", user);
  console.log("Medicine Card - isAuthenticated:", isAuthenticated);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart", {
        action: {
          label: "Login",
          onClick: () => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
        }
      });
      return;
    }
    
    // Check if in stock
    if (medicine.stock <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      imageUrl: medicine.imageUrl,
    });
    toast.success(`${medicine.name} added to cart`);
  };

  // Calculate average rating from reviews
  const reviews = medicine.reviews || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const reviewCount = reviews.length;

  const inStock = medicine.stock > 0;
  const hasValidImage = medicine.imageUrl && !imageError;

  // Loading state for button
  if (loading) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
        <CardContent className="p-4 flex-1">
          <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-muted animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-3 bg-muted rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" disabled size="sm">
            <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Link href={`/shop/${medicine.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer">
        <CardContent className="p-4 flex-1">
          <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-muted">
            {hasValidImage ? (
              <Image
                src={medicine.imageUrl!}
                alt={medicine.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
                unoptimized={medicine.imageUrl?.includes('example.com')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
              {medicine.name}
            </h3>
            {medicine.manufacturer && (
              <p className="text-xs text-muted-foreground">
                {medicine.manufacturer}
              </p>
            )}
            {medicine.category && (
              <Badge variant="outline" className="text-xs">
                {medicine.category.name}
              </Badge>
            )}

            <div className="flex items-center gap-1">
              {averageRating > 0 ? (
                <>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({reviewCount})
                  </span>
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">No reviews</span>
                </>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="text-2xl font-bold text-primary">
                ৳{medicine.price}
              </span>
              {medicine.stock > 0 && (
                <span className="text-xs text-muted-foreground">
                  {medicine.stock} in stock
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={!inStock}
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {!isAuthenticated 
              ? "Login to Add" 
              : inStock 
                ? "Add to Cart" 
                : "Out of Stock"
            }
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}