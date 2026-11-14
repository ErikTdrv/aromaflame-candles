import { formatPrice } from "../format";
import { DELIVERY_LABELS, type OrderItem } from "./supabase";

// Email notification for new orders, sent through Web3Forms.
// Leave the key empty to switch notifications off; orders are still saved
// and visible on the /admin page.
const WEB3FORMS_KEY: string = import.meta.env.VITE_WEB3FORMS_KEY ?? "";

export interface OrderNotification {
  customer_name: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  delivery: string;
  note: string | null;
  items: OrderItem[];
  total: number;
}

export async function notifyNewOrder(order: OrderNotification): Promise<void> {
  if (!WEB3FORMS_KEY) return;

  const lines = [
    `Клиент: ${order.customer_name}`,
    `Телефон: ${order.phone}`,
    order.email ? `Имейл: ${order.email}` : null,
    `Доставка: ${DELIVERY_LABELS[order.delivery] ?? order.delivery}`,
    `Град: ${order.city}`,
    `Адрес / офис: ${order.address}`,
    order.note ? `Бележка: ${order.note}` : null,
    "",
    "Поръчани продукти:",
    ...order.items.map(
      (i) => `- ${i.name} x${i.quantity} (${formatPrice(i.price)} на брой)`
    ),
    "",
    `Общо: ${formatPrice(order.total)}`,
  ].filter((l): l is string => l !== null);

  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Нова поръчка от ${order.customer_name} — ${formatPrice(order.total)}`,
        from_name: "AromaFlame Candles",
        message: lines.join("\n"),
      }),
    });
  } catch {
    // The order is already saved; a failed email must not break checkout.
  }
}
