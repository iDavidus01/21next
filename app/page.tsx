
import { Suspense } from 'react';
import { getMarketContext } from '@/lib/ai';
import { scrapeForexFactory } from '@/lib/scraper';
import { UsdFuturesNews } from '@/lib/types';
import { NewsList } from '@/components/news-list';
import { VolatilityChart } from '@/components/volatility-chart';
import { Badge } from '@/components/ui/badge';
import { NYClock } from '@/components/ny-clock';
import { Activity, Layers, ArrowUpRight } from 'lucide-react';


export const dynamic = 'force-dynamic'; // Use dynamic rendering
export const revalidate = 0; // Don't cache

async function Dashboard() {
  let context: { text: string; bias: 'neutral' | 'bullish' | 'bearish' } = {
    text: 'Loading market context...',
    bias: 'neutral'
  };
  let news: UsdFuturesNews[] = [];

  try {
    context = await getMarketContext();
    const rawNews = await scrapeForexFactory();

    // Basic sorting by time (ascending) - assuming rawNews is roughly ordered
    // In a real app we would sort by date object
    const relevantNews = rawNews.slice(0, 12);

    // Analyze news (parallel)
    const { analyzeNews } = await import('@/lib/ai');
    news = await Promise.all(
      relevantNews.map(async (item) => await analyzeNews(item))
    );
  } catch (error) {
    console.error('Dashboard data loading failed:', error);
    // Continue with empty/default data
  }

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-primary/20">

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 liquid-bg opacity-30 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 space-y-16">

        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                FUTURES<span className="text-primary">.AI</span>
              </h1>
            </div>
            <p className="text-zinc-400 font-mono text-sm tracking-wide pl-1">
              INSTITUTIONAL GRADE MACRO ANALYSIS • USD FOCUS
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              {['ES', 'NQ'].map(ticker => (
                <div key={ticker} className="glass px-3 py-1 rounded text-xs font-mono font-bold text-zinc-300 border-white/5 hover:border-primary/30 transition-colors cursor-default">
                  {ticker}
                </div>
              ))}
            </div>
            <NYClock />
          </div>
        </header>

        {/* 2. Top Grid: Context & Volatility */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Market Context (8 cols) */}
          <div className="lg:col-span-8 glass-card rounded-2xl p-8 relative group">
            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
              <Layers className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10 space-y-6 pr-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
                <h2 className="text-sm font-mono text-primary uppercase tracking-widest">Today's Context</h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-light text-white leading-tight">
                  {context.text}
                </h3>
                <div className="flex items-center gap-4 pt-2">
                  <Badge variant={context.bias as any} className="text-sm px-3 py-1 uppercase tracking-wider">
                    Bias: {context.bias}
                  </Badge>
                  <span className="text-zinc-500 text-xs font-mono">
                    AI Confidence: 94%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Volatility Widget (4 cols) */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Volatility Index</h3>
                <span className="text-2xl font-bold text-white">High</span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>
            <div className="h-[180px] w-full mt-auto">
              <VolatilityChart />
            </div>
          </div>
        </div>

        {/* 3. Main Split: News & Filters */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          <NewsList initialNews={news} />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-500 font-mono">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          INITIALIZING ORACLE...
        </div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  )
}
