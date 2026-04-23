export function matchStyle(sourceStyle, candidates) {
    const lower = sourceStyle.toLowerCase();
    return candidates.find(c => c.toLowerCase() === lower) ?? null;
}
export function findUnresolved(pairs, availableStyles) {
    const unresolved = [];
    for (const { from, to } of pairs) {
        const styles = availableStyles.get(to.family) ?? [];
        if (matchStyle(from.style, styles) === null) {
            unresolved.push({ fromFont: from, toFamily: to.family, candidates: styles });
        }
    }
    return unresolved;
}
