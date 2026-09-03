import { useEffect } from "react";
import { X, Plus, Package, Flame } from "lucide-react";
import type { Product } from "../types";
import { ProductArt } from "./ProductArt";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../format";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md [animation:backdrop-in_200ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-4xl max-h-[88vh] grid-cols-1 overflow-y-auto overflow-x-hidden rounded-[2rem] bg-cream shadow-2xl ring-1 ring-black/5 sm:grid-cols-2 [animation:panel-in_360ms_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Затвори"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-ink shadow-sm backdrop-blur-sm transition hover:scale-110 hover:bg-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-square overflow-hidden sm:aspect-auto sm:h-full sm:min-h-[26rem]">
          <div className="absolute inset-0 [animation:image-in_500ms_cubic-bezier(0.16,1,0.3,1)]">
            <ProductArt product={product} className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent sm:bg-gradient-to-r" />
        </div>

        <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
          <span className="w-fit rounded-full bg-amber-light/30 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-dark">
            {product.scentNotes}
          </span>
          <h2 className="text-4xl font-semibold leading-tight text-ink">
            {product.name}
          </h2>
          <p className="text-ink-soft">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/60 px-3 py-1.5 text-xs text-ink-soft">
              <Package className="h-3.5 w-3.5 text-amber-dark" strokeWidth={1.5} />
              {product.size}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/60 px-3 py-1.5 text-xs text-ink-soft">
              <Flame className="h-3.5 w-3.5 text-amber-dark" strokeWidth={1.5} />
              {product.burnTime}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 border-t border-ink/10 pt-5">
            <span className="font-display text-4xl text-amber-dark">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={() => {
                addItem(product);
                onClose();
              }}
              className="group flex items-center gap-1.5 rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream shadow-sm transition hover:scale-105 hover:bg-amber-dark cursor-pointer"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Добави в количката
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
