"use client"
import { useState, useEffect } from "react"

export function NYClock() {
    const [time, setTime] = useState<string>("")

    useEffect(() => {
        // Hydration mismatch prevention: set time only on client
        const updateTime = () => {
            const now = new Date()
            const timeString = now.toLocaleTimeString("en-US", {
                timeZone: "America/New_York",
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
            setTime(timeString)
        }

        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!time) return <span className="opacity-50">--:--:-- NY</span>

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-sm tracking-widest text-zinc-100 font-bold">
                {time} <span className="text-zinc-500 text-[10px]">NY</span>
            </span>
        </div>
    )
}
