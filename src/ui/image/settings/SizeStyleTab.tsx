import { StyleButton } from '@/ui/button/StyleButton'
import { useLgtm } from '../context/LgtmContext'
import { SizePreset } from '../types'

// 出力サイズプリセット
const SIZE_PRESETS: SizePreset[] = [
  { width: 320, height: 240, label: '320×240' },
  { width: 480, height: 360, label: '480×360' },
  { width: 640, height: 480, label: '640×480' },
  { width: 800, height: 600, label: '800×600' },
  { width: 300, height: 300, label: '300×300' },
]

/**
 * サイズスタイルタブ - 出力サイズの設定UI
 *
 * @description
 * 画像の出力サイズを設定するコンポーネント
 */
export function SizeStyleTab() {
  const {
    outputSize,
    customSize,
    isCustomSize,
    preserveAspectRatio,
    handleSizeChange,
    handleCustomSizeChange,
    setIsCustomSize,
    setPreserveAspectRatio,
  } = useLgtm()

  return (
    <>
      {/* 出力サイズ設定 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          出力サイズ
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SIZE_PRESETS.map((preset) => (
            <StyleButton
              key={preset.label}
              onClick={() => handleSizeChange(preset)}
              active={
                !isCustomSize &&
                outputSize.width === preset.width &&
                outputSize.height === preset.height
              }
            >
              {preset.label}
            </StyleButton>
          ))}
          <StyleButton
            onClick={() => setIsCustomSize(true)}
            active={isCustomSize}
          >
            カスタム
          </StyleButton>
        </div>

        {/* カスタムサイズ入力 */}
        {isCustomSize && (
          <div className="grid grid-cols-2 gap-2 mt-2 animate-fadeIn">
            <div className="space-y-1">
              <label className="block text-xs text-gray-300">幅 (px)</label>
              <input
                type="number"
                min="100"
                max="3840"
                value={customSize.width}
                onChange={(e) =>
                  handleCustomSizeChange('width', Number(e.target.value))
                }
                className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded-md text-white text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-gray-300">高さ (px)</label>
              <input
                type="number"
                min="100"
                max="2160"
                value={customSize.height}
                onChange={(e) =>
                  handleCustomSizeChange('height', Number(e.target.value))
                }
                className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded-md text-white text-sm"
              />
            </div>
          </div>
        )}

        {/* アスペクト比維持設定 */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={preserveAspectRatio}
            onChange={(e) => setPreserveAspectRatio(e.target.checked)}
            id="aspect-ratio-toggle"
            className="w-4 h-4 accent-pink-500"
          />
          <label
            htmlFor="aspect-ratio-toggle"
            className="text-xs font-medium text-gray-200"
          >
            アスペクト比を維持する
          </label>
        </div>
      </div>
    </>
  )
}
