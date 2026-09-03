import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Heart, Sparkles, Lightbulb, Flower2, Layers, Gift, Flame } from "lucide-react";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { GalleryStrip } from "../components/GalleryStrip";
import { Reveal } from "../components/Reveal";
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

const steps = [
  {
    icon: Lightbulb,
    title: "Идея",
    text: "Всеки букет тръгва от скица — цветова палитра, аромат и повод.",
  },
  {
    icon: Flower2,
    title: "Восъчни цветя",
    text: "Всяко цвете се оформя и оцветява на ръка от 100% соев восък.",
  },
  {
    icon: Layers,
    title: "Съставяне",
    text: "Цветята се подреждат внимателно в букет, цвят по цвят.",
  },
  {
    icon: Gift,
    title: "Опаковане",
    text: "Финални щрихи и грижливо опаковане, готово за подарък.",
  },
];

export function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const featured = products.slice(0, 3);
  const heroProduct = products[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#f0d9b5_0%,transparent_45%),radial-gradient(circle_at_80%_0%,#e8b98a_0%,transparent_40%)] opacity-60" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="rounded-full bg-amber-light/40 px-4 py-1 text-xs font-medium uppercase tracking-widest text-amber-dark">
              Ръчна изработка на малки партиди
            </span>
            <h1 className="text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              Свещи, изработени
              <br /> бавно, на ръка,
              <br /> с грижа.
            </h1>
            <p className="max-w-lg text-lg text-ink-soft">
              Всеки букет на AromaFlame Candles започва като малка идея и
              завършва като часове топла, спокойна светлина. Изработени от
              100% соев восък и с внимание към всеки детайл.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="rounded-full bg-ink px-8 py-3.5 font-medium text-cream shadow-sm transition hover:scale-105 hover:bg-amber-dark"
              >
                Разгледай колекцията
              </Link>
              <a
                href="#story"
                className="text-sm font-medium text-ink underline decoration-amber-dark decoration-2 underline-offset-4 transition hover:text-amber-dark"
              >
                Нашата история
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber-light/50 blur-2xl [animation:float-soft_6s_ease-in-out_infinite]" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-sage/30 blur-2xl [animation:float-soft_7s_ease-in-out_infinite]" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-black/5">
              <img
                src={heroProduct.image}
                alt={heroProduct.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm sm:-left-10">
              <Flame className="h-5 w-5 shrink-0 text-amber-dark" strokeWidth={1.5} />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink">{heroProduct.name}</p>
                <p className="text-xs text-ink-soft">{heroProduct.scentNotes}</p>
              </div>
            </div>

            <div className="absolute -right-3 -top-3 rotate-6 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream shadow-lg sm:right-2 sm:top-2">
              {heroProduct.badge ?? "Ръчна изработка"}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-ink/10 bg-white/50 p-8 text-center transition hover:-translate-y-1 hover:shadow-md">
                <Icon className="h-7 w-7 text-amber-dark" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm text-ink-soft">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-4">
        <Reveal className="mx-auto mb-8 max-w-6xl px-5 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-amber-dark">
            Ръчна изработка
          </span>
          <h2 className="text-4xl font-semibold text-ink">Нашите творения</h2>
        </Reveal>
        <GalleryStrip />
      </section>

      {/* Story */}
      <section id="story" className="bg-cream-dark scroll-mt-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-20 sm:grid-cols-2">
          <Reveal className="order-2 flex flex-col gap-4 sm:order-1">
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
          </Reveal>
          <Reveal delay={150} className="order-1 sm:order-2">
            <img
              src="/images/products/basket-mixed.jpg"
              alt="Ръчно изработен букет от восъчни цветя на AromaFlame Candles"
              className="aspect-square w-full rounded-2xl object-cover shadow-lg transition duration-500 hover:scale-[1.02]"
            />
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mb-12 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-amber-dark">
            Процесът
          </span>
          <h2 className="text-4xl font-semibold text-ink">
            Как създаваме всеки букет
          </h2>
        </Reveal>
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-6">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-ink/10 sm:block" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120} className="relative flex flex-col items-center gap-3 text-center">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cream border-2 border-amber-dark/30 bg-white text-amber-dark shadow-sm">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-ink">
                {i + 1}. {title}
              </h3>
              <p className="max-w-[16rem] text-sm text-ink-soft">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mb-10 flex items-end justify-between">
          <h2 className="text-4xl font-semibold text-ink">
            Любими на клиентите
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-amber-dark hover:underline"
          >
            Всички →
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 100}>
              <ProductCard product={product} onSelect={setSelected} />
            </Reveal>
          ))}
        </div>
      </section>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
