/**
 * @param range Convert to math is [min,max], rather than [min,max)
 * @param stringUsedToHash string
 * @returns number
 */
export function randomNum(range: { min: number; max: number }, stringUsedToHash?: string | number): number {
    let strToHash = String(stringUsedToHash);
    if (!strToHash) {
        strToHash = new Date().toString();
    }
    let num = 0;
    strToHash.split('').forEach((item) => {
        num += item.codePointAt(0);
    });
    return (num % (range.max - range.min + 1)) + range.min;
}
