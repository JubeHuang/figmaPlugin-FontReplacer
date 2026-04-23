import { describe, it, expect } from 'vitest';
import { matchStyle, findUnresolved } from '../logic/styleMatcher';
describe('matchStyle', () => {
    it('returns exact match when available', () => {
        expect(matchStyle('Bold', ['Regular', 'Bold', 'Italic'])).toBe('Bold');
    });
    it('returns null when no match exists', () => {
        expect(matchStyle('Condensed Bold', ['Regular', 'Bold'])).toBeNull();
    });
    it('is case-insensitive', () => {
        expect(matchStyle('bold', ['Regular', 'Bold'])).toBe('Bold');
    });
    it('returns null for empty candidates', () => {
        expect(matchStyle('Bold', [])).toBeNull();
    });
});
describe('findUnresolved', () => {
    it('returns empty array when all styles match', () => {
        const pairs = [{ from: { family: 'Arial', style: 'Bold' }, to: { family: 'Inter', style: '' } }];
        const available = new Map([['Inter', ['Regular', 'Bold']]]);
        expect(findUnresolved(pairs, available)).toEqual([]);
    });
    it('returns unresolved entry when style missing in target', () => {
        const pairs = [{ from: { family: 'Arial', style: 'Condensed' }, to: { family: 'Inter', style: '' } }];
        const available = new Map([['Inter', ['Regular', 'Bold']]]);
        const result = findUnresolved(pairs, available);
        expect(result).toHaveLength(1);
        expect(result[0].fromFont).toEqual({ family: 'Arial', style: 'Condensed' });
        expect(result[0].toFamily).toBe('Inter');
        expect(result[0].candidates).toEqual(['Regular', 'Bold']);
    });
});
