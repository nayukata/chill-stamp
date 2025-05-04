/**
 * 画像URL入力 - URLから画像を読み込むためのフォーム
 *
 * @description
 * 画像URLを入力して読み込むためのモーダルフォーム
 */
import { useState } from 'react'
import { useLgtm } from './context/LgtmContext'

export function ImageUrlInput() {
  const { isRendering, showUrlInput, loadImageFromInputUrl, setShowUrlInput } =
    useLgtm()
  const [imageUrl, setImageUrl] = useState<string>('')

  if (!showUrlInput) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn z-10">
      <div className="bg-gray-800/90 p-6 rounded-xl border border-white/20 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-gray-100">
          URLから画像を読み込む
        </h3>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1.5 rounded-md bg-gray-700 text-gray-200 text-sm hover:bg-gray-600 cursor-pointer"
            onClick={() => setShowUrlInput(false)}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-1.5 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm hover:from-pink-600 hover:to-purple-600 cursor-pointer"
            onClick={() => loadImageFromInputUrl(imageUrl)}
            disabled={isRendering}
          >
            読み込む
          </button>
        </div>
      </div>
    </div>
  )
}
