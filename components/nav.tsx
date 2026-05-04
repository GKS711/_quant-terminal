"use client";

import Link from "next/link";

export function Nav() {
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.85)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #FF6E40 0%, #E91E63 50%, #0066FF 100%)",
            }}
          />
          <span className="text-[15px] tracking-tight" style={{ fontWeight: 600, color: "#000" }}>
            每日股市儀表板
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/markets"
            className="hidden sm:inline-flex px-4 py-2 text-[13px]"
            style={{ color: "#000", fontWeight: 500 }}
          >
            Markets
          </Link>
          <a
            href="https://github.com/GKS711/_quant-terminal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-[13px] rounded-full transition-colors"
            style={{
              background: "#000",
              color: "#FFF",
              fontWeight: 600,
            }}
          >
            Open
          </a>
        </div>
      </div>
    </nav>
  );
}
