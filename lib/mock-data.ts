
import { UsdFuturesNews, Impact } from './types';

export function getMockNewsData(): Partial<UsdFuturesNews>[] {
    const now = new Date();

    const createDate = (daysFromNow: number, nyHour: number, nyMinute: number = 30) => {
        const d = new Date(now);
        d.setDate(d.getDate() + daysFromNow);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const h = nyHour.toString().padStart(2, '0');
        const m = nyMinute.toString().padStart(2, '0');

        return new Date(`${year}-${month}-${day}T${h}:${m}:00-05:00`);
    };

    const mockNews: Partial<UsdFuturesNews>[] = [
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
