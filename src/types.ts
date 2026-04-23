export interface FontName {
  family: string
  style: string
}

export interface FontPair {
  from: FontName
  to: FontName
}

export interface UnresolvedStyle {
  fromFont: FontName
  toFamily: string
  candidates: string[]
}

export interface FallbackChoice {
  fromFont: FontName
  toFamily: string
  toStyle: string
}

// Main → UI messages
export type MainToUI =
  | { type: 'init'; usedFonts: FontName[]; availableFamilies: string[] }
  | { type: 'unresolved'; items: UnresolvedStyle[] }
  | { type: 'done'; replaced: number }
  | { type: 'error'; message: string }

// UI → Main messages
export type UIToMain =
  | { type: 'replace'; scope: 'file' | 'page'; pairs: FontPair[] }
  | { type: 'applyWithFallbacks'; pairs: FontPair[]; fallbacks: FallbackChoice[]; scope: 'file' | 'page' }
  | { type: 'refresh' }
