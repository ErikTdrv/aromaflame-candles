import { Mail, Flame } from "lucide-react";
import { products } from "../data/products";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-4 w-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-ink/10 bg-cream-dark scroll-mt-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-[1.1fr_auto_1fr]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-dark" strokeWidth={1.5} />
            <span className="font-display text-xl font-semibold">
              AromaFlame Candles
            </span>
          </div>
          <p className="max-w-xs text-sm text-ink-soft">
            Ръчно изработени соеви свещи, направени на малки партиди с любов.
          </p>
        </div>

        <div className="hidden w-px bg-ink/10 sm:block" />

        <div className="flex flex-col gap-3 text-sm">
          <span className="font-medium text-ink">Последвай ни</span>
          <div className="grid grid-cols-5 gap-1.5 sm:max-w-xs">
            {products.map((p) => (
              <a
                key={p.id}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110 group-hover:opacity-80"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-soft transition hover:text-amber-dark"
          >
            <InstagramIcon />
            @aromaflamecandles
          </a>
          <a
            href="mailto:hello@aromaflamecandles.com"
            className="flex items-center gap-2 text-ink-soft transition hover:text-amber-dark"
          >
            <Mail className="h-4 w-4" />
            hello@aromaflamecandles.com
          </a>
        </div>
      </div>
      <div className="border-t border-ink/10 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} AromaFlame Candles. Всички права запазени.
      </div>
    </footer>
  );
}
