"use client"

"use client"

import { useState, useEffect } from "react"
import { MarketAnalyticsData } from "@/lib/market-data"
import { SectorHeatmap } from "@/components/sector-heatmap"
import { LiquidityMap } from "@/components/liquidity-map"
import { SeasonalityChart } from "@/components/seasonality-chart"
import { SentimentIndex } from "@/components/sentiment-index"
import { Grid3X3, MapPin, CalendarRange, Gauge, Info, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsClientProps {
    analytics: MarketAnalyticsData
}

type AnalyticsPanels = {
    heatmap: boolean
    liquidity: boolean
    seasonality: boolean
    sentiment: boolean
}

const panelGuides: Record<string, { title: string; bullets: string[] }> = {
    heatmap: {
        title: "How to use Sector Heatmap",
        bullets: [
            "Green = sector gaining, Red = sector losing — size reflects S&P 500 weight.",
            "If Tech (XLK) is strong while rest is flat → narrow rally, be cautious on ES longs.",
            "If most sectors are green → broad risk-on environment, favorable for long ES/NQ.",
            "Use for confluence: news says bullish but heatmap is deep red? Wait for confirmation.",
        ],
    },
    liquidity: {
        title: "How to use Liquidity Map",
        bullets: [
            "Call Wall = heavy resistance, price unlikely to go above without catalyst.",
            "Put Wall = strong support, high gamma means dealers stabilize price here.",
            "Vol Trigger = below this, volatility expands (dealers flip from dampening to amplifying moves).",
            "Use as targets: take profit near walls, tighten stops near vol trigger.",
        ],
    },
    seasonality: {
        title: "How to use Seasonality",
        bullets: [
            "Blue bar = current month. Green = historically positive, Red = negative.",
            "September is typically the worst month — be defensive. November/April strongest.",
            "Don't trade AGAINST seasonality unless you have strong conviction.",
            "Combine with sentiment: if Sep is bearish + sentiment is extreme greed → high risk.",
        ],
    },
    sentiment: {
        title: "How to use Sentiment Index",
        bullets: [
            "Fear & Greed ≤ 25 (Extreme Fear) = contrarian buy signal. ≥ 75 (Extreme Greed) = caution.",
            "AAII Spread > +20% bullish = market may be overextended. Negative spread = capitulation.",
            "Put/Call < 0.80 = complacency (bearish signal). > 1.10 = fear (bullish contrarian).",
            "VIX < 15 = low vol, sell premium. VIX > 25 = high vol, look for mean reversion.",
        ],
    },
}

const panelConfig = [
    { key: "heatmap" as const, label: "Sector Heatmap", icon: Grid3X3, subtitle: "S&P 500 • Live" },
    { key: "liquidity" as const, label: "Liquidity Map (Demo)", icon: MapPin, subtitle: "Gamma Levels • Estimated" },
    { key: "seasonality" as const, label: "Seasonality", icon: CalendarRange, subtitle: "ES / NQ • Live" },
    { key: "sentiment" as const, label: "Sentiment Index", icon: Gauge, subtitle: "Market Internals • Live" },
]

export function AnalyticsClient({ analytics }: AnalyticsClientProps) {
    const [panels, setPanels] = useState<AnalyticsPanels>({
        heatmap: true,
        liquidity: true,
        seasonality: true,
        sentiment: true,
    })

    // Load panel state from local storage on mount
    useEffect(() => {
        const savedPanels = localStorage.getItem("analytics-panels")
        if (savedPanels) {
            try {
                const parsed = JSON.parse(savedPanels)
                setPanels(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                console.error("Failed to parse saved analytics panel state")
            }
        }
    }, [])

    // Save panel state to local storage on change
    useEffect(() => {
        localStorage.setItem("analytics-panels", JSON.stringify(panels))
    }, [panels])

    const togglePanel = (key: keyof AnalyticsPanels) => {
        setPanels(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="space-y-10">
            {/* Toggle Bar */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mr-2">Show:</span>
                {panelConfig.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => togglePanel(key)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition-all duration-200",
                            panels[key]
                                ? "bg-primary/5 border-primary/20 text-zinc-300"
                                : "bg-zinc-900/20 border-white/5 text-zinc-500 hover:bg-zinc-900/40"
                        )}
                    >
                        <Icon className="w-3 h-3" />
                        {label}
                        {panels[key] ? <Eye className="w-3 h-3 text-primary" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                ))}
            </div>

            {/* Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {panels.heatmap && (
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Grid3X3 className="w-4 h-4 text-primary/70" />
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Sector Heatmap</h3>
                            <span className="text-[9px] font-mono text-zinc-600 ml-auto">S&P 500 • Live</span>
                        </div>
                        <SectorHeatmap data={analytics.sectors} />
                        <PanelGuide panelKey="heatmap" />
                    </div>
                )}

                {panels.liquidity && (
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary/70" />
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Liquidity Map (Demo)</h3>
                            <span className="text-[9px] font-mono text-zinc-600 ml-auto">Gamma Levels • Estimated</span>
                        </div>
                        <LiquidityMap />
                        <PanelGuide panelKey="liquidity" />
                    </div>
                )}

                {panels.seasonality && (
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarRange className="w-4 h-4 text-primary/70" />
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Seasonality</h3>
                            <span className="text-[9px] font-mono text-zinc-600 ml-auto">ES / NQ • Live</span>
                        </div>
                        <SeasonalityChart data={analytics.seasonality} />
                        <PanelGuide panelKey="seasonality" />
                    </div>
                )}

                {panels.sentiment && (
                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Gauge className="w-4 h-4 text-primary/70" />
                            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Sentiment Index</h3>
                            <span className="text-[9px] font-mono text-zinc-600 ml-auto">Market Internals • Live</span>
                        </div>
                        <SentimentIndex data={analytics.sentiment} />
                        <PanelGuide panelKey="sentiment" />
                    </div>
                )}
            </div>

            {/* Empty state */}
            {!panels.heatmap && !panels.liquidity && !panels.seasonality && !panels.sentiment && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                    <Eye className="w-8 h-8 mb-3 opacity-30" />
                    <p className="text-sm font-mono">All panels hidden. Use toggles above to show them.</p>
                </div>
            )}
        </div>
    )
}

function PanelGuide({ panelKey }: { panelKey: string }) {
    const guide = panelGuides[panelKey]
    if (!guide) return null

    return (
        <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
                <Info className="w-3.5 h-3.5 text-primary/50" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{guide.title}</span>
            </div>
            <ul className="space-y-2">
                {guide.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed">
                        <span className="text-primary/40 mt-0.5 shrink-0">▸</span>
                        <span>{bullet}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
