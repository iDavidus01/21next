import { UsdFuturesNews } from './types';
import { getMockNewsData } from './mock-data';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read news from JSON cache file
function readFromCache(): Partial<UsdFuturesNews>[] {
    try {
        const cachePath = join(process.cwd(), 'data', 'news-cache.json');
        const cacheData = readFileSync(cachePath, 'utf-8');
        const parsed = JSON.parse(cacheData);

        console.log(`✅ Loaded ${parsed.news.length} news items from cache (last updated: ${parsed.lastUpdated})`);
        return parsed.news;
    } catch (error) {
        console.warn('⚠️ Failed to read cache file, using mock data:', error);
        return getMockNewsData();
    }
}

export async function scrapeForexFactory(): Promise<Partial<UsdFuturesNews>[]> {
    // Use JSON cache instead of scraping to avoid 403 errors
    console.log('📰 Reading news from JSON cache...');
    return readFromCache();
}
