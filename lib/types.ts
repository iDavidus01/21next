
export type Impact = 'medium' | 'high';
export type Bias = 'bullish' | 'bearish' | 'neutral';
export type Volatility = 'low' | 'medium' | 'high';
export type Session = 'Asia' | 'London' | 'New York';

export interface UsdFuturesNews {
    id: string;
    title: string;
    impact: Impact;
    eventTimeUTC: string;
    forecast?: string;
    previous?: string;
    aiBias: Bias;
    aiVolatility: Volatility;
    aiComment: string;
    aiEventScore: number;
    aiConfidence: number;
    createdAt: string;
}

export type NewsPreview = Pick<UsdFuturesNews, 'title' | 'impact' | 'eventTimeUTC'>;

export declare function formatEvent(date: Date): string;
export declare function formatEvent(date: string): string;

export function isHighImpact(n: UsdFuturesNews): n is UsdFuturesNews & { impact: 'high' } {
    return n.impact === 'high';
}
