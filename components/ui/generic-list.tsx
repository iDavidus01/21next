import * as React from "react"
import { cn } from "@/lib/utils"

interface GenericListProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    data: T[]
    keyExtractor: (item: T) => string | number
    renderItem: (item: T, index: number) => React.ReactNode
    emptyMessage?: string
    isLoading?: boolean
}

export function GenericList<T>({
    data,
    keyExtractor,
    renderItem,
    emptyMessage = "No items found.",
    isLoading = false,
    className,
    ...props
}: GenericListProps<T>) {
    if (isLoading) {
        return (
            <div className={cn("space-y-3", className)} {...props}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-zinc-900/50 animate-pulse" />
                ))}
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className={cn("flex items-center justify-center p-8 text-zinc-500 text-sm font-mono", className)} {...props}>
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className={cn("space-y-2", className)} {...props}>
            {data.map((item, index) => (
                <React.Fragment key={keyExtractor(item)}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}
        </div>
    )
}
