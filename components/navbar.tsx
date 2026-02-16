"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Newspaper } from "lucide-react"
import { SubscriptionModal } from "./subscription-modal"

const navItems = [
    { href: "/", label: "Dashboard", icon: Newspaper },
    { href: "/analytics", label: "Market Analytics", icon: BarChart3 },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5">
            {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono tracking-wide transition-all duration-200",
                            isActive
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(var(--primary),0.1)]"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent"
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </Link>
                )
            })}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <SubscriptionModal />
        </nav>
    )
}
