"use client";

import { motion } from "framer-motion";
import { Github, ArrowUpRight, Star, GitFork, Eye } from "lucide-react";

const MINT = "#4EAA85";
const MINT_BRIGHT = "#6FC298";

/**
 * GitHub CTA — 取代 pricing.tsx，引導訪客查看真實程式碼
 *
 * 風格：與 cta.tsx 類似但訊息聚焦「查看 source code」而非「升級訂閱」
 */
export function GithubCta() {
  return (
    <section className="relative py-24" style={{ background: "#08090a" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background:
              `linear-gradient(135deg, ${MINT}1a 0%, ${MINT}0a 60%, transparent 100%), ` +
              "linear-gradient(180deg, #0f1213 0%, #0a0c10 100%)",
            border: `1px solid ${MINT}33`,
            boxShadow: `0 30px 80px -20px ${MINT}25, inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}
        >
          {/* dot grid bg */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 px-8 sm:px-14 py-14 sm:py-16">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#62666d] mb-3">
              <Github className="h-3 w-3" style={{ color: MINT_BRIGHT }} />
              <span>Open source · MIT License</span>
            </div>

            <h2
              className="text-[40px] sm:text-[56px] leading-[1.05] tracking-[-0.045em] text-white max-w-[760px]"
              style={{ fontWeight: 510 }}
            >
              想看 source code？
              <span style={{ color: MINT_BRIGHT }} className="italic font-normal"> 全在 GitHub。</span>
            </h2>
            <p className="mt-5 text-[16px] sm:text-[17px] leading-[1.6] max-w-[640px]" style={{ color: "#c8d0dc" }}>
              整套系統 100% 開源：FastAPI 後端、11 個策略分析器、Litellm 抽象層、多通道推送、GitHub Actions 排程。Fork 一份每天免費跑你自己的台股分析。
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/GKS711/daily_stock_analysis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-[15px]"
                style={{
                  background: MINT,
                  color: "#08090a",
                  fontWeight: 590,
                  boxShadow: `0 0 0 1px ${MINT}66, 0 14px 40px -10px ${MINT}66`,
                }}
              >
                <Github className="h-4 w-4" />
                看 GitHub Repo
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href="https://github.com/GKS711/daily_stock_analysis#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-[15px]"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  color: "#d0d6e0",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                讀 README
              </a>
            </div>

            {/* Quick facts */}
            <div className="mt-10 flex flex-wrap gap-6 text-[12px] font-mono">
              <FactItem icon={<Star className="h-3.5 w-3.5" />}     label="Stars"   value="open source" />
              <FactItem icon={<GitFork className="h-3.5 w-3.5" />}  label="Fork-ready" value="MIT license" />
              <FactItem icon={<Eye className="h-3.5 w-3.5" />}      label="自動執行"   value="GitHub Actions" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[#a8a8b3]">
      <span style={{ color: MINT_BRIGHT }}>{icon}</span>
      <span className="text-[#62666d] uppercase tracking-wider">{label}</span>
      <span className="text-[#d0d6e0]">{value}</span>
    </span>
  );
}
