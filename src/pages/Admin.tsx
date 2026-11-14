import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  Flame,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  supabase,
  IMAGE_BUCKET,
  DELIVERY_LABELS,
  type OrderRow,
  type OrderStatus,
  type ProductRow,
} from "../lib/supabase";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../format";
import { compressImage } from "../lib/image";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-amber-dark focus:ring-2 focus:ring-amber-light/50";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-ink";
const primaryBtn =
  "flex cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-amber-dark disabled:cursor-wait disabled:opacity-70";
const ghostBtn =
  "flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-amber-dark hover:text-amber-dark";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Нова",
  confirmed: "Потвърдена",
  shipped: "Изпратена",
  done: "Завършена",
  cancelled: "Отказана",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: "bg-amber-light/50 text-amber-dark",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-ink/10 text-ink-soft",
};

/* -------------------------------------------------------------------------- */
/* Page shell                                                                  */
/* -------------------------------------------------------------------------- */

export function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void supabase.rpc("is_admin").then(({ data }) => {
      if (!cancelled) setIsAdmin(data === true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(null);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-cream-dark">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-dark" strokeWidth={1.5} />
            <span className="font-display text-xl font-semibold">
              AromaFlame · Админ
            </span>
          </Link>
          {session && (
            <button onClick={signOut} className={ghostBtn}>
              <LogOut className="h-4 w-4" />
              Изход
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {loading ? (
          <Spinner />
        ) : !session ? (
          <Login />
        ) : isAdmin === null ? (
          <Spinner />
        ) : !isAdmin ? (
          <p className="rounded-2xl bg-white/70 p-6 text-center text-ink-soft">
            Този профил ({session.user.email}) няма права за управление на
            магазина.
          </p>
        ) : (
          <>
            <div className="mb-6 flex gap-2">
              {(["orders", "products"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition ${
                    tab === t
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/15 bg-white/60 text-ink-soft hover:border-amber-dark hover:text-amber-dark"
                  }`}
                >
                  {t === "orders" ? "Поръчки" : "Продукти"}
                </button>
              ))}
            </div>
            {tab === "orders" ? <Orders /> : <Products />}
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-ink-soft" />
    </div>
  );
}

function ErrorNote({ children }: { children: string }) {
  return (
    <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Login                                                                       */
/* -------------------------------------------------------------------------- */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signInError) setError("Грешен имейл или парола.");
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-10 flex max-w-sm flex-col gap-4 rounded-2xl border border-ink/10 bg-white/70 p-6 shadow-sm"
    >
      <h1 className="text-2xl font-semibold">Вход</h1>
      {error && <ErrorNote>{error}</ErrorNote>}
      <label className={labelClass}>
        Имейл
        <input
          className={inputClass}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
      </label>
      <label className={labelClass}>
        Парола
        <input
          className={inputClass}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      <button type="submit" disabled={busy} className={primaryBtn}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Влез
      </button>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Orders                                                                      */
/* -------------------------------------------------------------------------- */

function Orders() {
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (loadError) {
      setError("Поръчките не можаха да се заредят.");
      return;
    }
    setError(null);
    setOrders(data as OrderRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: OrderStatus) => {
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (updateError) {
      setError("Статусът не можа да се промени.");
      return;
    }
    setOrders((prev) =>
      prev ? prev.map((o) => (o.id === id ? { ...o, status } : o)) : prev
    );
  };

  const remove = async (order: OrderRow) => {
    if (
      !window.confirm(
        `Да изтрия ли поръчката на ${order.customer_name}? Това не може да се върне.`
      )
    )
      return;
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);
    if (deleteError) {
      setError("Поръчката не можа да се изтрие.");
      return;
    }
    setOrders((prev) => (prev ? prev.filter((o) => o.id !== order.id) : prev));
  };

  if (!orders && !error) return <Spinner />;

  const newCount = orders?.filter((o) => o.status === "new").length ?? 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {orders?.length ?? 0} поръчки
          {newCount > 0 && ` · ${newCount} нови`}
        </p>
        <button onClick={() => void load()} className={ghostBtn}>
          <RefreshCw className="h-4 w-4" />
          Обнови
        </button>
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}
      {orders?.length === 0 && (
        <p className="rounded-2xl bg-white/70 p-8 text-center text-ink-soft">
          Все още няма поръчки.
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {orders?.map((order) => (
          <li
            key={order.id}
            className="rounded-2xl border border-ink/10 bg-white/70 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold">
                    {order.customer_name}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">
                  {new Date(order.created_at).toLocaleString("bg-BG")}
                </p>
              </div>
              <span className="font-display text-2xl text-amber-dark">
                {formatPrice(Number(order.total))}
              </span>
            </div>

            <div className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              <p>
                <span className="text-ink-soft">Телефон: </span>
                <a
                  href={`tel:${order.phone}`}
                  className="font-medium text-amber-dark underline"
                >
                  {order.phone}
                </a>
              </p>
              {order.email && (
                <p>
                  <span className="text-ink-soft">Имейл: </span>
                  {order.email}
                </p>
              )}
              <p>
                <span className="text-ink-soft">Доставка: </span>
                {DELIVERY_LABELS[order.delivery] ?? order.delivery}
              </p>
              <p>
                <span className="text-ink-soft">Град: </span>
                {order.city}
              </p>
              <p className="sm:col-span-2">
                <span className="text-ink-soft">Адрес / офис: </span>
                {order.address}
              </p>
              {order.note && (
                <p className="sm:col-span-2">
                  <span className="text-ink-soft">Бележка: </span>
                  {order.note}
                </p>
              )}
            </div>

            <ul className="mt-3 rounded-xl bg-cream px-4 py-3 text-sm">
              {order.items.map((item, i) => (
                <li key={`${item.id}-${i}`} className="flex justify-between gap-3">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-ink-soft">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                Статус
                <select
                  value={order.status}
                  onChange={(e) =>
                    void setStatus(order.id, e.target.value as OrderStatus)
                  }
                  className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm text-ink"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => void remove(order)}
                className="flex cursor-pointer items-center gap-1.5 text-sm text-ink-soft hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Изтрий
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

type Draft = Omit<ProductRow, "id" | "price"> & { id?: string; price: string };

const emptyDraft: Draft = {
  name: "",
  scent_notes: "",
  price: "",
  size: "",
  burn_time: "",
  description: "",
  accent_from: "#f0c9a0",
  accent_to: "#c97c4b",
  image_url: "",
  images: [],
  occasion: "Универсален",
  badge: null,
  active: true,
  sort_order: 0,
};

function Products() {
  const { reload } = useProducts();
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("products")
      .select("*")
      .order("sort_order")
      .order("created_at");
    if (loadError) {
      setError("Продуктите не можаха да се заредят.");
      return;
    }
    setError(null);
    setRows(data as ProductRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changed = async () => {
    await load();
    await reload();
  };

  const toggleActive = async (row: ProductRow) => {
    const { error: updateError } = await supabase
      .from("products")
      .update({ active: !row.active })
      .eq("id", row.id);
    if (updateError) setError("Промяната не беше запазена.");
    else await changed();
  };

  const remove = async (row: ProductRow) => {
    if (
      !window.confirm(
        `Да изтрия ли „${row.name}“? Това не може да се върне. Ако искаш само да го скриеш от сайта, използвай „Скрий“.`
      )
    )
      return;
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", row.id);
    if (deleteError) setError("Продуктът не можа да се изтрие.");
    else await changed();
  };

  if (!rows && !error) return <Spinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-soft">{rows?.length ?? 0} продукта</p>
        <button
          onClick={() =>
            setEditing({
              ...emptyDraft,
              sort_order:
                Math.max(0, ...(rows ?? []).map((r) => r.sort_order)) + 1,
            })
          }
          className={primaryBtn}
        >
          <Plus className="h-4 w-4" />
          Нов продукт
        </button>
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}

      <ul className="flex flex-col gap-3">
        {rows?.map((row) => (
          <li
            key={row.id}
            className={`flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-white/70 p-3 shadow-sm ${
              row.active ? "" : "opacity-60"
            }`}
          >
            <div
              className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${row.accent_from}, ${row.accent_to})`,
              }}
            >
              {row.image_url && (
                <img
                  src={row.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-40 flex-1">
              <p className="font-semibold">{row.name}</p>
              <p className="text-sm text-ink-soft">
                {row.occasion}
                {row.badge ? ` · ${row.badge}` : ""}
                {(row.images?.length ?? 0) > 1
                  ? ` · ${row.images?.length} снимки`
                  : ""}
                {row.active ? "" : " · скрит"}
              </p>
              <p className="font-display text-lg text-amber-dark">
                {formatPrice(Number(row.price))}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setEditing({ ...row, price: String(row.price) })
                }
                className={ghostBtn}
              >
                <Pencil className="h-4 w-4" />
                Редактирай
              </button>
              <button onClick={() => void toggleActive(row)} className={ghostBtn}>
                {row.active ? "Скрий" : "Покажи"}
              </button>
              <button
                onClick={() => void remove(row)}
                aria-label={`Изтрий ${row.name}`}
                className={`${ghostBtn} hover:border-red-700 hover:text-red-700`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <ProductEditor
          draft={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await changed();
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  draft,
  onClose,
  onSaved,
}: {
  draft: Draft;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState<Draft>(draft);
  // All photos, cover first.
  const [photos, setPhotos] = useState<string[]>(
    draft.images?.length
      ? draft.images
      : draft.image_url
        ? [draft.image_url]
        : []
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const problems: string[] = [];
    for (const original of Array.from(files)) {
      // Shrink first, so large phone photos are fine to pick.
      const file = await compressImage(original);
      if (file.size > 5 * 1024 * 1024) {
        problems.push(`„${original.name}“ е твърде голяма.`);
        continue;
      }
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          cacheControl: "31536000", // file names are unique, so cache for a year
        });
      if (uploadError) {
        problems.push(
          `„${file.name}“ не можа да се качи (позволени са JPG, PNG и WebP).`
        );
        continue;
      }
      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      setPhotos((prev) => [...prev, data.publicUrl]);
    }
    setUploading(false);
    if (problems.length > 0) setError(problems.join(" "));
  };

  const makeCover = (url: string) =>
    setPhotos((prev) => [url, ...prev.filter((p) => p !== url)]);

  const removePhoto = (url: string) =>
    setPhotos((prev) => prev.filter((p) => p !== url));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const price = Number(form.price.replace(",", "."));
    if (!Number.isFinite(price) || price < 0) {
      setError("Въведи валидна цена, например 36 или 36,50.");
      return;
    }
    setBusy(true);
    setError(null);
    const { id, ...rest } = form;
    const payload = {
      ...rest,
      price,
      name: form.name.trim(),
      badge: form.badge?.trim() || null,
      images: photos,
      image_url: photos[0] ?? "",
    };
    const { error: saveError } = id
      ? await supabase.from("products").update(payload).eq("id", id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (saveError) {
      setError("Продуктът не беше запазен. Опитай отново.");
      return;
    }
    await onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={save}
        onClick={(e) => e.stopPropagation()}
        className="relative my-6 w-full max-w-2xl rounded-3xl bg-cream p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Затвори"
          className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 hover:bg-ink/5"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-5 text-2xl font-semibold">
          {form.id ? "Редактиране на продукт" : "Нов продукт"}
        </h2>
        {error && <ErrorNote>{error}</ErrorNote>}

        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <div className="flex flex-col gap-2">
            <div
              className="aspect-square w-full overflow-hidden rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${form.accent_from}, ${form.accent_to})`,
              }}
            >
              {photos[0] && (
                <img
                  src={photos[0]}
                  alt="Основна снимка"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <label className={`${ghostBtn} w-full`}>
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Добави снимки
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void upload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3.5">
            <label className={labelClass}>
              Име *
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                maxLength={120}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>
                Цена (€) *
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  required
                  placeholder="36"
                />
              </label>
              <label className={labelClass}>
                Повод / категория
                <input
                  className={inputClass}
                  value={form.occasion}
                  onChange={(e) => set("occasion", e.target.value)}
                  placeholder="Рожден ден"
                />
              </label>
            </div>
            <label className={labelClass}>
              Аромати
              <input
                className={inputClass}
                value={form.scent_notes}
                onChange={(e) => set("scent_notes", e.target.value)}
                placeholder="Рози, ванилия и полски билки"
              />
            </label>
          </div>
        </div>

        {photos.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-ink">
              Снимки ({photos.length}) — първата е основната
            </p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((url, i) => (
                <li key={url} className="flex flex-col gap-1">
                  <div
                    className={`relative aspect-square overflow-hidden rounded-xl ring-2 ${
                      i === 0 ? "ring-amber-dark" : "ring-transparent"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Снимка ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(url)}
                      aria-label={`Премахни снимка ${i + 1}`}
                      className="absolute right-1 top-1 cursor-pointer rounded-full bg-white/90 p-1 text-ink shadow-sm hover:text-red-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {i === 0 ? (
                    <span className="text-center text-xs font-medium text-amber-dark">
                      Основна
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(url)}
                      className="cursor-pointer text-center text-xs text-ink-soft underline hover:text-amber-dark"
                    >
                      Направи основна
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3.5">
          <label className={labelClass}>
            Описание
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              Размер / опаковка
              <input
                className={inputClass}
                value={form.size}
                onChange={(e) => set("size", e.target.value)}
              />
            </label>
            <label className={labelClass}>
              Време на горене
              <input
                className={inputClass}
                value={form.burn_time}
                onChange={(e) => set("burn_time", e.target.value)}
              />
            </label>
            <label className={labelClass}>
              Етикет (напр. „Ново“, по желание)
              <input
                className={inputClass}
                value={form.badge ?? ""}
                onChange={(e) => set("badge", e.target.value)}
                maxLength={30}
              />
            </label>
            <label className={labelClass}>
              Подредба (по-малко число = по-напред)
              <input
                className={inputClass}
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              />
            </label>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-amber-dark"
            />
            Показвай продукта в сайта
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={ghostBtn}>
            Отказ
          </button>
          <button type="submit" disabled={busy || uploading} className={primaryBtn}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Запази
          </button>
        </div>
      </form>
    </div>
  );
}
