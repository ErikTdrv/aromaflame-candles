import { products } from "../data/products";

export function GalleryStrip() {
  const items = [...products, ...products];

  return (
    <div className="group relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-32" />
      <div className="flex w-max gap-5 [animation:marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
        {items.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="relative h-56 w-56 shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-72 sm:w-72"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
              <span className="text-sm font-medium text-white">
                {product.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
