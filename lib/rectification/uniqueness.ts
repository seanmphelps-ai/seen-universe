export function sentenceKey(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function duplicatedLines(a: string, b: string) {
  const as = a.split(/(?<=[.!?])\s+/).map(sentenceKey).filter(Boolean);
  const bs = new Set(b.split(/(?<=[.!?])\s+/).map(sentenceKey).filter(Boolean));
  return as.filter((line) => line.length > 24 && bs.has(line));
}

export function rejectIfShared(thisCard: string, otherCards: string[]) {
  for (const other of otherCards) {
    const hits = duplicatedLines(thisCard, other);
    if (hits.length) {
      throw new Error(`SHARED_LINE: ${hits[0]}`);
    }
  }
}
