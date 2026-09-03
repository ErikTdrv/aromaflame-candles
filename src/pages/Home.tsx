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
    title: "100% Соев восък",
    text: "Чисто горене, естествен и по-щадящ въздуха в дома ви.",
  },
  {
    icon: Heart,
    title: "Ръчна изработка",
    text: "Всеки букет е оформен и завършен на ръка, на малки партиди.",
  },
  {
    icon: Sparkles,
    title: "Аромати с внимание",
    text: "Всеки букет е съставен и тестван, докато не стане точно както трябва.",
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
            Ръчна изработка на малки партиди
          </span>
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
            Свещи, изработени бавно,
            <br /> на ръка, с грижа.
          </h1>
          <p className="max-w-xl text-lg text-ink-soft">
            Всеки букет на AromaFlame Candles започва като малка идея и
            завършва като часове топла, спокойна светлина. Изработени от
            100% соев восък и с внимание към всеки детайл — нищо забързано,
            нищо масово производство.
          </p>
          <Link
            to="/shop"
            className="mt-2 rounded-full bg-ink px-8 py-3.5 font-medium text-cream shadow-sm transition hover:bg-amber-dark"
          >
            Разгледай колекцията
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
              Нашата история
            </span>
            <h2 className="text-4xl font-semibold text-ink">
              Занаят, изграждан свещ по свещ
            </h2>
            <p className="text-ink-soft">
              AromaFlame Candles започна на кухненската маса, с тенджера
              разтопен восък и много проби и грешки. Днес всеки букет все още
              се прави на ръка — тестван за аромат, форма и качество, преди да
              стигне до вас. Малък, личен бизнес, изграден с търпение и любов
              към занаята.
            </p>
            <Link
              to="/shop"
              className="mt-2 w-fit border-b-2 border-amber-dark pb-0.5 font-medium text-ink transition hover:text-amber-dark"
            >
              Разгледай колекцията →
            </Link>
          </div>
          <img
            src="/images/products/basket-mixed.jpg"
            alt="Ръчно изработен букет от восъчни цветя на AromaFlame Candles"
            className="order-1 aspect-square w-full rounded-2xl object-cover sm:order-2"
          />
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-4xl font-semibold text-ink">
            Любими на клиентите
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-amber-dark hover:underline"
          >
            Всички →
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
