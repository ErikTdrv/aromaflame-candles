const items = [
  "Ръчна изработка на малки партиди",
  "100% соев восък",
  "Изработва се по поръчка",
  "Всеки букет е уникален",
];

export function AnnouncementBar() {
  const line = [...items, ...items];

  return (
    <div className="overflow-hidden bg-ink py-2 text-cream">
      <div className="flex w-max gap-10 [animation:marquee_26s_linear_infinite]">
        {line.map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-xs font-medium uppercase tracking-widest text-cream/90"
          >
            {text}
            <span className="text-amber-light">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
