"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, User2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "model"; text: string };

const SUGGESTIONS = [
  "2330 現在該追嗎？",
  "AI 伺服器類股還能買嗎？",
  "解釋一下 MACD 黃金交叉",
  "高股息 ETF 要怎麼選？",
];

export function AiDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "model",
      text: "你好。我是接到 _quant-terminal 系統的 AI 顧問。可以問 12 檔個股 / 11 策略 / 投資觀念。",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const next: Msg[] = [...messages, { role: "user", text: trimmed }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "model", text: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: next.slice(0, -1).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "model", text: acc };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "model",
          text: "抱歉，AI 顧問目前離線，請稍後再試。",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <section id="advisor" className="section-y">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <Badge>
              <Sparkles className="h-3 w-3" />
              Live Demo
            </Badge>
            <h2 className="mt-4 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink-50 font-light">
              和組合對話，<br/>
              <span className="italic text-mint-300">不再盯試算表。</span>
            </h2>
            <p className="mt-4 text-ink-300 text-[15px] leading-relaxed max-w-[420px]">
              真打 <span className="text-ink-50">Gemma 4 31B</span>，token 逐字串流。沒 key 自動切 mock。
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-ink-800/70 backdrop-blur-xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-mint-400 text-ink-900">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-[13px] text-ink-50 leading-tight">AI 顧問</div>
                  <div className="text-[11px] text-ink-400 font-mono">gemma-4-31b-it</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-mint-300">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-400 animate-pulse-soft" />
                線上
              </span>
            </div>

            <div
              ref={scrollerRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-busy={streaming}
              aria-label="AI 顧問對話歷史"
              className="thin-scroll h-[360px] overflow-y-auto px-5 py-5 space-y-4"
            >
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} streaming={streaming && i === messages.length - 1 && m.role === "model"} />
              ))}
            </div>

            <div className="px-3 pb-3 pt-2 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-1.5 px-2 pb-2.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    disabled={streaming}
                    onClick={() => send(s)}
                    className="text-[11.5px] text-ink-300 hover:text-ink-50 px-2.5 py-1 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                className="flex items-end gap-2 rounded-xl bg-ink-900/80 border border-white/[0.06] px-3 py-2 focus-within:border-mint-400/40 transition-colors"
                onSubmit={(e) => { e.preventDefault(); send(input); }}
              >
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="向 AI 顧問提問⋯⋯"
                  className="flex-1 resize-none bg-transparent outline-none text-[14.5px] text-ink-50 placeholder:text-ink-400 max-h-32"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mint-400 text-ink-900 disabled:bg-white/[0.06] disabled:text-ink-400 transition-colors"
                  aria-label="送出"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </form>
              <p className="px-2 pt-2 text-[11px] text-ink-400">
                僅為 Demo，非投資建議。訊息會送到 Gemma 4 31B 推論，伺服器端不留 log。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bubble({ role, text, streaming }: { role: "user" | "model"; text: string; streaming?: boolean }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-md",
          isUser ? "bg-white/[0.06] text-ink-50" : "bg-mint-400 text-ink-900",
        )}
      >
        {isUser ? <User2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </span>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-mint-400 text-ink-900 rounded-tr-sm"
            : "bg-white/[0.04] text-ink-50 rounded-tl-sm border border-white/[0.05]",
        )}
      >
        {text}
        {streaming && <span className="inline-block w-1.5 h-3.5 align-text-bottom ml-0.5 bg-mint-300 animate-pulse-soft" />}
      </div>
    </div>
  );
}
