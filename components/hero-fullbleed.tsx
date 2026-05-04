"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * v3.0 First-screen hero — full-bleed AI-generated image dominates,
 * tiny text overlay (1 line + 2 buttons). Apple/Stripe/Vercel "image first" feel.
 */
export function HeroFullBleed() {
  const [imageReady, setImageReady] = useState(false);

  // 圖片預載完才 reveal
  useEffect(() => {
    const img = new (window as any).Image();
    img.onload = () => setImageReady(true);
    img.onerror = () => setImageReady(true); // fallback 仍 reveal placeholder
    img.src = "/v3-heroes/hero-main.png";
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 56px)", minHeight: "560px", background: "#FFFFFF" }}
    >
      {/* Hero image — fills 80% of screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        {imageReady ? (
          <Image
            src="/v3-heroes/hero-main.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center" }}
          />
        ) : (
          // Placeholder: animated gradient wave (撞色)
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(255,110,64,0.5) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(233,30,99,0.4) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 80%, rgba(0,102,255,0.4) 0%, transparent 60%), #FFFFFF",
            }}
          />
        )}
        {/* Soft white fade at bottom for text readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.95) 100%)",
          }}
        />
      </div>

      {/* Bottom-anchored minimal text */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-16 sm:pb-20">
          <h1
            className="mb-6 max-w-[860px]"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              color: "#000",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            打開就知道<br />
            <span style={{ color: "#FF6E40" }}>今天該不該動</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#tiles"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[14px] transition-transform hover:scale-105"
              style={{
                background: "#000",
                color: "#FFF",
                fontWeight: 600,
              }}
            >
              探索儀表板 →
            </a>
            <a
              href="#ai-editor"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[14px] transition-colors"
              style={{
                background: "transparent",
                color: "#000",
                fontWeight: 600,
                border: "1.5px solid #000",
              }}
            >
              問 AI 顧問
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
