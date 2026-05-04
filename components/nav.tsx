"use client";

import Link from "next/link";
import { Github } from "lucide-react";

const SERIF = '"Iowan Old Style", "Palatino", "Georgia", serif';

export function Nav() {
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: "rgba(250,249,246,0.85)",
        borderBottom: "1px solid rgba(33,25,34,0.08)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Masthead */}
        <Link href="/" className="flex items-baseline gap-3 group">
          <span
            className="text-[20px] tracking-tight"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              color: "#211922",
              fontWeight: 400,
            }}
          >
            每日股市儀表板
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "#91918C", fontWeight: 500 }}
          >
            By GKS · No. 1
          </span>
        </Link>

        {/* Right: GitHub minimal */}
        <a
          href="https://github.com/GKS711/_quant-terminal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px]"
          style={{
            color: "#62625B",
            borderBottom: "1px solid transparent",
          }}
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </nav>
  );
}
