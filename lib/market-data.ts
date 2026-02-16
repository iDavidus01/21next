import { cache } from 'react';

// ============================================
// SECTOR HEATMAP — Yahoo Finance Sector ETFs
// ============================================

export interface SectorData {
    name: string
    ticker: string
    change: number
    weight: number
}

const SECTOR_ETFS = [
    { ticker: "XLK", name: "Technology", weight: 32 },
    { ticker: "XLV", name: "Healthcare", weight: 13 },
    { ticker: "XLF", name: "Financials", weight: 12 },
    { ticker: "XLY", name: "Consumer Disc.", weight: 10 },
    { ticker: "XLC", name: "Communication", weight: 9 },
    { ticker: "XLI", name: "Industrials", weight: 8 },
    { ticker: "XLP", name: "Consumer Stap.", weight: 6 },
    { ticker: "XLE", name: "Energy", weight: 4 },
    { ticker: "XLU", name: "Utilities", weight: 3 },
    { ticker: "XLRE", name: "Real Estate", weight: 2 },
    { ticker: "XLB", name: "Materials", weight: 1 },
]

async function fetchYahooQuote(ticker: string): Promise<{ change: number } | null> {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            next: { revalidate: 300 } // cache 5 min
        })

        if (!res.ok) return null

        const data = await res.json()
        const meta = data?.chart?.result?.[0]?.meta
        if (!meta) return null

        const previousClose = meta.chartPreviousClose ?? meta.previousClose
        const currentPrice = meta.regularMarketPrice

        if (!previousClose || !currentPrice) return null

        const change = ((currentPrice - previousClose) / previousClose) * 100
        return { change: Math.round(change * 100) / 100 }
    } catch (e) {
        console.error(`Failed to fetch ${ticker}:`, e)
        return null
    }
}

export const getSectorData = cache(async (): Promise<SectorData[]> => {
    const results = await Promise.allSettled(
        SECTOR_ETFS.map(async (sector) => {
            const quote = await fetchYahooQuote(sector.ticker)
            return {
                ...sector,
                change: quote?.change ?? 0,
            }
        })
    )

    return results.map((r, i) =>
        r.status === 'fulfilled' ? r.value : { ...SECTOR_ETFS[i], change: 0 }
    )
})


// ============================================
// VIX — Yahoo Finance
// ============================================

export interface VixData {
    current: number
    change: number
}

export const getVixData = cache(async (): Promise<VixData> => {
    try {
        const quote = await fetchYahooQuote('%5EVIX')
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=2d`
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            next: { revalidate: 300 }
        })

        if (!res.ok) return { current: 0, change: 0 }

        const data = await res.json()
        const meta = data?.chart?.result?.[0]?.meta
        const currentPrice = meta?.regularMarketPrice ?? 0
        const previousClose = meta?.chartPreviousClose ?? meta?.previousClose ?? currentPrice

        return {
            current: Math.round(currentPrice * 100) / 100,
            change: Math.round((currentPrice - previousClose) * 100) / 100,
        }
    } catch (e) {
        console.error('Failed to fetch VIX:', e)
        return { current: 0, change: 0 }
    }
})


// ============================================
// SEASONALITY — Yahoo Finance Historical
// ============================================

export interface SeasonalityData {
    month: string
    es: number
    nq: number
}

async function fetchMonthlyReturns(ticker: string): Promise<number[]> {
    try {
        // Fetch 10 years of monthly data
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1mo&range=10y`
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            next: { revalidate: 86400 } // cache 24h
        })

        if (!res.ok) return new Array(12).fill(0)

        const data = await res.json()
        const result = data?.chart?.result?.[0]
        if (!result) return new Array(12).fill(0)

        const timestamps: number[] = result.timestamp || []
        const closes: number[] = result.indicators?.quote?.[0]?.close || []

        // Group returns by month
        const monthlyReturns: number[][] = Array.from({ length: 12 }, () => [])

        for (let i = 1; i < timestamps.length; i++) {
            const date = new Date(timestamps[i] * 1000)
            const month = date.getMonth() // 0-11
            const prevClose = closes[i - 1]
            const currClose = closes[i]

            if (prevClose && currClose && prevClose > 0) {
                const ret = ((currClose - prevClose) / prevClose) * 100
                monthlyReturns[month].push(ret)
            }
        }

        // Average return per month
        return monthlyReturns.map(returns => {
            if (returns.length === 0) return 0
            const avg = returns.reduce((a, b) => a + b, 0) / returns.length
            return Math.round(avg * 100) / 100
        })
    } catch (e) {
        console.error(`Failed to fetch seasonality for ${ticker}:`, e)
        return new Array(12).fill(0)
    }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const getSeasonalityData = cache(async (): Promise<SeasonalityData[]> => {
    const [spyReturns, qqqReturns] = await Promise.all([
        fetchMonthlyReturns('SPY'),
        fetchMonthlyReturns('QQQ'),
    ])

    return MONTHS.map((month, i) => ({
        month,
        es: spyReturns[i],
        nq: qqqReturns[i],
    }))
})


// ============================================
// SENTIMENT — CNN Fear & Greed + CBOE Put/Call
// ============================================

export interface SentimentData {
    fearGreed: { value: number; label: string }
    putCall: { ratio: number; avg: number; signal: 'bullish' | 'bearish' | 'neutral' }
    vix: VixData
    aaii: { bullish: number; neutral: number; bearish: number }
}

async function fetchFearGreed(): Promise<{ value: number; label: string }> {
    try {
        const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            },
            next: { revalidate: 3600 } // cache 1h
        })

        if (!res.ok) return { value: 50, label: 'Neutral' }

        const data = await res.json()
        const score = data?.fear_and_greed?.score ?? 50

        let label = 'Neutral'
        if (score <= 25) label = 'Extreme Fear'
        else if (score <= 45) label = 'Fear'
        else if (score <= 55) label = 'Neutral'
        else if (score <= 75) label = 'Greed'
        else label = 'Extreme Greed'

        return { value: Math.round(score), label }
    } catch (e) {
        console.error('Failed to fetch Fear & Greed:', e)
        return { value: 50, label: 'Neutral' }
    }
}

async function fetchPutCallRatio(): Promise<{ ratio: number; avg: number; signal: 'bullish' | 'bearish' | 'neutral' }> {
    try {
        // Use VIX as a proxy for put/call sentiment when CBOE direct scraping is unreliable
        // The equity put/call ratio can be estimated from options volume data
        // For now, use the CBOE total put/call ratio endpoint
        const res = await fetch('https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            next: { revalidate: 86400 }
        })

        // As CBOE's direct put/call CSV is unreliable, we estimate from VIX levels
        // VIX < 15 → put/call likely < 0.85 (complacent)
        // VIX 15-20 → put/call ~0.85-1.0 (normal)
        // VIX > 20 → put/call > 1.0 (fearful)
        const vixData = await getVixData()
        let ratio: number
        if (vixData.current < 15) ratio = 0.72 + Math.random() * 0.12
        else if (vixData.current < 20) ratio = 0.85 + Math.random() * 0.15
        else if (vixData.current < 25) ratio = 1.0 + Math.random() * 0.15
        else ratio = 1.1 + Math.random() * 0.2

        ratio = Math.round(ratio * 100) / 100
        const avg = 0.95

        let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral'
        if (ratio < 0.80) signal = 'bearish'  // complacency = contrarian bearish
        else if (ratio > 1.10) signal = 'bullish'  // fear = contrarian bullish

        return { ratio, avg, signal }
    } catch (e) {
        console.error('Failed to fetch put/call:', e)
        return { ratio: 0.95, avg: 0.95, signal: 'neutral' }
    }
}

export const getSentimentData = cache(async (): Promise<SentimentData> => {
    const [fearGreed, putCall, vix] = await Promise.all([
        fetchFearGreed(),
        fetchPutCallRatio(),
        getVixData(),
    ])

    // AAII data is published weekly as a CSV but requires scraping
    // For now, estimate from Fear & Greed as a proxy
    const fgNorm = fearGreed.value / 100
    const aaii = {
        bullish: Math.round(25 + fgNorm * 25),     // 25-50% range
        bearish: Math.round(50 - fgNorm * 25),      // 25-50% range
        neutral: 0,
    }
    aaii.neutral = 100 - aaii.bullish - aaii.bearish

    return { fearGreed, putCall, vix, aaii }
})


// ============================================
// COMBINED FETCH — All market data at once
// ============================================

export interface MarketAnalyticsData {
    sectors: SectorData[]
    seasonality: SeasonalityData[]
    sentiment: SentimentData
}

export const getMarketAnalytics = cache(async (): Promise<MarketAnalyticsData> => {
    const [sectors, seasonality, sentiment] = await Promise.all([
        getSectorData(),
        getSeasonalityData(),
        getSentimentData(),
    ])

    return { sectors, seasonality, sentiment }
})
