import { Leaf, Award, Users, Heart, ArrowRight } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: "100% Organic",
      description:
        "We source only the finest organic spices, free from harmful chemicals.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Each spice undergoes rigorous quality testing to ensure maximum flavor.",
    },
    {
      icon: Users,
      title: "Family Heritage",
      description:
        "Generations of spice expertise, bringing traditional knowledge to your kitchen.",
    },
    {
      icon: Heart,
      title: "Health First",
      description:
        "We believe good food starts with pure ingredients that nourish the body.",
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* === హీరో సెక్షన్ === */}
      <section
        className="relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542685324-b2df6498a3a1?q=80&w=2070')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-down">
            About DhanaLaxmi Foods
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Preserving the authentic flavors of Indian cuisine for over three
            generations.
          </p>
        </div>
      </section>

      {/* === కథ (Story) సెక్షన్ === */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop"
                alt="Spice processing"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Founded in 1952, DhanaLaxmi Foods began as a small family
                  business in the heart of Telangana, India. What started as a
                  passion for preserving traditional spice processing methods
                  has grown into a trusted name in organic spices.
                </p>
                <p>
                  Today, we continue to honor our heritage while embracing
                  modern sustainable practices. Every spice is carefully
                  selected from certified organic farms and processed using
                  time-tested methods to preserve maximum freshness and flavor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === విలువలు (Values) సెక్షన్ === */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from sourcing to
              packaging.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === వ్యవస్థాపకుడు (Founder) సెక్షన్ === */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/10 rounded-lg p-10 flex flex-col md:flex-row items-center gap-10">
            <img
              src="https://res.cloudinary.com/dexsr3yj6/image/upload/v1752996240/kumar_l6io95.jpg"
              alt="Founder"
              className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                A Word from Our Founder
              </h2>
              <p className="text-muted-foreground italic text-lg leading-relaxed mb-4">
                "Our family's promise is simple: to bring the purest, most
                flavorful spices from our home to yours. We believe in
                tradition, quality, and the simple joy of a well-cooked meal.
                Thank you for being a part of our journey."
              </p>
              <p className="font-semibold text-primary">
                - S. Kumar, Third Generation Spice Master
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === ప్రక్రియ (Process) సెక్షన్ === */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              From Farm to Your Kitchen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards at every step of our process.
            </p>
          </div>
          <div className="relative grid md:grid-cols-3 gap-8 items-start">
            <div className="absolute hidden md:block top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2"></div>

            <div className="relative text-center bg-background p-6 rounded-lg shadow-md">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Careful Sourcing</h3>
              <p className="text-muted-foreground text-sm">
                We partner with certified organic farms that share our
                commitment to sustainable agriculture.
              </p>
            </div>
            <div className="relative text-center bg-background p-6 rounded-lg shadow-md">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Traditional Processing
              </h3>
              <p className="text-muted-foreground text-sm">
                Using time-honored techniques, we process each spice to preserve
                its natural oils and maximum flavor.
              </p>
            </div>
            <div className="relative text-center bg-background p-6 rounded-lg shadow-md">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Fresh Packaging</h3>
              <p className="text-muted-foreground text-sm">
                Our spices are packaged in small batches to ensure maximum
                freshness and shipped directly to your door.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
