
/**
 * 左循環シフト8bit版
 * @param b 
 * @param s 
 * @returns 
 */
export function rotl8(b: number, s: number): number {
	s = s % 8;
	return ((b << s) | (b >> (8 - s))) & (2 ** 8 - 1);
}

/**
 * 右循環シフト8bit版
 * @param b 
 * @param s 
 * @returns 
 */
export function rotr8(b: number, s: number): number {
	s = s % 8;
	return ((b >> s) | (b << (8 - s))) & (2 ** 8 - 1);
}
