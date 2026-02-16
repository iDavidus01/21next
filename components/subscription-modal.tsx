"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react"

// Step 1: Contact Info
const step1Schema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
})

// Step 2: Preferences
const step2Schema = z.object({
    alerts: z.array(z.string()).refine((value) => value.length > 0, {
        message: "Select at least one alert type.",
    }),
    frequency: z.enum(["instant", "daily", "weekly"]),
})

// Combined Schema for final submission (optional, but good for types)
const finalSchema = step1Schema.merge(step2Schema).and(z.object({
    captchaToken: z.string().min(1, "Please complete the CAPTCHA"),
}))

export function SubscriptionModal() {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<z.infer<typeof finalSchema>>>({})

    // Verify key exists or use a test key
    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key

    // Forms for each step
    const form1 = useForm<z.infer<typeof step1Schema>>({
        resolver: zodResolver(step1Schema),
        defaultValues: { email: "", name: "" },
    })

    const form2 = useForm<z.infer<typeof step2Schema>>({
        resolver: zodResolver(step2Schema),
        defaultValues: { alerts: ["high_impact"], frequency: "instant" },
    })

    const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setStep(2)
    }

    const onStep2Submit = (data: z.infer<typeof step2Schema>) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setStep(3)
    }

    const onFinalSubmit = async (token: string | null) => {
        if (!token) return

        const finalData = { ...formData, captchaToken: token }
        console.log("Submitting:", finalData)

        // Simmsulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setOpen(false)
        setStep(1)
        form1.reset()
        form2.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white/5 border-white/10 hover:bg-white/10">
                    <Bell className="w-4 h-4" />
                    Subscribe
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Market Alerts
                    </DialogTitle>
                    <DialogDescription>
                        Get notified about high-impact market events.
                        <span className="block mt-2 text-xs font-mono text-zinc-500">
                            STEP {step} OF 3
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <Form {...form1}>
                        <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
                            <FormField
                                control={form1.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} className="bg-zinc-900 border-white/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form1.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" {...field} className="bg-zinc-900 border-white/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" className="w-full">
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}

                {step === 2 && (
                    <Form {...form2}>
                        <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
                            <FormField
                                control={form2.control}
                                name="alerts"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Alert Types</FormLabel>
                                        </div>
                                        {["high_impact", "volatility", "daily_summary"].map((item) => (
                                            <FormField
                                                key={item}
                                                control={form2.control}
                                                name="alerts"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
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
                                                            <FormLabel className="font-normal capitalize cursor-pointer">
                                                                {item.replace("_", " ")}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">
                                    Back
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}

                {step === 3 && (
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <ShieldCheck className="w-12 h-12 text-zinc-600" />
                            <div className="space-y-1">
                                <h4 className="font-medium text-zinc-200">Human Verification</h4>
                                <p className="text-sm text-zinc-500">Please complete the captcha to finish.</p>
                            </div>

                            <div className="bg-white p-2 rounded-md">
                                <ReCAPTCHA
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={onFinalSubmit}
                                    theme="light"
                                />
                            </div>
                        </div>
                        <Button variant="ghost" onClick={() => setStep(2)} className="w-full">
                            Back
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
