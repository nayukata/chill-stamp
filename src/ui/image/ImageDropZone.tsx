/**
 * 画像ドロップゾーン - 画像のドラッグ＆ドロップ、ファイル選択、URL入力
 *
 * @description
 * 画像のアップロード方法を提供するコンポーネント
 */
import { useEffect, useState } from 'react'
import { SampleImageSection } from './SampleImageSection'
import { useLgtm } from './context/LgtmContext'

type ImageDropZoneProps = {
  openFilePicker: () => void
}

export function ImageDropZone({ openFilePicker }: ImageDropZoneProps) {
  const { isDragging, showNotification, setShowUrlInput } = useLgtm()
  const [shortcutKey, setShortcutKey] = useState<string>('Ctrl+V')

  // デバイス判定
  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    setShortcutKey(isMac ? '⌘+V' : 'Ctrl+V')
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="text-center p-6 transition duration-300">
        <div className="text-4xl mb-4 animate-float">📷</div>
        <p className="text-gray-300 text-lg mb-2">
          {isDragging
            ? 'ドロップして画像をアップロード'
            : '画像をドラッグ＆ドロップ'}
        </p>
        <p className="text-gray-400 text-sm mb-2">または</p>
        <div className="flex flex-col gap-2">
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium text-sm hover:scale-103 active:scale-98 transition duration-300 cursor-pointer"
            onClick={openFilePicker}
          >
            ファイルを選択
          </button>
          <button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-medium text-sm hover:scale-103 active:scale-98 transition duration-300 cursor-pointer"
            onClick={() => setShowUrlInput(true)}
          >
            URLから読み込み
          </button>
        </div>
        <p className="mt-3 text-gray-400 text-xs">
          または画像をクリップボードからペースト ({shortcutKey})
        </p>

        {/* サンプル画像セクション */}
        <SampleImageSection showNotification={showNotification} />
      </div>
    </div>
  )
}
