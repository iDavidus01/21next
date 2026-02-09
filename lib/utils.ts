
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatEvent(date: Date): string;
export function formatEvent(date: string): string;

export function formatEvent(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid Date';

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
        hour12: false,
        timeZone: 'America/New_York'
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(d);

    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const month = parts.find(p => p.type === 'month')?.value;

    return `${hour}:${minute} • ${day} ${month}`;
}
