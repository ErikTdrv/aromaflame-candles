import { createClient } from "@supabase/supabase-js";
import type { Product } from "../types";

// The publishable key is meant to be public; access is limited by the
// row level security rules in supabase/setup.sql.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://dgnhllcigjocfvczcxeq.supabase.co";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ??
  "sb_publishable_mG7NsI5SwoD8FW6NwSJEFw_EdWKhjey";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const IMAGE_BUCKET = "product-images";

export interface ProductRow {
  id: string;
  name: string;
  scent_notes: string;
  price: number | string;
  size: string;
  burn_time: string;
  description: string;
  accent_from: string;
  accent_to: string;
  image_url: string;
  images?: string[] | null;
  occasion: string;
  badge: string | null;
  active: boolean;
  sort_order: number;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    scentNotes: row.scent_notes,
    price: Number(row.price),
    size: row.size,
    burnTime: row.burn_time,
    description: row.description,
    accent: [row.accent_from, row.accent_to],
    image: row.image_url,
    images: row.images?.length ? row.images : row.image_url ? [row.image_url] : [],
    occasion: row.occasion,
    badge: row.badge ?? undefined,
  };
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "done" | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  delivery: string;
  note: string | null;
  items: OrderItem[];
  total: number | string;
  status: OrderStatus;
}

export const DELIVERY_LABELS: Record<string, string> = {
  econt: "Офис на Еконт",
  speedy: "Офис на Спиди",
  pigeon: "Офис на Pigeon Express",
  address: "До адрес",
  pickup: "Вземане от магазин (Видин)",
};

/** Our own shops, for orders picked up in person: [name, street address]. */
export const PICKUP_CITY = "Видин";
export const PICKUP_SHOPS: [string, string][] = [
  ["Цветарски магазин Вивиан", "ул. Широка 39"],
  ["Цветарски магазин Вивиан 2", ""],
];
