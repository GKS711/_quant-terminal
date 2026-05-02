"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const BULL = "#10b981";
const BEAR = "#E5484D";
const MINT = "#6FC298";

interface SparklineProps {
  data: number[];
  /** 漲跌色，自動由 data 判斷（可 override）*/
  color?: string;
  /** 寬高（px）*/
  width?: number;
  height?: number;
  /** 線寬 */
  strokeWidth?: number;
  /** 是否填漸層 */
  filled?: boolean;
  /** 動畫 stagger delay（秒）*/
  delay?: number;
  /** 顯示最末點圓點 */
  showLastDot?: boolean;
}

/**
 * 極輕量 SVG sparkline
 *
 * 視覺：純 path + optional gradient fill + 動畫描繪 path
 * 性能：~30 個點的 polyline，零依賴（不靠 recharts）
 */
export function Sparkline({
  data,
  color,
  width = 120,
  height = 36,
  strokeWidth = 1.5,
  filled = true,
  delay = 0,
  showLastDot = true,
}: SparklineProps) {
  const { pathLine, pathFill, lastX, lastY, autoColor } = useMemo(() => {
    if (data.length < 2) {
      return { pathLine: "", pathFill: "", lastX: 0, lastY: 0, autoColor: MINT };
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);

    const pts = data.map((v, i) => ({
      x: i * stepX,
      y: height - ((v - min) / range) * height,
    }));

    const pathLine = pts.reduce(
      (acc, p, i) => acc + (i === 0 ? `M${p.x},${p.y}` : ` L${p.x},${p.y}`),
      "",
    );
    const pathFill =
      pathLine + ` L${pts[pts.length - 1].x},${height} L0,${height} Z`;

    const trendUp = data[data.length - 1] >= data[0];
    return {
      pathLine,
      pathFill,
      lastX: pts[pts.length - 1].x,
      lastY: pts[pts.length - 1].y,
      autoColor: trendUp ? BULL : BEAR,
    };
  }, [data, width, height]);

  const lineColor = color ?? autoColor;
  const gradientId = useMemo(
    () => `spark-grad-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {filled && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor={lineColor} stopOpacity={0.32} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {filled && (
        <motion.path
          d={pathFill}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.3 }}
        />
      )}
      <motion.path
        d={pathLine}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      {showLastDot && (
        <motion.circle
          cx={lastX}
          cy={lastY}
          r={2.6}
          fill={lineColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: delay + 1.2 }}
        />
      )}
    </svg>
  );
}
