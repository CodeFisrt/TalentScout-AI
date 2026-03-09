import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const PROMPT = `You are an AI recruiter. Compare the candidate's skills with the job description and return ONLY a single number between 0 and 100 as the match score. No explanation, no other text - just the integer. Consider relevance of skills, experience level, and keywords.`;

/**
 * Get AI match score (0-100) for candidate skills vs job description.
 * @param {string} jobDescription - Job description or required skills text
 * @param {string} candidateSkills - Candidate skills (comma-separated or free text)
 * @returns {Promise<number>} Score 0-100
 */
export async function getMatchScore(jobDescription, candidateSkills) {
  if (!process.env.OPENAI_API_KEY) return Math.floor(Math.random() * 30) + 60; // fallback for demo
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: PROMPT },
      {
        role: 'user',
        content: `Job description/requirements:\n${(jobDescription || '').slice(0, 2000)}\n\nCandidate skills:\n${(candidateSkills || '').slice(0, 500)}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 10,
  });
  const text = response.choices[0]?.message?.content?.trim() || '50';
  const num = parseInt(text.replace(/\D/g, ''), 10);
  return isNaN(num) ? 50 : Math.min(100, Math.max(0, num));
}
