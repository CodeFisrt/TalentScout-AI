import 'dotenv/config';
import cron from 'node-cron';
import { scrapeLinkedInJobs } from './scraper/linkedin-scraper.js';

// Run every 3 hours: 0 */3 * * *
cron.schedule('0 */3 * * *', async () => {
  console.log('[Scheduler] Running job scrape at', new Date().toISOString());
  try {
    const result = await scrapeLinkedInJobs({ headless: true, maxJobsPerQuery: 10 });
    console.log('[Scheduler] Scrape completed:', result);
  } catch (err) {
    console.error('[Scheduler] Error:', err);
  }
}, { timezone: 'UTC' });

console.log('TalentScout AI – Cron scheduler started (job scrape every 3 hours). Press Ctrl+C to stop.');
