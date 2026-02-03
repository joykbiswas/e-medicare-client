import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Fake review data for display purposes
const fakeReviews = [
    {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent service! The medicines were delivered on time and in perfect condition. Highly recommend e-Medicare for all your pharmaceutical needs.",
        location: "Dhaka, Bangladesh"
    },
    {
        id: 2,
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?u=michael",
        rating: 4,
        date: "2024-01-10",
        comment: "Great selection of medicines and very competitive prices. The customer support team was very helpful when I had questions about my order.",
        location: "Chittagong, Bangladesh"
    },
    {
        id: 3,
        name: "Emily Rahman",
        avatar: "https://i.pravatar.cc/150?u=emily",
        rating: 5,
        date: "2024-01-08",
        comment: "I've been using e-Medicare for over a year now and they've never disappointed. Fast delivery and authentic medicines. Very satisfied customer!",
        location: "Sylhet, Bangladesh"
    },
    {
        id: 4,
        name: "David Ahmed",
        avatar: "https://i.pravatar.cc/150?u=david",
        rating: 5,
        date: "2024-01-05",
        comment: "The home delivery service is amazing! As a senior citizen, it's difficult for me to go to pharmacies. E-Medicare makes it so convenient.",
        location: "Rajshahi, Bangladesh"
    },
    {
        id: 5,
        name: "Lisa Khan",
        avatar: "https://i.pravatar.cc/150?u=lisa",
        rating: 4,
        date: "2024-01-02",
        comment: "Good experience overall. The website is easy to navigate and the checkout process was smooth. Will definitely order again.",
        location: "Barisal, Bangladesh"
    },
    {
        id: 6,
        name: "Robert Islam",
        avatar: "https://i.pravatar.cc/150?u=robert",
        rating: 5,
        date: "2023-12-28",
        comment: "Best online pharmacy in Bangladesh! Competitive prices and genuine medicines. The app is also very user-friendly.",
        location: "Khulna, Bangladesh"
    }
];

const ReviewSection = () => {
    return (
        <section className="py-16 bg-neutral-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Read testimonials from our satisfied customers who trust e-Medicare for their healthcare needs.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fakeReviews.map((review) => (
                        <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                {/* Header with Avatar and Name */}
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={review.avatar} alt={review.name} />
                                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {review.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {review.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating Stars */}
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            className={`h-5 w-5 ${
                                                index < review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-gray-300 text-gray-300"
                                            }`}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">
                                        {review.date}
                                    </span>
                                </div>

                                {/* Review Comment */}
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
