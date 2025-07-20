
import SpiceHero from '@/components/SpiceHero';
import FeaturedProducts from '@/components/FeaturedProducts';
import WhyChooseUs from '@/components/WhyChooseUs';

const Home = () => {
  return (
    <div className="min-h-screen">
      <SpiceHero />
      <FeaturedProducts />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
