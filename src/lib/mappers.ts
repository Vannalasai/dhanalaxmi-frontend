// src/lib/mappers.ts
import type { BackendProduct, Product } from "./types"

export function mapBackendProduct(bp: BackendProduct): Product {
  return {
    id: bp._id,
    name: bp.name,
    image: bp.image,
    price: bp.cost,
    inStock: bp.quantity > 0,
    category: bp.category,
    description: bp.description,
  }
}
