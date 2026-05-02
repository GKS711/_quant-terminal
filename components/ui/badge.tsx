import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "mint",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "mint" | "neutral" | "danger";
}) {
  const tones = {
    mint:    "border-mint-400/25 bg-mint-400/10 text-mint-300",
    neutral: "border-white/10     bg-white/5     text-ink-300",
    danger:  "border-danger/30    bg-danger/10   text-danger",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
