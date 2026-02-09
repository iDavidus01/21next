
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Filter, CheckCircle2, Settings2, Zap } from "lucide-react"

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
        <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Feed Configuration
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="sessions"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-xs text-zinc-400 font-semibold mb-2 block">SESSIONS</FormLabel>
                                    <div className="grid grid-cols-1 gap-2">
                                        {["Asia", "London", "New York"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="sessions"
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={item}
                                                        className="flex flex-row items-center space-x-3 space-y-0 bg-white/5 p-3 rounded-lg border border-white/5 transition-all hover:bg-white/10"
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
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-mono text-sm cursor-pointer flex-1">
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
                                    <FormLabel className="text-xs text-zinc-400 font-semibold mb-2 block">IMPACT LEVEL</FormLabel>
                                    <div className="flex gap-2">
                                        {["medium", "high"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="impact"
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={item}
                                                        className={`flex-1 flex flex-row items-center justify-center space-x-2 space-y-0 p-2 rounded-lg border cursor-pointer transition-all ${field.value?.includes(item)
                                                            ? item === 'high' ? 'bg-red-950/40 border-red-500/50 text-red-200' : 'bg-yellow-950/40 border-yellow-500/50 text-yellow-200'
                                                            : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item)}
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
                                                        <FormLabel className="text-xs font-bold uppercase tracking-wider cursor-pointer">
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
                            name="confidenceThreshold"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-2">
                                        <FormLabel className="text-xs text-zinc-400 font-semibold">MIN CONFIDENCE</FormLabel>
                                        <span className="text-xs font-mono text-primary font-bold">{field.value}%</span>
                                    </div>
                                    <FormControl>
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={1}
                                            defaultValue={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                            className="py-2"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-bold tracking-wide shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all">
                            <Zap className="w-4 h-4 mr-2" />
                            UPDATE FEED
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
