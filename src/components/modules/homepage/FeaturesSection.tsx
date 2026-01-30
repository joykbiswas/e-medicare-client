import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Truck,
  CreditCard,
  Headphones,
  CheckCircle2,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Certified Medicines",
    description: "All products are sourced from licensed pharmacies and verified distributors.",
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Fast Delivery",
    description: "Same-day or next-day delivery available in major areas. Free delivery over ৳999.",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Secure Payment",
    description: "Multiple payment options with secure encryption for your peace of mind.",
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: "24/7 Support",
    description: "Our team is always ready to help with your orders and health queries.",
  },
  {
    icon: <CheckCircle2 className="h-8 w-8" />,
    title: "100% Genuine",
    description: "We guarantee authentic pharmaceutical products with proper verification.",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Easy Prescription Upload",
    description: "Upload your prescription and our pharmacists will verify and prepare your order.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground">
            Your trusted partner for all your healthcare needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}