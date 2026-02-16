"use client"

import { useState, useEffect } from "react"
import { UsdFuturesNews, Bias } from "@/lib/types"
import { NewsList } from "./news-list"
import { Badge } from "@/components/ui/badge"
import { VolatilityChart } from "@/components/volatility-chart"
import { Layers, ArrowUpRight } from "lucide-react"

interface DashboardClientProps {
    context: { text: string; bias: Bias }
    news: UsdFuturesNews[]
}

export type PanelVisibility = {
    context: boolean
    volatility: boolean
}

export function DashboardClient({ context, news }: DashboardClientProps) {
    const [panels, setPanels] = useState<PanelVisibility>({
        context: true,
        volatility: true,
    })

    // Load panel state from local storage on mount
    useEffect(() => {
        const savedPanels = localStorage.getItem("dashboard-panels")
        if (savedPanels) {
            try {
                const parsed = JSON.parse(savedPanels)
                // Merge with default to ensure new keys are present if added later
                setPanels(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                console.error("Failed to parse saved panel state")
            }
        }
    }, [])

    // Save panel state to local storage on change
    useEffect(() => {
        localStorage.setItem("dashboard-panels", JSON.stringify(panels))
    }, [panels])

    const togglePanel = (key: keyof PanelVisibility) => {
        setPanels(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const anyTopVisible = panels.context || panels.volatility

    return (
        <>
            {/* Top Row: Context + Volatility */}
            {anyTopVisible && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {panels.context && (
                        <div className="lg:col-span-8 glass-card rounded-2xl p-8 relative group">
                            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                                <Layers className="w-24 h-24 text-white" />
                            </div>
                            <div className="relative z-10 space-y-6 pr-20">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
                                    <h2 className="text-sm font-mono text-primary uppercase tracking-widest">Today&apos;s Context</h2>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-medium text-zinc-200 leading-relaxed max-w-3xl">
                                        {context.text}
                                    </h3>
                                    <div className="flex items-center gap-4 pt-2">
                                        <Badge variant={context.bias as any} className="text-sm px-3 py-1 uppercase tracking-wider">
                                            Bias: {context.bias}
                                        </Badge>
                                        <span className="text-zinc-500 text-xs font-mono">
                                            AI Confidence: 94%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {panels.volatility && (
                        <div className={`${panels.context ? 'lg:col-span-4' : 'lg:col-span-12'} glass-card rounded-2xl p-6 flex flex-col justify-between`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Volatility Index</h3>
                                    <span className="text-2xl font-bold text-white">High</span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-primary" />
                            </div>
                            <div className="h-[180px] w-full mt-auto">
                                <VolatilityChart />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* News Table + Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
                <NewsList
                    initialNews={news}
                    panels={panels}
                    onTogglePanel={togglePanel}
                />
            </div>
        </>
    )
}
