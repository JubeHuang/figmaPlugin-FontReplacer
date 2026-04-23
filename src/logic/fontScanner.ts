import type { FontName } from '../types'

export function deduplicateFonts(fonts: FontName[]): FontName[] {
  const seen = new Set<string>()
  return fonts.filter(f => {
    const key = `${f.family}::${f.style}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function groupStylesByFamily(fonts: FontName[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const { family, style } of fonts) {
    if (!map.has(family)) map.set(family, [])
    map.get(family)!.push(style)
  }
  return map
}
