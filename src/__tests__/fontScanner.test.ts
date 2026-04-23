import { describe, it, expect } from 'vitest'
import { deduplicateFonts, groupStylesByFamily } from '../logic/fontScanner'
import type { FontName } from '../types'

describe('deduplicateFonts', () => {
  it('removes duplicate font+style combinations', () => {
    const input: FontName[] = [
      { family: 'Arial', style: 'Bold' },
      { family: 'Arial', style: 'Bold' },
      { family: 'Arial', style: 'Regular' },
    ]
    expect(deduplicateFonts(input)).toHaveLength(2)
  })

  it('returns empty array for empty input', () => {
    expect(deduplicateFonts([])).toEqual([])
  })
})

describe('groupStylesByFamily', () => {
  it('groups styles under their family', () => {
    const fonts: FontName[] = [
      { family: 'Inter', style: 'Regular' },
      { family: 'Inter', style: 'Bold' },
      { family: 'Arial', style: 'Regular' },
    ]
    const result = groupStylesByFamily(fonts)
    expect(result.get('Inter')).toEqual(['Regular', 'Bold'])
    expect(result.get('Arial')).toEqual(['Regular'])
  })
})
