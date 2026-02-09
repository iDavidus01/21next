"use client"

import { useState, useMemo } from "react"
import { UsdFuturesNews } from "@/lib/types"
import { FilterForm } from "./filter-form"
import { NewsCard, NewsCardHeader, NewsCardMeta, NewsCardAI } from "./news-card"
import { Sparkles } from "lucide-react"

interface NewsListProps {
    initialNews: UsdFuturesNews[]
}

export function NewsList({ initialNews }: NewsListProps) {
    const [filters, setFilters] = useState({
        sessions: ["London", "New York"],
        impact: ["high"],
        confidenceThreshold: 70
    })

    // Filter news based on current filters
    const filteredNews = useMemo(() => {
        return initialNews.filter(item => {
            // Filter by impact
            if (!filters.impact.includes(item.impact)) {
                return false
            }

            // Filter by confidence threshold
            if (item.aiConfidence < filters.confidenceThreshold) {
                return false
            }

            // Filter by session (based on time)
            // This is a simplified version - you might want to add proper session detection
            const hour = parseInt(item.eventTimeUTC.split(':')[0])
            let itemSession = ""

            if (hour >= 18 || hour < 3) {
                itemSession = "Asia"
            } else if (hour >= 3 && hour < 12) {
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

    return (
        <>
            {/* Filters (Sticky) */}
            <aside className="xl:col-span-1 xl:sticky xl:top-8 space-y-8">
                <div className="glass-card rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                    {/* Subtle overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="relative z-10">
                        <FilterForm onFilter={setFilters} />
                    </div>
                </div>
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

            {/* News Feed */}
            <main className="xl:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Incoming High Impact Stream
                    </h3>
                    <span className="text-xs text-zinc-500 font-mono">
                        LIVE FEED • FILTERED
                    </span>
                </div>

                {filteredNews.length === 0 ? (
                    <div className="p-12 text-center text-zinc-500 glass-card rounded-xl">
                        No news matching your filters. Try adjusting the filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {filteredNews.map((item) => (
                            <NewsCard key={item.id} news={item}>
                                <NewsCardHeader />
                                <NewsCardMeta />
                                <NewsCardAI />
                            </NewsCard>
                        ))}
                    </div>
                )}
            </main>
        </>
    )
}
