import type { Product } from "../types";
import { ProductArt } from "./ProductArt";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../format";
import { Plus } from "lucide-react";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/60 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
      <button
        onClick={() => onSelect(product)}
        className="block text-left cursor-pointer"
      >
        <ProductArt product={product} className="aspect-square w-full" />
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
            className="flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-medium text-cream transition hover:bg-amber-dark cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Добави
          </button>
        </div>
      </div>
    </div>
  );
}
