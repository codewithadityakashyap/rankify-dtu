import { NextRequest } from 'next/server';

/**
 * Validates that the request is coming from an allowed origin or referer.
 * This helps prevent unauthorized bulk scraping from scripts/Postman.
 */
export function validateRequestOrigin(req: NextRequest): boolean {
  // Allow localhost for development
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const referer = req.headers.get('referer');
  const origin = req.headers.get('origin');

  const source = referer || origin || '';
  
  if (!source) {
    return false; // Block requests without origin/referer (typical of curl/postman)
  }

  // Strictly check if it's coming from our own domains
  // Allow vercel.app domains, rankify-dtu domains, and localhosts
  const allowed = ['rankify-dtu', 'vercel.app', 'localhost'];
  return allowed.some(domain => source.includes(domain));
}
