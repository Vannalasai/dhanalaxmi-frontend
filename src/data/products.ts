
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  benefits: string[];
  usage: string;
  weight: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Turmeric Powder",
    price: 12.99,
    originalPrice: 15.99,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
    category: "Turmeric",
    rating: 5,
    description: "Pure, organic turmeric powder with high curcumin content. Perfect for cooking and health benefits.",
    benefits: ["Anti-inflammatory", "Antioxidant rich", "Boosts immunity", "Natural antiseptic"],
    usage: "Add 1/2 teaspoon to milk, cooking, or smoothies",
    weight: "250g",
    inStock: true
  },
  {
    id: 2,
    name: "Organic Garam Masala",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
    category: "Spice Blends",
    rating: 4,
    description: "Traditional blend of aromatic spices including cardamom, cinnamon, cloves, and black pepper.",
    benefits: ["Digestive aid", "Rich in antioxidants", "Enhances flavor", "Traditional recipe"],
    usage: "Add to curries, rice dishes, and meat preparations",
    weight: "100g",
    inStock: true
  },
  {
    id: 3,
    name: "Pure Red Chili Powder",
    price: 6.99,
    originalPrice: 8.99,
    image: "https://images.unsplash.com/photo-1583571715085-1a2b0fd9e8fa?w=400&h=300&fit=crop",
    category: "Chili",
    rating: 5,
    description: "Vibrant red chili powder made from premium quality dried chilies with perfect heat level.",
    benefits: ["Rich in Vitamin C", "Boosts metabolism", "Natural preservative", "Adds heat and color"],
    usage: "Use in curries, marinades, and spice rubs",
    weight: "200g",
    inStock: true
  },
  {
    id: 4,
    name: "Organic Coriander Seeds",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1596040033189-d54e81ad9de2?w=400&h=300&fit=crop",
    category: "Whole Spices",
    rating: 4,
    description: "Whole coriander seeds with aromatic flavor, perfect for tempering and grinding fresh.",
    benefits: ["Aids digestion", "Rich in fiber", "Natural detoxifier", "Anti-bacterial properties"],
    usage: "Roast and grind fresh or use whole in tempering",
    weight: "150g",
    inStock: true
  },
  {
    id: 5,
    name: "Premium Cumin Powder",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1596040033199-e54f5b5d4a82?w=400&h=300&fit=crop",
    category: "Ground Spices",
    rating: 5,
    description: "Freshly ground cumin powder with intense aroma and earthy flavor.",
    benefits: ["Improves digestion", "Rich in iron", "Boosts immunity", "Weight management"],
    usage: "Essential for Indian cooking, add to dal and curries",
    weight: "100g",
    inStock: true
  },
  {
    id: 6,
    name: "Black Mustard Seeds",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1596040033179-a54e81ad9de1?w=400&h=300&fit=crop",
    category: "Whole Spices",
    rating: 4,
    description: "Premium black mustard seeds perfect for tempering and pickle making.",
    benefits: ["Rich in selenium", "Anti-inflammatory", "Heart healthy", "Natural preservative"],
    usage: "Use in tempering, pickles, and marinades",
    weight: "100g",
    inStock: false
  }
];
