/**
 * 画像ジェネレーター用の型定義
 *
 * @description
 * 画像処理と表示に関する型定義
 */

// 画像エフェクト
export type ImageEffect = {
  id: string
  name: string
  description: string
  overlayUrl?: string // オーバーレイ画像のURL
  borderStyle?: string // 枠線のスタイル
  cornerStyle?: string // 角のスタイル
}

// サイズプリセット
export type SizePreset = {
  width: number
  height: number
  label: string
}
