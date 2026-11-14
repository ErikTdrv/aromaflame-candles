import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../format";
import {
  supabase,
  DELIVERY_LABELS,
  PICKUP_CITY,
  PICKUP_SHOPS,
  type OrderItem,
} from "../lib/supabase";
import { notifyNewOrder } from "../lib/notify";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white/70 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-amber-dark focus:ring-2 focus:ring-amber-light/50";

const labelClass = "flex flex-col gap-1 text-sm font-medium text-ink";

/** City name → list of [office name, street address]. */
type EcontOffices = Record<string, [string, string][]>;

// Loaded once per visit, the first time the order form opens.
let econtOfficesPromise: Promise<EcontOffices | null> | null = null;
function loadEcontOffices(): Promise<EcontOffices | null> {
  econtOfficesPromise ??= fetch("/data/econt-offices.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { cities?: EcontOffices } | null) => data?.cities ?? null)
    .catch(() => null);
  return econtOfficesPromise;
}

export function OrderForm({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState("econt");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: real people leave it empty
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [econt, setEcont] = useState<EcontOffices | null>(null);
  const [office, setOffice] = useState(""); // index into cityOffices

  useEffect(() => {
    let cancelled = false;
    void loadEcontOffices().then((data) => {
      if (!cancelled) setEcont(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const econtCities = useMemo(() => (econt ? Object.keys(econt) : []), [econt]);

  // Offices in the typed city, if Econt has any there (ignores letter case).
  const cityOffices = useMemo(() => {
    if (delivery !== "econt" || !econt) return null;
    const typed = city.trim().toLocaleLowerCase("bg");
    if (!typed) return null;
    const match = econtCities.find((c) => c.toLocaleLowerCase("bg") === typed);
    return match ? econt[match] : null;
  }, [delivery, econt, econtCities, city]);

  const isPickup = delivery === "pickup";
  // The list to choose from: our shops for pickup, Econt offices for Econt.
  const choices = isPickup ? PICKUP_SHOPS : cityOffices;
  const pickOffice = choices !== null;
  const noEcontOffice =
    delivery === "econt" && econt !== null && city.trim() !== "" && !cityOffices;

  const addressLabel =
    delivery === "address"
      ? "Адрес за доставка"
      : "Офис (име или адрес на офиса)";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (website) {
      onDone();
      return;
    }
    let orderAddress = address.trim();
    if (pickOffice) {
      const chosen = choices[Number(office)];
      if (office === "" || !chosen) {
        setError(
          isPickup ? "Моля, изберете магазин." : "Моля, изберете офис на Еконт."
        );
        return;
      }
      orderAddress = chosen[1] ? `${chosen[0]} — ${chosen[1]}` : chosen[0];
    }

    setSending(true);
    setError(null);

    const orderItems: OrderItem[] = items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));
    const order = {
      customer_name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      city: isPickup ? PICKUP_CITY : city.trim(),
      address: orderAddress,
      delivery,
      note: note.trim() || null,
      items: orderItems,
      total: totalPrice,
    };

    const { error: insertError } = await supabase.from("orders").insert(order);
    if (insertError) {
      setSending(false);
      setError(
        "Не успяхме да изпратим поръчката. Моля, опитайте отново или ни пишете в Instagram."
      );
      return;
    }

    await notifyNewOrder(order);
    clearCart();
    setSending(false);
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-5">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm text-ink-soft hover:text-amber-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Обратно към количката
        </button>

        <div className="flex flex-col gap-3.5">
          <label className={labelClass}>
            Име и фамилия *
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
            />
          </label>

          <label className={labelClass}>
            Телефон *
            <input
              className={inputClass}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={5}
              maxLength={40}
              autoComplete="tel"
              placeholder="08..."
            />
          </label>

          <label className={labelClass}>
            Имейл (по желание)
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={160}
              autoComplete="email"
            />
          </label>

          <label className={labelClass}>
            Начин на доставка *
            <select
              className={inputClass}
              value={delivery}
              onChange={(e) => {
                setDelivery(e.target.value);
                setOffice("");
              }}
            >
              {Object.entries(DELIVERY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          {!isPickup && (
            <label className={labelClass}>
              Град / село *
              <input
                className={inputClass}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setOffice("");
                }}
                required
                maxLength={120}
                autoComplete="address-level2"
                list={delivery === "econt" ? "econt-cities" : undefined}
              />
              {noEcontOffice && (
                <span className="text-xs font-normal text-ink-soft">
                  Не намираме офис на Еконт в това населено място. Проверете
                  името или опишете офиса по-долу.
                </span>
              )}
            </label>
          )}
          <datalist id="econt-cities">
            {econtCities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          {pickOffice ? (
            <label className={labelClass}>
              {isPickup ? "Магазин във Видин *" : "Офис на Еконт *"}
              <select
                className={inputClass}
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                required
              >
                <option value="">
                  {isPickup
                    ? "Изберете магазин"
                    : `Изберете офис (${choices.length})`}
                </option>
                {choices.map(([officeName, officeAddress], i) => (
                  <option key={`${officeName}-${i}`} value={i}>
                    {officeAddress
                      ? `${officeName} — ${officeAddress}`
                      : officeName}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className={labelClass}>
              {addressLabel} *
              <input
                className={inputClass}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                maxLength={300}
              />
            </label>
          )}

          <label className={labelClass}>
            Бележка (по желание)
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              placeholder="Напр. надпис, цвят, желана дата"
            />
          </label>

          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
        </div>
      </div>

      <div className="border-t border-ink/10 p-5">
        <div className="mb-3 flex items-center justify-between text-lg">
          <span className="text-ink-soft">Общо</span>
          <span className="font-display text-2xl text-amber-dark">
            {formatPrice(totalPrice)}
          </span>
        </div>
        {error && (
          <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={sending}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink py-3 font-medium text-cream transition hover:bg-amber-dark disabled:cursor-wait disabled:opacity-70"
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? "Изпращане..." : "Изпрати поръчката"}
        </button>
        <p className="mt-2 text-center text-xs text-ink-soft">
          Плащане при доставка. Ще се свържем с вас по телефона за
          потвърждение.
        </p>
      </div>
    </form>
  );
}
