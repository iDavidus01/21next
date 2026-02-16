"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Filter, CheckCircle2, Settings2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
    sessions: z.array(z.string()).refine((value) => value.length > 0, {
        message: "Select at least one session.",
    }),
    impact: z.array(z.string()).refine((value) => value.length > 0, {
        message: "Select at least one impact.",
    }),
    confidenceThreshold: z.number().min(0).max(100),
})

export function FilterForm({ onFilter }: { onFilter?: (data: z.infer<typeof formSchema>) => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sessions: ["Asia", "London", "New York"],
            impact: ["medium", "high"],
            confidenceThreshold: 0,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (onFilter) onFilter(values)
    }

    return (
        <Card className="border-0 bg-transparent shadow-none p-4">
            <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Feed Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="sessions"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-xs text-zinc-500 font-bold mb-3 block tracking-widest">ACTIVE SESSIONS</FormLabel>
                                    <div className="grid grid-cols-1 gap-2">
                                        {["Asia", "London", "New York"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="sessions"
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={item}
                                                        className={cn(
                                                            "flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md border transition-all duration-200 cursor-pointer",
                                                            field.value?.includes(item)
                                                                ? "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.05)]"
                                                                : "bg-zinc-900/20 border-white/5 hover:bg-zinc-900/40 hover:border-white/10"
                                                        )}
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item
                                                                            )
                                                                        )
                                                                }}
                                                                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                                                            />
                                                        </FormControl>
                                                        <FormLabel className={cn(
                                                            "font-mono text-sm cursor-pointer flex-1",
                                                            field.value?.includes(item) ? "text-primary font-semibold" : "text-zinc-400"
                                                        )}>
                                                            {item}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="impact"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-xs text-zinc-500 font-bold mb-3 block tracking-widest">IMPACT LEVEL</FormLabel>
                                    <div className="flex gap-3">
                                        {["medium", "high"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="impact"
                                                render={({ field }) => {
                                                    const isChecked = field.value?.includes(item);
                                                    const isHigh = item === 'high';

                                                    return (
                                                        <FormItem
                                                            key={item}
                                                            className={cn(
                                                                "flex-1 flex flex-row items-center justify-center space-x-2 space-y-0 p-2.5 rounded-md border cursor-pointer transition-all duration-200",
                                                                isChecked
                                                                    ? isHigh
                                                                        ? "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                                                        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                                                    : "bg-zinc-900/20 border-white/5 text-zinc-500 hover:bg-zinc-900/40 hover:border-white/10"
                                                            )}
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    className="hidden"
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item
                                                                                )
                                                                            )
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-xs font-bold uppercase tracking-wider cursor-pointer select-none">
                                                                {item}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confidenceThreshold"
                            render={({ field }) => (
                                <FormItem className="pt-2">
                                    <div className="flex justify-between items-end mb-4">
                                        <FormLabel className="text-xs text-zinc-500 font-bold tracking-widest leading-none">MIN CONFIDENCE</FormLabel>
                                        <span className="text-xs font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20 leading-none">
                                            {field.value}%
                                        </span>
                                    </div>
                                    <FormControl>
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={1}
                                            defaultValue={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                            className="[&_.bg-primary]:bg-blue-500 [&_.border-primary]:border-blue-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-primary text-black hover:bg-white/90 font-bold tracking-wide h-10 shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_25px_rgba(var(--primary),0.3)] transition-all active:scale-[0.98]">
                            <Zap className="w-3.5 h-3.5 mr-2" />
                            UPDATE FEED
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
