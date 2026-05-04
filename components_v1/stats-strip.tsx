const STATS = [
  { value: "NT$2.4億+", label: "追蹤資產總額" },
  { value: "8,200",     label: "活躍台灣投資人" },
  { value: "99.98%",    label: "近 90 天可用率" },
  { value: "4.9 ★",     label: "App Store 評分" },
];

export function StatsStrip() {
  return (
    <section className="relative border-y border-white/[0.06] bg-ink-900/60">
      <div className="container-x grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={
              "py-8 md:py-10 " +
              (i % 2 === 1 ? "border-l border-white/[0.06] " : "") +
              (i >= 2 ? "md:border-l " : "") +
              (i < 2 ? "border-b border-white/[0.06] md:border-b-0 " : "")
            }
          >
            <div className="font-display text-3xl md:text-4xl tracking-tighter tabular text-ink-50">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-ink-400 font-mono">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
