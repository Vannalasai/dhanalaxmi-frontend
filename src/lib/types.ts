// src/lib/types.ts
export interface BackendProduct {
  _id: string
  name: string
  image: string
  quantity: number
  cost: number
  description: string
  category: string
}

export interface Product {
  id: string
  name: string
  image: string
  price: number
  inStock: boolean
  category: string
  description: string
}
