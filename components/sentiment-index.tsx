"use client"

import { cn } from "@/lib/utils"
import { SentimentData } from "@/lib/market-data"

interface SentimentIndexProps {
    data?: SentimentData
}

function getGaugeColor(value: number): string {
    if (value <= 25) return "text-red-500"
    if (value <= 45) return "text-orange-400"
    if (value <= 55) return "text-yellow-400"
    if (value <= 75) return "text-emerald-400"
    return "text-emerald-500"
}

function getFearGreedBg(value: number): string {
    if (value <= 25) return "from-red-500/30 to-red-500/5"
    if (value <= 45) return "from-orange-500/30 to-orange-500/5"
    if (value <= 55) return "from-yellow-500/30 to-yellow-500/5"
    if (value <= 75) return "from-emerald-500/30 to-emerald-500/5"
    return "from-emerald-500/40 to-emerald-500/5"
}

const fallbackData: SentimentData = {
    aaii: { bullish: 33, neutral: 34, bearish: 33 },
    putCall: { ratio: 0.95, avg: 0.95, signal: 'neutral' },
    vix: { current: 0, change: 0 },
    fearGreed: { value: 50, label: 'Neutral' },
}

export function SentimentIndex({ data }: SentimentIndexProps) {
    const { aaii, putCall, vix, fearGreed } = data ?? fallbackData
    const bullBearSpread = aaii.bullish - aaii.bearish

    return (
        <div className="space-y-4">
            {/* Fear & Greed Gauge */}
            <div className={cn("p-4 rounded-lg border border-white/5 bg-gradient-to-br", getFearGreedBg(fearGreed.value))}>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Fear & Greed</span>
                    <span className={cn("text-lg font-black font-mono", getGaugeColor(fearGreed.value))}>
                        {fearGreed.value}
                    </span>
                </div>
                <div className="h-2 bg-zinc-900/50 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-1000"
                        style={{ width: `${fearGreed.value}%` }}
                    />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-zinc-600 mt-1">
                    <span>Extreme Fear</span>
                    <span className={cn("font-bold", getGaugeColor(fearGreed.value))}>{fearGreed.label}</span>
                    <span>Extreme Greed</span>
                </div>
            </div>

            {/* AAII Survey */}
            <div className="p-4 rounded-lg border border-white/5 bg-zinc-900/20">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">AAII Sentiment</span>
                    <span className={cn(
                        "text-[10px] font-mono font-bold",
                        bullBearSpread > 0 ? "text-emerald-400" : "text-red-400"
                    )}>
                        Spread: {bullBearSpread > 0 ? '+' : ''}{bullBearSpread.toFixed(1)}%
                    </span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-500 w-14">Bulls</span>
                        <div className="flex-1 h-4 bg-zinc-900/50 rounded overflow-hidden">
                            <div className="h-full bg-emerald-500/50 rounded flex items-center pl-2" style={{ width: `${aaii.bullish}%` }}>
                                <span className="text-[9px] font-mono font-bold text-white">{aaii.bullish}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-500 w-14">Neutral</span>
                        <div className="flex-1 h-4 bg-zinc-900/50 rounded overflow-hidden">
                            <div className="h-full bg-zinc-500/30 rounded flex items-center pl-2" style={{ width: `${aaii.neutral}%` }}>
                                <span className="text-[9px] font-mono font-bold text-zinc-300">{aaii.neutral}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-500 w-14">Bears</span>
                        <div className="flex-1 h-4 bg-zinc-900/50 rounded overflow-hidden">
                            <div className="h-full bg-red-500/50 rounded flex items-center pl-2" style={{ width: `${aaii.bearish}%` }}>
                                <span className="text-[9px] font-mono font-bold text-white">{aaii.bearish}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-white/5 bg-zinc-900/20">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Put/Call Ratio</span>
                    <div className="flex items-end gap-2">
                        <span className={cn(
                            "text-xl font-black font-mono",
                            putCall.ratio < putCall.avg ? "text-emerald-400" : "text-red-400"
                        )}>
                            {putCall.ratio.toFixed(2)}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600 mb-1">avg: {putCall.avg.toFixed(2)}</span>
                    </div>
                    <span className={cn(
                        "text-[9px] font-mono font-bold uppercase",
                        putCall.signal === 'bullish' ? "text-emerald-400" : putCall.signal === 'bearish' ? "text-red-400" : "text-zinc-400"
                    )}>
                        {putCall.signal}
                    </span>
                </div>
                <div className="p-3 rounded-lg border border-white/5 bg-zinc-900/20">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">VIX</span>
                    <div className="flex items-end gap-2">
                        <span className="text-xl font-black font-mono text-zinc-200">
                            {vix.current > 0 ? vix.current : '—'}
                        </span>
                        {vix.current > 0 && (
                            <span className={cn(
                                "text-[10px] font-mono font-bold mb-1",
                                vix.change < 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                                {vix.change > 0 ? '+' : ''}{vix.change.toFixed(1)}
                            </span>
                        )}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600">
                        {vix.current < 15 ? 'Low Volatility' : vix.current < 20 ? 'Normal' : vix.current < 25 ? 'Elevated' : 'High Volatility'}
                    </span>
                </div>
            </div>
        </div>
    )
}
