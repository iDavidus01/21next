"use client"

import { cn } from "@/lib/utils"
import { SectorData } from "@/lib/market-data"

interface SectorHeatmapProps {
    data?: SectorData[]
}

const fallbackSectors: SectorData[] = [
    { name: "Technology", ticker: "XLK", change: 0, weight: 32 },
    { name: "Healthcare", ticker: "XLV", change: 0, weight: 13 },
    { name: "Financials", ticker: "XLF", change: 0, weight: 12 },
    { name: "Consumer Disc.", ticker: "XLY", change: 0, weight: 10 },
    { name: "Communication", ticker: "XLC", change: 0, weight: 9 },
    { name: "Industrials", ticker: "XLI", change: 0, weight: 8 },
    { name: "Consumer Stap.", ticker: "XLP", change: 0, weight: 6 },
    { name: "Energy", ticker: "XLE", change: 0, weight: 4 },
    { name: "Utilities", ticker: "XLU", change: 0, weight: 3 },
    { name: "Real Estate", ticker: "XLRE", change: 0, weight: 2 },
    { name: "Materials", ticker: "XLB", change: 0, weight: 1 },
]

function getHeatColor(change: number): string {
    if (change > 1) return "bg-emerald-500/80 text-white"
    if (change > 0.5) return "bg-emerald-500/50 text-emerald-100"
    if (change > 0) return "bg-emerald-500/25 text-emerald-200"
    if (change === 0) return "bg-zinc-700/30 text-zinc-400"
    if (change > -0.5) return "bg-red-500/25 text-red-200"
    if (change > -1) return "bg-red-500/50 text-red-100"
    return "bg-red-500/80 text-white"
}

export function SectorHeatmap({ data }: SectorHeatmapProps) {
    const sectors = data && data.length > 0 ? data : fallbackSectors
    const maxWeight = Math.max(...sectors.map(s => s.weight))

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
                {sectors.map((sector) => {
                    const relSize = Math.max(sector.weight / maxWeight, 0.3)
                    return (
                        <div
                            key={sector.ticker}
                            className={cn(
                                "rounded-lg p-2 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 cursor-default border border-white/5",
                                getHeatColor(sector.change),
                                sector.weight > 10 ? "col-span-2 row-span-2" : sector.weight > 6 ? "col-span-2" : ""
                            )}
                            style={{ minHeight: `${50 + relSize * 40}px` }}
                        >
                            <span className="text-[10px] font-bold tracking-wider opacity-70">{sector.ticker}</span>
                            <span className="text-xs font-mono font-bold mt-0.5">
                                {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}%
                            </span>
                            {sector.weight > 6 && (
                                <span className="text-[9px] opacity-50 mt-0.5">{sector.name}</span>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-600 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-2 rounded-sm bg-red-500/80" />
                    <span>Bearish</span>
                </div>
                <span>S&P 500 Sector Performance • Live</span>
                <div className="flex items-center gap-2">
                    <span>Bullish</span>
                    <div className="w-3 h-2 rounded-sm bg-emerald-500/80" />
                </div>
            </div>
        </div>
    )
}
