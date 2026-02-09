
import { Suspense } from 'react';
import { getMarketContext } from '@/lib/ai';
import { scrapeForexFactory } from '@/lib/scraper'; // For basic server-side fetch if validation needed
import { UsdFuturesNews } from '@/lib/types';
import { FilterForm } from '@/components/filter-form';
import { NewsCard } from '@/components/news-card';
import { VolatilityChart } from '@/components/volatility-chart';
import { Badge } from '@/components/ui/badge';

// Revalidate every 15 mins (server component level)
export const revalidate = 900;

async function Dashboard() {
  const context = await getMarketContext();

  // NOTE: In production, we should call the API route or the function directly.
  // Since we are in Server Component, calling function directly is better.
  // But to simulate "API" call mentioned in requirements, I will fetch from localhost absolute URL in real app.
  // Here for simplicity and reliability in this env, I'll import the logic.
  // However, `app/api/scrape` logic is: scrape -> analyze.
  // Let's reuse the logic via a direct helper to avoid HTTP roundtrip overhead in this demo env,
  // but let's strictly mock the API behavior.

  // Actually, let's just fetch from the API route we built?
  // No, `headers()` and absolute URL issues in Next.js server components can be tricky in dev environments.
  // Safest is to call the logic directly since we are on the server.

  const { scrapeForexFactory } = await import('@/lib/scraper');
  const { analyzeNews } = await import('@/lib/ai');

  const rawNews = await scrapeForexFactory();
  const relevantNews = rawNews.slice(0, 8);
  const news: UsdFuturesNews[] = await Promise.all(
    relevantNews.map(async (item) => await analyzeNews(item))
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">

      {/* 1. Header & Market Context */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white/90">
              USD Futures <span className="text-primary/80">Macro</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • Pre-NY Session
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="h-8 glass">ES</Badge>
            <Badge variant="outline" className="h-8 glass">NQ</Badge>
            <Badge variant="outline" className="h-8 glass">DXY</Badge>
          </div>
        </div>

        {/* Market Context AI Card */}
        <div className="glass-card rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Today's Market Context
          </h2>
          <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">
            {context.text}
          </p>
          <div className="mt-4 flex gap-3">
            <Badge variant={context.bias as any} className="text-xs uppercase">
              Bias: {context.bias}
            </Badge>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="@container">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

          {/* Left Column: Volatility & Filters */}
          <div className="col-span-1 space-y-8">
            <section>
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
                Volatility Expectation
              </h3>
              <div className="glass-card p-4 rounded-xl">
                <VolatilityChart />
                <div className="mt-4 text-center">
                  <span className="text-xs text-zinc-500">Intraday Volatility Index (AI Projected)</span>
                </div>
              </div>
            </section>

            <section>
              <FilterForm />
            </section>
          </div>

          {/* Right Column: News Feed */}
          <div className="col-span-1 xl:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Incoming Event Stream
              </h3>
              <span className="text-xs text-zinc-600">
                Live updates strictly filtered for USD High/Med Impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} news={item}>
                  <NewsCard.Header />
                  <NewsCard.Meta />
                  <NewsCard.AI />
                </NewsCard>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background to-background">
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-zinc-500">Initializing AI Macro Feed...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}
