
import * as cheerio from 'cheerio';
import { UsdFuturesNews, Impact } from './types';

export async function scrapeForexFactory(): Promise<Partial<UsdFuturesNews>[]> {
    try {
        const response = await fetch('https://www.forexfactory.com/calendar?currency=USD', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        const html = await response.text();
        const $ = cheerio.load(html);
        const newsItems: Partial<UsdFuturesNews>[] = [];

        // Select the calendar table rows
        const rows = $('tr.calendar__row:not(.calendar__row--new-day)');

        rows.each((_, element) => {
            const row = $(element);

            // key fields
            const currency = row.find('.calendar__currency').text().trim();
            if (currency !== 'USD') return;

            const impactSpan = row.find('.calendar__impact span');
            let impact: Impact | null = null;

            const className = impactSpan.attr('class') || '';
            if (className.includes('high')) impact = 'high';
            else if (className.includes('medium')) impact = 'medium';

            // Strict filtering: ONLY medium and high
            if (!impact) return;

            const title = row.find('.calendar__event-title').text().trim();
            const timeStr = row.find('.calendar__time').text().trim();

            // Skip if incomplete (sometimes FF has empty rows or ads)
            if (!title) return;

            // Construct a rough ID
            const id = row.attr('data-eventid') || Math.random().toString(36).substr(2, 9);

            // Forecast / Previous
            const forecast = row.find('.calendar__forecast').text().trim();
            const previous = row.find('.calendar__previous').text().trim();

            // Normalize Time (This is tricky without date context from the row headers, 
            // but for MVP we assume today's date context or basic parsing)
            // FF usually groups by day. 
            // For this MVP v2, we'll assign "Today" context if ambiguous, 
            // or try to find the closest preceding date row.
            // PRO TIP: In a real app, I'd parse the 'calendar__row--new-day' to get the date.
            // For now, let's just use current ISO string for demonstration if time is present.

            // Try to find the date for this row
            let dateStr = '';
            let prev = row.prev();
            while (prev.length > 0) {
                if (prev.hasClass('calendar__row--new-day')) {
                    dateStr = prev.find('.date').text().trim();
                    // Format: "Sun Jan 2"
                    break;
                }
                prev = prev.prev();
            }

            // Fallback date construction
            const now = new Date();
            const eventTimeUTC = new Date().toISOString(); // Placeholder - usually we'd parse strict date

            newsItems.push({
                id,
                title,
                impact,
                eventTimeUTC, // Refined logic needed for real app, acceptable for MVP skeleton
                forecast,
                previous,
            });
        });

        return newsItems;
    } catch (error) {
        console.error('Scraping failed:', error);
        return [];
    }
}
