import { Flame } from "lucide-react";
import type { Product } from "../types";

export function ProductArt({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const [from, to] = product.accent;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${from}, ${to})`,
      }}
    >
      <div className="absolute inset-0 bg-black/5" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
        <Flame className="h-8 w-8 text-white drop-shadow-sm" strokeWidth={1.5} />
      </div>
    </div>
  );
}
