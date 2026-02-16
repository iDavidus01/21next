"use client"

import * as React from "react"
import { formatEvent } from "@/lib/utils"
import { UsdFuturesNews } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Bot, AlertTriangle } from "lucide-react"

const NewsContext = React.createContext<{ news: UsdFuturesNews } | null>(null)

function useNewsContext() {
    const context = React.useContext(NewsContext)
    if (!context) {
        throw new Error("NewsCard.* components must be used within a NewsCard")
    }
    return context
}

interface NewsCardProps {
    news: UsdFuturesNews
    children: React.ReactNode
    className?: string
}

export function NewsCard({ news, children, className }: NewsCardProps) {
    const impactColor = news.impact === 'high'
        ? 'hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)] hover:border-red-500/30'
        : 'hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)] hover:border-yellow-500/30'

    return (
        <NewsContext.Provider value={{ news }}>
            {/* 
              Added @container to enable container queries for children 
              Added group to enable group-hover effects
            */}
            <Card className={`glass-card group relative overflow-hidden transition-all duration-500 @container ${impactColor} ${className}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {children}
            </Card>
        </NewsContext.Provider>
    )
}

export function NewsCardHeader() {
    const { news } = useNewsContext()

    return (
        <CardHeader className="pb-2 relative z-10">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border border-white/5 px-1.5 py-0.5 rounded bg-black/20">
                            {formatEvent(news.eventTimeUTC)}
                        </span>
                        {news.impact === 'high' && (
                            <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 leading-tight tracking-tight group-hover:text-glow transition-all duration-300">
                        {news.title}
                    </h3>
                </div>
                <Badge variant={news.impact as any} className="ml-2 capitalize shadow-lg">
                    {news.impact}
                </Badge>
            </div>
        </CardHeader>
    )
}

export function NewsCardMeta() {
    const { news } = useNewsContext()

    if (!news.forecast && !news.previous) return null

    return (
        <CardContent className="py-3 relative z-10">
            {/* Use grid for larger containers, stack for smaller */}
            <div className="grid grid-cols-1 @[200px]:grid-cols-2 gap-4 bg-black/20 p-3 rounded-lg border border-white/5">
                {news.previous && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Previous</span>
                        <span className="font-mono text-sm text-zinc-300">{news.previous}</span>
                    </div>
                )}
                {news.forecast && (
                    <div className="flex flex-col gap-1 border-t @[200px]:border-t-0 @[200px]:border-l border-white/5 pt-2 @[200px]:pt-0 @[200px]:pl-4">
                        <span className="text-[10px] uppercase tracking-wider text-primary/70 font-semibold">Forecast</span>
                        <span className="font-mono text-sm text-primary font-bold">{news.forecast}</span>
                    </div>
                )}
            </div>
        </CardContent>
    )
}

export function NewsCardAI() {
    const { news } = useNewsContext()

    return (
        <CardFooter className="pt-0 pb-0 px-0 flex-col items-start mt-2 relative z-10">
            <div className="w-full bg-zinc-950/30 border-t border-white/5 p-4 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2 w-full mb-3">
                    <Bot className="w-3.5 h-3.5 text-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-primary tracking-widest uppercase">AI Analysis</span>

                    {/* Hide score on very small containers */}
                    <div className="hidden @[250px]:block">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-blue-500/30 text-blue-400 font-mono">
                            IMPACT: {news.aiEventScore}/10
                        </Badge>
                    </div>

                    <div className="ml-auto flex gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                        <Badge variant={news.aiBias as any} className="text-[9px] px-1.5 py-0 rounded-sm uppercase tracking-wider">
                            {news.aiBias === 'bullish' ? 'BULLISH' : news.aiBias === 'bearish' ? 'BEARISH' : 'NEUTRAL'}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 text-zinc-400 font-mono tracking-tighter">
                            VOL: {news.aiVolatility.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="relative pl-3 border-l-2 border-primary/20">
                    <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                        &quot;{news.aiComment}&quot;
                    </p>
                </div>

                <div className="mt-3 flex justify-end items-center gap-1.5">
                    <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary/50 rounded-full transition-all duration-1000"
                            style={{ width: `${news.aiConfidence}%` }}
                        />
                    </div>
                    <span className="text-[9px] text-zinc-600 font-mono">{news.aiConfidence}% CONF</span>
                </div>
            </div>
        </CardFooter>
    )
}
