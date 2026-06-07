// Reliable "visit & events" links per school. We avoid guessing exact official
// URLs (which vary wildly and go stale). Instead we link the school's homepage
// (from College Scorecard when available) and use site-scoped web searches that
// reliably land on the school's own visit / tour / events pages.
import type { CollegeData } from './scorecard';
import type { School } from './schools';

export interface VisitLinks {
  site: string | null;
  visit: string;
  virtualTour: string;
  events: string;
}

function hostFrom(url: string | null | undefined): string | null {
  if (!url) return null;
  let u = url.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function search(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function visitLinks(school: School, college: CollegeData | null): VisitLinks {
  const host = hostFrom(college?.schoolUrl);
  const name = school.name;
  // When we know the official domain, scope searches to it for accuracy.
  const scoped = (intent: string) =>
    host ? search(`site:${host} ${intent}`) : search(`${name} ${intent}`);

  return {
    site: host ? `https://${host}` : null,
    visit: scoped('schedule a campus visit or tour admissions'),
    virtualTour: search(`${name} virtual campus tour`),
    events: scoped('admissions events register info session'),
  };
}
