import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductArt } from "./ProductArt";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 p-5">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-1.5 hover:bg-ink/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-ink-soft">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <ProductArt
                    product={item.product}
                    className="h-20 w-20 shrink-0 rounded-lg"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <span className="font-medium">{item.product.name}</span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                        className="text-ink-soft hover:text-amber-dark cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-ink-soft">
                      ${item.product.price} each
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="rounded-full border border-ink/15 p-1 hover:bg-ink/5 cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="rounded-full border border-ink/15 p-1 hover:bg-ink/5 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 p-5">
            <div className="mb-4 flex items-center justify-between text-lg">
              <span className="text-ink-soft">Total</span>
              <span className="font-display text-2xl text-amber-dark">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <a
              href={`mailto:hello@aromaflamecandles.com?subject=${encodeURIComponent(
                "Candle order"
              )}&body=${encodeURIComponent(
                "Hi! I'd like to order:\n\n" +
                  items
                    .map(
                      (i) => `- ${i.product.name} x${i.quantity} ($${i.product.price} each)`
                    )
                    .join("\n") +
                  `\n\nTotal: $${totalPrice.toFixed(2)}`
              )}`}
              className="block w-full rounded-full bg-ink py-3 text-center font-medium text-cream transition hover:bg-amber-dark"
            >
              Send order request
            </a>
            <p className="mt-2 text-center text-xs text-ink-soft">
              No online checkout yet — this sends your order by email.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
