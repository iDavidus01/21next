
import Anthropic from '@anthropic-ai/sdk';
import { UsdFuturesNews, Bias, Volatility, Session } from './types';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL = 'claude-3-haiku-20240307';

function getNYTime(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

function fallbackAnalyze(newsItem: Partial<UsdFuturesNews>): UsdFuturesNews {
    return {
        ...newsItem,
        aiBias: 'neutral',
        aiVolatility: 'medium',
        aiComment: "AI Engine offline. Manual bias assessment required for ES/NQ.",
        aiEventScore: 5,
        aiConfidence: 50,
        createdAt: new Date().toISOString(),
    } as UsdFuturesNews;
}

export async function analyzeNewsBatch(newsItems: Partial<UsdFuturesNews>[]): Promise<UsdFuturesNews[]> {
    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️ ANTHROPIC_API_KEY missing, using mock analysis');
        return newsItems.map(item => fallbackAnalyze(item));
    }

    if (newsItems.length === 0) return [];

    try {
        const eventsDescription = newsItems.map((item, idx) =>
            `Event #${idx + 1}:
            Title: ${item.title}
            Forecast: ${item.forecast || 'N/A'}
            Previous: ${item.previous || 'N/A'}`
        ).join('\n\n');

        const prompt = `Analyze these economic news events unfolding SIMULTANEOUSLY for a USD futures trader (ES/NQ). 
        Events:
        ${eventsDescription}
        
        CRITICAL: Provide a unified and consistent analysis. If multiple events conflict, weigh their institutional importance (e.g., CPI > Retail Sales) to determine a single, final MARKET BIAS for this time block. Avoid giving mixed signals for the same timestamp.
        
        Provide analysis as a JSON array of objects, one for each event in the order provided:
        [
            {
                "bias": "bullish" | "bearish" | "neutral",
                "volatility": "low" | "medium" | "high",
                "score": 1-10 (how much this impacts ES/NQ),
                "confidence": 0-100,
                "comment": "1 short sentence about cumulative ES/NQ impact regarding this specific event"
            },
            ...
        ]`;

        const msg = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 600,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = msg.content[0].type === 'text' ? msg.content[0].text : '';
        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']') + 1;
        const results = JSON.parse(content.substring(jsonStart, jsonEnd));

        return newsItems.map((item, idx) => ({
            ...item,
            aiBias: results[idx].bias,
            aiVolatility: results[idx].volatility,
            aiComment: results[idx].comment,
            aiEventScore: results[idx].score,
            aiConfidence: results[idx].confidence,
            createdAt: new Date().toISOString(),
        } as UsdFuturesNews));

    } catch (error) {
        console.error('AI Batch Analysis failed:', error);
        return newsItems.map(item => fallbackAnalyze(item));
    }
}

export async function analyzeNews(newsItem: Partial<UsdFuturesNews>): Promise<UsdFuturesNews> {
    const results = await analyzeNewsBatch([newsItem]);
    return results[0];
}

export async function getMarketContext(): Promise<{ text: string, bias: Bias }> {
    const nyTime = getNYTime();
    const day = nyTime.toLocaleDateString('en-US', { weekday: 'long' });

    if (!process.env.ANTHROPIC_API_KEY) {
        return {
            text: `Today is ${day}. Standard institutional positioning expected with moderate movement.`,
            bias: 'neutral'
        };
    }

    try {
        const prompt = `Provide a very brief (2 sentences) market context for TODAY (${day}) for USD Futures (ES/NQ). 
        Include if it's expected to be a high or low movement day based on typically ${day} behavior and positioning.
        Return JSON: {"text": "...", "bias": "bullish" | "bearish" | "neutral"}`;

        const msg = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 150,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = msg.content[0].type === 'text' ? msg.content[0].text : '';
        const res = JSON.parse(content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1));

        return {
            text: `[${day}] ${res.text}`,
            bias: res.bias
        };
    } catch (error) {
        return {
            text: `Today is ${day}. AI Context engine unavailable. Focus on high impact news releases.`,
            bias: 'neutral'
        };
    }
}
