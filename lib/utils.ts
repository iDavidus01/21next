
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

    // Format: HH:mm NY • DD MMM
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        day: '2-digit',
        month: 'short',
        timeZone: 'America/New_York',
    }).format(d) + ' NY';
}
