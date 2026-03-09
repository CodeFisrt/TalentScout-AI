import { chromium } from 'playwright';
import { createJob, jobExistsByLink } from '../models/Job.js';
import { createRecruiter } from '../models/Recruiter.js';

const SEARCH_QUERIES = [
  'React Developer',
  'Angular Developer',
  'Java Developer',
  '.NET Developer',
];

const LINKEDIN_JOBS_URL = 'https://www.linkedin.com/jobs/search';

/**
 * Scrape LinkedIn jobs for given keywords.
 * Note: LinkedIn may require login and has anti-bot measures. This is a structural implementation.
 * For production, consider official LinkedIn API or dedicated job board APIs.
 */
export async function scrapeLinkedInJobs(options = {}) {
  const { headless = true, maxJobsPerQuery = 10 } = options;
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  const results = { added: 0, skipped: 0, errors: [] };

  try {
    for (const query of SEARCH_QUERIES) {
      try {
        const url = `${LINKEDIN_JOBS_URL}/?keywords=${encodeURIComponent(query)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);

        const jobCards = await page.$$('[data-job-id], .job-search-card, [data-entity-urn*="jobListing"]');
        let count = 0;
        for (const card of jobCards) {
          if (count >= maxJobsPerQuery) break;
          try {
            const titleEl = await card.$('h3, .job-search-card__title, [class*="title"]');
            const companyEl = await card.$('[class*="company"], .job-search-card__subtitle');
            const locationEl = await card.$('[class*="location"], .job-search-card__location');
            const linkEl = await card.$('a[href*="/jobs/"]');
            const title = titleEl ? (await titleEl.textContent()).trim() : '';
            const company = companyEl ? (await companyEl.textContent()).trim() : 'Unknown';
            const location = locationEl ? (await locationEl.textContent()).trim() : '';
            let jobLink = linkEl ? await linkEl.getAttribute('href') : '';
            if (jobLink && !jobLink.startsWith('http')) jobLink = 'https://www.linkedin.com' + jobLink;

            if (!title || !jobLink) continue;
            const exists = await jobExistsByLink(jobLink);
            if (exists) { results.skipped++; continue; }

            await createJob({
              title,
              company,
              location,
              skills: query,
              experience: '',
              description: `${query} position at ${company}.`,
              job_link: jobLink,
              posted_date: new Date().toISOString().slice(0, 10),
              source: 'linkedin',
            });
            results.added++;
            count++;
          } catch (e) {
            results.errors.push(e.message);
          }
        }
      } catch (err) {
        results.errors.push(`Query "${query}": ${err.message}`);
      }
    }
  } finally {
    await browser.close();
  }
  return results;
}
