"use client"

import { cn } from "@/lib/utils"
import { SeasonalityData } from "@/lib/market-data"

interface SeasonalityChartProps {
    data?: SeasonalityData[]
}

const fallbackData: SeasonalityData[] = [
    { month: "Jan", es: 0, nq: 0 }, { month: "Feb", es: 0, nq: 0 },
    { month: "Mar", es: 0, nq: 0 }, { month: "Apr", es: 0, nq: 0 },
    { month: "May", es: 0, nq: 0 }, { month: "Jun", es: 0, nq: 0 },
    { month: "Jul", es: 0, nq: 0 }, { month: "Aug", es: 0, nq: 0 },
    { month: "Sep", es: 0, nq: 0 }, { month: "Oct", es: 0, nq: 0 },
    { month: "Nov", es: 0, nq: 0 }, { month: "Dec", es: 0, nq: 0 },
]

function getCurrentMonth() {
    return new Date().toLocaleString('en-US', { month: 'short' })
}

export function SeasonalityChart({ data }: SeasonalityChartProps) {
    const monthlyData = data && data.length > 0 ? data : fallbackData
    const maxVal = Math.max(...monthlyData.flatMap(d => [Math.abs(d.es), Math.abs(d.nq)]), 0.1)
    const currentMonth = getCurrentMonth()

    return (
        <div className="space-y-4">
            {/* ES Chart */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">ES (S&P 500 Futures)</span>
                    <span className="text-[10px] font-mono text-zinc-600">10yr avg</span>
                </div>
                <div className="flex items-end gap-1 h-20">
                    {monthlyData.map((d) => {
                        const isCurrentMonth = d.month === currentMonth
                        const height = (Math.abs(d.es) / maxVal) * 100
                        return (
                            <div key={`es-${d.month}`} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                                <div className="w-full flex flex-col justify-end h-16 relative">
                                    {d.es >= 0 ? (
                                        <div
                                            className={cn(
                                                "w-full rounded-t-sm transition-all duration-300 group-hover:opacity-100",
                                                isCurrentMonth ? "bg-blue-500 opacity-100" : "bg-emerald-500/50 opacity-70"
                                            )}
                                            style={{ height: `${height}%` }}
                                        />
                                    ) : (
                                        <div className="w-full flex flex-col justify-start h-full">
                                            <div className="flex-1" />
                                            <div
                                                className={cn(
                                                    "w-full rounded-b-sm transition-all duration-300 group-hover:opacity-100",
                                                    isCurrentMonth ? "bg-blue-500 opacity-100" : "bg-red-500/50 opacity-70"
                                                )}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[8px] font-mono",
                                    isCurrentMonth ? "text-blue-400 font-bold" : "text-zinc-600"
                                )}>
                                    {d.month}
                                </span>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-zinc-300 whitespace-nowrap z-10 pointer-events-none">
                                    {d.es > 0 ? '+' : ''}{d.es.toFixed(1)}%
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* NQ Chart */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">NQ (Nasdaq Futures)</span>
                    <span className="text-[10px] font-mono text-zinc-600">10yr avg</span>
                </div>
                <div className="flex items-end gap-1 h-20">
                    {monthlyData.map((d) => {
                        const isCurrentMonth = d.month === currentMonth
                        const height = (Math.abs(d.nq) / maxVal) * 100
                        return (
                            <div key={`nq-${d.month}`} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                                <div className="w-full flex flex-col justify-end h-16 relative">
                                    {d.nq >= 0 ? (
                                        <div
                                            className={cn(
                                                "w-full rounded-t-sm transition-all duration-300 group-hover:opacity-100",
                                                isCurrentMonth ? "bg-blue-500 opacity-100" : "bg-emerald-500/50 opacity-70"
                                            )}
                                            style={{ height: `${height}%` }}
                                        />
                                    ) : (
                                        <div className="w-full flex flex-col justify-start h-full">
                                            <div className="flex-1" />
                                            <div
                                                className={cn(
                                                    "w-full rounded-b-sm transition-all duration-300 group-hover:opacity-100",
                                                    isCurrentMonth ? "bg-blue-500 opacity-100" : "bg-red-500/50 opacity-70"
                                                )}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[8px] font-mono",
                                    isCurrentMonth ? "text-blue-400 font-bold" : "text-zinc-600"
                                )}>
                                    {d.month}
                                </span>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-zinc-300 whitespace-nowrap z-10 pointer-events-none">
                                    {d.nq > 0 ? '+' : ''}{d.nq.toFixed(1)}%
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-zinc-600 pt-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-emerald-500/50" />
                    <span>Positive</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-red-500/50" />
                    <span>Negative</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm bg-blue-500" />
                    <span>Current</span>
                </div>
            </div>
        </div>
    )
}
