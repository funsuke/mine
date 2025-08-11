import { Random } from "./random";
import { AST_TILES } from "./sceneTitle";
import { shuffleArray } from './utilAkashic';

interface Tile {
	entity: g.Sprite;
	isWall: boolean;	// 壁かどうか
	isMine: boolean;	// 爆弾があるか
	isOpen: boolean;	// 開いてるか
	mCount: number;	// タイルの状態
	// isFlag: boolean;	// 旗が立っているか
	idx: number;			// インデックス
	// groupNo: number;	// グループ番号
};


// タイル状態定数
export const TileState = {
	Zero: 0,
	One: 1,
	Two: 2,
	Three: 3,
	Four: 4,
	Five: 5,
	Six: 6,
	Seven: 7,
	Close: 8,
	Flag: 9,
	Mine: 10,
	Miss: 11,
	Smile: 12,
	Dizzy: 13,
	Poo: 14,
} as const;
type TileState = typeof TileState[keyof typeof TileState];


export const SRC_TILE_SIZE: number = 80;
export const DST_TILE_SIZE: number = 40;
export const MINE_MAX: number = 99;

const TILE_COLS: number = 30;		// タイルの列数(横の数)
const TILE_ROWS: number = 16;		// タイルの行数(縦の数)
const VIEW_TILES: number = TILE_COLS * TILE_ROWS;
const ALL_TILES: number = (TILE_COLS + 2) * (TILE_ROWS + 2);
const NEIGHBOR8: number[] = [-(TILE_COLS + 3), -(TILE_COLS + 2), -(TILE_COLS + 1), 1, (TILE_COLS + 3), (TILE_COLS + 2), (TILE_COLS + 1), -1];
// const NEIGHBOR4: number[] = [-18, 1, 18, -1];

export class Tiles {
	private tiles: Tile[] = new Array<Tile>(ALL_TILES);
	private rand: Random;
	private openMine: number = 0;
	private pointByClick: number = 0;
	/**
	 * コンストラクタ
	 * @param rand 乱数生成器
	 */
	constructor(rand: Random) {
		// 乱数生成器の設定
		this.rand = rand;
		// 型付け
		for (let i = 0; i < this.tiles.length; i++) {
			this.tiles[i] = <Tile>{};
		}
		// タイルの初期化と壁の設定
		this.init();
	}

	/**
	 * タイルの初期化と壁の設定
	 */
	public init(): void {
		// 晒した地雷の数
		this.openMine = 0;
		// タイルの初期化
		for (let i = 0; i < this.tiles.length; i++) {
			let v: Tile = this.tiles[i];
			// タイル初期値
			this.tiles[i].isWall = false;
			this.tiles[i].isMine = false;
			this.tiles[i].isOpen = false;
			this.tiles[i].mCount = 0;
			// 壁
			if (this.isWallTiles(i)) {
				this.tiles[i].isWall = true;
			} else {
				// 画像の更新
				if (this.tiles[i].entity != null) {
					this.tiles[i].entity.srcX = SRC_TILE_SIZE * TileState.Close;
					this.tiles[i].entity.invalidate();
				}
			}
		};
		// for (let i = 0; i < this.tiles.length; i++) {
		// 	// タイル初期値
		// 	this.tiles[i] = <Tile>{
		// 		isWall: false,
		// 		isMine: false,
		// 		isOpen: false,
		// 		bCount: 0,
		// 	};
		// 	// 壁
		// 	if (this.isWallTiles(i)) {
		// 		this.tiles[i].isWall = true;
		// 	}
		// 	// 晒した爆弾
		// 	this.openMine = 0;
		// };
	}

	/**
	 * 残りの地雷の数
	 * @returns <number>
	 */
	public getCloseMine(): number {
		return MINE_MAX - this.openMine;
	}

	public isOpen(idx: number): boolean {
		return this.tiles[idx].isOpen;
	}

	public isCloseZero(idx: number): boolean {
		return (!this.tiles[idx].isOpen && this.tiles[idx].mCount === 0);
	}

	/**
	 * タイル(地雷)の設置
	 * @param tx クリックしたタイルのX位置
	 * @param ty クリックしたタイルのY位置
	 * @returns <void>
	 */
	public setTiles(x: number, y: number): void {
		const tIdx = Tiles.changeXY2Idx(x, y);
		// ↓これダメ初期化できない 配列の要素をインデックスで初期化するならmapを使った方がスマート
		// indices.forEach((v, i) => {
		// 	v = i;
		// });
		// indices = indices.fill().map((_, i) => i);
		// 乱数列の初期化
		let indices: number[] = [...Array(VIEW_TILES).keys()];
		indices = shuffleArray(indices, this.rand.gen());
		// 地雷の設定
		let mineNum: number = 0;
		for (let i = 0; ; i++) {
			const _idx = indices[i];
			const col = _idx % TILE_COLS;
			const row = Math.floor(_idx / TILE_COLS);
			const idx = (TILE_COLS + 2) * (row + 1) + (col + 1);
			// クリック周辺に地雷がある場合コンティニュー (それ以外は置く)
			if (this.isSetBomb(idx, tIdx)) continue;
			// クリック周辺の数値に７がある場合コンティニュー (7より大きいのはない)
			// const result: boolean = NEIGHBOR8.every(v => {
			// 	return this.tiles[idx + v].state !== TileState.Seven;
			// });
			// if (!result) continue;
			// -----------------------------
			// タイルにする
			this.tiles[idx].isMine = true;
			// 周辺の数値を１つ足す
			NEIGHBOR8.forEach(v => {
				this.tiles[idx + v].mCount++;
			});
			// 地雷カウンタ(20になったらループを抜
			mineNum++;
			if (mineNum >= MINE_MAX) break;
		}
		return;
	}

	// 画像表示
	public append(scene: g.Scene, layer: g.E): void {
		for (let i = 0; i < this.tiles.length; i++) {
			if (!this.tiles[i].isWall) {
				const col = i % (TILE_COLS + 2);
				const row = Math.floor(i / (TILE_COLS + 2));
				// 画像定義
				this.tiles[i].entity = new g.Sprite({
					scene: scene,
					src: scene.asset.getImageById(AST_TILES),
					srcWidth: SRC_TILE_SIZE, srcHeight: SRC_TILE_SIZE,
					width: DST_TILE_SIZE, height: DST_TILE_SIZE,
					srcX: SRC_TILE_SIZE * TileState.Close,
					x: DST_TILE_SIZE * col,
					y: DST_TILE_SIZE * (row + 1),
					// touchable: true,
					parent: layer,
				});
			}
		};
		return;
	}

	/**
	 * 配列のインデックスが壁である場合True
	 * @param i インデックス
	 * @returns 
	 */
	private isWallTiles(i: number): boolean {
		if (i % (TILE_COLS + 2) === 0) return true;
		if (i % (TILE_COLS + 2) === TILE_COLS + 1) return true;
		if (i < TILE_COLS + 2) return true;
		if (i >= ALL_TILES - (TILE_COLS + 2)) return true;
		return false;
	}

	/**
	 * クリックした位置の周辺に地雷がある場合true
	 * @param i 		置こうとしている地雷の位置
	 * @param tIdx	クリックした位置
	 * @return true: 
	 */
	private isSetBomb(i: number, tIdx: number): boolean {
		let retBool: boolean = false;
		// クリックした位置はダメ
		if (i === tIdx) return true;
		// クリックした周辺もダメ
		NEIGHBOR8.forEach(v => {
			if (i === tIdx + v) retBool = true;
		});
		return retBool;
	}

	/**
	 * 
	 * @param x 
	 * @param y 
	 */
	public static changeXY2Idx(x: number, y: number): number {
		// console.log("x  :" + x);
		// console.log("y  :" + y);
		// console.log("col:" + (Math.floor((x - 40) / DST_TILE_SIZE) + 1));
		// console.log("row:" + (Math.floor((y - 80) / DST_TILE_SIZE) + 1));
		// console.log("idx:" + ((TILE_COLS + 2) * (Math.floor((y - 80) / DST_TILE_SIZE) + 1) + (Math.floor((x - 40) / DST_TILE_SIZE) + 1)));
		return (TILE_COLS + 2) * (Math.floor((y - 80) / DST_TILE_SIZE) + 1) + (Math.floor((x - 40) / DST_TILE_SIZE) + 1);
	}

	public consoleLog(): void {
		let str = "";
		let cnt = 0;
		this.tiles.forEach((_, i) => {
			if (!this.tiles[i].isWall) {
				if (this.tiles[i].isMine) {
					str += "M ";
				} else {
					str += "" + this.tiles[i].mCount + " ";
				}
				cnt++;
				if (cnt >= TILE_COLS) {
					console.log(str);
					cnt = 0; str = "";
				}
			}
		});
		return;
	}

	public refresh(x: number, y: number, b: number): boolean {
		const tIdx = Tiles.changeXY2Idx(x, y);
		const cTile = this.tiles[tIdx];
		let retValue = true;
		// 処理を抜ける
		// if (cTile.entity != null) {
		// 	if (b === 0 && cTile.entity.srcX >= SRC_TILE_SIZE * TileState) return true;
		// 	if (b === 2 && cTile.entity.srcX !== SRC_TILE_SIZE * 8) return true;
		// }
		//
		// ポイントクリア
		this.pointByClick = 0;
		//
		if (b === 0) {
			// todo:クリックしてミスをして20個確定した場合、すべて開く処理
			// 左ボタン処理
			// タイルを開ける処理
			if (!cTile.isOpen) {
				// this.openTile(cTile);
				if (cTile.isMine) {
					this.openBombTile(cTile);
					// return false;
					retValue = false;
					this.openMine++;
				} else if (cTile.mCount === TileState.Zero) {
					this.openCountTile(cTile);
					this.open(tIdx);
				} else {
					this.openCountTile(cTile);
				}
			} else if (cTile.isOpen && !cTile.isMine) {
				// カウント
				let closeArray: Tile[] = [];
				let cnt = 0;
				NEIGHBOR8.forEach(v => {
					const sTile: Tile = this.tiles[tIdx + v];
					sTile.idx = tIdx + v;
					if (!sTile.isWall) {
						if (!sTile.isOpen) {
							closeArray.push(sTile);
						}
						if (!sTile.isOpen || sTile.isMine) {
							cnt++;
						}
					}
				});
				// 数字クリック時処理
				if (cnt === cTile.mCount) {
					// 旗を立てる
					closeArray.forEach(v => {
						this.openFlagTile(v);
						this.pointByClick += 1000;
						this.openMine++;
					});
				} else if (cnt - closeArray.length === cTile.mCount) {
					// 旗が既に書いてある数字の分立っていれば開く
					closeArray.forEach(v => {
						this.openCountTile(v);
						if (v.mCount === TileState.Zero) {
							this.open(v.idx);
						}
					});
				}
			}
			// -------------------------------------------------------------
			// 最終で全ての開いていないタイルに旗を立てる処理
			// -------------------------------------------------------------
			// カウント
			let openMine = 0;
			let close = 0;
			for (let j = (TILE_COLS + 2) + 1; j < (TILE_COLS + 2) * (TILE_ROWS + 1) - 1; j += TILE_COLS + 2) {
				for (let i = j; i < j + TILE_COLS; i++) {
					if (this.tiles[i].isOpen) {
						if (this.tiles[i].isMine) {
							openMine++;
						}
					} else {
						close++;
					}
				}
			}
			if (openMine === MINE_MAX) {
				// 残り全て開ける
				for (let j = (TILE_COLS + 2) + 1; j < (TILE_COLS + 2) * (TILE_ROWS + 1) - 1; j += TILE_COLS + 2) {
					for (let i = j; i < j + TILE_COLS; i++) {
						if (!this.tiles[i].isOpen) {
							this.openCountTile(this.tiles[i]);
						}
					}
				}
			} else if (close === MINE_MAX - openMine) {
				// 残り全て旗を立てる
				for (let j = (TILE_COLS + 2) + 1; j < (TILE_COLS + 2) * (TILE_ROWS + 1) - 1; j += TILE_COLS + 2) {
					for (let i = j; i < j + TILE_COLS; i++) {
						if (!this.tiles[i].isOpen) {
							this.openFlagTile(this.tiles[i]);
							this.pointByClick += 1000;
							this.openMine++;
						}
					}
				}
			}
		} else if (b === 2) {
			// todo:右クリックしてミスをして20個確定した場合、すべて旗を立てる処理
			// 右ボタン処理
			// タイルを開ける処理
			if (!cTile.isOpen && !cTile.isMine) {
				this.openCountTile(cTile);
				retValue = false;
				// return false;
			} else {
				this.openFlagTile(cTile);
				this.pointByClick += 1000;
				this.openMine++;
			}
			// -------------------------------------------------------------
			// 最終で全ての開いていないタイルを開ける処理
			// -------------------------------------------------------------
			// カウント
			let openBomb = 0;
			let close = 0;
			for (let j = (TILE_COLS + 2) + 1; j < (TILE_COLS + 2) * (TILE_ROWS + 1) - 1; j += TILE_COLS + 2) {
				for (let i = j; i < j + TILE_COLS; i++) {
					if (this.tiles[i].isOpen) {
						if (this.tiles[i].isMine) {
							openBomb++;
						}
					} else {
						close++;
					}
				}
			}
			if (retValue === false && close === MINE_MAX - openBomb) {
				// 残り全て旗を立てる
				for (let j = (TILE_COLS + 2) + 1; j < (TILE_COLS + 2) * (TILE_ROWS + 1) - 1; j += TILE_COLS + 2) {
					for (let i = j; i < j + TILE_COLS; i++) {
						if (!this.tiles[i].isOpen) {
							this.openFlagTile(this.tiles[i]);
							this.openMine++;
						}
					}
				}
			} else if (openBomb === MINE_MAX) {
				// 残り全て開ける
				for (let j = (TILE_COLS + 2) + 1; j < (TILE_COLS + 2) * (TILE_ROWS + 1) - 1; j += TILE_COLS + 2) {
					for (let i = j; i < j + TILE_COLS; i++) {
						if (!this.tiles[i].isOpen) {
							this.openCountTile(this.tiles[i]);
						}
					}
				}
			}
		}
		// 面クリアの場合
		if (this.getCloseMine() === 0) {
			this.pointByClick++;
		}
		return retValue;
	}

	private open(tIdx: number): void {
		NEIGHBOR8.forEach(v => {
			if (!this.tiles[tIdx + v].isOpen && !this.tiles[tIdx + v].isWall) {
				this.openCountTile(this.tiles[tIdx + v]);
				if (this.tiles[tIdx + v].mCount === TileState.Zero) {
					this.open(tIdx + v);
				}
			}
		});
		return;
	}

	public getTile(i: number): Tile {
		return this.tiles[i];
	}

	private openCountTile(tile: Tile): void {
		tile.isOpen = true;
		if (tile.entity != null) {
			tile.entity.srcX = SRC_TILE_SIZE * tile.mCount;
			tile.entity.invalidate();
		}
	}

	private openBombTile(tile: Tile): void {
		tile.isOpen = true;
		// tile.state = 0;
		if (tile.entity != null) {
			tile.entity.srcX = SRC_TILE_SIZE * TileState.Mine;
			tile.entity.invalidate();
		}
	}

	private openFlagTile(tile: Tile): void {
		tile.isOpen = true;
		tile.isMine = true;
		// tile.state = 0;
		if (tile.entity != null) {
			tile.entity.srcX = SRC_TILE_SIZE * TileState.Flag;
			tile.entity.invalidate();
		}
	}

	public getPoint(): number {
		return this.pointByClick;
	}
}
