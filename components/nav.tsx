"use client";

import Link from "next/link";
import { Github, TrendingUp } from "lucide-react";

const GOLD = "#F5A623";
const PINK = "#FF4D6D";

export function Nav() {
  return (
    <nav
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        background: "rgba(11,20,38,0.85)",
        borderColor: "rgba(245,166,35,0.10)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="grid h-7 w-7 place-items-center rounded-md transition-transform group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${PINK} 100%)`,
              boxShadow: "0 4px 12px rgba(245,166,35,0.30)",
            }}
          >
            <TrendingUp className="h-4 w-4 text-navy-900" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] tracking-tight" style={{ fontWeight: 590, color: "#F4F6FA" }}>
            每日股市儀表板
            <span className="ml-2 text-[11px] font-mono" style={{ color: "#7A869A" }}>/ GKS</span>
          </span>
          <span
            className="ml-2 px-1.5 py-0.5 text-[9px] font-mono tracking-widest rounded"
            style={{
              background: "rgba(245,166,35,0.12)",
              color: GOLD,
              border: `1px solid ${GOLD}40`,
              fontWeight: 590,
            }}
          >
            v2.0
          </span>
        </Link>

        {/* Center: market pulse indicator */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5" style={{ color: "#A9B3C4" }}>
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: GOLD }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ background: GOLD }}
              />
            </span>
            <span className="uppercase tracking-wider">LIVE PULSE</span>
          </span>
          <span style={{ color: "#3E4A5E" }}>·</span>
          <span style={{ color: "#A9B3C4" }}>5 國 100 檔</span>
          <span style={{ color: "#3E4A5E" }}>·</span>
          <span style={{ color: GOLD }}>Gemma 4 31B</span>
        </div>

        {/* Right: GitHub */}
        <a
          href="https://github.com/GKS711/_quant-terminal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-full transition-colors"
          style={{
            background: "rgba(244,246,250,0.04)",
            color: "#D6DCE6",
            border: "1px solid rgba(244,246,250,0.10)",
          }}
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
      </div>
    </nav>
  );
}
