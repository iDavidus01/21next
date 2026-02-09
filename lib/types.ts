
export type Impact = 'medium' | 'high';
export type Bias = 'bullish' | 'bearish' | 'neutral';
export type Volatility = 'low' | 'medium' | 'high';
export type Session = 'Asia' | 'London' | 'New York';

export interface UsdFuturesNews {
    id: string;
    title: string;
    impact: Impact;
    eventTimeUTC: string; // ISO date string
    forecast?: string;
    previous?: string;
    aiBias: Bias;
    aiVolatility: Volatility;
    aiComment: string; // 1-2 sentences
    aiConfidence: number; // 0-100
    createdAt: string;
}

// ✅ Utility types (Partial / Pick / Omit)
export type NewsPreview = Pick<UsdFuturesNews, 'title' | 'impact' | 'eventTimeUTC'>;

// ✅ Function overload definition (implementation will be in utils)
export declare function formatEvent(date: Date): string;
export declare function formatEvent(date: string): string;

// ✅ Type predicate
export function isHighImpact(n: UsdFuturesNews): n is UsdFuturesNews & { impact: 'high' } {
    return n.impact === 'high';
}
