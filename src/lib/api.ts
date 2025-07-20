// src/lib/api.ts

// వేరియంట్ కోసం ఇంటర్‌ఫేస్
export interface Variant {
  _id: string; // MongoDB నుండి వస్తుంది
  weight: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

// ప్రొడక్ట్ కోసం ఇంటర్‌ఫేస్
export interface Product {
  id: string; // MongoDB _id
  name: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  benefits: string[];
  usage: string;
  inStock: boolean;
  variants: Variant[];
}

// API నుండి నేరుగా వచ్చే డేటా కోసం Raw ఇంటర్‌ఫేస్
interface RawProduct extends Omit<Product, 'id' | 'variants'> {
  _id: string;
  variants: Variant[];
}


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// అన్ని ప్రొడక్ట్స్‌ను ఫెచ్ చేయండి
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error(`Fetch products failed (${res.status})`);
  
  const rawProducts: RawProduct[] = await res.json();
  
  // డేటాను ఫ్రంటెండ్‌కు అనుగుణంగా మ్యాప్ చేయండి
  return rawProducts.map((p) => ({
    id: p._id,
    name: p.name,
    image: p.image,
    category: p.category,
    rating: p.rating,
    description: p.description,
    benefits: p.benefits,
    usage: p.usage,
    inStock: p.inStock,
    variants: p.variants,
  }));
}

// ఒకే ప్రొడక్ట్‌ను ఫెచ్ చేయండి
export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error(`Fetch product ${id} failed (${res.status})`);
  
  const p: RawProduct = await res.json();
  
  // డేటాను ఫ్రంటెండ్‌కు అనుగుణంగా మ్యాప్ చేయండి
  return {
    id: p._id,
    name: p.name,
    image: p.image,
    category: p.category,
    rating: p.rating,
    description: p.description,
    benefits: p.benefits,
    usage: p.usage,
    inStock: p.inStock,
    variants: p.variants,
  };
}

export async function updateProduct(id: string, productData: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return await res.json();
}

export async function deleteProduct(id: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return await res.json();
}