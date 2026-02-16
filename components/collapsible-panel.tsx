"use client"

import { useState, ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsiblePanelProps {
    children: ReactNode
    className?: string
}

export function CollapsiblePanel({ children, className }: CollapsiblePanelProps) {
    const [visible, setVisible] = useState(true)

    return (
        <div className={cn("relative", className)}>
            <button
                onClick={() => setVisible(!visible)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
                title={visible ? "Hide" : "Show"}
            >
                {visible ? (
                    <Eye className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                ) : (
                    <EyeOff className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                )}
            </button>
            <div className={cn(
                "transition-all duration-300 overflow-hidden",
                visible ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}>
                {children}
            </div>
        </div>
    )
}
