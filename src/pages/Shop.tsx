import { useState } from "react";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import type { Product } from "../types";

export function Shop() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-10 flex flex-col gap-2 text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-amber-dark">
          The Collection
        </span>
        <h1 className="text-5xl font-semibold text-ink">Shop All Candles</h1>
        <p className="mx-auto max-w-xl text-ink-soft">
          Six scents, all hand-poured with 100% soy wax. Tap a candle to see
          details, or add it straight to your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={setSelected}
          />
        ))}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
