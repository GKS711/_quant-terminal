"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, X, ChevronDown, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
// @ts-expect-error -- three has runtime exports but no bundled .d.ts in this version
import * as THREE from "three";
import { EXCHANGES, type Exchange } from "@/lib/exchanges";
import { cn } from "@/lib/utils";

// Three.js + WebGL — client only
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// ─── Tokens ───
const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";
// 「太空教育風」：飽和藍地球 + 強烈青藍光暈 + 深空背景
const ICE_BLUE = "#7CC8F2";        // 強化的青藍 halo（更亮）
const HALO_CORE = "#A8DDF7";       // 內圈光核（接近白藍）
const DEEP_OCEAN = "#0a2240";
const EMISSIVE_BLUE = "#0e2d52";   // 較深的藍 emissive，不會吃掉貼圖

// Solar System Scope 8K texture（CC-BY 4.0）— 比 NASA blue-marble 更鮮豔飽和、更接近 stylized space illustration
const GLOBE_DAYMAP = "/textures/earth-daymap-8k.jpg";
const GLOBE_CLOUDS = "/textures/earth-clouds-8k.jpg";
const GLOBE_BUMP = "//unpkg.com/three-globe/example/img/earth-topology.png";

/**
 * v4 — "全屏掌握" layout (Codex + Visual Storyteller spec)
 * - Globe is the full-screen background protagonist (min(92vw, 920px), opaque)
 * - Headline + single CTA float at top-center inside a thin glass-blur band
 * - 3 floating cards at corners (LiveQuote top-left / Risk top-right / Gemma bottom-right)
 *   positioned to AVOID the central globe hotspot density
 * - pointer-events orchestration so globe stays interactive
 * - Scroll: globe scale 1→.78 / opacity 1→.35 / blur 0→2px
 */
export function GlobalMarketsHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  const [openExchange, setOpenExchange] = useState<Exchange | null>(null);
  const [hoverExchange, setHoverExchange] = useState<Exchange | null>(null);
  const [globeSize, setGlobeSize] = useState(820);
  const [isMobile, setIsMobile] = useState(false);

  // ─── Scroll-linked: globe scale + opacity + blur ───
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const globeScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.78]);
  const globeOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.35]);
  const globeBlur = useTransform(scrollYProgress, [0, 0.45], [0, 2]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // ─── Responsive sizing ───
  useEffect(() => {
    function resize() {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      // Globe = min(92vw, 920px) for desktop, min(75vw, 600px) for mobile
      const size = mobile ? Math.min(w * 0.75, 600) : Math.min(w * 0.92, 920);
      setGlobeSize(size);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ─── Globe init ───
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !openExchange;
    controls.autoRotateSpeed = 0.3;
    g.pointOfView({ lat: 18, lng: 110, altitude: 2.0 }, 0);

    // Mod material：Solar System Scope 8K texture，色彩本身就鮮豔，emissive 拉低
    const mat = g.globeMaterial();
    if (mat) {
      mat.color = new THREE.Color("#ffffff");
      mat.emissive = new THREE.Color("#0a2848");
      mat.emissiveIntensity = 0.05;
      mat.specular = new THREE.Color("#cfecff");
      mat.shininess = 28;
      mat.bumpScale = 0.5;
      mat.needsUpdate = true;
    }

    // Lighting：明亮方向光 + 中等 ambient（保留日夜對比但暗面不黑）
    const scene = g.scene();
    scene.traverse((obj: any) => {
      if (obj.isDirectionalLight) {
        obj.position.set(1.5, 0.8, 1.0);
        obj.intensity = 1.5;
        obj.color = new THREE.Color("#ffffff");
      }
      if (obj.isAmbientLight) {
        obj.intensity = 0.55;
        obj.color = new THREE.Color("#6ba0d4");
      }
    });

    // ─── 加雲層 sphere（比 globe 大 1.5%）───
    const globeRadius = 100; // three-globe 內部用 100 半徑
    const cloudGeo = new THREE.SphereGeometry(globeRadius * 1.015, 64, 64);
    const cloudTex = new THREE.TextureLoader().load(GLOBE_CLOUDS);
    cloudTex.colorSpace = THREE.SRGBColorSpace;
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      alphaMap: cloudTex,    // 雲層 jpg 本身白底黑雲 → alphaMap 讓黑色變透明
      depthWrite: false,
      opacity: 0.55,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.name = "clouds";
    g.scene().add(cloudMesh);

    // 雲層獨立慢轉
    const cloudAnimate = () => {
      cloudMesh.rotation.y += 0.0003;
      requestAnimationFrame(cloudAnimate);
    };
    cloudAnimate();
    // openExchange 只取 mount 當下初值；之後變動由下方 [openExchange] 那條 effect 處理
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = !openExchange;
  }, [openExchange]);

  const points = useMemo(
    () =>
      EXCHANGES.map((e) => ({
        lat: e.lat,
        lng: e.lng,
        size: e.id === hoverExchange?.id ? 1.3 : 0.8,
        color: e.isOpen ? MINT_BRIGHT : "#9CD5DA",
        ex: e,
      })),
    [hoverExchange],
  );

  const ringsData = useMemo(
    () =>
      EXCHANGES.filter((e) => e.isOpen).map((e) => ({
        lat: e.lat,
        lng: e.lng,
        maxR: 5,
        propagationSpeed: 1.6,
        repeatPeriod: 2200,
      })),
    [],
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100vh] overflow-hidden"
      style={{
        // 太空教育風：中央深藍微光 → 黑色邊緣，襯托地球青藍 halo
        background:
          "radial-gradient(ellipse 70% 55% at 50% 50%, #0a1830 0%, #04081a 45%, #010206 100%)",
      }}
    >
      <BackgroundFx />

      <div ref={containerRef} className="relative h-screen flex items-center justify-center">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* GLOBE — full-screen background protagonist                  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            scale: globeScale,
            opacity: globeOpacity,
            filter: useTransform(globeBlur, (v) => `blur(${v}px)`),
            x: isMobile ? 0 : "4vw",
            y: isMobile ? "-4vh" : "2vh",
          }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-auto"
        >
          {/* Outer rim glow — 4 層青藍 halo（向 Stian 風推到極致） */}
          {/* Layer 1: 巨大擴散冷光，太空 ambient */}
          <div
            className="absolute rounded-full blur-[240px] opacity-95 pointer-events-none"
            style={{
              width: globeSize * 2.0,
              height: globeSize * 2.0,
              background: `radial-gradient(circle, ${ICE_BLUE}cc 0%, ${ICE_BLUE}77 25%, ${ICE_BLUE}33 50%, transparent 72%)`,
            }}
          />
          {/* Layer 2: 中距離光圈 */}
          <div
            className="absolute rounded-full blur-[110px] opacity-90 pointer-events-none"
            style={{
              width: globeSize * 1.42,
              height: globeSize * 1.42,
              background: `radial-gradient(circle, transparent 28%, ${HALO_CORE}99 47%, ${ICE_BLUE}66 60%, transparent 76%)`,
            }}
          />
          {/* Layer 3: 緊貼地球的亮環（大氣折射） */}
          <div
            className="absolute rounded-full blur-[32px] opacity-100 pointer-events-none"
            style={{
              width: globeSize * 1.05,
              height: globeSize * 1.05,
              background: `radial-gradient(circle, transparent 42%, ${HALO_CORE}ff 49%, ${ICE_BLUE}aa 54%, transparent 62%)`,
            }}
          />
          {/* Layer 4: 微細高光環 */}
          <div
            className="absolute rounded-full blur-[5px] opacity-100 pointer-events-none"
            style={{
              width: globeSize * 1.008,
              height: globeSize * 1.008,
              background: `radial-gradient(circle, transparent 47%, #e8f6ff 49.5%, transparent 52%)`,
            }}
          />

          {/* Globe — Solar System Scope 8K daymap + 雲層 + 輕度色彩 grade */}
          <div
            className="relative"
            style={{
              filter:
                "url(#cool-grade) saturate(1.15) brightness(1.05) contrast(1.05)",
            }}
          >
          <Globe
            ref={globeRef}
            width={globeSize}
            height={globeSize}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={GLOBE_DAYMAP}
            bumpImageUrl={GLOBE_BUMP}
            showAtmosphere
            atmosphereColor={HALO_CORE}
            atmosphereAltitude={0.28}
            pointsData={points}
            pointLat={(d: any) => d.lat}
            pointLng={(d: any) => d.lng}
            pointAltitude={0.018}
            pointRadius={(d: any) => d.size}
            pointColor={(d: any) => d.color}
            pointLabel={(d: any) =>
              `<div style="background:#0f1619;color:#f7f8f8;padding:8px 12px;border:1px solid rgba(78,170,133,.4);border-radius:8px;font-size:12px;font-family:Inter,system-ui;box-shadow:0 8px 24px rgba(0,0,0,.6);pointer-events:none">
                <div style="font-weight:600;margin-bottom:2px">${d.ex.shortCode} · ${d.ex.nameZh}</div>
                <div style="color:#8a8f98">${d.ex.mainIndex.name} <span style="color:${d.ex.mainIndex.changePct >= 0 ? MINT_BRIGHT : "#E5484D"}">${d.ex.mainIndex.value.toLocaleString()} ${d.ex.mainIndex.changePct >= 0 ? "+" : ""}${d.ex.mainIndex.changePct}%</span></div>
              </div>`
            }
            onPointClick={(d: any) => setOpenExchange(d.ex)}
            onPointHover={(d: any) => setHoverExchange(d?.ex ?? null)}
            ringsData={ringsData}
            ringColor={() => (t: number) => `rgba(78,170,133,${1 - t})`}
            ringMaxRadius={(d: any) => d.maxR}
            ringPropagationSpeed={(d: any) => d.propagationSpeed}
            ringRepeatPeriod={(d: any) => d.repeatPeriod}
          />
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HEADLINE — top center inside thin glass-blur band            */}
        {/* pointer-events: none on wrapper, auto on CTA only            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute z-20 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          // top 18vh on desktop, slightly higher on mobile
          // (Tailwind doesn't have arbitrary vh by default - use inline)
        >
          <div
            style={{ marginTop: "18vh" }}
            className="rounded-2xl px-8 py-7 max-w-[760px] mx-auto"
          >
            {/* Glass-blur band — 改更透明，地球能透出來 */}
            <div
              className="rounded-2xl px-7 py-6 backdrop-blur-sm"
              style={{
                background: "rgba(2,6,16,0.18)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <h1
                className="text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.0] tracking-[-0.045em]"
                style={{
                  fontWeight: 510,
                  color: "#f7f8f8",
                  fontFeatureSettings: '"cv01","ss03","tnum"',
                  textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                }}
              >
                全球市場，
                <span className="italic font-normal" style={{ color: MINT_BRIGHT }}>
                  正在流動。
                </span>
              </h1>
              <p
                className="mt-4 text-[16px] leading-[1.6] max-w-[520px] mx-auto"
                style={{ color: "#c8d0dc", letterSpacing: "-0.165px" }}
              >
                9 個交易所、即時行情、AI 即時分析——一個畫面看世界在動。
              </p>

              {/* Single primary CTA — pointer-events: auto */}
              <div className="mt-7 pointer-events-auto inline-flex">
                <CtaPrimary>
                  開始監看市場 <ArrowRight className="h-4 w-4" />
                </CtaPrimary>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FLOATING CARDS — 3 corners, avoid central hotspot density    */}
        {/* pointer-events: auto                                          */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div style={{ opacity: cardsOpacity }} className="absolute inset-0 z-10 pointer-events-none">
          <FloatingCard
            delay={0.4}
            className="absolute top-[16vh] left-[3vw] pointer-events-auto"
          >
            <LiveQuoteCard />
          </FloatingCard>

          <FloatingCard
            delay={0.7}
            className="absolute top-[14vh] right-[3vw] pointer-events-auto hidden md:block"
          >
            <RiskRadarCard />
          </FloatingCard>

          <FloatingCard
            delay={1.0}
            className="absolute bottom-[18vh] right-[5vw] pointer-events-auto hidden md:block"
          >
            <AiInsightCard />
          </FloatingCard>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* REGION CAROUSEL — bottom-right corner (out of center)       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <RegionCarousel
          onPick={(region) => {
            const target = EXCHANGES.find((e) => regionOf(e) === region);
            if (target && globeRef.current) {
              globeRef.current.pointOfView({ lat: target.lat, lng: target.lng, altitude: 2.0 }, 1200);
            }
          }}
        />
      </div>

      {/* Live ticker bar — bottom sticky */}
      <LiveTickerBar />

      <AnimatePresence>
        {openExchange && (
          <ExchangeDialog ex={openExchange} onClose={() => setOpenExchange(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// BACKGROUND FX — grid + stars + noise
// ════════════════════════════════════════════════════════════════════
function BackgroundFx() {
  return (
    <>
      {/* SVG color-grade filter：Solar System Scope texture 已飽和，這裡只做輕度藍提升 */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="cool-grade" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                0.95 0.04 0.01 0 0.01
                0.05 0.92 0.08 0 0.02
                0.08 0.15 1.05 0 0.04
                0    0    0    1 0
              "
            />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 70% at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at center, black 30%, transparent 80%)",
        }}
      />
      {/* Dense star field — Stian 滿天星感 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 7% 15%, white, transparent)," +
            "radial-gradient(1px 1px at 14% 42%, white, transparent)," +
            "radial-gradient(1.5px 1.5px at 21% 78%, white, transparent)," +
            "radial-gradient(1px 1px at 28% 8%, #B8D4EE, transparent)," +
            "radial-gradient(1px 1px at 35% 55%, white, transparent)," +
            "radial-gradient(2px 2px at 42% 25%, white, transparent)," +
            "radial-gradient(1px 1px at 49% 88%, #B8D4EE, transparent)," +
            "radial-gradient(1px 1px at 56% 18%, white, transparent)," +
            "radial-gradient(1.5px 1.5px at 63% 62%, white, transparent)," +
            "radial-gradient(1px 1px at 70% 35%, #B8D4EE, transparent)," +
            "radial-gradient(1px 1px at 77% 75%, white, transparent)," +
            "radial-gradient(2px 2px at 84% 12%, white, transparent)," +
            "radial-gradient(1px 1px at 91% 48%, white, transparent)," +
            "radial-gradient(1px 1px at 96% 82%, #B8D4EE, transparent)," +
            "radial-gradient(1px 1px at 3% 65%, white, transparent)",
          backgroundSize: "100% 100%",
        }}
      />
      {/* Animated twinkle — 部分星星閃爍 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 animate-pulse"
        style={{
          animationDuration: "4s",
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 22% 28%, #6FC298, transparent)," +
            "radial-gradient(1px 1px at 68% 72%, #6FC298, transparent)," +
            "radial-gradient(1.5px 1.5px at 88% 38%, #B8D4EE, transparent)",
          backgroundSize: "100% 100%",
        }}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// CTA
// ════════════════════════════════════════════════════════════════════
function CtaPrimary({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ y: -2, boxShadow: `0 0 0 1px rgba(78,170,133,0.5), 0 18px 40px -10px rgba(78,170,133,0.55)` }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-[15px]"
      style={{
        background: MINT,
        color: "#08090a",
        fontWeight: 590,
        boxShadow: `0 0 0 1px rgba(78,170,133,0.4), 0 10px 30px -10px rgba(78,170,133,0.45)`,
      }}
    >
      {children}
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════════════
// FLOATING CARD wrapper — fade-in + slow float
// ════════════════════════════════════════════════════════════════════
function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LIVE QUOTE CARD — 2330.TW pulsing
// ════════════════════════════════════════════════════════════════════
function LiveQuoteCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const price = (1180 + Math.sin(tick / 3) * 4).toFixed(1);
  const change = (1.84 + Math.sin(tick / 5) * 0.3).toFixed(2);

  return (
    <div
      className="rounded-xl px-3.5 py-2.5 backdrop-blur-xl min-w-[200px]"
      style={{
        background: "rgba(2,6,16,0.70)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: MINT_BRIGHT }} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f98]">LIVE · TWSE</span>
        </div>
        <span className="text-[9px] text-[#62666d]">01:48 UTC</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[14px] font-mono text-[#f7f8f8]" style={{ fontWeight: 590 }}>2330</span>
        <span className="text-[10px] text-[#8a8f98]">台積電</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[20px] tabular-nums" style={{ fontWeight: 510, letterSpacing: "-0.5px", color: "#f7f8f8" }}>
          NT${price}
        </span>
        <span className="text-[11px] tabular-nums inline-flex items-center gap-0.5" style={{ color: MINT_BRIGHT }}>
          <TrendingUp className="h-3 w-3" /> +{change}%
        </span>
      </div>
      <svg viewBox="0 0 100 24" className="mt-1.5 w-full h-6">
        <path
          d="M0 18 L10 14 L20 16 L30 10 L40 12 L50 7 L60 9 L70 4 L80 6 L90 2 L100 5"
          fill="none"
          stroke={MINT_BRIGHT}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// RISK RADAR CARD
// ════════════════════════════════════════════════════════════════════
function RiskRadarCard() {
  return (
    <div
      className="rounded-xl px-3.5 py-2.5 backdrop-blur-xl min-w-[180px]"
      style={{
        background: "rgba(2,6,16,0.70)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7)",
      }}
    >
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#62666d] mb-1.5">PORTFOLIO RISK</div>
      <div className="flex items-baseline gap-2">
        <span className="text-[16px]" style={{ color: "#f7f8f8", fontWeight: 590 }}>Moderate</span>
        <span className="text-[10px] text-[#8a8f98]">VAR 2.4%</span>
      </div>
      <div className="mt-1.5 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i <= 3 ? MINT : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// AI INSIGHT CARD — Gemma 4 streaming
// ════════════════════════════════════════════════════════════════════
const AI_INSIGHT_PHRASES = [
  "分析半導體類股動能…",
  "比對外資籌碼變化…",
  "檢測 NVDA 法說影響…",
  "更新風險評估…",
];

function AiInsightCard() {
  const phrases = AI_INSIGHT_PHRASES;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % AI_INSIGHT_PHRASES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-xl px-3.5 py-2.5 backdrop-blur-xl min-w-[230px]"
      style={{
        background: "rgba(2,6,16,0.72)",
        border: "1px solid rgba(78,170,133,0.20)",
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(78,170,133,0.10)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="grid h-4 w-4 place-items-center rounded" style={{ background: MINT }}>
          <Sparkles className="h-2.5 w-2.5 text-[#08090a]" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a8f98]">GEMMA 4 31B</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.35 }}
          className="text-[12px] text-[#d0d6e0] flex items-center gap-1.5"
        >
          {phrases[idx]}
          <span className="inline-block w-1 h-3 bg-[#6FC298] animate-pulse" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LIVE TICKER BAR — bottom sticky
// ════════════════════════════════════════════════════════════════════
function LiveTickerBar() {
  const items = EXCHANGES.map((e) => ({
    code: e.shortCode,
    idx: e.mainIndex.name,
    val: e.mainIndex.value,
    pct: e.mainIndex.changePct,
  }));
  const doubled = [...items, ...items];

  return (
    <div
      className="absolute bottom-0 inset-x-0 z-30 overflow-hidden border-t backdrop-blur-xl"
      style={{
        background: "rgba(2,6,10,0.88)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {doubled.map((it, i) => (
          <div key={i} className="flex items-center gap-2 px-5 text-[12px] font-mono">
            <span className="text-[#62666d]">{it.code}</span>
            <span className="text-[#8a8f98]">{it.idx}</span>
            <span className="tabular-nums" style={{ color: "#f7f8f8" }}>{it.val.toLocaleString()}</span>
            <span className="tabular-nums" style={{ color: it.pct >= 0 ? MINT_BRIGHT : "#E5484D" }}>
              {it.pct >= 0 ? "+" : ""}{it.pct}%
            </span>
            <span className="text-[#23252a]">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// REGION CAROUSEL — bottom right corner
// ════════════════════════════════════════════════════════════════════
type Region = "Asia" | "Americas" | "Europe";
function regionOf(e: Exchange): Region {
  if (["nyse", "nasdaq"].includes(e.id)) return "Americas";
  if (["lse"].includes(e.id)) return "Europe";
  return "Asia";
}

function RegionCarousel({ onPick }: { onPick: (r: Region) => void }) {
  const [active, setActive] = useState<Region>("Asia");
  const regions: Region[] = ["Asia", "Americas", "Europe"];
  const labels: Record<Region, string> = { Asia: "亞太", Americas: "美洲", Europe: "歐洲" };

  function pick(r: Region) {
    setActive(r);
    onPick(r);
  }

  return (
    <div
      className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1 rounded-full px-1 py-1"
      style={{
        background: "rgba(2,6,10,0.82)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
      }}
    >
      {regions.map((r) => (
        <button
          key={r}
          onClick={() => pick(r)}
          className="relative px-4 py-1.5 text-[12px] rounded-full transition-colors"
          style={{
            color: active === r ? MINT_BRIGHT : "#8a8f98",
            fontWeight: 510,
          }}
        >
          {active === r && (
            <motion.span
              layoutId="region-bg-v4"
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(78,170,133,0.12)", border: "1px solid rgba(78,170,133,0.25)" }}
              transition={{ type: "spring", damping: 26, stiffness: 380 }}
            />
          )}
          <span className="relative">{labels[r]} · {r}</span>
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DIALOG (unchanged from v3)
// ════════════════════════════════════════════════════════════════════
function ExchangeDialog({ ex, onClose }: { ex: Exchange; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const positive = ex.mainIndex.changePct >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 360 }}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #0f1213 0%, #08090a 100%)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          color: "#f7f8f8",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          aria-label="關閉"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pt-6 pb-4 border-l-2" style={{ borderColor: MINT }}>
          <div className="text-[10px] uppercase tracking-wider text-[#62666d] font-mono mb-1">WHY NOW</div>
          <div className="text-[14px]" style={{ color: "#d0d6e0", lineHeight: 1.55 }}>{ex.whyNow}</div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.06]">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl">{ex.countryFlag}</span>
            <h3 className="text-[20px]" style={{ fontWeight: 590, letterSpacing: "-0.24px" }}>{ex.shortCode}</h3>
            <span className="text-[14px] text-[#8a8f98]">{ex.nameZh}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#8a8f98] font-mono">
            <StatusBadge isOpen={ex.isOpen} />
            <span>{ex.tradingHours}</span>
            <span>· {ex.countdownLabel}</span>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-[#62666d] font-mono mb-2">{ex.mainIndex.name}</div>
          <div className="flex items-baseline gap-3">
            <span className="text-[32px] tabular-nums" style={{ fontWeight: 510, letterSpacing: "-0.704px" }}>
              {ex.mainIndex.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="inline-flex items-center gap-1 text-[14px] tabular-nums" style={{ color: positive ? MINT_BRIGHT : "#E5484D" }}>
              <TrendIcon className="h-4 w-4" />
              {positive ? "+" : ""}{ex.mainIndex.changePct}% ({positive ? "+" : ""}{ex.mainIndex.changePts.toFixed(1)})
            </span>
          </div>
          <div className="mt-2 text-[12px] text-[#8a8f98]">
            成交量 vs 20MA{" "}
            <span style={{ color: ex.volumeVs20MA >= 0 ? MINT_BRIGHT : "#E5484D" }}>
              {ex.volumeVs20MA >= 0 ? "+" : ""}{ex.volumeVs20MA}%
            </span>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-[#62666d] font-mono mb-3">市場訊號</div>
          <div className="space-y-1.5">
            {Object.entries(ex.signalData).map(([k, v]) => (
              <div key={k} className="flex justify-between text-[13px]">
                <span className="text-[#8a8f98]">{k}</span>
                <span className="tabular-nums" style={{ color: "#f7f8f8" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-white/[0.06] grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#62666d] font-mono mb-2">領漲類股</div>
            {ex.topSectors.map((s) => (
              <div key={s.name} className="flex justify-between text-[13px] py-0.5">
                <span className="text-[#d0d6e0]">{s.name}</span>
                <span className="tabular-nums" style={{ color: MINT_BRIGHT }}>+{s.pct}%</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#62666d] font-mono mb-2">領跌類股</div>
            {ex.bottomSectors.map((s) => (
              <div key={s.name} className="flex justify-between text-[13px] py-0.5">
                <span className="text-[#d0d6e0]">{s.name}</span>
                <span className="tabular-nums" style={{ color: "#E5484D" }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-[#62666d] font-mono mb-3">接下來 7 天</div>
          {ex.catalysts.map((c, i) => (
            <div key={i} className="flex gap-3 text-[13px] py-1">
              <span className="font-mono text-[#62666d] w-12">{c.date}</span>
              <span className="text-[#d0d6e0]">{c.title}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 border-t border-white/[0.06] flex gap-2">
          <button
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-[13px]"
            style={{ background: "rgba(78,170,133,0.10)", color: MINT_BRIGHT, border: `1px solid rgba(78,170,133,0.25)` }}
          >
            展開 AI 分析 <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-md px-3 py-2 text-[13px]"
            style={{ background: "rgba(255,255,255,0.02)", color: "#d0d6e0", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            完整市場頁 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function StatusBadge({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px]"
      style={{
        background: isOpen ? "rgba(78,170,133,0.10)" : "rgba(229,72,77,0.10)",
        color: isOpen ? MINT_BRIGHT : "#E5484D",
        border: `1px solid ${isOpen ? "rgba(78,170,133,0.25)" : "rgba(229,72,77,0.25)"}`,
        fontWeight: 510,
      }}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", isOpen && "animate-pulse")}
        style={{ background: isOpen ? MINT_BRIGHT : "#E5484D" }}
      />
      {isOpen ? "開盤中" : "收盤"}
    </span>
  );
}
