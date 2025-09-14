window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

// テンプレート
// akashic init -t typescript
// gの定義
// https://akashic-games.github.io/guide/common-pitfalls.html
// npm install -DE @akashic/akashic-engine
// Zipファイル(上書き)
// akashic export zip --output game.zip --nicolive -f -M
// htmlファイル(上書き)
// akashic export html --magnify --force  --output ../mine/myhtml
// テスト
// akashic-sandbox
// マルチのテストは
// akashic serve -s nicolive
// マインスイーパー
// マップの大きさ(windows版)と地雷数
// ・初級： 9× 9のマスに10個の地雷(0.123456789..)
// ・中級：16×16のマスに40個の地雷(0.15625)
// ・上級：30×16のマスに99個の地雷(0.20625)
// １タイルの大きさ 80x80
// ・１画面最大表示=1280/80x720/80=16*9
// タイルの数
// ・上部に秒数や残り地雷数、スコアを表示すると 16*8=128
// 地雷の数(20くらいがいいか？)
// ・128タイル * 0.12(初級比) = 15.36個
// ・128タイル * 0.20(上級比) = 25.6個
// ・20 / 128 = 0.15625
// 旗を立てるときのスマホなど(右左クリックが無い)の操作
// ・旗を立てたい場所にタッチ移動して、違う場所で離す
// ・PC環境では右クリックで、タイル解放と区別
// 爆弾列が繋がってると解きにくくなる
// ・考えてると４ねるので一旦保留
// ・例えば...
//   ┏━━━━                １２３２１
//   ┃？？爆２                ２爆爆爆２
//   ┃？？爆３                ３爆？爆３
//   ┃爆爆爆２                ２爆爆爆２
//   ┃２３２１...こんなのや   １２３２１...こんなの
// ・離れた空間が無いようにすればいい？ or
//   地雷列が繋がらないようにする？
// ・置こうとしてるタイルの８近傍を対象に
//   地雷と無しを左上から時計回りにビット列を作り、
//   7回1ビット巡回シフトして101,1001,10001が2つ以上存在する場合は繋がってしまう判定
// １回目は必ず地雷に当たらないようにするには...
// ・地雷生成を１操作以降にすれば良い
// ・マルチは知らん
//   ・全員の操作の初めてのときに生成？
//   ・フィールドが大きいとラグが出るかも
//   ・無視して最初に生成が一番楽
// ユーザー処理
// クリック or 右クリック or クリック→スワイプ→離す
// ・クリック
//   開いてる数字の場合は、旗表示処理or開く処理
//   閉じてる数字の場合は、開く処理(0の場合は開示処理)
//   閉じてる爆弾の場合は、爆弾表示と赤線
// ・右クリック
//   開いてるタイルには何もしない
//   閉じてる数字の場合は、数字表示と赤線
//   閉じてる爆弾の場合は、旗表示
// ・クリック→スワイプ→離す
//   右クリック時と同等
// 音
// ・開ける音(0以外の場合、数字クリック→開ける処理)
// ・開ける音(0の場合) シャラーン短め
// ・旗を立てる音(右クリック成功時、数字クリック→旗立て処理)
// ・失敗時 ブー短め
const sceneTitle_1 = require("./sceneTitle");
function main(param) {
  g.game.vars.gameState = {};
  g.game.vars.gameState.score = 0;
  g.game.pushScene(new sceneTitle_1.SceneTitle(param));
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}