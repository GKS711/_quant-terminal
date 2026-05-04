"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { routeToStock } from "@/lib/stock-routes";

const HOME_LINKS = [
  { label: "決策矩陣", href: "/#strategy" },
  { label: "回測表現", href: "/#backtest" },
  { label: "AI 顧問",  href: "/#advisor" },
  { label: "技術架構", href: "/#tech" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // /tw/2330, /us/nvda...
  const isStockPage = !!pathname && /^\/(tw|us|hk|cn)\/[a-z0-9]+/.test(pathname);
  const stockMatch = isStockPage ? pathname.match(/^\/(tw|us|hk|cn)\/([a-z0-9]+)/i) : null;
  const currentStock =
    stockMatch ? routeToStock(stockMatch[1], stockMatch[2]) : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ink-900/70 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        {/* Logo always links to home */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
          <span className="text-[15px] font-medium tracking-tight">
            每日股市儀表板 <span className="text-ink-300 font-mono text-[12px]">/ GKS</span>
          </span>
          {isStockPage && (
            <span className="text-[11px] font-mono text-ink-400 ml-1 group-hover:text-ink-200 transition-colors">
              ← 回主頁
            </span>
          )}
        </Link>

        {/* Center nav */}
        {!isStockPage ? (
          <nav className="hidden md:flex items-center gap-1">
            {HOME_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-1.5 text-sm text-ink-300 hover:text-ink-50 hover:bg-white/5 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-ink-300 hover:text-ink-50 hover:bg-white/5 transition-colors"
            >
              <Home className="h-3.5 w-3.5" /> 首頁
            </Link>
            <Link
              href="/#advisor"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors"
              style={{
                background: "rgba(78,170,133,0.10)",
                color: "#6FC298",
                border: "1px solid rgba(78,170,133,0.30)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {currentStock ? `問 AI 關於 ${currentStock.shortCode}` : "問 AI"}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/GKS711/_quant-terminal"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-ink-300 hover:text-ink-50 hover:bg-white/5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </a>
          <Link
            href={isStockPage ? "/" : "/#decision"}
            className="inline-flex items-center justify-center gap-2 rounded-full font-medium h-9 px-3.5 text-sm bg-mint-400 text-ink-900 hover:bg-mint-300 transition-colors"
            style={{ boxShadow: "0 0 0 1px rgba(78,170,133,0.4), 0 10px 30px -10px rgba(78,170,133,0.45)" }}
          >
            {isStockPage ? "回主頁" : "看決策"}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-md bg-mint-400 text-ink-900">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 18 L10 10 L14 14 L20 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
