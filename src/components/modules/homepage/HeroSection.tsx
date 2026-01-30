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

const heroSlides = [
  {
    title: "Your Health, Our Priority",
    description: "Get genuine medicines delivered to your doorstep with care and precision.",
    cta: "Shop Now",
  },
  {
    title: "Trusted Medicines at Your Doorstep",
    description: "100% authentic pharmaceutical products from licensed distributors.",
    cta: "Browse Medicines",
  },
  {
    title: "Fast & Secure Delivery",
    description: "Same-day delivery available. Your health needs, delivered safely.",
    cta: "Order Now",
  },
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center px-4 py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center space-y-6 z-10">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" className="text-base px-8" asChild>
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
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
}