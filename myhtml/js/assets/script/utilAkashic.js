window.gLocalAssetContainer["utilAkashic"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffleArray = shuffleArray;
/**
 * 任意の配列を混ぜる
 * @param array 配列
 * @param param ゲームパラメータ
 * @returns シャッフルされた配列
 */
function shuffleArray(a, r) {
  const retArr = [...a];
  for (let i = retArr.length - 1; i > 0; i--) {
    const j = Math.floor((i + 1) * r.generate());
    [retArr[i], retArr[j]] = [retArr[j], retArr[i]];
  }
  return retArr;
}
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}