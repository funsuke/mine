window.gLocalAssetContainer["util"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotl8 = rotl8;
exports.rotr8 = rotr8;
/**
 * 左循環シフト8bit版
 * @param b
 * @param s
 * @returns
 */
function rotl8(b, s) {
  s = s % 8;
  return (b << s | b >> 8 - s) & Math.pow(2, 8) - 1;
}
/**
 * 右循環シフト8bit版
 * @param b
 * @param s
 * @returns
 */
function rotr8(b, s) {
  s = s % 8;
  return (b >> s | b << 8 - s) & Math.pow(2, 8) - 1;
}
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}