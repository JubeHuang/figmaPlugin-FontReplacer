import type { FontPair, UnresolvedStyle } from '../types'

export function matchStyle(sourceStyle: string, candidates: string[]): string | null {
  const lower = sourceStyle.toLowerCase()
  return candidates.find(c => c.toLowerCase() === lower) ?? null
}

export function findUnresolved(
  pairs: FontPair[],
  availableStyles: Map<string, string[]>
): UnresolvedStyle[] {
  const unresolved: UnresolvedStyle[] = []
  for (const { from, to } of pairs) {
    const styles = availableStyles.get(to.family) ?? []
    if (matchStyle(from.style, styles) === null) {
      unresolved.push({ fromFont: from, toFamily: to.family, candidates: styles })
    }
  }
  return unresolved
}
