
"use client"

import { useMemo } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const MOCK_DATA = [
    { time: "08:00", volatility: 20 },
    { time: "09:00", volatility: 35 },
    { time: "10:00", volatility: 25 },
    { time: "11:00", volatility: 45 },
    { time: "12:00", volatility: 30 },
    { time: "13:00", volatility: 55 },
    { time: "14:00", volatility: 80 }, // NY Open impact
    { time: "15:00", volatility: 60 },
    { time: "16:00", volatility: 40 },
]

export function VolatilityChart() {
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DATA}>
                    <defs>
                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#52525b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a" }}
                        itemStyle={{ color: "#e4e4e7" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="volatility"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorVol)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
