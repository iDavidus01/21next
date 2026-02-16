
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

export function formatTimeNY(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '--:--';

    return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
    }).format(d);
}

export function formatDateNY(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        timeZone: 'America/New_York'
    }).format(d);
}

export function getDateKeyNY(date: string): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'unknown';

    return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/New_York'
    }).format(d);
}
