"use client"

import { useState, useMemo, useEffect } from "react"
import { UsdFuturesNews } from "@/lib/types"
import { FilterForm } from "./filter-form"
import { formatTimeNY, getDateKeyNY, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
    Sparkles, ChevronDown, ChevronUp, Bot, AlertTriangle,
    TrendingUp, Calendar, Eye, EyeOff, MinusCircle,
    AlignJustify, LayoutGrid
} from "lucide-react"
import { PanelVisibility } from "./dashboard-client"
import { NewsCard, NewsCardHeader, NewsCardMeta, NewsCardAI } from "./news-card"

interface NewsListProps {
    initialNews: UsdFuturesNews[]
    panels?: PanelVisibility
    onTogglePanel?: (key: keyof PanelVisibility) => void
}

function getCurrentWeekWeekdays(): string[] {
    const now = new Date()
    // Convert to NY time to find the "current" day in NY
    const nyString = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York" }).format(now)
    const nyDate = new Date(nyString)

    const day = nyDate.getDay() // 0=Sun, 1=Mon, ..., 6=Sat
    const diffToMon = day === 0 ? -6 : 1 - day // Adjust when day is Sunday

    const monday = new Date(nyDate)
    monday.setDate(nyDate.getDate() + diffToMon)

    const weekdays: string[] = []
    for (let i = 0; i < 5; i++) {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        // Format as YYYY-MM-DD
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        weekdays.push(`${year}-${month}-${day}`)
    }
    return weekdays
}

export function NewsList({ initialNews, panels, onTogglePanel }: NewsListProps) {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [filters, setFilters] = useState({
        sessions: ["Asia", "London", "New York"],
        impact: ["medium", "high"],
        confidenceThreshold: 0
    })

    // Load filters from local storage on mount
    useEffect(() => {
        const savedFilters = localStorage.getItem("news-filters")
        if (savedFilters) {
            try {
                setFilters(JSON.parse(savedFilters))
            } catch (e) {
                console.error("Failed to parse saved filters")
            }
        }
    }, [])

    // Save filters to local storage on change
    useEffect(() => {
        localStorage.setItem("news-filters", JSON.stringify(filters))
    }, [filters])

    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    const filteredNews = useMemo(() => {
        return initialNews.filter(item => {
            if (!filters.impact.includes(item.impact)) {
                return false
            }

            if (item.aiConfidence < filters.confidenceThreshold) {
                return false
            }

            const d = new Date(item.eventTimeUTC)
            const nyHour = parseInt(new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                hour12: false,
                timeZone: 'America/New_York'
            }).format(d))

            let itemSession = ""
            if (nyHour >= 18 || nyHour < 3) {
                itemSession = "Asia"
            } else if (nyHour >= 3 && nyHour < 12) {
                itemSession = "London"
            } else {
                itemSession = "New York"
            }

            if (!filters.sessions.includes(itemSession)) {
                return false
            }

            return true
        })
    }, [initialNews, filters])

    // Group sorted news by date key
    const groupedNews = useMemo(() => {
        const groups: Record<string, UsdFuturesNews[]> = {}
        filteredNews.forEach(item => {
            const dateKey = getDateKeyNY(item.eventTimeUTC)
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].push(item)
        })
        return groups
    }, [filteredNews])

    const weekDays = useMemo(() => getCurrentWeekWeekdays(), [])

    return (
        <>
            <aside className="xl:col-span-1 border-r border-white/5 pr-6 space-y-8">
                <div className="glass-card rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <FilterForm onFilter={setFilters} />
                    </div>
                </div>

                {/* Panel Visibility Toggles */}
                {panels && onTogglePanel && (
                    <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02] space-y-2">
                        <h4 className="text-xs font-mono text-zinc-500 uppercase mb-3 tracking-widest">Panels</h4>
                        {([
                            { key: "context" as const, label: "Today's Context" },
                            { key: "volatility" as const, label: "Volatility Index" },
                        ]).map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => onTogglePanel(key)}
                                className={cn(
                                    "w-full flex items-center justify-between p-2.5 rounded-md border text-xs font-mono transition-all duration-200",
                                    panels[key]
                                        ? "bg-primary/5 border-primary/20 text-zinc-300"
                                        : "bg-zinc-900/20 border-white/5 text-zinc-500 hover:bg-zinc-900/40"
                                )}
                            >
                                <span>{label}</span>
                                {panels[key] ? <Eye className="w-3.5 h-3.5 text-primary" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                        ))}
                    </div>
                )}

                <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                    <h4 className="text-xs font-mono text-zinc-500 uppercase mb-3">System Status</h4>
                    <div className="flex items-center justify-between text-xs text-zinc-300 py-1">
                        <span>Scraper</span>
                        <span className="text-green-500">● Online</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-300 py-1">
                        <span>AI Engine</span>
                        <span className="text-green-500">● Connected</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-300 py-1 border-t border-white/5 mt-2 pt-2">
                        <span>Showing</span>
                        <span className="text-primary font-bold">{filteredNews.length}/{initialNews.length}</span>
                    </div>
                </div>
            </aside>

            <main className="xl:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Incoming High Impact Stream
                    </h3>

                    <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'table' ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <AlignJustify className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'grid' ? "bg-primary/20 text-primary" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.map(news => (
                            <NewsCard key={news.id} news={news}>
                                <NewsCardHeader />
                                <NewsCardMeta />
                                <NewsCardAI />
                            </NewsCard>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-mono text-zinc-600 uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                            <div className="col-span-2">Date / Time</div>
                            <div className="col-span-1 text-center">Cur</div>
                            <div className="col-span-1 text-center">Imp</div>
                            <div className="col-span-5">Event</div>
                            <div className="hidden md:block md:col-span-2 text-right">Forecast</div>
                            <div className="col-span-1 text-right"></div>
                        </div>

                        {/* Table Body */}
                        <div>
                            {weekDays.map((dateKey) => {
                                const daysNews = groupedNews[dateKey] || []
                                const [y, m, d] = dateKey.split('-').map(Number)
                                const dateObj = new Date(y, m - 1, d, 12, 0, 0)
                                const dateLabel = new Intl.DateTimeFormat('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                }).format(dateObj)

                                return (
                                    <div key={dateKey}>
                                        {/* Date Separator Row */}
                                        <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border-y border-white/5">
                                            <Calendar className="w-3.5 h-3.5 text-primary/70" />
                                            <span className="text-xs font-bold text-zinc-300 tracking-wide uppercase">
                                                {dateLabel}
                                            </span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                                        </div>

                                        {daysNews.length === 0 ? (
                                            <div className="px-4 py-3 text-xs italic text-zinc-600 flex items-center gap-2 border-b border-white/[0.03]">
                                                <MinusCircle className="w-3.5 h-3.5 opacity-50" />
                                                <span>No high/medium impact news scheduled.</span>
                                            </div>
                                        ) : (
                                            daysNews.map((item) => {
                                                const isExpanded = expandedIds.has(item.id)
                                                const impactColor = item.impact === 'high' ? 'text-red-500' : 'text-yellow-500'
                                                const impactBg = item.impact === 'high' ? 'bg-red-500/10' : 'bg-yellow-500/10'

                                                return (
                                                    <div key={item.id} className="group transition-colors hover:bg-white/[0.02] border-b border-white/[0.03] last:border-b-0">
                                                        <div
                                                            className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer"
                                                            onClick={() => toggleExpand(item.id)}
                                                        >
                                                            {/* Time Column */}
                                                            <div className="col-span-2 text-xs font-mono text-zinc-300 font-semibold">
                                                                {formatTimeNY(item.eventTimeUTC)}
                                                            </div>

                                                            {/* Currency */}
                                                            <div className="col-span-1 text-center text-[11px] font-bold text-zinc-500">USD</div>

                                                            {/* Impact */}
                                                            <div className="col-span-1 flex justify-center">
                                                                <div className={cn("w-6 h-6 rounded flex items-center justify-center", impactBg)}>
                                                                    <AlertTriangle className={cn("w-3 h-3", impactColor)} />
                                                                </div>
                                                            </div>

                                                            {/* Event Title */}
                                                            <div className="col-span-5 text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                                                                {item.title}
                                                            </div>

                                                            {/* Forecast / Previous */}
                                                            <div className="hidden md:block md:col-span-2 text-right text-xs font-mono text-zinc-400">
                                                                <div className="flex flex-col items-end gap-0.5">
                                                                    {item.forecast && <span className="text-primary">{item.forecast}</span>}
                                                                    {item.previous && <span className="text-zinc-600 text-[10px]">Prev: {item.previous}</span>}
                                                                </div>
                                                            </div>

                                                            {/* Chevron */}
                                                            <div className="col-span-1 flex justify-end">
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                                                                ) : (
                                                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Expanded Details */}
                                                        {isExpanded && (
                                                            <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-white/5">

                                                                    {/* AI Analysis Block */}
                                                                    <div className="lg:col-span-2 space-y-3 p-4 bg-zinc-900/30 rounded-lg border border-white/5">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Bot className="w-3.5 h-3.5 text-primary" />
                                                                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">AI Insight</span>
                                                                        </div>
                                                                        <p className="text-xs text-zinc-300 leading-relaxed font-mono pl-2 border-l-2 border-primary/20">
                                                                            &quot;{item.aiComment}&quot;
                                                                        </p>

                                                                        <div className="flex items-center gap-3 pt-2">
                                                                            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                                                <div
                                                                                    className="h-full bg-primary/70 rounded-full"
                                                                                    style={{ width: `${item.aiConfidence}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-[10px] font-mono text-zinc-500">{item.aiConfidence}% CONFIDENCE</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Metrics Block */}
                                                                    <div className="lg:col-span-1 grid grid-cols-2 gap-2">
                                                                        <div className="p-3 bg-zinc-900/30 rounded-lg border border-white/5 flex flex-col justify-center items-center text-center">
                                                                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Bias</span>
                                                                            <Badge variant={item.aiBias as any} className="text-[10px] h-5 px-2">
                                                                                {item.aiBias}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="p-3 bg-zinc-900/30 rounded-lg border border-white/5 flex flex-col justify-center items-center text-center">
                                                                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Vol</span>
                                                                            <div className="flex items-center gap-1 text-xs font-mono text-zinc-300 uppercase">
                                                                                <TrendingUp className="w-3 h-3 text-zinc-500" />
                                                                                {item.aiVolatility}
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-3 bg-zinc-900/30 rounded-lg border border-white/5 flex flex-col justify-center items-center text-center">
                                                                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Score</span>
                                                                            <span className="text-sm font-bold font-mono text-blue-400">{item.aiEventScore}/10</span>
                                                                        </div>
                                                                        <div className="p-3 bg-zinc-900/30 rounded-lg border border-white/5 flex flex-col justify-center items-center text-center">
                                                                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Impact</span>
                                                                            <span className={cn("text-xs font-bold uppercase", impactColor)}>{item.impact}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}
