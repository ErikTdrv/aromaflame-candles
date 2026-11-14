import { useMemo, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Reveal } from "../components/Reveal";
import type { Product } from "../types";

export function Shop() {
  const { products } = useProducts();
  const [selected, setSelected] = useState<Product | null>(null);
  const [filter, setFilter] = useState<string>("Всички");

  const occasions = useMemo(
    () => ["Всички", ...Array.from(new Set(products.map((p) => p.occasion)))],
    [products]
  );

  const filtered =
    filter === "Всички"
      ? products
      : products.filter((p) => p.occasion === filter);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="mb-8 flex flex-col gap-2 text-center">
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

      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {occasions.map((occasion) => (
          <button
            key={occasion}
            onClick={() => setFilter(occasion)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === occasion
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 bg-white/60 text-ink-soft hover:border-amber-dark hover:text-amber-dark"
            }`}
          >
            {occasion}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) => (
          <Reveal key={product.id} delay={(i % 3) * 90}>
            <ProductCard product={product} onSelect={setSelected} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-ink-soft">
          Няма свещи в тази категория все още.
        </p>
      )}

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
