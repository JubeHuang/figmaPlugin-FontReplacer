import type { MainToUI, UIToMain, FontPair, FallbackChoice } from './src/types'
import { deduplicateFonts, groupStylesByFamily } from './src/logic/fontScanner'
import { matchStyle, findUnresolved } from './src/logic/styleMatcher'

figma.showUI(__html__, { width: 360, height: 520, title: 'Font Replacer' })

let cachedAllFonts: Font[] = []

async function collectUsedFonts(): Promise<Array<{ family: string; style: string }>> {
  const textNodes = figma.root.findAll(n => n.type === 'TEXT') as TextNode[]
  const raw: Array<{ family: string; style: string }> = []

  for (const node of textNodes) {
    const len = node.characters.length
    if (len === 0) continue
    let i = 0
    while (i < len) {
      const font = node.getRangeFontName(i, i + 1)
      if (font !== figma.mixed) raw.push(font as { family: string; style: string })
      let j = i + 1
      while (j < len) {
        const next = node.getRangeFontName(j, j + 1)
        const f = font as { family: string; style: string }
        if (
          next === figma.mixed ||
          (next as { family: string; style: string }).family !== f.family ||
          (next as { family: string; style: string }).style !== f.style
        ) break
        j++
      }
      i = j
    }
  }

  return deduplicateFonts(raw)
}

;(async () => {
  await figma.loadAllPagesAsync()

  const [usedFonts, allFonts] = await Promise.all([
    collectUsedFonts(),
    figma.listAvailableFontsAsync(),
  ])
  cachedAllFonts = allFonts

  const availableFamilies = Array.from(new Set(allFonts.map(f => f.fontName.family))).sort()

  const msg: MainToUI = { type: 'init', usedFonts, availableFamilies }
  figma.ui.postMessage(msg)
})()

figma.ui.on('message', async (raw: UIToMain) => {
  if (raw.type === 'replace') await handleReplace(raw.scope, raw.pairs, [])
  if (raw.type === 'applyWithFallbacks') await handleReplace(raw.scope, raw.pairs, raw.fallbacks)
  if (raw.type === 'refresh') {
    await figma.loadAllPagesAsync()
    const [usedFonts, allFonts] = await Promise.all([
      collectUsedFonts(),
      figma.listAvailableFontsAsync(),
    ])
    cachedAllFonts = allFonts
    const availableFamilies = Array.from(new Set(allFonts.map(f => f.fontName.family))).sort()
    const msg: MainToUI = { type: 'init', usedFonts, availableFamilies }
    figma.ui.postMessage(msg)
  }
})

async function handleReplace(
  scope: 'file' | 'page',
  pairs: FontPair[],
  fallbacks: FallbackChoice[]
): Promise<void> {
  try {
    if (scope === 'file') await figma.loadAllPagesAsync()
    const root = scope === 'file' ? figma.root : figma.currentPage
    const textNodes = root.findAll(n => n.type === 'TEXT') as TextNode[]
    const availableStyles = groupStylesByFamily(cachedAllFonts.map(f => f.fontName))

    if (fallbacks.length === 0) {
      const unresolved = findUnresolved(pairs, availableStyles)
      if (unresolved.length > 0) {
        figma.ui.postMessage({ type: 'unresolved', items: unresolved } as MainToUI)
        return
      }
    }

    const lookup = new Map<string, { family: string; style: string }>()
    for (const { from, to } of pairs) {
      const styles = availableStyles.get(to.family) ?? []
      const resolvedStyle = matchStyle(from.style, styles) ?? styles[0] ?? 'Regular'
      lookup.set(`${from.family}::${from.style}`, { family: to.family, style: resolvedStyle })
    }
    for (const fb of fallbacks) {
      lookup.set(`${fb.fromFont.family}::${fb.fromFont.style}`, { family: fb.toFamily, style: fb.toStyle })
    }

    let replaced = 0

    for (const node of textNodes) {
      const len = node.characters.length
      if (len === 0) continue
      let i = 0
      while (i < len) {
        const font = node.getRangeFontName(i, i + 1)
        if (font === figma.mixed) { i++; continue }

        const f = font as { family: string; style: string }
        const target = lookup.get(`${f.family}::${f.style}`)

        let j = i + 1
        while (j < len) {
          const next = node.getRangeFontName(j, j + 1)
          if (next === figma.mixed) break
          const n2 = next as { family: string; style: string }
          if (n2.family !== f.family || n2.style !== f.style) break
          j++
        }

        if (target) {
          try {
            await figma.loadFontAsync(target)
            node.setRangeFontName(i, j, target)
            replaced++
          } catch {
            // skip — font load failed
          }
        }
        i = j
      }
    }

    figma.ui.postMessage({ type: 'done', replaced } as MainToUI)
  } catch (err) {
    figma.ui.postMessage({ type: 'error', message: String(err) } as MainToUI)
  }
}
