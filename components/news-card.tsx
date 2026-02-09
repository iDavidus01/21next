
"use client"

import * as React from "react"
import { formatEvent } from "@/lib/utils"
import { UsdFuturesNews } from "@/lib/types"
// We need to import badges and components
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Bot, TrendingUp, AlertTriangle, Info } from "lucide-react"

// Create context for Compound Component
const NewsContext = React.createContext<{ news: UsdFuturesNews } | null>(null)

function useNewsContext() {
    const context = React.useContext(NewsContext)
    if (!context) {
        throw new Error("NewsCard.* components must be used within a NewsCard")
    }
    return context
}

// 1. Root Component
interface NewsCardProps {
    news: UsdFuturesNews
    children: React.ReactNode
    className?: string
}

export function NewsCard({ news, children, className }: NewsCardProps) {
    return (
        <NewsContext.Provider value={{ news }}>
            <Card className={`glass-card hover:scale-[1.02] transition-transform duration-300 ${className}`}>
                {children}
            </Card>
        </NewsContext.Provider>
    )
}

// 2. Sub-components

// HEADER: Time, Title, Impact
function Header() {
    const { news } = useNewsContext()

    return (
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        {formatEvent(news.eventTimeUTC)}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-100 leading-tight">
                        {news.title}
                    </h3>
                </div>
                <Badge variant={news.impact as any} className="ml-2 capitalize">
                    {news.impact} Impact
                </Badge>
            </div>
        </CardHeader>
    )
}

// META: Forecast vs Previous
function Meta() {
    const { news } = useNewsContext()

    // Only render if data exists
    if (!news.forecast && !news.previous) return null

    return (
        <CardContent className="py-2">
            <div className="flex gap-4 text-sm">
                {news.previous && (
                    <div className="flex flex-col">
                        <span className="text-zinc-500 text-xs">Previous</span>
                        <span className="font-mono text-zinc-300">{news.previous}</span>
                    </div>
                )}
                {news.forecast && (
                    <div className="flex flex-col">
                        <span className="text-zinc-500 text-xs">Forecast</span>
                        <span className="font-mono text-zinc-100">{news.forecast}</span>
                    </div>
                )}
            </div>
        </CardContent>
    )
}

// AI: Analysis block
function AI() {
    const { news } = useNewsContext()

    return (
        <CardFooter className="pt-2 pb-6 flex-col items-start gap-3 border-t border-white/5 mt-2 bg-black/20 rounded-b-xl">
            <div className="flex items-center gap-2 w-full">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide">AI OUTLOOK</span>
                <div className="ml-auto flex gap-2">
                    <Badge variant={news.aiBias as any} className="text-[10px] px-1.5 py-0">
                        Bias: {news.aiBias}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/10 text-zinc-400">
                        Vol: {news.aiVolatility}
                    </Badge>
                </div>
            </div>

            <p className="text-sm text-zinc-400 italic leading-relaxed">
                "{news.aiComment}"
            </p>

            <div className="w-full flex justify-end">
                <span className="text-[10px] text-zinc-600">Confidence: {news.aiConfidence}%</span>
            </div>
        </CardFooter>
    )
}

// Attach sub-components
NewsCard.Header = Header
NewsCard.Meta = Meta
NewsCard.AI = AI
