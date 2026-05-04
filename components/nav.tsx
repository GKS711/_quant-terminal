"use client";

import Link from "next/link";
import { Github } from "lucide-react";

const AMBER = "#FF6B00";

export function Nav() {
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: "rgba(0,0,0,0.85)",
        borderBottom: "1px solid #27272A",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span
            className="text-[14px] uppercase tracking-[0.18em]"
            style={{ color: "#FFFFFF", fontWeight: 500 }}
          >
            每日股市儀表板
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "#767D88", fontWeight: 450 }}
          >
            v2.2 / GKS
          </span>
        </Link>

        <a
          href="https://github.com/GKS711/_quant-terminal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors"
          style={{ color: "#C9CCD1", fontWeight: 500 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = AMBER)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#C9CCD1")}
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
      </div>
    </nav>
  );
}
