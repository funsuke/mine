import { Random } from "./random";
import { DST_TILE_SIZE, MINE_MAX, SRC_TILE_SIZE, Tiles, TileState } from "./CTiles";
import { Number } from "./number";
// import { SceneMain } from "./sceneMain";
// import { generate2DArray, getSerialNumberArray } from "./util";
// import { playAudio } from "./utilAkashic";

// アセットID定義
export const AST_TILES: string = "tiles";
export const AST_7SEG_0: string = "7seg_48x80_0";
export const AST_7SEG_1: string = "7seg_48x80_1";
export const AST_WAIT: string = "wait";
export const AST_TITLE: string = "title";
export const AST_WINDOW: string = "window_score";
export const AST_NUMBER: string = "num_result";

// export const AST_ID_OPEN: string = "se_open_nc305386";
// export const AST_ID_OPEN_ZERO: string = "se_open_zero_nc194283";
export const AST_FAIL = "se_fail_nc70053";
export const AST_CLICK = "se_open_nc305386";
export const AST_PON = "se_pon";

export const AST_95_B = "se95s_nc294782_44_Startup95";
export const AST_95_E = "se95e_nc294782_17_TADA95";
export const AST_NT4_B = "seNT4s_nc294782_45_StartupNT4";
export const AST_NT4_E = "seNT4e_nc294782_46_ShutdownNT4";
export const AST_98_B = "se98s_nc294782_49_Startup98";
export const AST_98_E = "se98e_nc294782_50_Shutdown98";
export const AST_NT5_B = "seNT5s_nc294782_47_StartupNT5";
export const AST_NT5_E = "seNT5e_nc294782_48_ShutdownNT5";
export const AST_2000_B = "se2000s_nc294782_51_Startup2000";
export const AST_2000_E = "se2000e_nc294782_52_Shutdown2000";
export const AST_XP_B = "seXPs_nc294782_55_StartupXP";
export const AST_XP_E = "seXPe_nc294782_56_ShutdownXP";
export const AST_LH_B = "seLHs_nc294782_59_StartupLH";
export const AST_LH_E = "seLHe_nc294782_60_ShutdownLH";
export const AST_VISTA_B = "seVistas_nc294782_63_StartupVista";
export const AST_VISTA_E = "seVistae_nc294782_64_ShutdownVista";

export const SceneState = {
	Title: 0,
	Main: 1,
} as const;
type SceneState = typeof SceneState[keyof typeof SceneState];
let sceneState: SceneState = SceneState.Title;

// *************************************************
// タイトルシーン
// *************************************************
export class SceneTitle extends g.Scene {
	private rand: Random;
	private tiles: Tiles;
	private restMine: Number | null = null;
	private restTime: Number | null = null;
	private face: g.FrameSprite | null = null;
	private wait: g.Sprite | null = null;
	private title: g.Sprite | null = null;
	private timeTitle: number = 5;
	private time: number = 120;
	private miss: number = 0;
	private isTouchScene: boolean = false;
	private downIdx: number = -1;
	private layer0: g.E | null = null;
	private layer1: g.E | null = null;
	private layer2: g.E | null = null;
	private idxSE: number;
	private assetSE: string[][] = new Array(8);
	private isPlayEnd: boolean = false;
	private time3: number = 3;
	private isPlayBeginning: boolean = false;
	private grayRect: g.FilledRect | null = null;
	private window: g.Sprite | null = null;
	private score: Number | null = null;
	private resetScore: number = 0;
	private isMissStage: boolean = false;
	/**
	 * タイトルシーン
	 * @param param シーンパラメータ
	 */
	constructor(param: g.GameMainParameterObject) {
		// =================================================
		// シーン定義
		// =================================================
		super({
			game: g.game,
			assetIds: [
				// タイトル, 画像フォント
				AST_TILES, AST_7SEG_0, AST_7SEG_1,
				AST_WAIT, AST_TITLE,
				AST_WINDOW, AST_NUMBER,
				// 音
				AST_CLICK, AST_FAIL, AST_PON,
				AST_95_B, AST_95_E,
				AST_NT4_B, AST_NT4_E,
				AST_98_B, AST_98_E,
				AST_NT5_B, AST_NT5_E,
				AST_2000_B, AST_2000_E,
				AST_XP_B, AST_XP_E,
				AST_LH_B, AST_LH_E,
				AST_VISTA_B, AST_VISTA_E,
			],
		});
		// ランダム
		this.rand = new Random(g.game.random);
		// タイルクラス
		this.tiles = new Tiles(this.rand);
		// SE
		this.idxSE = this.rand.randInt(8);
		this.assetSE = [
			[AST_95_B, AST_95_E],
			[AST_NT4_B, AST_NT4_E],
			[AST_98_B, AST_98_E],
			[AST_NT5_B, AST_NT5_E],
			[AST_2000_B, AST_2000_E],
			[AST_XP_B, AST_XP_E],
			[AST_LH_B, AST_LH_E],
			[AST_VISTA_B, AST_VISTA_E],
		];
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
		this.onPointUpCapture.add((ev: g.PointUpEvent) => {
			//
			if (!this.isTouchScene) return;
			// 押上時のインデックスを取得し処理を分岐
			const upIdx: number = Tiles.changeXY2Idx(ev.point.x + ev.startDelta.x, ev.point.y + ev.startDelta.y);
			if (ev.point.y >= 80) {
				if (ev.point.x < DST_TILE_SIZE) return;
				if (ev.point.y >= g.game.width - DST_TILE_SIZE) return;
				if (ev.button === 0) {
					// console.log("upIdx = " + upIdx);
					// console.log("dwIdx = " + this.downIdx);
					if (this.downIdx >= 0) {
						if (upIdx === this.downIdx && !this.tiles.isOpen(this.downIdx)) {
							// タイルオープン処理
							if (!this.tiles.refresh(ev.point.x, ev.point.y, ev.button)) {
								this.appendRedLine(ev.point);
								this.miss++;
								this.isMissStage = true;
								// 音
								this.asset.getAudioById(AST_FAIL).play().changeVolume(0.7);
							} else {
								this.miss = 0;
							}
						} else if (upIdx !== this.downIdx && !this.tiles.isOpen(this.downIdx)) {
							// 音
							this.asset.getAudioById(AST_CLICK).play().changeVolume(0.1);
							// 旗立て処理
							if (!this.tiles.refresh(ev.point.x, ev.point.y, 2)) {
								this.appendRedLine(ev.point);
								this.miss++;
								this.isMissStage = true;
								// 音
								this.asset.getAudioById(AST_FAIL).play().changeVolume(0.7);
							} else {
								g.game.vars.gameState.score += this.tiles.getPoint();
								this.miss = 0;
							}
						}
					}
					// 残り地雷数の設定
					this.restMine?.setNumber(this.tiles.getCloseMine());
				}
			}
		});
		// =================================================
		// シーン押下時イベント用
		// =================================================
		this.onPointDownCapture.add((ev: g.PointDownEvent) => {
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
						this.isMissStage = true;
					} else {
						this.miss = 0;
					}
					// 音
					if (!this.isPlayBeginning) {
						this.asset.getAudioById(this.assetSE[this.idxSE][0]).play();
						this.isPlayBeginning = true;
					} else {
						this.asset.getAudioById(AST_CLICK).play().changeVolume(0.1);
					}
					// 押下事インデックスの取得
					this.downIdx = Tiles.changeXY2Idx(ev.point.x, ev.point.y);
				} else if (ev.button === 0) {
					// 押下事インデックスの取得
					this.downIdx = Tiles.changeXY2Idx(ev.point.x, ev.point.y);
					//
					if (!this.tiles.getTile(this.downIdx).isMine) {
						// 音
						this.asset.getAudioById(AST_CLICK).play().changeVolume(0.1);
						// 
						if (!this.tiles.refresh(ev.point.x, ev.point.y, ev.button)) {
							this.appendRedLine(ev.point);
							this.miss++;
							this.isMissStage = true;
							// 音
							this.asset.getAudioById(AST_FAIL).play().changeVolume(0.7);
						} else {
							g.game.vars.gameState.score += this.tiles.getPoint();
							this.miss = 0;
						}
					}
				} else if (ev.button === 2) {
					// 押下事インデックスの取得
					this.downIdx = Tiles.changeXY2Idx(ev.point.x, ev.point.y);
					if (!this.tiles.isOpen(this.downIdx)) {
						// 音
						this.asset.getAudioById(AST_CLICK).play().changeVolume(0.1);
						//
						if (!this.tiles.refresh(ev.point.x, ev.point.y, ev.button)) {
							this.appendRedLine(ev.point);
							this.miss++;
							this.isMissStage = true;
							// 音
							this.asset.getAudioById(AST_FAIL).play().changeVolume(0.7);
						} else {
							g.game.vars.gameState.score += this.tiles.getPoint();
							this.miss = 0;
						}
					}
					// 残り地雷数の設定
					this.restMine?.setNumber(this.tiles.getCloseMine());
				}
			}
		});
	}

	/**
	 * シーン更新時処理
	 * @param param
	 * @returns
	 */
	private onUpdateFunc(param: g.GameMainParameterObject): void {
		if (sceneState === SceneState.Title) {
			if (this.timeTitle <= 0) {
				this.title?.hide();
				this.layer0?.show();
				this.layer1?.show();
				this.layer2?.show();
				this.isTouchScene = true;
				this.time3 = 3;
				sceneState = SceneState.Main;
				return;
			}
			// 残り３秒
			if (this.time3 === 3 && this.timeTitle <= 3) {
				this.asset.getAudioById(AST_PON).play().changeVolume(0.5);
				this.time3--;
			} else if (this.time3 === 2 && this.timeTitle <= 2) {
				this.asset.getAudioById(AST_PON).play().changeVolume(0.5);
				this.time3--;
			} else if (this.time3 === 1 && this.timeTitle <= 1) {
				this.asset.getAudioById(AST_PON).play().changeVolume(0.5);
				this.time3--;
			}
			this.timeTitle -= 1 / g.game.fps;
		} else if (sceneState === SceneState.Main) {
			if (this.time <= 0) {
				this.isTouchScene = false;
				// 音
				if (!this.isPlayEnd) {
					this.asset.getAudioById(this.assetSE[this.idxSE][1]).play();
					this.isPlayEnd = true;
				}
			}
			// 残り３秒
			if (this.time3 === 3 && this.time <= 3) {
				this.asset.getAudioById(AST_PON).play().changeVolume(0.5);
				this.time3--;
			} else if (this.time3 === 2 && this.time <= 2) {
				this.asset.getAudioById(AST_PON).play().changeVolume(0.5);
				this.time3--;
			} else if (this.time3 === 1 && this.time <= 1) {
				this.asset.getAudioById(AST_PON).play().changeVolume(0.5);
				this.time3--;
			} else if (this.time3 === 0 && this.time <= -1) {
				this.grayRect?.show();
				this.window?.show();
				this.score?.setNumber(g.game.vars.gameState.score);
				this.score?.show();
			}
			this.time -= 1 / g.game.fps;
			// 残り時間の設定
			this.restTime?.setNumber(Math.ceil(this.time < 0 ? 0 : this.time));
			// 顔の表示更新
			if (this.face != null) {
				this.face.frameNumber = this.miss;
				this.face.modified();
			}
			// ２回ミスすると表示(２秒後)
			if (this.miss >= 2) {
				this.isTouchScene = false;
				this.wait?.show();
				const timerId = this.setTimeout(() => {
					this.miss = 0;
					this.wait?.hide();
					this.isTouchScene = true;
					this.clearTimeout(timerId);
				}, 3000);
			}
			// タイルアップデート
			if (this.tiles.getCloseMine() === 0) {
				g.game.vars.gameState.score += (!this.isMissStage) ? 1000 : 0;
				if (this.isMissStage) this.isMissStage = false;
				this.resetScore = g.game.vars.gameState.score;
				this.refresh();
			}
		}
		return;
	}

	private refresh(): void {
		// 赤線削除
		if (this.layer1 != null && this.layer1.children != null) {
			this.layer1.children = [];
		}
		// 初期化
		this.tiles.init();
		// 初期値
		this.downIdx = -1;
	}

	/**
	 * シーン読込時処理
	 * @param param シーンパラメータ
	 * @returns
	 */
	private onLoadFunc(param: g.GameMainParameterObject): void {
		// レイヤー
		this.layer0 = new g.E({ scene: this, parent: this, hidden: true, });
		this.layer1 = new g.E({ scene: this, parent: this, hidden: true, });
		this.layer2 = new g.E({ scene: this, parent: this, hidden: true, });
		// 背景色
		new g.FilledRect({
			scene: this,
			cssColor: "#f0f0f0",
			width: g.game.width,
			height: g.game.height,
			parent: this.layer0,
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
				src: this.asset.getImageById(AST_7SEG_0),
				x: 48 * i,
				parent: this.layer0,
			});
		}
		// 本表示
		this.restMine = new Number({
			scene: this,
			assetId: AST_7SEG_1,
			maxDigit: 3,
			align: "right",
			parent: this.layer0,
		});
		this.restMine.setNumber(MINE_MAX);
		// =================================================
		// 顔
		// =================================================
		this.face = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById(AST_TILES),
			// srcX: TILE_SIZE * TileState.Smile,
			width: 80,
			height: 80,
			frames: [12, 13, 14],
			frameNumber: TileState.Smile,
			anchorX: 0.5,
			x: g.game.width / 2,
			parent: this.layer0,
			touchable: true,
		});
		this.face.onPointDown.add(() => {
			g.game.vars.gameState.score = this.resetScore;
			this.refresh();
		});
		// =================================================
		// 残り時間
		// =================================================
		// 下に薄いのを表示
		for (let i = 0; i < 3; i++) {
			new g.Sprite({
				scene: this,
				src: this.asset.getImageById(AST_7SEG_0),
				x: g.game.width - 48 * (i + 1),
				parent: this.layer0,
			});
		}
		// 本表示
		this.restTime = new Number({
			scene: this,
			assetId: AST_7SEG_1,
			maxDigit: 3,
			align: "right",
			x: g.game.width - 48 * 3,
			parent: this.layer0,
		});
		this.restTime.setNumber(Math.ceil(this.time));
		// =================================================
		// ２回連続ミス
		// =================================================
		this.wait = new g.Sprite({
			scene: this,
			src: this.asset.getImageById(AST_WAIT),
			scaleX: 2.0,
			scaleY: 2.0,
			parent: this.layer2,
			// touchable: true,
			hidden: true,
		});
		// =================================================
		// グレーの矩形
		// =================================================
		this.grayRect = new g.FilledRect({
			scene: this,
			cssColor: "rgba(0, 0, 0, 0.5)",
			width: g.game.width,
			height: g.game.height,
			parent: this.layer2,
			hidden: true,
		});
		this.window = new g.Sprite({
			scene: this,
			src: this.asset.getImageById(AST_WINDOW),
			anchorX: 0.5, anchorY: 0.5,
			scaleX: 2.0, scaleY: 2.0,
			x: g.game.width / 2, y: g.game.height / 2,
			parent: this.layer2,
			hidden: true,
		});
		this.score = new Number({
			scene: this,
			assetId: AST_NUMBER,
			maxDigit: 6,
			anchorX: 1.0,
			scaleX: 1.5, scaleY: 1.5,
			x: g.game.width / 2 + 300,
			y: g.game.height / 2,
			pitch: 68,
			parent: this.layer2,
			hidden: true,
		});
		this.score.setNumber(g.game.vars.gameState.score);
		// =================================================
		// タイトル
		// =================================================
		this.title = new g.Sprite({
			scene: this,
			src: this.asset.getImageById(AST_TITLE),
			scaleX: 2.0,
			scaleY: 2.0,
			parent: this,
		});
		return;
	}

	private appendRedLine(p: g.CommonOffset): g.Sprite {
		// 赤線
		return new g.Sprite({
			scene: this,
			src: this.asset.getImageById(AST_TILES),
			srcWidth: SRC_TILE_SIZE, srcHeight: SRC_TILE_SIZE,
			width: DST_TILE_SIZE, height: DST_TILE_SIZE,
			srcX: SRC_TILE_SIZE * TileState.Miss,
			x: 40 + Math.floor((p.x - 40) / DST_TILE_SIZE) * DST_TILE_SIZE,
			y: 80 + Math.floor((p.y - 80) / DST_TILE_SIZE) * DST_TILE_SIZE,
			parent: <g.E>this.layer1,
		});
	}
}
