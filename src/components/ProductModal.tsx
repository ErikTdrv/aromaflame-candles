import { useEffect } from "react";
import { X, Plus } from "lucide-react";
import type { Product } from "../types";
import { ProductArt } from "./ProductArt";
import { useCart } from "../context/CartContext";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-2xl bg-cream shadow-2xl sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/70 p-1.5 text-ink hover:bg-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        <ProductArt product={product} className="aspect-square w-full" />
        <div className="flex flex-col justify-center gap-3 p-6">
          <h2 className="text-3xl font-semibold text-ink">{product.name}</h2>
          <p className="text-sm uppercase tracking-wide text-amber-dark">
            {product.scentNotes}
          </p>
          <p className="text-ink-soft">{product.description}</p>
          <div className="flex gap-4 text-sm text-ink-soft">
            <span>{product.size}</span>
            <span>·</span>
            <span>{product.burnTime}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-display text-3xl text-amber-dark">
              ${product.price}
            </span>
            <button
              onClick={() => {
                addItem(product);
                onClose();
              }}
              className="flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-amber-dark cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
