"use client";

import { useEffect, useRef } from "react";
import { createChart, type IChartApi, type ISeriesApi, type Time, CandlestickSeries, LineSeries } from "lightweight-charts";

const MINT_BRIGHT = "#6FC298";
const BULL = "#10b981";
const BEAR = "#E5484D";

interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface KlineChartProps {
  /** 30 個收盤價（從 portfolio.spark30d）*/
  closes: number[];
  /** 圖表高度 px */
  height?: number;
  /** 是否顯示 MA(5) 跟 MA(20) */
  showMA?: boolean;
}

/**
 * Lightweight-Charts K 線
 *
 * 用 portfolio.ts 內的 30 日 closes 推算 OHLC（mock 簡單算法：
 *   open = 前日 close
 *   high = max(open, close) * (1 + 隨機小幅)
 *   low  = min(open, close) * (1 - 隨機小幅)
 *
 * 用真實 API 拿到日 OHLC 後可直接替換 derive 函式。
 */
export function KlineChart({ closes, height = 280, showMA = true }: KlineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || closes.length < 2) return;

    const chart: IChartApi = createChart(el, {
      width: el.clientWidth,
      height,
      layout: {
        background: { color: "transparent" },
        textColor: "#a8a8b3",
        fontFamily: 'ui-monospace, "Geist Mono", monospace',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)", style: 0 },
        horzLines: { color: "rgba(255,255,255,0.04)", style: 0 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        rightOffset: 4,
        secondsVisible: false,
      },
      rightPriceScale: { borderVisible: false },
      crosshair: {
        vertLine: { color: "rgba(255,255,255,0.10)", width: 1, style: 0 },
        horzLine: { color: "rgba(255,255,255,0.10)", width: 1, style: 0 },
      },
      handleScroll: false,
      handleScale: false,
    });

    // 推算 OHLC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const data: CandleData[] = closes.map((close, i) => {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - (closes.length - 1 - i));
      const prev = i === 0 ? close : closes[i - 1];
      const seed = Math.sin(i * 1.7 + close) * 0.5 + 0.5; // 0..1
      const swing = close * 0.012 * seed;
      const open = prev;
      const max = Math.max(open, close);
      const min = Math.min(open, close);
      const high = max + swing;
      const low = min - swing * 0.8;
      return {
        time: (d.getTime() / 1000) as Time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      };
    });

    const candleSeries: ISeriesApi<"Candlestick"> = chart.addSeries(CandlestickSeries, {
      upColor: BULL,
      downColor: BEAR,
      wickUpColor: BULL,
      wickDownColor: BEAR,
      borderVisible: false,
    });
    candleSeries.setData(data);

    if (showMA) {
      const ma5 = computeMA(data, 5);
      const ma20 = computeMA(data, 20);

      const ma5Series = chart.addSeries(LineSeries, {
        color: MINT_BRIGHT,
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      ma5Series.setData(ma5);

      const ma20Series = chart.addSeries(LineSeries, {
        color: "#FCD34D",
        lineWidth: 1,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      ma20Series.setData(ma20);
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (el) chart.applyOptions({ width: el.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [closes, height, showMA]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full" style={{ height }} />
      {showMA && (
        <div
          className="absolute top-2 left-3 flex gap-3 text-[10px] font-mono pointer-events-none"
          style={{ color: "#62666d" }}
        >
          <span style={{ color: MINT_BRIGHT }}>— MA5</span>
          <span style={{ color: "#FCD34D" }}>— MA20</span>
        </div>
      )}
    </div>
  );
}

function computeMA(data: CandleData[], period: number): { time: Time; value: number }[] {
  const out: { time: Time; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
    out.push({ time: data[i].time, value: Number((sum / period).toFixed(2)) });
  }
  return out;
}
