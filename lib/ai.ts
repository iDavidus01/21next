
import { UsdFuturesNews, Bias, Volatility, Session } from './types';

interface AiOutput {
    marketBias: Bias;
    volatilityExpectation: Volatility;
    sessionComment: string;
    confidence: number;
}

// Get current NY time
function getNYTime(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

// Determine current session based on NY time
function getCurrentSession(nyTime: Date): Session {
    const hour = nyTime.getHours();

    // Asia: 8pm - 5am NY (20:00 - 05:00)
    if (hour >= 20 || hour < 5) return 'Asia';
    // London: 3am - 12pm NY (03:00 - 12:00)
    if (hour >= 3 && hour < 12) return 'London';
    // New York: 8am - 5pm NY (08:00 - 17:00)
    if (hour >= 8 && hour < 17) return 'New York';

    return 'Asia'; // fallback
}

// Determine if we're in a kill zone or session overlap
function getSessionContext(nyTime: Date): { isKillZone: boolean; isOverlap: boolean; description: string } {
    const hour = nyTime.getHours();
    const minute = nyTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Kill Zones (high volatility periods)
    // London Open Kill Zone: 2am - 5am NY
    const londonKillStart = 2 * 60;
    const londonKillEnd = 5 * 60;

    // NY Open Kill Zone: 8am - 11am NY
    const nyKillStart = 8 * 60;
    const nyKillEnd = 11 * 60;

    // London Close Kill Zone: 10am - 12pm NY
    const londonCloseStart = 10 * 60;
    const londonCloseEnd = 12 * 60;

    // Session Overlaps (increased liquidity)
    // London-NY Overlap: 8am - 12pm NY
    const overlapStart = 8 * 60;
    const overlapEnd = 12 * 60;

    if (timeInMinutes >= londonKillStart && timeInMinutes < londonKillEnd) {
        return { isKillZone: true, isOverlap: false, description: 'London Open Kill Zone - expect high volatility' };
    }

    if (timeInMinutes >= nyKillStart && timeInMinutes < nyKillEnd) {
        if (timeInMinutes >= overlapStart && timeInMinutes < overlapEnd) {
            return { isKillZone: true, isOverlap: true, description: 'NY Kill Zone + London overlap - maximum liquidity and volatility' };
        }
        return { isKillZone: true, isOverlap: false, description: 'NY Open Kill Zone - prime trading window' };
    }

    if (timeInMinutes >= londonCloseStart && timeInMinutes < londonCloseEnd) {
        return { isKillZone: true, isOverlap: true, description: 'London Close + NY session - volatility spike expected' };
    }

    if (timeInMinutes >= overlapStart && timeInMinutes < overlapEnd) {
        return { isKillZone: false, isOverlap: true, description: 'London-NY overlap - increased volume' };
    }

    return { isKillZone: false, isOverlap: false, description: 'Standard session activity' };
}

export async function analyzeNews(newsItem: Partial<UsdFuturesNews>): Promise<UsdFuturesNews> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 100));

    const title = newsItem.title?.toLowerCase() || '';
    const nyTime = getNYTime();
    const dayOfWeek = nyTime.toLocaleDateString('en-US', { weekday: 'long' });
    const session = getCurrentSession(nyTime);
    const sessionCtx = getSessionContext(nyTime);

    let output: AiOutput = {
        marketBias: 'neutral',
        volatilityExpectation: 'low',
        sessionComment: sessionCtx.description,
        confidence: 70
    };

    // High impact events
    const isHighImpact = title.includes('cpi') || title.includes('nfp') ||
        title.includes('fomc') || title.includes('rate decision') ||
        title.includes('gdp') || title.includes('employment');

    const isMediumImpact = title.includes('ppi') || title.includes('retail sales') ||
        title.includes('jobless claims') || title.includes('pmi');

    // Volatility calculation based on event + session context
    if (isHighImpact) {
        output.volatilityExpectation = 'high';
        output.confidence = 92;

        if (sessionCtx.isKillZone) {
            output.sessionComment = `Critical ${dayOfWeek} release during kill zone. Expect explosive moves and liquidity sweeps.`;
        } else if (sessionCtx.isOverlap) {
            output.sessionComment = `Major data release during session overlap. Institutional volume will amplify reaction.`;
        } else {
            output.sessionComment = `High-impact ${dayOfWeek} event. Markets compressed pre-release, expansion likely post-data.`;
        }
    } else if (isMediumImpact) {
        output.volatilityExpectation = sessionCtx.isKillZone || sessionCtx.isOverlap ? 'high' : 'medium';
        output.confidence = 85;
        output.sessionComment = sessionCtx.isKillZone
            ? `Moderate event amplified by kill zone timing. Watch for stop hunts.`
            : `Standard volatility expected. Monitor for deviation from forecast.`;
    } else {
        output.volatilityExpectation = sessionCtx.isKillZone ? 'medium' : 'low';
        output.confidence = 75;
    }

    // Bias logic based on forecast vs previous
    if (newsItem.forecast && newsItem.previous) {
        try {
            const forecastNum = parseFloat(newsItem.forecast.replace(/[^0-9.-]/g, ''));
            const previousNum = parseFloat(newsItem.previous.replace(/[^0-9.-]/g, ''));

            if (!isNaN(forecastNum) && !isNaN(previousNum)) {
                if (forecastNum > previousNum) {
                    output.marketBias = 'bullish';
                    output.sessionComment += ' Forecast improvement suggests USD strength.';
                } else if (forecastNum < previousNum) {
                    output.marketBias = 'bearish';
                    output.sessionComment += ' Forecast deterioration may pressure USD.';
                }
            }
        } catch (e) {
            // Keep neutral if parsing fails
        }
    }

    // Unemployment special case
    if (title.includes('unemployment') || title.includes('jobless')) {
        output.marketBias = 'bearish';
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

// Dynamic market context based on current session and time
export async function getMarketContext(): Promise<{ text: string, bias: Bias }> {
    const nyTime = getNYTime();
    const day = nyTime.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = nyTime.getHours();
    const session = getCurrentSession(nyTime);
    const sessionCtx = getSessionContext(nyTime);

    let context = '';
    let bias: Bias = 'neutral';

    // Day-specific context
    if (day === 'Monday') {
        context = `${day} ${session} session. Range compression typical as institutions position for week ahead. `;
        if (sessionCtx.isKillZone) {
            context += 'Kill zone active - watch for liquidity grabs before directional moves.';
        } else {
            context += 'Low volume expected until London-NY overlap.';
        }
    } else if (day === 'Friday') {
        context = `${day} ${session} session. Profit-taking and position squaring into weekend. `;
        context += sessionCtx.isKillZone
            ? 'Final kill zone of week - expect volatility spikes before close.'
            : 'Mean reversion likely as week closes out.';
    } else if (day === 'Wednesday' || day === 'Thursday') {
        context = `Mid-week ${session} session. Trend continuation probable. `;
        if (sessionCtx.isOverlap) {
            context += 'Session overlap provides optimal liquidity for institutional execution.';
            bias = 'bullish';
        } else if (sessionCtx.isKillZone) {
            context += 'Kill zone active - prime window for smart money accumulation.';
        } else {
            context += 'Monitor key levels for breakout or reversal signals.';
        }
    } else {
        context = `${day} ${session} session. ${sessionCtx.description}. `;
        if (sessionCtx.isKillZone || sessionCtx.isOverlap) {
            context += 'High probability setup window for intraday traders.';
        } else {
            context += 'Standard market conditions - focus on high-impact news catalysts.';
        }
    }

    return { text: context, bias };
}
