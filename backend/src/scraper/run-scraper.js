import 'dotenv/config';
import pool from '../config/database.js';
import { scrapeLinkedInJobs } from './linkedin-scraper.js';

async function run() {
  console.log('TalentScout AI – Job scraper started');
  try {
    const result = await scrapeLinkedInJobs({ headless: true, maxJobsPerQuery: 5 });
    console.log('Scrape result:', result);
  } catch (err) {
    console.error('Scraper error:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
