"use client";

import Image from "next/image";

interface Tile {
  id: string;
  imgSrc: string;
  title: string;
  tagline: string;
  cta: string;
  href: string;
  bgFallback: string; // gradient placeholder if img missing
  accentText: string; // tagline accent color
}

const TILES: Tile[] = [
  {
    id: "ai-editor",
    imgSrc: "/v3-heroes/tile-ai-editor.png",
    title: "AI Editor",
    tagline: "AI 替你讀完今天",
    cta: "Ask AI",
    href: "#ai-editor",
    bgFallback:
      "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,89,182,0.4) 0%, rgba(233,30,99,0.3) 50%, transparent 80%), #FAF6FC",
    accentText: "#9B59B6",
  },
  {
    id: "100-stocks",
    imgSrc: "/v3-heroes/tile-100-stocks.png",
    title: "100 Stocks Scanner",
    tagline: "5 國 100 檔，一頁讀完",
    cta: "Scan All",
    href: "#scanner",
    bgFallback:
      "linear-gradient(135deg, #FF6E40 0%, #FFC700 50%, #00C896 100%)",
    accentText: "#FF6E40",
  },
  {
    id: "watchlist",
    imgSrc: "/v3-heroes/tile-watchlist.png",
    title: "My Watchlist",
    tagline: "你的個人清單，雲端同步",
    cta: "Add Stocks",
    href: "#watchlist",
    bgFallback:
      "radial-gradient(ellipse 50% 40% at 30% 40%, rgba(0,102,255,0.4) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 70% 70%, rgba(255,199,0,0.3) 0%, transparent 70%), #F5FAFF",
    accentText: "#0066FF",
  },
  {
    id: "11-strategies",
    imgSrc: "/v3-heroes/tile-11-strategies.png",
    title: "11 Strategies",
    tagline: "11 種演算法給你訊號",
    cta: "Explore",
    href: "#strategies",
    bgFallback:
      "linear-gradient(135deg, #E91E63 0%, #FF6E40 30%, #FFC700 60%, #00C896 100%)",
    accentText: "#E91E63",
  },
  {
    id: "news-wires",
    imgSrc: "/v3-heroes/tile-news-wires.png",
    title: "News Wires",
    tagline: "24h 新聞 + 情緒分數",
    cta: "Read",
    href: "#news",
    bgFallback:
      "linear-gradient(135deg, #0066FF 0%, #FF6E40 100%)",
    accentText: "#0066FF",
  },
  {
    id: "methodology",
    imgSrc: "/v3-heroes/tile-methodology.png",
    title: "Methodology",
    tagline: "資料源 + 演算法全公開",
    cta: "Read Source",
    href: "https://github.com/GKS711/_quant-terminal",
    bgFallback:
      "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,200,150,0.3) 0%, transparent 80%), #F5FFFA",
    accentText: "#00C896",
  },
];

export function TileGrid() {
  return (
    <section
      id="tiles"
      className="py-16 sm:py-24"
      style={{ background: "#F5F5F5" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          className="text-[12px] uppercase mb-3"
          style={{ color: "#767676", letterSpacing: "0.3em", fontWeight: 600 }}
        >
          Explore
        </div>
        <h2
          className="mb-12"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 600,
            color: "#000",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          一站式投資資訊
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TILES.map((t) => (
            <TileCard key={t.id} tile={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TileCard({ tile }: { tile: Tile }) {
  return (
    <a
      href={tile.href}
      target={tile.href.startsWith("http") ? "_blank" : undefined}
      rel={tile.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="block relative overflow-hidden group transition-transform hover:scale-[1.01]"
      style={{
        background: "#FFFFFF",
        borderRadius: "24px",
        minHeight: "440px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Big image (or fallback gradient) — 70% height */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "260px",
          background: tile.bgFallback,
        }}
      >
        <Image
          src={tile.imgSrc}
          alt=""
          fill
          className="object-cover"
          onError={(e) => {
            // hide on error — fallback gradient remains
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Text bottom */}
      <div className="p-7 sm:p-8">
        <h3
          className="mb-2"
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#000",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {tile.title}
        </h3>
        <p
          className="mb-5 text-[15px]"
          style={{ color: "#3A3A3A", lineHeight: 1.5 }}
        >
          <span style={{ color: tile.accentText, fontWeight: 600 }}>
            {tile.tagline}
          </span>
        </p>
        <span
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] transition-colors"
          style={{
            background: "#000",
            color: "#FFF",
            fontWeight: 600,
          }}
        >
          {tile.cta} →
        </span>
      </div>
    </a>
  );
}
