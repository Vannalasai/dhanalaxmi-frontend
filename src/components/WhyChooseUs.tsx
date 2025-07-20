import { Leaf, Shield, Truck, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Organic & Pure",
      description:
        "All our spices are certified organic, free from any harmful chemicals and pesticides.",
    },
    {
      icon: Award,
      title: "Traditional Methods",
      description:
        "Processed using time-tested methods to preserve the natural flavors and potent aroma.",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description:
        "Every single product undergoes rigorous quality checks to ensure purity and freshness.",
    },
    {
      icon: Truck,
      title: "Fast & Safe Delivery",
      description:
        "Your order of fresh spices is delivered safely to your doorstep within 2-3 business days.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">DhanaLaxmi Foods?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We are committed to bringing you the finest spices, with a promise
            of purity, tradition, and unmatched quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center bg-background border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <CardHeader className="items-center">
                <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-semibold text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
