
"use client"

import { useMemo, useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"

// 24-hour cycle starting from 18:00 NY time (6 PM)
// Asia: 18:00-03:00 (9 hours)
// London: 03:00-12:00 (9 hours)
// NYSE: 09:30-16:00 (6.5 hours) - overlaps with London 09:30-12:00 (KILL ZONE)
const VOLATILITY_DATA = [
    // Asia Session (18:00-03:00 NY time)
    { time: "18:00", volatility: 25, session: "Asia" },
    { time: "19:00", volatility: 22, session: "Asia" },
    { time: "20:00", volatility: 28, session: "Asia" },
    { time: "21:00", volatility: 30, session: "Asia" },
    { time: "22:00", volatility: 26, session: "Asia" },
    { time: "23:00", volatility: 24, session: "Asia" },
    { time: "00:00", volatility: 27, session: "Asia" },
    { time: "01:00", volatility: 29, session: "Asia" },
    { time: "02:00", volatility: 31, session: "Asia" },

    // London Session starts (03:00-12:00 NY time)
    { time: "03:00", volatility: 45, session: "London" }, // London open spike
    { time: "04:00", volatility: 42, session: "London" },
    { time: "05:00", volatility: 48, session: "London" },
    { time: "06:00", volatility: 50, session: "London" },
    { time: "07:00", volatility: 52, session: "London" },
    { time: "08:00", volatility: 54, session: "London" },
    { time: "09:00", volatility: 58, session: "London" },

    // London + NYSE Overlap (09:30-12:00 NY time) - KILL ZONE
    { time: "09:30", volatility: 82, session: "London+NYSE" }, // NYSE open - highest volatility
    { time: "10:00", volatility: 88, session: "London+NYSE" }, // Peak kill zone
    { time: "10:30", volatility: 85, session: "London+NYSE" },
    { time: "11:00", volatility: 78, session: "London+NYSE" },
    { time: "11:30", volatility: 72, session: "London+NYSE" },
    { time: "12:00", volatility: 68, session: "London+NYSE" }, // London close

    // NYSE Session only (12:00-16:00 NY time)
    { time: "12:30", volatility: 58, session: "NYSE" },
    { time: "13:00", volatility: 52, session: "NYSE" },
    { time: "13:30", volatility: 48, session: "NYSE" },
    { time: "14:00", volatility: 45, session: "NYSE" },
    { time: "14:30", volatility: 42, session: "NYSE" },
    { time: "15:00", volatility: 40, session: "NYSE" },
    { time: "15:30", volatility: 38, session: "NYSE" },
    { time: "16:00", volatility: 35, session: "NYSE" }, // NYSE close
]

export function VolatilityChart() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-[200px] w-full animate-pulse bg-zinc-800/50 rounded-lg" />
    }

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={VOLATILITY_DATA} margin={{ top: 25, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <filter id="glow" height="200%" width="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                            <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                            <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.5" result="offsetColor" />
                            <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
                            <feMerge>
                                <feMergeNode in="offsetBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Session markers */}
                    <ReferenceLine x="03:00" stroke="rgba(139, 92, 246, 0.3)" strokeDasharray="3 3" label={{ value: "London", position: "insideTopRight", fill: "rgba(139, 92, 246, 0.6)", fontSize: 9 }} />
                    <ReferenceLine x="09:30" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="3 3" label={{ value: "NYSE", position: "insideTopRight", fill: "rgba(239, 68, 68, 0.8)", fontSize: 9, fontWeight: "bold" }} />
                    <ReferenceLine x="12:00" stroke="rgba(139, 92, 246, 0.3)" strokeDasharray="3 3" label={{ value: "LDN Close", position: "insideTopRight", fill: "rgba(139, 92, 246, 0.6)", fontSize: 9 }} />

                    <XAxis
                        dataKey="time"
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        interval={2}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "rgba(10, 10, 10, 0.9)",
                            borderColor: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(10px)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                        }}
                        itemStyle={{ color: "hsl(var(--primary))", fontWeight: "bold" }}
                        labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}
                        formatter={(value: any, name: any, props: any) => {
                            const session = props.payload.session
                            return [`${value} (${session})`, "Volatility"]
                        }}
                        cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="volatility"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        filter="url(#glow)"
                        fillOpacity={1}
                        fill="url(#colorVol)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
