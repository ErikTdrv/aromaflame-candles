import type { Product } from "../types";
import { ProductArt } from "./ProductArt";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../format";
import { Plus, Eye } from "lucide-react";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/60 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <button
        onClick={() => onSelect(product)}
        className="relative block cursor-pointer overflow-hidden text-left"
      >
        <ProductArt product={product} className="aspect-square w-full" />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream shadow-sm">
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur-sm">
          {product.occasion}
        </span>

        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
          <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink shadow-lg transition duration-300 group-hover:translate-y-0">
            <Eye className="h-4 w-4" />
            Разгледай
          </span>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <button onClick={() => onSelect(product)} className="text-left cursor-pointer">
          <h3 className="text-xl font-semibold text-ink">{product.name}</h3>
        </button>
        <p className="text-sm text-ink-soft">{product.scentNotes}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-2xl text-amber-dark">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:scale-105 hover:bg-amber-dark cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Добави
          </button>
        </div>
      </div>
    </div>
  );
}
