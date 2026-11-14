export interface Product {
  id: string;
  name: string;
  scentNotes: string;
  price: number;
  size: string;
  burnTime: string;
  description: string;
  accent: [string, string];
  image: string;
  /** All photos, cover first. Missing on older cached data. */
  images?: string[];
  occasion: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
