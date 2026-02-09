
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ✅ Function overload implementation
export function formatEvent(date: Date): string;
export function formatEvent(date: string): string;

export function formatEvent(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }

    // Format: HH:mm • DD MMM (UTC-5)
    const timePart = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/New_York',
    }).format(d);

    const datePart = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        timeZone: 'America/New_York',
    }).format(d);

    return `${timePart} • ${datePart}`;
}
