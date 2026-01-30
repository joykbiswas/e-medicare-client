"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const heroSlides = [
  {
    title: "Your Health, Our Priority",
    description: "Get genuine medicines delivered to your doorstep with care and precision.",
    cta: "Shop Now",
    bgImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80", // Healthcare/Medical theme
  },
  {
    title: "Trusted Medicines at Your Doorstep",
    description: "100% authentic pharmaceutical products from licensed distributors.",
    cta: "Browse Medicines",
    bgImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1920&q=80", // Pharmacy/Medicine theme
  },
  {
    title: "Fast & Secure Delivery",
    description: "Same-day delivery available. Your health needs, delivered safely.",
    cta: "Order Now",
    bgImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80", // Fast delivery/Delivery service theme
  },
];

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>();

  // Auto-play functionality - change slide every 2 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="basis-full p-0">
              <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${slide.bgImage})`,
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
                  {/* Additional gradient overlay for modern look */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all" asChild>
                      <Link href="#medicines">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        {slide.cta}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-8 bg-background/80 hover:bg-background border-2" />
        <CarouselNext className="right-4 md:right-8 bg-background/80 hover:bg-background border-2" />
      </Carousel>
    </section>
  );
}