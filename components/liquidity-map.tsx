"use client"

import { cn } from "@/lib/utils"

const gammaLevels = [
    { price: 6120, type: "call_wall", label: "Call Wall", strength: 95 },
    { price: 6100, type: "resistance", label: "Key Gamma Resistance", strength: 78 },
    { price: 6080, type: "hvm", label: "HVL (High Vol Level)", strength: 60 },
    { price: 6050, type: "spot", label: "SPOT PRICE", strength: 100 },
    { price: 6020, type: "support", label: "Gamma Support", strength: 72 },
    { price: 5980, type: "put_wall", label: "Put Wall", strength: 88 },
    { price: 5940, type: "vol_trigger", label: "Vol Trigger", strength: 55 },
]

function getLevelStyle(type: string) {
    switch (type) {
        case "call_wall": return { bar: "bg-emerald-500/60", text: "text-emerald-400", dot: "bg-emerald-400" }
        case "resistance": return { bar: "bg-emerald-500/30", text: "text-emerald-300/70", dot: "bg-emerald-300/70" }
        case "hvm": return { bar: "bg-yellow-500/30", text: "text-yellow-400", dot: "bg-yellow-400" }
        case "spot": return { bar: "bg-blue-500/50", text: "text-blue-400 font-bold", dot: "bg-blue-400 animate-pulse" }
        case "support": return { bar: "bg-red-500/30", text: "text-red-300/70", dot: "bg-red-300/70" }
        case "put_wall": return { bar: "bg-red-500/60", text: "text-red-400", dot: "bg-red-400" }
        case "vol_trigger": return { bar: "bg-orange-500/40", text: "text-orange-400", dot: "bg-orange-400" }
        default: return { bar: "bg-zinc-500/30", text: "text-zinc-400", dot: "bg-zinc-400" }
    }
}

export function LiquidityMap() {
    return (
        <div className="space-y-2">
            {gammaLevels.map((level) => {
                const style = getLevelStyle(level.type)
                const isSpot = level.type === "spot"

                return (
                    <div
                        key={level.price}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-white/[0.03]",
                            isSpot && "bg-blue-500/5 border border-blue-500/20"
                        )}
                    >
                        <span className={cn("text-xs font-mono w-12 text-right font-bold", style.text)}>
                            {level.price}
                        </span>
                        <div className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
                        <div className="flex-1 h-3 bg-zinc-900/50 rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-700", style.bar)}
                                style={{ width: `${level.strength}%` }}
                            />
                        </div>
                        <span className={cn("text-[10px] font-mono w-32 text-right truncate", style.text)}>
                            {level.label}
                        </span>
                    </div>
                )
            })}
            <div className="flex items-center justify-center gap-4 pt-2 text-[9px] font-mono text-zinc-600">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Calls / Resistance</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Spot</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span>Puts / Support</span>
                </div>
            </div>
        </div>
    )
}
