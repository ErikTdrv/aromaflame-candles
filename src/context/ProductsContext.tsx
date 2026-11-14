import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types";
import { products as fallbackProducts } from "../data/products";
import { supabase, rowToProduct, type ProductRow } from "../lib/supabase";

const CACHE_KEY = "aromaflame-products";

interface ProductsContextValue {
  products: Product[];
  reload: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

// Start from the last list we saw (or the built-in one) so the page is never
// empty while the live list loads.
function initialProducts(): Product[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    // ignore a broken cache
  }
  return fallbackProducts;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order")
      .order("created_at");
    if (error || !data) return; // keep showing what we have
    const next = (data as ProductRow[]).map(rowToProduct);
    setProducts(next);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    } catch {
      // storage may be unavailable
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <ProductsContext.Provider value={{ products, reload }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductsProvider");
  return ctx;
}
