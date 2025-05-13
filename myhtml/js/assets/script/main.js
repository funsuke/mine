window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

// テンプレート
// akashic init -t typescript
// gの定義
// https://akashic-games.github.io/guide/common-pitfalls.html
// npm install -DE @akashic/akashic-engine
// Zipファイル(上書き)
// akashic export zip --output game.zip --nicolive -f -M
// テスト
// akashic-sandbox
// マルチのテストは
// akashic serve -s nicolive
const sceneTitle_1 = require("./sceneTitle");
function main(param) {
  g.game.vars.gameState = {};
  g.game.vars.gameState.score = 0;
  g.game.pushScene(new sceneTitle_1.SceneTitle(param));
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}