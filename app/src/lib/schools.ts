// Data model + helpers for the Campus Map feature.
// Schools are stored client-side in localStorage so the tool works with no
// backend on both GitHub Pages and Vercel.

export type Quality = 'A' | 'B' | 'C';
export type Status = 'considering' | 'visiting' | 'visited';
export type Region = 'US' | 'Europe' | 'Other';

export interface School {
  id: string;
  name: string;
  location: string; // human-readable "City, Country"
  lat: number;
  lng: number;
  ranking: number; // 1-5 (0 = unranked)
  quality: Quality | null; // A-C (null = ungraded)
  status: Status;
  notes: string;
  createdAt: number;
}

export const STORAGE_KEY = 'cc_campus_map_schools_v1';
export const SEED_FLAG_KEY = 'cc_campus_map_seeded_v1';

export const STATUS_LABELS: Record<Status, string> = {
  considering: 'Considering',
  visiting: 'Planning to visit',
  visited: 'Visited',
};

// Quality grade -> brand-aligned color used for map pins, badges and the legend.
export const QUALITY_COLORS: Record<Quality, string> = {
  A: '#14B8A6', // teal — top tier
  B: '#F59E0B', // amber — solid
  C: '#94A3B8', // slate — backup
};

export function qualityColor(q: Quality | null): string {
  return q ? QUALITY_COLORS[q] : '#7F56D9'; // default to brand purple when ungraded
}

// Rough region classification from coordinates so we can offer US / Europe filters.
export function regionFor(lat: number, lng: number): Region {
  const inUS = lat >= 24 && lat <= 50 && lng >= -125 && lng <= -66;
  const inAlaskaHawaii =
    (lat >= 51 && lat <= 72 && lng >= -170 && lng <= -129) || // Alaska
    (lat >= 18 && lat <= 23 && lng >= -161 && lng <= -154); // Hawaii
  if (inUS || inAlaskaHawaii) return 'US';
  const inEurope = lat >= 35 && lat <= 71 && lng >= -25 && lng <= 45;
  if (inEurope) return 'Europe';
  return 'Other';
}

export function createId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadSchools(): School[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSchool);
  } catch {
    return [];
  }
}

export function saveSchools(schools: School[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schools));
  } catch {
    // storage full / unavailable — fail silently, the UI still works in-memory
  }
}

function isValidSchool(s: unknown): s is School {
  if (!s || typeof s !== 'object') return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.lat === 'number' &&
    typeof o.lng === 'number'
  );
}

// A small curated set so the map looks great on first load. The user can
// edit or clear these at any time.
export function sampleSchools(): School[] {
  const now = Date.now();
  const base: Omit<School, 'id' | 'createdAt'>[] = [
    {
      name: 'Stanford University',
      location: 'Stanford, CA, USA',
      lat: 37.4275,
      lng: -122.1697,
      ranking: 5,
      quality: 'A',
      status: 'visiting',
      notes: 'Strong CS + entrepreneurship. Tour booked.',
    },
    {
      name: 'Massachusetts Institute of Technology',
      location: 'Cambridge, MA, USA',
      lat: 42.3601,
      lng: -71.0942,
      ranking: 5,
      quality: 'A',
      status: 'considering',
      notes: 'Reach school. Check engineering programs.',
    },
    {
      name: 'University of Michigan',
      location: 'Ann Arbor, MI, USA',
      lat: 42.278,
      lng: -83.7382,
      ranking: 4,
      quality: 'B',
      status: 'visited',
      notes: 'Big campus, great vibe. Liked the dorms.',
    },
    {
      name: 'University of Oxford',
      location: 'Oxford, UK',
      lat: 51.7548,
      lng: -1.2544,
      ranking: 5,
      quality: 'A',
      status: 'considering',
      notes: 'Collegiate system. Tutorial-style teaching.',
    },
    {
      name: 'ETH Zürich',
      location: 'Zürich, Switzerland',
      lat: 47.3763,
      lng: 8.5476,
      ranking: 4,
      quality: 'A',
      status: 'visiting',
      notes: 'Top European STEM. Affordable tuition.',
    },
    {
      name: 'Bocconi University',
      location: 'Milan, Italy',
      lat: 45.4476,
      lng: 9.1885,
      ranking: 3,
      quality: 'B',
      status: 'considering',
      notes: 'Business/economics focus. Great city.',
    },
  ];
  return base.map((b, i) => ({
    ...b,
    id: createId() + i,
    createdAt: now + i,
  }));
}

// --- Geocoding via OpenStreetMap Nominatim (free, no API key) -------------

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}

export async function geocode(query: string): Promise<GeocodeResult[]> {
  const url =
    'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=' +
    encodeURIComponent(query);
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data: Array<{ display_name: string; lat: string; lon: string }> =
    await res.json();
  return data.map((d) => ({
    label: d.display_name,
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
  }));
}
