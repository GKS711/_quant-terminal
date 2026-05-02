import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint-400 text-ink-900 hover:bg-mint-300 active:bg-mint-500 " +
    "shadow-[0_0_0_1px_rgba(78,170,133,0.4),0_10px_30px_-10px_rgba(78,170,133,0.45)]",
  secondary:
    "bg-ink-50 text-ink-900 hover:bg-ink-100",
  ghost:
    "bg-transparent text-ink-50 hover:bg-white/5",
  outline:
    "bg-transparent text-ink-50 border border-white/10 hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9  px-3.5 text-sm",
  md: "h-11 px-5   text-[15px]",
  lg: "h-12 px-6   text-[15px]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
