import { UsdFuturesNews, Impact } from './types';

// Mock data for when Forex Factory blocks requests or for testing
export function getMockNewsData(): Partial<UsdFuturesNews>[] {
    const now = new Date();

    // Create dates for different sessions
    const createDate = (hoursFromNow: number, nyHour: number, nyMinute: number = 30) => {
        const date = new Date(now);
        date.setHours(date.getHours() + hoursFromNow);
        date.setHours(nyHour, nyMinute, 0, 0);
        return date;
    };

    const mockNews: Partial<UsdFuturesNews>[] = [
        // Today - NY Session (9:30 AM - 4:00 PM NY time)
        {
            id: 'mock-cpi-1',
            title: 'Core CPI m/m',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(0, 8, 30).toISOString(),
            forecast: '0.3%',
            previous: '0.2%',
        },
        {
            id: 'mock-retail-1',
            title: 'Retail Sales m/m',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(0, 8, 30).toISOString(),
            forecast: '0.5%',
            previous: '0.4%',
        },
        {
            id: 'mock-jobless-1',
            title: 'Unemployment Claims',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(0, 8, 30).toISOString(),
            forecast: '220K',
            previous: '215K',
        },
        {
            id: 'mock-pmi-1',
            title: 'Services PMI',
            impact: 'medium' as Impact,
            eventTimeUTC: createDate(0, 9, 45).toISOString(),
            forecast: '52.5',
            previous: '52.1',
        },
        {
            id: 'mock-housing-1',
            title: 'Building Permits',
            impact: 'medium' as Impact,
            eventTimeUTC: createDate(0, 10, 0).toISOString(),
            forecast: '1.48M',
            previous: '1.45M',
        },

        // Tomorrow - London Session (3:00 AM - 12:00 PM NY time)
        {
            id: 'mock-gdp-1',
            title: 'GDP q/q',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(24, 8, 30).toISOString(),
            forecast: '2.8%',
            previous: '2.6%',
        },
        {
            id: 'mock-fomc-1',
            title: 'FOMC Meeting Minutes',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(24, 14, 0).toISOString(),
            forecast: '',
            previous: '',
        },
        {
            id: 'mock-ppi-1',
            title: 'PPI m/m',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(24, 8, 30).toISOString(),
            forecast: '0.2%',
            previous: '0.3%',
        },
        {
            id: 'mock-consumer-1',
            title: 'Consumer Sentiment',
            impact: 'medium' as Impact,
            eventTimeUTC: createDate(24, 10, 0).toISOString(),
            forecast: '79.5',
            previous: '78.8',
        },

        // Day After Tomorrow
        {
            id: 'mock-nfp-1',
            title: 'Non-Farm Employment Change',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(48, 8, 30).toISOString(),
            forecast: '185K',
            previous: '199K',
        },
        {
            id: 'mock-unemployment-1',
            title: 'Unemployment Rate',
            impact: 'high' as Impact,
            eventTimeUTC: createDate(48, 8, 30).toISOString(),
            forecast: '4.1%',
            previous: '4.0%',
        },
        {
            id: 'mock-wages-1',
            title: 'Average Hourly Earnings m/m',
            impact: 'medium' as Impact,
            eventTimeUTC: createDate(48, 8, 30).toISOString(),
            forecast: '0.3%',
            previous: '0.4%',
        },
    ];

    return mockNews;
}
