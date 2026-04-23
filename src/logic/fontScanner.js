export function deduplicateFonts(fonts) {
    const seen = new Set();
    return fonts.filter(f => {
        const key = `${f.family}::${f.style}`;
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
export function groupStylesByFamily(fonts) {
    const map = new Map();
    for (const { family, style } of fonts) {
        if (!map.has(family))
            map.set(family, []);
        map.get(family).push(style);
    }
    return map;
}
