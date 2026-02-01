"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Star,
  ShoppingCart,
  Package,
  Building2,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  StarHalf,
  Send,
  Loader2,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { MedicineDetail } from "@/types/medicine.type";
import Image from "next/image";
import { useState } from "react";
import { medicineService } from "@/services/medicine.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface MedicineDetailProps {
  medicine: MedicineDetail;
}

export function MedicineDetailComponent({
  medicine: initialMedicine,
}: MedicineDetailProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviews, setReviews] = useState(initialMedicine.reviews);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: initialMedicine.id,
        name: initialMedicine.name,
        price: initialMedicine.price,
        imageUrl: initialMedicine.imageUrl,
      });
    }
    toast.success(`${quantity} ${initialMedicine.name} added to cart`);
  };

  const inStock = initialMedicine.stock > 0;
  const hasValidImage = initialMedicine.imageUrl && !imageError;

  // Calculate average rating from current reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (rating: number) => void,
  ) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          const isFilled =
            starValue <= fullStars ||
            (starValue === fullStars + 1 && hasHalfStar);
          const isHalfFilled = starValue === fullStars + 1 && hasHalfStar;

          return (
            <button
              key={i}
              type="button"
              onClick={() => interactive && onStarClick?.(starValue)}
              onMouseEnter={() => interactive && setHoveredRating(starValue)}
              onMouseLeave={() => interactive && setHoveredRating(0)}
              className={
                interactive
                  ? "cursor-pointer transition-transform hover:scale-110"
                  : ""
              }
              disabled={!interactive}
            >
              {isFilled && !isHalfFilled ? (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : isHalfFilled ? (
                <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const handleStarClick = (value: number) => {
    setRating(value);
    setReviewError(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);

    if (rating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setReviewError("Please write a comment");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const { data, error } = await medicineService.createReview({
        medicineId: initialMedicine.id,
        rating,
        comment: comment.trim(),
      });

      if (error) {
        setReviewError(error);
        toast.error(error);
      } else {
        toast.success("Review submitted successfully!");
        setRating(0);
        setComment("");
        setHoveredRating(0);

        // Refresh the page to get updated reviews
        router.refresh();
      }
    } catch (err) {
      setReviewError("Failed to submit review. Please try again.");
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full bg-muted">
              {hasValidImage ? (
                <Image
                  src={initialMedicine.imageUrl!}
                  alt={initialMedicine.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized={initialMedicine.imageUrl?.includes(
                    "example.com",
                  )}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Title and Category */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  {initialMedicine.name}
                </h1>
                {initialMedicine.category && (
                  <Badge variant="outline" className="text-sm">
                    {initialMedicine.category.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              {renderStars(averageRating)}
              <span className="text-lg font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          <Separator />

          {/* Price and Stock */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-bold text-primary">
                ৳{initialMedicine.price}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    In Stock ({initialMedicine.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          {initialMedicine.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {initialMedicine.description}
              </p>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <div className="flex items-center gap-2 border rounded-md">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={initialMedicine.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(
                      Math.max(1, Math.min(val, initialMedicine.stock)),
                    );
                  }}
                  className="w-16 text-center border-0 focus:outline-none focus:ring-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() =>
                    setQuantity(Math.min(initialMedicine.stock, quantity + 1))
                  }
                  disabled={quantity >= initialMedicine.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg"
              size="lg"
              onClick={() => {
                if (!isAuthenticated) {
                  // Navigate to login page - adjust based on your routing
                  router.push("/login"); // If using Next.js router
                  // or window.location.href = '/login'; // If not using Next.js
                  // or navigate('/login'); // If using React Router
                  return;
                }
                handleAddToCart();
              }}
              disabled={!inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {!isAuthenticated ? "Login to Add to Cart" : "Add to Cart"}
            </Button>
          </div>

          <Separator />

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Manufacturer</p>
                  <p className="font-medium">{initialMedicine.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">{initialMedicine.seller.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Seller Email</p>
                  <p className="font-medium">{initialMedicine.seller.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Customer Reviews
          </h2>
          <p className="text-muted-foreground">
            {reviews.length > 0
              ? "See what our customers are saying about this product"
              : "Be the first to review this product"}
          </p>
        </div>

        {/* Review Form */}
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <Field>
                <FieldLabel>Rating</FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    {renderStars(displayRating, true, handleStarClick)}
                    {rating > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {rating} out of 5
                      </span>
                    )}
                  </div>
                  {reviewError && rating === 0 && (
                    <FieldError>{reviewError}</FieldError>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="comment">Your Review</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="comment"
                    placeholder="Share your experience with this product..."
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      setReviewError(null);
                    }}
                    rows={5}
                    className="resize-none"
                  />
                  {reviewError && !comment.trim() && (
                    <FieldError>{reviewError}</FieldError>
                  )}
                </FieldContent>
              </Field>

              {reviewError && rating > 0 && comment.trim() && (
                <FieldError>{reviewError}</FieldError>
              )}

              <Button
                type="submit"
                disabled={isSubmittingReview || rating === 0 || !comment.trim()}
                className="w-full sm:w-auto"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Reviews */}
        {reviews.length > 0 ? (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="font-semibold">{review.rating}/5</span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
