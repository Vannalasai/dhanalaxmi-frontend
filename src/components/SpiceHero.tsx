
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SpiceHero = () => {
  return (
    <section 
      className="relative min-h-[80vh] flex items-center justify-center text-white"
      style={{
        backgroundImage: 'url(https://img.freepik.com/premium-photo/selection-spices-herbs-ingredients-cooking-food-background-wooden-table_44537-99.jpg?w=1480)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Welcome to DhanaLaxmi Foods
        </h1>
        
        <p className="text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover natural, organic, and traditionally processed Indian food items.
        </p>
        
        <Link to="/shop">
          <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
            Shop Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default SpiceHero;
