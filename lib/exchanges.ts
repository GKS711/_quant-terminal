/**
 * 9 個全球主要交易所 — 每日股市儀表板 地球儀 hotspot 資料
 * 數值為示範資料（mock）。lat/lng 用於 react-globe.gl 在球面定位。
 */

export type SignalType =
  | "TW_INSTITUTIONAL"  // 三大法人
  | "CN_NORTHBOUND"     // 北向資金
  | "HK_SOUTHBOUND"     // 南向資金
  | "US_VIX_PCR"        // VIX + Put/Call
  | "JP_FOREIGN"        // 外資現貨買賣
  | "UK_FTSE_BREADTH"   // FTSE100 vs FTSE250
  | "IN_FII"            // FII 流向
  | "AU_SECTOR_ROT";    // 礦業 vs 金融輪動

export interface Exchange {
  id: string;
  shortCode: string;
  nameZh: string;
  nameEn: string;
  city: string;
  countryFlag: string;
  lat: number;
  lng: number;
  timezone: string;     // IANA tz
  tradingHours: string; // local
  currency: string;

  isOpen: boolean;
  countdownLabel: string; // "剩 4h12m" or "距下次開盤 18h"

  mainIndex: { name: string; value: number; changePct: number; changePts: number };
  volumeVs20MA: number;  // % over 20-day MA, e.g. +12 means +12%

  signalType: SignalType;
  signalData: Record<string, string | number>;

  topSectors: { name: string; pct: number }[]; // top 3 winners
  bottomSectors: { name: string; pct: number }[]; // top 3 losers

  catalysts: { date: string; title: string }[];

  whyNow: string;
}

export const EXCHANGES: Exchange[] = [
  {
    id: "twse",
    shortCode: "TWSE",
    nameZh: "臺灣證券交易所",
    nameEn: "Taiwan Stock Exchange",
    city: "Taipei",
    countryFlag: "🇹🇼",
    lat: 25.0330, lng: 121.5654,
    timezone: "Asia/Taipei",
    tradingHours: "09:00–13:30",
    currency: "TWD",
    isOpen: true,
    countdownLabel: "剩 2h 47m",
    mainIndex: { name: "加權指數", value: 22580.45, changePct: 0.84, changePts: 188.6 },
    volumeVs20MA: 12,
    signalType: "TW_INSTITUTIONAL",
    signalData: { foreign: "+84 億", trust: "+12 億", proprietary: "−3 億" },
    topSectors: [
      { name: "半導體", pct: 2.1 },
      { name: "AI 概念", pct: 1.8 },
      { name: "電動車", pct: 1.4 },
    ],
    bottomSectors: [
      { name: "觀光", pct: -0.8 },
      { name: "傳產", pct: -0.6 },
      { name: "金融", pct: -0.2 },
    ],
    catalysts: [
      { date: "5/12", title: "台積電 Q1 法說" },
      { date: "5/14", title: "央行理監事會議" },
      { date: "5/16", title: "加權指數除息高峰" },
    ],
    whyNow: "半導體財報季開跑，外資轉買 NT$84 億",
  },
  {
    id: "nyse",
    shortCode: "NYSE",
    nameZh: "紐約證券交易所",
    nameEn: "New York Stock Exchange",
    city: "New York",
    countryFlag: "🇺🇸",
    lat: 40.7069, lng: -74.0113,
    timezone: "America/New_York",
    tradingHours: "09:30–16:00",
    currency: "USD",
    isOpen: false,
    countdownLabel: "距開盤 18h 22m",
    mainIndex: { name: "S&P 500", value: 5847.23, changePct: -0.27, changePts: -15.8 },
    volumeVs20MA: -4,
    signalType: "US_VIX_PCR",
    signalData: { VIX: 14.8, "Put/Call": 0.92 },
    topSectors: [
      { name: "Energy", pct: 0.6 },
      { name: "Utilities", pct: 0.4 },
      { name: "Healthcare", pct: 0.3 },
    ],
    bottomSectors: [
      { name: "Tech", pct: -1.1 },
      { name: "Comms", pct: -0.9 },
      { name: "Discretionary", pct: -0.5 },
    ],
    catalysts: [
      { date: "5/12", title: "FOMC 會議紀要" },
      { date: "5/14", title: "Walmart 財報" },
      { date: "5/15", title: "CPI 公布" },
    ],
    whyNow: "VIX 維持低位，市場進入財報整理期",
  },
  {
    id: "nasdaq",
    shortCode: "NASDAQ",
    nameZh: "那斯達克",
    nameEn: "NASDAQ",
    city: "New York",
    countryFlag: "🇺🇸",
    lat: 40.7589, lng: -73.9851, // slight offset from NYSE
    timezone: "America/New_York",
    tradingHours: "09:30–16:00",
    currency: "USD",
    isOpen: false,
    countdownLabel: "距開盤 18h 22m",
    mainIndex: { name: "NASDAQ 100", value: 18165.42, changePct: -0.41, changePts: -74.7 },
    volumeVs20MA: 6,
    signalType: "US_VIX_PCR",
    signalData: { VIX: 14.8, "Put/Call": 0.92 },
    topSectors: [
      { name: "Biotech", pct: 1.2 },
      { name: "Semis (def.)", pct: 0.8 },
      { name: "EVs", pct: 0.5 },
    ],
    bottomSectors: [
      { name: "Mega Cap Tech", pct: -1.4 },
      { name: "Cloud", pct: -0.9 },
      { name: "Streaming", pct: -0.6 },
    ],
    catalysts: [
      { date: "5/13", title: "NVDA 財報" },
      { date: "5/15", title: "TSLA AI Day" },
      { date: "5/16", title: "AMZN 法說" },
    ],
    whyNow: "Mega-cap 拉回，Biotech 與半導體輪漲",
  },
  {
    id: "hkex",
    shortCode: "HKEX",
    nameZh: "香港交易所",
    nameEn: "Hong Kong Exchanges",
    city: "Hong Kong",
    countryFlag: "🇭🇰",
    lat: 22.2855, lng: 114.1577,
    timezone: "Asia/Hong_Kong",
    tradingHours: "09:30–16:00",
    currency: "HKD",
    isOpen: true,
    countdownLabel: "剩 5h 12m",
    mainIndex: { name: "恒生指數", value: 19842.6, changePct: 1.25, changePts: 245.1 },
    volumeVs20MA: 18,
    signalType: "HK_SOUTHBOUND",
    signalData: { Northbound: "+62 億 RMB", Southbound: "+38 億 HKD" },
    topSectors: [
      { name: "互聯網", pct: 2.4 },
      { name: "新能源", pct: 1.9 },
      { name: "醫藥", pct: 1.1 },
    ],
    bottomSectors: [
      { name: "地產", pct: -1.2 },
      { name: "保險", pct: -0.5 },
      { name: "電信", pct: -0.3 },
    ],
    catalysts: [
      { date: "5/13", title: "Tencent 財報" },
      { date: "5/14", title: "中國 4 月 PMI" },
      { date: "5/16", title: "美團法說" },
    ],
    whyNow: "南向資金回流，互聯網板塊領漲",
  },
  {
    id: "jpx",
    shortCode: "JPX",
    nameZh: "東京證券交易所",
    nameEn: "Japan Exchange Group",
    city: "Tokyo",
    countryFlag: "🇯🇵",
    lat: 35.6812, lng: 139.7671,
    timezone: "Asia/Tokyo",
    tradingHours: "09:00–15:00",
    currency: "JPY",
    isOpen: true,
    countdownLabel: "剩 4h 18m",
    mainIndex: { name: "日經 225", value: 38245.7, changePct: 0.62, changePts: 235.4 },
    volumeVs20MA: 8,
    signalType: "JP_FOREIGN",
    signalData: { 外資現貨: "+1,820 億 JPY", 期貨: "−420 億" },
    topSectors: [
      { name: "半導體裝置", pct: 1.6 },
      { name: "汽車", pct: 1.2 },
      { name: "機械", pct: 0.9 },
    ],
    bottomSectors: [
      { name: "不動產", pct: -0.4 },
      { name: "電力", pct: -0.3 },
      { name: "陸運", pct: -0.2 },
    ],
    catalysts: [
      { date: "5/13", title: "東京威力科創財報" },
      { date: "5/15", title: "BoJ 點陣圖" },
      { date: "5/16", title: "日銀短觀數據" },
    ],
    whyNow: "外資連 5 日買超日股，日經逼近年高",
  },
  {
    id: "lse",
    shortCode: "LSE",
    nameZh: "倫敦證券交易所",
    nameEn: "London Stock Exchange",
    city: "London",
    countryFlag: "🇬🇧",
    lat: 51.5155, lng: -0.0922,
    timezone: "Europe/London",
    tradingHours: "08:00–16:30",
    currency: "GBP",
    isOpen: false,
    countdownLabel: "距開盤 11h 8m",
    mainIndex: { name: "FTSE 100", value: 8245.6, changePct: 0.18, changePts: 14.8 },
    volumeVs20MA: -2,
    signalType: "UK_FTSE_BREADTH",
    signalData: { "FTSE 100 vs 250": "+0.18% / +0.42%" },
    topSectors: [
      { name: "Mining", pct: 1.4 },
      { name: "Oil & Gas", pct: 0.9 },
      { name: "Banks", pct: 0.6 },
    ],
    bottomSectors: [
      { name: "Pharma", pct: -0.7 },
      { name: "Telecom", pct: -0.4 },
      { name: "Retail", pct: -0.3 },
    ],
    catalysts: [
      { date: "5/12", title: "BoE 利率決議" },
      { date: "5/14", title: "GDP 初值" },
      { date: "5/16", title: "Vodafone 法說" },
    ],
    whyNow: "FTSE 250 強過 100，中型股風險偏好回升",
  },
  {
    id: "sse",
    shortCode: "SSE",
    nameZh: "上海證券交易所",
    nameEn: "Shanghai Stock Exchange",
    city: "Shanghai",
    countryFlag: "🇨🇳",
    lat: 31.2304, lng: 121.4737,
    timezone: "Asia/Shanghai",
    tradingHours: "09:30–15:00",
    currency: "CNY",
    isOpen: true,
    countdownLabel: "剩 3h 22m",
    mainIndex: { name: "上證指數", value: 3164.8, changePct: 0.92, changePts: 28.9 },
    volumeVs20MA: 22,
    signalType: "CN_NORTHBOUND",
    signalData: { Northbound: "+62 億 RMB", Southbound: "+38 億" },
    topSectors: [
      { name: "白酒", pct: 2.8 },
      { name: "新能源車", pct: 2.1 },
      { name: "半導體", pct: 1.6 },
    ],
    bottomSectors: [
      { name: "房地產", pct: -1.5 },
      { name: "鋼鐵", pct: -0.8 },
      { name: "煤炭", pct: -0.4 },
    ],
    catalysts: [
      { date: "5/12", title: "4 月社融數據" },
      { date: "5/15", title: "央行 LPR" },
      { date: "5/16", title: "工業增加值" },
    ],
    whyNow: "北向資金 5 日連買，消費 + 新能源輪動",
  },
  {
    id: "asx",
    shortCode: "ASX",
    nameZh: "澳洲證券交易所",
    nameEn: "Australian Securities Exchange",
    city: "Sydney",
    countryFlag: "🇦🇺",
    lat: -33.8688, lng: 151.2093,
    timezone: "Australia/Sydney",
    tradingHours: "10:00–16:00",
    currency: "AUD",
    isOpen: false,
    countdownLabel: "距開盤 22h 14m",
    mainIndex: { name: "ASX 200", value: 7942.4, changePct: 0.34, changePts: 27.0 },
    volumeVs20MA: 4,
    signalType: "AU_SECTOR_ROT",
    signalData: { 礦業: "+1.2%", 金融: "−0.4%", 趨勢: "資金流向礦業" },
    topSectors: [
      { name: "Mining", pct: 1.2 },
      { name: "Energy", pct: 0.8 },
      { name: "Utilities", pct: 0.5 },
    ],
    bottomSectors: [
      { name: "Banks", pct: -0.4 },
      { name: "Tech", pct: -0.3 },
      { name: "Real Estate", pct: -0.2 },
    ],
    catalysts: [
      { date: "5/13", title: "RBA 紀要" },
      { date: "5/15", title: "失業率" },
      { date: "5/16", title: "BHP 季報" },
    ],
    whyNow: "鐵礦砂價反彈，資金從金融輪動到礦業",
  },
  {
    id: "bse",
    shortCode: "BSE",
    nameZh: "孟買證券交易所",
    nameEn: "Bombay Stock Exchange",
    city: "Mumbai",
    countryFlag: "🇮🇳",
    lat: 19.0760, lng: 72.8777,
    timezone: "Asia/Kolkata",
    tradingHours: "09:15–15:30",
    currency: "INR",
    isOpen: true,
    countdownLabel: "剩 1h 32m",
    mainIndex: { name: "SENSEX", value: 75428.6, changePct: 1.12, changePts: 838.4 },
    volumeVs20MA: 14,
    signalType: "IN_FII",
    signalData: { FII: "+2,340 Cr", DII: "+1,180 Cr" },
    topSectors: [
      { name: "IT Services", pct: 1.8 },
      { name: "Pharma", pct: 1.4 },
      { name: "Banks", pct: 1.1 },
    ],
    bottomSectors: [
      { name: "FMCG", pct: -0.4 },
      { name: "Auto", pct: -0.3 },
      { name: "Power", pct: -0.2 },
    ],
    catalysts: [
      { date: "5/13", title: "Infosys Q4" },
      { date: "5/14", title: "WPI 通膨" },
      { date: "5/16", title: "RBI 紀要" },
    ],
    whyNow: "FII 連 3 日買超，IT 服務帶領大盤",
  },
];
