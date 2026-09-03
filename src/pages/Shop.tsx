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
          Колекцията
        </span>
        <h1 className="text-5xl font-semibold text-ink">Пазарувай всички свещи</h1>
        <p className="mx-auto max-w-xl text-ink-soft">
          Ръчно изработени букети от соеви восъчни цветя — за рожден ден,
          дипломиране или просто за подарък. Докосни свещ, за да видиш
          детайли, или я добави направо в количката.
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
