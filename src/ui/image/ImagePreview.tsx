/**
 * 画像プレビュー - アップロードされた画像のプレビュー
 *
 * @description
 * アップロードされた画像にテキストと共に表示するキャンバスコンポーネント
 */
import { RefObject } from 'react'
import { useLgtm } from './context/LgtmContext'

type ImagePreviewProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

export function ImagePreview({ canvasRef }: ImagePreviewProps) {
  const { isRendering, selectedEffect, clearImage, imageUrl } = useLgtm()
  if (!imageUrl) return null

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden">
      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        style={{
          border: selectedEffect.borderStyle || 'none',
          filter: selectedEffect.cornerStyle || 'none',
          padding: selectedEffect.borderStyle ? '5px' : '0',
        }}
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain"
        />

        {/* オーバーレイ画像 */}
        {selectedEffect.overlayUrl && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url(${selectedEffect.overlayUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.85,
            }}
          />
        )}
      </div>

      {/* 画像削除ボタン */}
      <button
        onClick={clearImage}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors cursor-pointer"
        title="画像をクリア"
      >
        ✕
      </button>

      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-fadeIn">
            <span className="text-white">レンダリング中...</span>
          </div>
        </div>
      )}
    </div>
  )
}
