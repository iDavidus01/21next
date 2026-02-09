
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Filter, CheckCircle2 } from "lucide-react"

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
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// ✅ Zod schema with refine
const formSchema = z.object({
    sessions: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one session.",
    }),
    impact: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one impact level.",
    }),
    confidenceThreshold: z.number().min(0).max(100).refine((v) => v >= 50, {
        message: "Confidence threshold must be at least 50%."
    }),
})

export function FilterForm({ onFilter }: { onFilter?: (data: z.infer<typeof formSchema>) => void }) {
    const [step, setStep] = useState(1)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sessions: ["London", "New York"],
            impact: ["high"],
            confidenceThreshold: 70,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Mimic reCAPTCHA check or final step validation
        console.log("Form Submitted:", values)
        if (onFilter) onFilter(values)
    }

    const nextStep = async () => {
        // Validate current step fields before moving
        const isValid = await form.trigger(["sessions", "impact"])
        if (isValid) setStep(2)
    }

    return (
        <Card className="glass-card w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Dashboard Filters
                </CardTitle>
                <CardDescription>
                    Customize your Futures feed. Step {step} of 2.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                                <FormField
                                    control={form.control}
                                    name="sessions"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Target Sessions</FormLabel>
                                                <FormDescription>
                                                    Select which market sessions to analyze.
                                                </FormDescription>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {["Asia", "London", "New York"].map((item) => (
                                                    <FormField
                                                        key={item}
                                                        control={form.control}
                                                        name="sessions"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item}
                                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item)}
                                                                            onCheckedChange={(checked: boolean | string) => {
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
                                                                    <FormLabel className="font-normal">
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
                                    name="impact"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base">Impact Level</FormLabel>
                                            </div>
                                            <div className="flex flex-row gap-4">
                                                {["medium", "high"].map((item) => (
                                                    <FormField
                                                        key={item}
                                                        control={form.control}
                                                        name="impact"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item}
                                                                    className="flex flex-row items-center space-x-2 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item)}
                                                                            onCheckedChange={(checked: boolean | string) => {
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
                                                                    <FormLabel className="font-normal capitalize">
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
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <FormField
                                    control={form.control}
                                    name="confidenceThreshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Min AI Confidence: {field.value}%</FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    defaultValue={[field.value]}
                                                    onValueChange={(vals) => field.onChange(vals[0])}
                                                    className="py-4"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Filter out low confidence AI predictions.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            {step === 2 && (
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="border-white/10 hover:bg-white/5">
                                    Back
                                </Button>
                            )}
                            {step === 1 ? (
                                <Button type="button" onClick={nextStep} className="ml-auto bg-primary text-black hover:bg-primary/90">
                                    Next Step
                                </Button>
                            ) : (
                                <Button type="submit" className="ml-auto bg-primary text-black hover:bg-primary/90">
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Apply Filters
                                </Button>
                            )}
                        </div>

                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
