window.gLocalAssetContainer["random"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Random = void 0;
/**
 * ランダムクラス
 */
class Random {
  /**
   * 乱数クラス生成
   * @param rnd 乱数生成器(通常はg.game.randomなど)
   */
  constructor(rnd) {
    this.rnd = rnd;
  }
  /**
   * 乱数値(0<=rnd<1.0)を出力
   * @returns {number} 小数値
   */
  get() {
    return this.rnd.generate();
  }
  /**
   * 乱数生成器を返す
   * @returns
   */
  gen() {
    return this.rnd;
  }
  /**
   * 整数の乱数値を出力
   * @param {number} start 開始値
   * @param {number} stop 閾値(含まない)
   * @param {number} step 増減値
   * @returns {number} 整数値
   */
  randRange(start = 0, stop = 2, step = 1) {
    return Math.floor(start + (stop - start) * this.rnd.generate() * step);
  }
  _randRange(rnd, start = 0, stop = 2, step = 1) {
    return Math.floor(start + (stop - start) * rnd.generate() * step);
  }
  /**
   * 整数(0～)の乱数値を出力
   * @param len 出力数
   * @returns 整数値
   */
  randInt(len) {
    return Math.floor(len * this.rnd.generate());
  }
  /**
   * ０から指定した数までのランダムな組合せの配列を返す(nCr)
   * @param {number} length 全体の数
   * @param {number} pick 選ぶ数
   * @returns {number[]} 組合せの配列
   */
  getRndCombination(length, pick) {
    const array = [];
    for (let i = 0; i < length; i++) {
      array[i] = i;
    }
    const arrPick = [];
    for (let i = 0; i < pick; i++) {
      let select = this.randRange(0, array.length);
      arrPick[i] = array.splice(select, 1)[0];
    }
    return arrPick;
  }
  _getRndCombination(rnd, length, pick) {
    const array = [];
    for (let i = 0; i < length; i++) {
      array[i] = i;
    }
    const arrPick = [];
    for (let i = 0; i < pick; i++) {
      let select = this._randRange(rnd, 0, array.length);
      arrPick[i] = array.splice(select, 1)[0];
    }
    return arrPick;
  }
}
exports.Random = Random;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}