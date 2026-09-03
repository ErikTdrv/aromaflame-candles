import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Sparkles } from "lucide-react";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import type { Product } from "../types";

const values = [
  {
    icon: Leaf,
    title: "100% Soy Wax",
    text: "Clean-burning, natural, and kinder to the air in your home.",
  },
  {
    icon: Heart,
    title: "Hand-Poured",
    text: "Every candle is poured, cooled, and finished by hand in small batches.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful Scents",
    text: "Blended and tested until each one feels just right.",
  },
];

export function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const featured = products.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#f0d9b5_0%,transparent_45%),radial-gradient(circle_at_80%_0%,#e8b98a_0%,transparent_40%)] opacity-60" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-24 text-center sm:py-32">
          <span className="rounded-full bg-amber-light/40 px-4 py-1 text-xs font-medium uppercase tracking-widest text-amber-dark">
            Hand-poured in small batches
          </span>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Candles made slowly,
            <br /> by hand, with care.
          </h1>
          <p className="max-w-xl text-lg text-ink-soft">
            Every AromaFlame candle starts as a small idea and ends as
            hours of warm, quiet light. Made with 100% soy wax and thoughtful
            scent blends — nothing rushed, nothing mass-produced.
          </p>
          <Link
            to="/shop"
            className="mt-2 rounded-full bg-ink px-8 py-3.5 font-medium text-cream shadow-sm transition hover:bg-amber-dark"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-ink/10 bg-white/50 p-8 text-center"
            >
              <Icon className="h-7 w-7 text-amber-dark" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream-dark">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-20 sm:grid-cols-2">
          <div className="order-2 flex flex-col gap-4 sm:order-1">
            <span className="text-xs font-medium uppercase tracking-widest text-amber-dark">
              Our Story
            </span>
            <h2 className="text-4xl font-semibold text-ink">
              A craft built one candle at a time
            </h2>
            <p className="text-ink-soft">
              AromaFlame Candles started at a kitchen table with a pot of melted
              wax and a lot of trial and error. Today, every candle is still
              poured by hand — tested for scent, burn, and quality before it
              ever reaches you. It's a small, personal business built on
              patience and a love for the craft.
            </p>
            <Link
              to="/shop"
              className="mt-2 w-fit border-b-2 border-amber-dark pb-0.5 font-medium text-ink transition hover:text-amber-dark"
            >
              See what's in the collection →
            </Link>
          </div>
          <div className="order-1 aspect-square rounded-2xl bg-[radial-gradient(circle_at_30%_30%,#e8b98a,#954f21)] sm:order-2" />
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-4xl font-semibold text-ink">
            Fan Favorites
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-amber-dark hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelected}
            />
          ))}
        </div>
      </section>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
