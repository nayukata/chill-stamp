/**
 * 画像エフェクト定義
 *
 * @description
 * LGTMイメージジェネレーターで使用する画像エフェクトの定義
 */
import { ImageEffect } from '@/ui/image/types'

// 画像エフェクトプリセット
export const IMAGE_EFFECTS: ImageEffect[] = [
  {
    id: 'none',
    name: 'なし',
    description: '装飾なし',
  },
  {
    id: 'polaroid',
    name: 'ポラロイド',
    description: 'ポラロイド風フレーム',
    borderStyle: '15px solid white',
    cornerStyle: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
  },
  {
    id: 'neon',
    name: 'ネオン',
    description: '光るネオン風フレーム',
    borderStyle: '10px solid transparent',
    cornerStyle: 'drop-shadow(0 0 10px #ff00ff) drop-shadow(0 0 20px #0077ff)',
  },
  {
    id: 'vaporwave',
    name: 'ヴェイパーウェイブ',
    description: 'レトロ未来的なグリッド',
    overlayUrl: '/effects/vaporwave-grid.svg',
  },
  {
    id: 'cute',
    name: 'キュート',
    description: 'かわいいスタンプ',
    overlayUrl: '/effects/cute-stamps.svg',
  },
  {
    id: 'grunge',
    name: 'グランジ',
    description: 'ビンテージ加工',
    overlayUrl: '/effects/grunge-texture.svg',
  },
]
