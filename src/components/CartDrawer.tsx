import { useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductArt } from "./ProductArt";
import { OrderForm } from "./OrderForm";
import { formatPrice } from "../format";

type Step = "cart" | "form" | "done";

const titles: Record<Step, string> = {
  cart: "Твоята количка",
  form: "Данни за поръчка",
  done: "Благодарим!",
};

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [step, setStep] = useState<Step>("cart");

  // The form only makes sense with something in the cart.
  const view: Step = step === "form" && items.length === 0 ? "cart" : step;

  const close = () => {
    onClose();
    if (step === "done") setStep("cart");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 p-5">
          <h2 className="text-2xl font-semibold">{titles[view]}</h2>
          <button
            onClick={close}
            aria-label="Затвори количката"
            className="rounded-full p-1.5 hover:bg-ink/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {view === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-sage" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold">Поръчката е получена</h3>
            <p className="text-ink-soft">
              Ще се свържем с вас по телефона, за да я потвърдим и да уточним
              доставката.
            </p>
            <button
              onClick={close}
              className="mt-3 cursor-pointer rounded-full bg-ink px-6 py-2.5 font-medium text-cream transition hover:bg-amber-dark"
            >
              Затвори
            </button>
          </div>
        )}

        {view === "form" && (
          <div className="min-h-0 flex-1">
            <OrderForm
              onBack={() => setStep("cart")}
              onDone={() => setStep("done")}
            />
          </div>
        )}

        {view === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="mt-16 flex flex-col items-center gap-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark">
                    <ShoppingBag
                      className="h-7 w-7 text-ink-soft"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-ink-soft">Количката ви е празна.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item, i) => (
                    <li
                      key={item.product.id}
                      className="flex gap-3 [animation:fade-up_300ms_ease-out_backwards]"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <ProductArt
                        product={item.product}
                        className="h-20 w-20 shrink-0 rounded-lg"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between">
                          <span className="font-medium">
                            {item.product.name}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Премахни артикул"
                            className="text-ink-soft hover:text-amber-dark cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm text-ink-soft">
                          {formatPrice(item.product.price)} на брой
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            aria-label="Намали количеството"
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
                            aria-label="Увеличи количеството"
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
                  <span className="text-ink-soft">Общо</span>
                  <span className="font-display text-2xl text-amber-dark">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => setStep("form")}
                  className="block w-full cursor-pointer rounded-full bg-ink py-3 text-center font-medium text-cream transition hover:bg-amber-dark"
                >
                  Към поръчка
                </button>
                <p className="mt-2 text-center text-xs text-ink-soft">
                  Плащане при доставка — ще се свържем с вас за потвърждение.
                </p>
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
