/**
 * アクションボタン - 画像ダウンロードとクリップボードコピー
 *
 * @description
 * 生成した画像に対する操作ボタン群
 */

import { useLgtm } from './context/LgtmContext'

type ActionButtonsProps = {
  onDownload: () => void
  onCopy: () => void
}

export function ActionButtons({ onDownload, onCopy }: ActionButtonsProps) {
  const { isRendering } = useLgtm()

  return (
    <div className="flex flex-wrap gap-3 animate-fadeInDelay justify-center">
      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        disabled={isRendering}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>ダウンロード</span>
      </button>
      <button
        onClick={onCopy}
        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        disabled={isRendering}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        <span>コピー</span>
      </button>
    </div>
  )
}
