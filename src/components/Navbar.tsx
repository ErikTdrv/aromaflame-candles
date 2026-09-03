import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Flame, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Начало" },
  { to: "/shop", label: "Магазин" },
  { to: "/#contact", label: "Контакти" },
];

export function Navbar({ onCartClick }: { onCartClick: () => void }) {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-cream/85 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-ink/10 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <Flame
            className="h-6 w-6 text-amber-dark transition-transform group-hover:scale-110 group-hover:rotate-6"
            strokeWidth={1.5}
          />
          <span className="font-display text-2xl font-semibold text-ink">
            AromaFlame Candles
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="group relative text-sm font-medium text-ink-soft transition hover:text-amber-dark"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-dark transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onCartClick}
            aria-label="Отвори количката"
            className="relative rounded-full p-2 hover:bg-ink/5 cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-dark text-[10px] font-semibold text-white [animation:panel-in_260ms_cubic-bezier(0.16,1,0.3,1)]"
              >
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню"
            className="rounded-full p-2 hover:bg-ink/5 sm:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 px-5 py-3 sm:hidden [animation:fade-up_200ms_ease-out]">
          {links.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="rounded-lg px-2 py-2 text-sm font-medium text-ink-soft hover:bg-ink/5"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
