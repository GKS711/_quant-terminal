/**
 * 12 個月回測 mock 資料
 *
 * 模擬 _quant-terminal 系統「策略 vs 大盤」回測結果，
 * 給 Backtest Results section 的 Recharts 折線圖用。
 *
 * 數值經過設計：策略略勝大盤但有合理的回撤，看起來像真實回測（不是一路漲）。
 */

export interface BacktestPoint {
  date: string;          // "2026-01"
  strategy: number;      // 策略累積報酬 %（從 0 開始）
  benchmark: number;     // 加權指數累積報酬 %
  drawdown: number;      // 策略回撤 %（負數）
}

/**
 * 12 個月（2026/04 反推 12 個月 = 2025/05 ~ 2026/04）
 *
 * 設計原則：
 *   - 策略最終 +18.7%（贏大盤 +6.2%）
 *   - 大盤最終 +12.5%
 *   - 中途有 2 次明顯回撤（模擬地緣政治 / 利率事件）
 *   - 策略最大回撤 -7.3%
 *   - 月度走勢看起來自然（不是線性）
 */
export const BACKTEST_DATA: BacktestPoint[] = [
  { date: "2025-05", strategy:  0.0, benchmark:  0.0, drawdown:  0.0 },
  { date: "2025-06", strategy:  3.2, benchmark:  2.1, drawdown:  0.0 },
  { date: "2025-07", strategy:  5.8, benchmark:  4.4, drawdown:  0.0 },
  { date: "2025-08", strategy:  4.1, benchmark:  3.2, drawdown: -1.7 },
  { date: "2025-09", strategy:  7.6, benchmark:  5.8, drawdown:  0.0 },
  { date: "2025-10", strategy: 11.2, benchmark:  8.4, drawdown:  0.0 },
  { date: "2025-11", strategy:  9.5, benchmark:  7.1, drawdown: -1.7 },
  { date: "2025-12", strategy:  8.3, benchmark:  6.5, drawdown: -2.9 },
  { date: "2026-01", strategy:  6.4, benchmark:  4.8, drawdown: -4.8 },
  { date: "2026-02", strategy:  4.1, benchmark:  3.2, drawdown: -7.1 },
  { date: "2026-03", strategy: 12.7, benchmark:  9.5, drawdown:  0.0 },
  { date: "2026-04", strategy: 18.7, benchmark: 12.5, drawdown:  0.0 },
];

// ─── 統計指標卡片 ─────────────────────────────────────────────

export interface BacktestStats {
  totalReturn: number;       // %
  benchmarkReturn: number;   // %
  excessReturn: number;      // % (alpha)
  winRate: number;           // %
  sharpeRatio: number;
  maxDrawdown: number;       // % (negative)
  numTrades: number;
  avgHoldDays: number;
}

export const BACKTEST_STATS: BacktestStats = {
  totalReturn: 18.7,
  benchmarkReturn: 12.5,
  excessReturn: 6.2,
  winRate: 62.5,
  sharpeRatio: 1.84,
  maxDrawdown: -7.3,
  numTrades: 47,
  avgHoldDays: 14,
};

/** 月度勝率（顯示在熱力圖或小圖示）*/
export const MONTHLY_WIN_RATE: { month: string; win: boolean }[] = [
  { month: "2025-05", win: true  },
  { month: "2025-06", win: true  },
  { month: "2025-07", win: true  },
  { month: "2025-08", win: false },
  { month: "2025-09", win: true  },
  { month: "2025-10", win: true  },
  { month: "2025-11", win: false },
  { month: "2025-12", win: false },
  { month: "2026-01", win: true  },
  { month: "2026-02", win: false },
  { month: "2026-03", win: true  },
  { month: "2026-04", win: true  },
];

/** 策略貢獻度（用在策略雷達圖 / 條形圖）*/
export interface StrategyContribution {
  strategyZh: string;
  strategyEn: string;
  contribution: number;  // % of total alpha
}

export const STRATEGY_CONTRIBUTION: StrategyContribution[] = [
  { strategyZh: "均線多頭",     strategyEn: "MA Trend",         contribution: 18.5 },
  { strategyZh: "MACD 黃金交叉", strategyEn: "MACD Crossover",   contribution: 16.2 },
  { strategyZh: "新聞情緒",     strategyEn: "News Sentiment",   contribution: 14.8 },
  { strategyZh: "籌碼分布",     strategyEn: "Volume Profile",   contribution: 11.4 },
  { strategyZh: "RSI 動能",     strategyEn: "RSI Momentum",     contribution:  9.3 },
  { strategyZh: "類股輪動",     strategyEn: "Sector Rotation",  contribution:  8.7 },
  { strategyZh: "VWAP 回歸",    strategyEn: "VWAP Reversion",   contribution:  7.1 },
  { strategyZh: "布林通道",     strategyEn: "Bollinger Band",   contribution:  5.5 },
  { strategyZh: "風險疊加",     strategyEn: "Risk Overlay",     contribution:  4.2 },
  { strategyZh: "艾略特波浪",   strategyEn: "Elliott Wave",     contribution:  3.4 },
  { strategyZh: "多策略共識",   strategyEn: "Consensus",        contribution:  0.9 },
];
