"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Heart, Activity, Baby, Stethoscope, Syringe } from "lucide-react";
import type { Category } from "@/types/medicine.type";
import Link from "next/link";

interface CategoriesSectionProps {
    categories: Category[];
}

const categoryIcons: Record<string, React.ReactNode> = {
    Vitamin: <Pill className="h-8 w-8" />,
    Painkiller: <Activity className="h-8 w-8" />,
    Heart: <Heart className="h-8 w-8" />,
    Diabetes: <Stethoscope className="h-8 w-8" />,
    Baby: <Baby className="h-8 w-8" />,
    default: <Syringe className="h-8 w-8" />,
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
    const getIcon = (name: string) => {
        return categoryIcons[name] || categoryIcons.default;
    };

    return (
        <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                        Shop by Category
                    </h2>
                    <p className="text-muted-foreground">
                        Find medicines organized by your health needs
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No categories available.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {categories.map((category) => (
                            <Card
                                key={category.id}
                                className="group hover:shadow-md transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(16.666%-0.83rem)] max-w-[200px]"
                            >
                                <Link href={`/medicines?category=${category.id}`}>
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
                                        <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                                            {getIcon(category.name)}
                                        </div>
                                        <h3 className="font-semibold text-sm md:text-base">
                                            {category.name}
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs"
                                            asChild
                                        >
                                            <span>Explore</span>
                                        </Button>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}