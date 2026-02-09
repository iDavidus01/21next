
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
                high: "border-red-500/50 bg-red-950/30 text-red-200 hover:bg-red-900/40",
                medium: "border-yellow-500/50 bg-yellow-950/30 text-yellow-200 hover:bg-yellow-900/40",
                low: "border-blue-500/50 bg-blue-950/30 text-blue-200 hover:bg-blue-900/40",
                bullish: "border-green-500/50 bg-green-950/30 text-green-200",
                bearish: "border-red-500/50 bg-red-950/30 text-red-200",
                neutral: "border-zinc-500/50 bg-zinc-950/30 text-zinc-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
