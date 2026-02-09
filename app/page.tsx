
import { Suspense } from 'react';
import Image from 'next/image';
import { getMarketContext } from '@/lib/ai';
import { scrapeForexFactory } from '@/lib/scraper';
import { UsdFuturesNews } from '@/lib/types';
import { NewsList } from '@/components/news-list';
import { VolatilityChart } from '@/components/volatility-chart';
import { Badge } from '@/components/ui/badge';
import { NYClock } from '@/components/ny-clock';
import { Layers, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function Dashboard() {
  let context: { text: string; bias: 'neutral' | 'bullish' | 'bearish' } = {
    text: 'Loading market context...',
    bias: 'neutral'
  };
  let news: UsdFuturesNews[] = [];

  try {
    context = await getMarketContext();
    const rawNews = await scrapeForexFactory();
    const relevantNews = rawNews.slice(0, 12);

    const { analyzeNewsBatch } = await import('@/lib/ai');
    const groupedNews: Record<string, Partial<UsdFuturesNews>[]> = {};

    relevantNews.forEach(item => {
      const time = item.eventTimeUTC || 'unknown';
      if (!groupedNews[time]) groupedNews[time] = [];
      groupedNews[time].push(item);
    });

    const analyzedGroups = await Promise.all(
      Object.values(groupedNews).map(group => analyzeNewsBatch(group))
    );

    news = analyzedGroups.flat().sort((a, b) =>
      new Date(a.eventTimeUTC).getTime() - new Date(b.eventTimeUTC).getTime()
    );
  } catch (error) {
    console.error('Dashboard data loading failed:', error);
  }

  return (
    <div className="relative min-h-screen text-zinc-100 font-sans selection:bg-primary/20">
      <div className="fixed inset-0 z-0 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 liquid-bg opacity-30 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="FUTURES.AI Logo"
                  width={32}
                  height={32}
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                />
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                <h3 className="text-xl font-medium text-zinc-200 leading-relaxed max-w-3xl">
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
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="tracking-[0.2em] text-xs">SYNCING MARKET DATA...</span>
        </div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  )
}
