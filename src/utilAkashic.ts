/**
 * 任意の配列を混ぜる
 * @param array 配列
 * @param param ゲームパラメータ
 * @returns シャッフルされた配列
 */
export function shuffleArray<T>(a: T[], r: g.RandomGenerator): T[] {
	const retArr = [...a];
	for (let i = retArr.length - 1; i > 0; i--) {
		const j = Math.floor((i + 1) * r.generate());
		[retArr[i], retArr[j]] = [retArr[j], retArr[i]];
	}
	return retArr;
}
