window.gLocalAssetContainer["sceneTitle"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SceneTitle = exports.SceneState = exports.AST_VISTA_E = exports.AST_VISTA_B = exports.AST_LH_E = exports.AST_LH_B = exports.AST_XP_E = exports.AST_XP_B = exports.AST_2000_E = exports.AST_2000_B = exports.AST_NT5_E = exports.AST_NT5_B = exports.AST_98_E = exports.AST_98_B = exports.AST_NT4_E = exports.AST_NT4_B = exports.AST_95_E = exports.AST_95_B = exports.AST_PON = exports.AST_CLICK = exports.AST_FAIL = exports.AST_TITLE = exports.AST_WAIT = exports.AST_7SEG_1 = exports.AST_7SEG_0 = exports.AST_TILES = void 0;
const random_1 = require("./random");
const CTiles_1 = require("./CTiles");
const number_1 = require("./number");
// import { SceneMain } from "./sceneMain";
// import { generate2DArray, getSerialNumberArray } from "./util";
// import { playAudio } from "./utilAkashic";
// アセットID定義
exports.AST_TILES = "tiles";
exports.AST_7SEG_0 = "7seg_48x80_0";
exports.AST_7SEG_1 = "7seg_48x80_1";
exports.AST_WAIT = "wait";
exports.AST_TITLE = "title";
// export const AST_ID_OPEN: string = "se_open_nc305386";
// export const AST_ID_OPEN_ZERO: string = "se_open_zero_nc194283";
exports.AST_FAIL = "se_fail_nc70053";
exports.AST_CLICK = "se_open_nc305386";
exports.AST_PON = "se_pon";
exports.AST_95_B = "se95s_nc294782_44_Startup95";
exports.AST_95_E = "se95e_nc294782_17_TADA95";
exports.AST_NT4_B = "seNT4s_nc294782_45_StartupNT4";
exports.AST_NT4_E = "seNT4e_nc294782_46_ShutdownNT4";
exports.AST_98_B = "se98s_nc294782_49_Startup98";
exports.AST_98_E = "se98e_nc294782_50_Shutdown98";
exports.AST_NT5_B = "seNT5s_nc294782_47_StartupNT5";
exports.AST_NT5_E = "seNT5e_nc294782_48_ShutdownNT5";
exports.AST_2000_B = "se2000s_nc294782_51_Startup2000";
exports.AST_2000_E = "se2000e_nc294782_52_Shutdown2000";
exports.AST_XP_B = "seXPs_nc294782_55_StartupXP";
exports.AST_XP_E = "seXPe_nc294782_56_ShutdownXP";
exports.AST_LH_B = "seLHs_nc294782_59_StartupLH";
exports.AST_LH_E = "seLHe_nc294782_60_ShutdownLH";
exports.AST_VISTA_B = "seVistas_nc294782_63_StartupVista";
exports.AST_VISTA_E = "seVistae_nc294782_64_ShutdownVista";
exports.SceneState = {
  Title: 0,
  Main: 1
};
let sceneState = exports.SceneState.Title;
// *************************************************
// タイトルシーン
// *************************************************
class SceneTitle extends g.Scene {
  /**
   * タイトルシーン
   * @param param シーンパラメータ
   */
  constructor(param) {
    // =================================================
    // シーン定義
    // =================================================
    super({
      game: g.game,
      assetIds: [
      // タイトル, 画像フォント
      exports.AST_TILES, exports.AST_7SEG_0, exports.AST_7SEG_1, exports.AST_WAIT, exports.AST_TITLE,
      // 音
      exports.AST_CLICK, exports.AST_FAIL, exports.AST_PON, exports.AST_95_B, exports.AST_95_E, exports.AST_NT4_B, exports.AST_NT4_E, exports.AST_98_B, exports.AST_98_E, exports.AST_NT5_B, exports.AST_NT5_E, exports.AST_2000_B, exports.AST_2000_E, exports.AST_XP_B, exports.AST_XP_E, exports.AST_LH_B, exports.AST_LH_E, exports.AST_VISTA_B, exports.AST_VISTA_E]
    });
    this.restMine = null;
    this.restTime = null;
    this.face = null;
    this.wait = null;
    this.title = null;
    this.timeTitle = 5;
    this.time = 120;
    this.miss = 0;
    this.isTouchScene = false;
    this.downIdx = -1;
    this.layer0 = null;
    this.layer1 = null;
    this.layer2 = null;
    this.assetSE = new Array(8);
    this.isPlayEnd = false;
    this.time3 = 3;
    this.isPlayBeginning = false;
    // ランダム
    this.rand = new random_1.Random(g.game.random);
    // タイルクラス
    this.tiles = new CTiles_1.Tiles(this.rand);
    // SE
    this.idxSE = this.rand.randInt(8);
    this.assetSE = [[exports.AST_95_B, exports.AST_95_E], [exports.AST_NT4_B, exports.AST_NT4_E], [exports.AST_98_B, exports.AST_98_E], [exports.AST_NT5_B, exports.AST_NT5_E], [exports.AST_2000_B, exports.AST_2000_E], [exports.AST_XP_B, exports.AST_XP_E], [exports.AST_LH_B, exports.AST_LH_E], [exports.AST_VISTA_B, exports.AST_VISTA_E]];
    // =================================================
    // シーン読込時イベント
    // =================================================
    this.onLoad.add(() => {
      this.onLoadFunc(param);
    });
    // =================================================
    // シーン更新時イベント
    // =================================================
    this.onUpdate.add(() => {
      this.onUpdateFunc(param);
    });
    // =================================================
    // シーン押上時イベント用
    // =================================================
    this.onPointUpCapture.add(ev => {
      var _a;
      //
      if (!this.isTouchScene) return;
      // 押上時のインデックスを取得し処理を分岐
      const upIdx = CTiles_1.Tiles.changeXY2Idx(ev.point.x + ev.startDelta.x, ev.point.y + ev.startDelta.y);
      if (ev.point.y >= 80) {
        if (ev.point.x < CTiles_1.DST_TILE_SIZE) return;
        if (ev.point.y >= g.game.width - CTiles_1.DST_TILE_SIZE) return;
        if (ev.button === 0) {
          // console.log("upIdx = " + upIdx);
          // console.log("dwIdx = " + this.downIdx);
          if (this.downIdx >= 0) {
            if (upIdx === this.downIdx && !this.tiles.isOpen(this.downIdx)) {
              // タイルオープン処理
              if (!this.tiles.refresh(ev.point.x, ev.point.y, ev.button)) {
                this.appendRedLine(ev.point);
                this.miss++;
                // 音
                this.asset.getAudioById(exports.AST_FAIL).play().changeVolume(0.7);
              } else {
                this.miss = 0;
              }
            } else if (upIdx !== this.downIdx && !this.tiles.isOpen(this.downIdx)) {
              // 音
              this.asset.getAudioById(exports.AST_CLICK).play().changeVolume(0.1);
              // 旗立て処理
              if (!this.tiles.refresh(ev.point.x, ev.point.y, 2)) {
                this.appendRedLine(ev.point);
                this.miss++;
                // 音
                this.asset.getAudioById(exports.AST_FAIL).play().changeVolume(0.7);
              } else {
                g.game.vars.gameState.score += this.tiles.getPoint();
                this.miss = 0;
              }
            }
          }
          // 残り地雷数の設定
          (_a = this.restMine) === null || _a === void 0 ? void 0 : _a.setNumber(this.tiles.getCloseMine());
        }
      }
    });
    // =================================================
    // シーン押下時イベント用
    // =================================================
    this.onPointDownCapture.add(ev => {
      var _a;
      //
      if (!this.isTouchScene) return;
      //
      if (ev.point.y >= 80) {
        // 初回の場合、初期生成処理
        if (this.downIdx < 0) {
          this.tiles.setTiles(ev.point.x, ev.point.y);
          // this.tiles.consoleLog();
          // タイルオープン処理
          if (!this.tiles.refresh(ev.point.x, ev.point.y, 0)) {
            this.appendRedLine(ev.point);
            this.miss++;
          } else {
            this.miss = 0;
          }
          // 音
          if (!this.isPlayBeginning) {
            this.asset.getAudioById(this.assetSE[this.idxSE][0]).play();
            this.isPlayBeginning = true;
          } else {
            this.asset.getAudioById(exports.AST_CLICK).play().changeVolume(0.1);
          }
          // 押下事インデックスの取得
          this.downIdx = CTiles_1.Tiles.changeXY2Idx(ev.point.x, ev.point.y);
        } else if (ev.button === 0) {
          // 押下事インデックスの取得
          this.downIdx = CTiles_1.Tiles.changeXY2Idx(ev.point.x, ev.point.y);
          //
          if (!this.tiles.getTile(this.downIdx).isMine) {
            // 音
            this.asset.getAudioById(exports.AST_CLICK).play().changeVolume(0.1);
            // 
            if (!this.tiles.refresh(ev.point.x, ev.point.y, ev.button)) {
              this.appendRedLine(ev.point);
              this.miss++;
              // 音
              this.asset.getAudioById(exports.AST_FAIL).play().changeVolume(0.7);
            } else {
              g.game.vars.gameState.score += this.tiles.getPoint();
              this.miss = 0;
            }
          }
        } else if (ev.button === 2) {
          // 押下事インデックスの取得
          this.downIdx = CTiles_1.Tiles.changeXY2Idx(ev.point.x, ev.point.y);
          if (!this.tiles.isOpen(this.downIdx)) {
            // 音
            this.asset.getAudioById(exports.AST_CLICK).play().changeVolume(0.1);
            //
            if (!this.tiles.refresh(ev.point.x, ev.point.y, ev.button)) {
              this.appendRedLine(ev.point);
              this.miss++;
              // 音
              this.asset.getAudioById(exports.AST_FAIL).play().changeVolume(0.7);
            } else {
              g.game.vars.gameState.score += this.tiles.getPoint();
              this.miss = 0;
            }
          }
          // 残り地雷数の設定
          (_a = this.restMine) === null || _a === void 0 ? void 0 : _a.setNumber(this.tiles.getCloseMine());
        }
      }
    });
  }
  /**
   * シーン更新時処理
   * @param param
   * @returns
   */
  onUpdateFunc(param) {
    var _a, _b, _c, _d, _e, _f;
    if (sceneState === exports.SceneState.Title) {
      if (this.timeTitle <= 0) {
        (_a = this.title) === null || _a === void 0 ? void 0 : _a.hide();
        (_b = this.layer0) === null || _b === void 0 ? void 0 : _b.show();
        (_c = this.layer1) === null || _c === void 0 ? void 0 : _c.show();
        (_d = this.layer2) === null || _d === void 0 ? void 0 : _d.show();
        this.isTouchScene = true;
        this.time3 = 3;
        sceneState = exports.SceneState.Main;
        return;
      }
      // 残り３秒
      if (this.time3 === 3 && this.timeTitle <= 3) {
        this.asset.getAudioById(exports.AST_PON).play().changeVolume(0.5);
        this.time3--;
      } else if (this.time3 === 2 && this.timeTitle <= 2) {
        this.asset.getAudioById(exports.AST_PON).play().changeVolume(0.5);
        this.time3--;
      } else if (this.time3 === 1 && this.timeTitle <= 1) {
        this.asset.getAudioById(exports.AST_PON).play().changeVolume(0.5);
        this.time3--;
      }
      this.timeTitle -= 1 / g.game.fps;
    } else if (sceneState === exports.SceneState.Main) {
      if (this.time <= 0) {
        this.isTouchScene = false;
        // 音
        if (!this.isPlayEnd) {
          this.asset.getAudioById(this.assetSE[this.idxSE][1]).play();
          this.isPlayEnd = true;
        }
        return;
      }
      // 残り３秒
      if (this.time3 === 3 && this.time <= 3) {
        this.asset.getAudioById(exports.AST_PON).play().changeVolume(0.5);
        this.time3--;
      } else if (this.time3 === 2 && this.time <= 2) {
        this.asset.getAudioById(exports.AST_PON).play().changeVolume(0.5);
        this.time3--;
      } else if (this.time3 === 1 && this.time <= 1) {
        this.asset.getAudioById(exports.AST_PON).play().changeVolume(0.5);
        this.time3--;
      }
      this.time -= 1 / g.game.fps;
      // 残り時間の設定
      (_e = this.restTime) === null || _e === void 0 ? void 0 : _e.setNumber(Math.ceil(this.time));
      // 顔の表示更新
      if (this.face != null) {
        this.face.frameNumber = this.miss;
        this.face.modified();
      }
      // ２回ミスすると表示(２秒後)
      if (this.miss >= 2) {
        this.isTouchScene = false;
        (_f = this.wait) === null || _f === void 0 ? void 0 : _f.show();
        const timerId = this.setTimeout(() => {
          var _a;
          this.miss = 0;
          (_a = this.wait) === null || _a === void 0 ? void 0 : _a.hide();
          this.isTouchScene = true;
          this.clearTimeout(timerId);
        }, 3000);
      }
      // タイルアップデート
      if (this.tiles.getCloseMine() === 0) {
        // 赤線削除
        if (this.layer1 != null && this.layer1.children != null) {
          this.layer1.children = [];
        }
        // 初期化
        this.tiles.init();
        // 初期値
        this.downIdx = -1;
      }
    }
    return;
  }
  /**
   * シーン読込時処理
   * @param param シーンパラメータ
   * @returns
   */
  onLoadFunc(param) {
    // レイヤー
    this.layer0 = new g.E({
      scene: this,
      parent: this,
      hidden: true
    });
    this.layer1 = new g.E({
      scene: this,
      parent: this,
      hidden: true
    });
    this.layer2 = new g.E({
      scene: this,
      parent: this,
      hidden: true
    });
    // 背景色
    new g.FilledRect({
      scene: this,
      cssColor: "#f0f0f0",
      width: g.game.width,
      height: g.game.height,
      parent: this.layer0
    });
    // タイルの表示
    this.tiles.append(this, this.layer0);
    // =================================================
    // 残り地雷数
    // =================================================
    // 下に薄いのを表示
    for (let i = 0; i < 3; i++) {
      new g.Sprite({
        scene: this,
        src: this.asset.getImageById(exports.AST_7SEG_0),
        x: 48 * i,
        parent: this.layer0
      });
    }
    // 本表示
    this.restMine = new number_1.Number({
      scene: this,
      assetId: exports.AST_7SEG_1,
      maxDigit: 3,
      align: "right",
      parent: this.layer0
    });
    this.restMine.setNumber(CTiles_1.MINE_MAX);
    // =================================================
    // 顔
    // =================================================
    this.face = new g.FrameSprite({
      scene: this,
      src: this.asset.getImageById(exports.AST_TILES),
      // srcX: TILE_SIZE * TileState.Smile,
      width: 80,
      height: 80,
      frames: [12, 13, 14],
      frameNumber: CTiles_1.TileState.Smile,
      anchorX: 0.5,
      x: g.game.width / 2,
      parent: this.layer0
    });
    // =================================================
    // 残り時間
    // =================================================
    // 下に薄いのを表示
    for (let i = 0; i < 3; i++) {
      new g.Sprite({
        scene: this,
        src: this.asset.getImageById(exports.AST_7SEG_0),
        x: g.game.width - 48 * (i + 1),
        parent: this.layer0
      });
    }
    // 本表示
    this.restTime = new number_1.Number({
      scene: this,
      assetId: exports.AST_7SEG_1,
      maxDigit: 3,
      align: "right",
      x: g.game.width - 48 * 3,
      parent: this.layer0
    });
    this.restTime.setNumber(Math.ceil(this.time));
    // =================================================
    // ２回連続ミス
    // =================================================
    this.wait = new g.Sprite({
      scene: this,
      src: this.asset.getImageById(exports.AST_WAIT),
      scaleX: 2.0,
      scaleY: 2.0,
      parent: this.layer2,
      // touchable: true,
      hidden: true
    });
    // =================================================
    // タイトル
    // =================================================
    this.title = new g.Sprite({
      scene: this,
      src: this.asset.getImageById(exports.AST_TITLE),
      scaleX: 2.0,
      scaleY: 2.0,
      parent: this
    });
    return;
  }
  appendRedLine(p) {
    // 赤線
    return new g.Sprite({
      scene: this,
      src: this.asset.getImageById(exports.AST_TILES),
      srcWidth: CTiles_1.SRC_TILE_SIZE,
      srcHeight: CTiles_1.SRC_TILE_SIZE,
      width: CTiles_1.DST_TILE_SIZE,
      height: CTiles_1.DST_TILE_SIZE,
      srcX: CTiles_1.SRC_TILE_SIZE * CTiles_1.TileState.Miss,
      x: 40 + Math.floor((p.x - 40) / CTiles_1.DST_TILE_SIZE) * CTiles_1.DST_TILE_SIZE,
      y: 80 + Math.floor((p.y - 80) / CTiles_1.DST_TILE_SIZE) * CTiles_1.DST_TILE_SIZE,
      parent: this.layer1
    });
  }
}
exports.SceneTitle = SceneTitle;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}