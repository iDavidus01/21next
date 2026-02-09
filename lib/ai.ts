
import { UsdFuturesNews, Bias, Volatility, Session } from './types';

interface AiOutput {
    marketBias: Bias;
    volatilityExpectation: Volatility;
    sessionComment: string;
    confidence: number;
}

export async function analyzeNews(newsItem: Partial<UsdFuturesNews>): Promise<UsdFuturesNews> {
    // Simulate AI latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const title = newsItem.title?.toLowerCase() || '';
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = now.getUTCHours();

    let session: Session = 'Asia';
    if (hour >= 7 && hour < 13) session = 'London';
    else if (hour >= 13 && hour < 21) session = 'New York';

    // HEURISTIC LOGIC (Replacing LLM for Demo/MVP without API Key)
    // This mimics the structured output requested.

    let output: AiOutput = {
        marketBias: 'neutral',
        volatilityExpectation: 'low',
        sessionComment: 'Standard market activity expected.',
        confidence: 70
    };

    // 1. Volatility Logic
    if (title.includes('cpi') || title.includes('nfp') || title.includes('fomc') || title.includes('rate decision')) {
        output.volatilityExpectation = 'high';
        output.confidence = 90;
        output.sessionComment = `Major volatility event. Markets likely to compress ahead of ${dayOfWeek}'s release.`;
    } else if (title.includes('ppi') || title.includes('retail sales') || title.includes('gdp')) {
        output.volatilityExpectation = 'medium';
        output.confidence = 85;
        output.sessionComment = 'Moderate impact expected. Watch for knee-jerk reactions at release.';
    }

    // 2. Bias Logic (Simplified - usually requires previous/forecast comparison)
    // For MVP: random bias based on "sentiment" of keywords or placeholder
    // In a real app, AI would compare forecast vs previous.
    if (title.includes('unemployment')) {
        output.marketBias = 'bearish'; // purely illustrative for MVP
        output.sessionComment += ' Higher unemployment data typically pressures USD.';
    }

    // 3. Time Context
    if (session === 'London' && output.volatilityExpectation === 'high') {
        output.sessionComment = `London session liquidity thin before significant data. Expect fakeouts.`;
    } else if (session === 'New York') {
        output.sessionComment = `NY session overlap. Volume will expand.`;
    }

    return {
        ...newsItem,
        aiBias: output.marketBias,
        aiVolatility: output.volatilityExpectation,
        aiComment: output.sessionComment,
        aiConfidence: output.confidence,
        createdAt: new Date().toISOString(),
    } as UsdFuturesNews;
}

// Global Context Analyzer (The "Today's Market Context" feature)
export async function getMarketContext(): Promise<{ text: string, bias: Bias }> {
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    if (day === 'Monday') {
        return {
            text: "Monday sessions typically show range compression as participants await mid-week data. Lower volume expected in early NY session.",
            bias: 'neutral'
        };
    } else if (day === 'Friday') {
        return {
            text: "End of week profit taking may lead to erratic moves. Watch for mean reversion into the close.",
            bias: 'neutral'
        };
    }

    return {
        text: "Mid-week trend continuation likely. Focus on key technical levels reacting to incoming data.",
        bias: 'bullish' // placeholder
    };
}
