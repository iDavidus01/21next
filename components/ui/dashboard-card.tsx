import * as React from "react"
import { cn } from "@/lib/utils"

const DashboardCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { gradient?: boolean }
>(({ className, gradient = false, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border border-white/[0.08] bg-zinc-900/50 backdrop-blur-xl shadow-lg transition-all duration-500",
            gradient && "bg-gradient-to-br from-white/[0.07] to-white/[0.03]",
            "hover:shadow-primary/10 hover:border-white/20",
            className
        )}
        {...props}
    />
))
DashboardCard.displayName = "DashboardCard"

const DashboardCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
DashboardCardHeader.displayName = "DashboardCardHeader"

const DashboardCardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-mono text-sm font-medium leading-none tracking-wider text-zinc-400 uppercase", className)}
        {...props}
    />
))
DashboardCardTitle.displayName = "DashboardCardTitle"

const DashboardCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
DashboardCardContent.displayName = "DashboardCardContent"

const DashboardCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
DashboardCardFooter.displayName = "DashboardCardFooter"

export { DashboardCard, DashboardCardHeader, DashboardCardFooter, DashboardCardTitle, DashboardCardContent }
