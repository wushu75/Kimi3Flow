// Tiny subsequence fuzzy matcher. Returns a score (higher is better) or null
// when the query characters cannot be found in order. Kept dependency-free.

export function fuzzyScore(query: string, text: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const t = text.toLowerCase();

  let qi = 0;
  let score = 0;
  let lastMatch = -1;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      // Reward consecutive matches and matches at word boundaries.
      if (lastMatch === ti - 1) score += 3;
      if (ti === 0 || t[ti - 1] === ' ' || t[ti - 1] === '-' || t[ti - 1] === '_') score += 2;
      score += 1;
      lastMatch = ti;
      qi++;
    }
  }

  return qi === q.length ? score : null;
}

export interface Ranked<T> {
  item: T;
  score: number;
}

export function fuzzyFilter<T>(query: string, items: T[], key: (item: T) => string): T[] {
  if (!query.trim()) return items;
  const ranked: Ranked<T>[] = [];
  for (const item of items) {
    const score = fuzzyScore(query, key(item));
    if (score !== null) ranked.push({ item, score });
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked.map((r) => r.item);
}
