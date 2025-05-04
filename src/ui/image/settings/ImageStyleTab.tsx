import { IMAGE_EFFECTS } from '@/utils/image-effects'
import { StyleButton } from '@/ui/button/StyleButton'
import { useLgtm } from '../context/LgtmContext'

/**
 * 画像スタイルタブ - 画像フレームエフェクトとフィルターの設定UI
 *
 * @description
 * 画像のエフェクトとフィルターを設定するコンポーネント
 */
export function ImageStyleTab() {
  const { imageUrl, selectedEffect, applyEffect, imageFilter, setImageFilter } =
    useLgtm()

  return (
    <>
      {/* 画像エフェクト選択 */}
      {imageUrl && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            フレームエフェクト
          </label>
          <div className="grid grid-cols-2 gap-2">
            {IMAGE_EFFECTS.map((effect) => (
              <StyleButton
                key={effect.id}
                onClick={() => applyEffect(effect)}
                active={selectedEffect.id === effect.id}
                title={effect.description}
                className="truncate"
              >
                {effect.name}
              </StyleButton>
            ))}
          </div>
          {selectedEffect.id !== 'none' && (
            <p className="text-xs text-gray-400 mt-1 animate-fadeIn">
              {selectedEffect.description}
            </p>
          )}
        </div>
      )}

      {/* 画像フィルター */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          画像フィルター
        </label>
        <div className="grid grid-cols-2 gap-2">
          <StyleButton
            onClick={() => setImageFilter('none')}
            active={imageFilter === 'none'}
          >
            なし
          </StyleButton>
          <StyleButton
            onClick={() => setImageFilter('sepia')}
            active={imageFilter === 'sepia'}
          >
            セピア
          </StyleButton>
          <StyleButton
            onClick={() => setImageFilter('grayscale')}
            active={imageFilter === 'grayscale'}
          >
            モノクロ
          </StyleButton>
          <StyleButton
            onClick={() => setImageFilter('negative')}
            active={imageFilter === 'negative'}
          >
            ネガティブ
          </StyleButton>
          <StyleButton
            onClick={() => setImageFilter('blur')}
            active={imageFilter === 'blur'}
          >
            ぼかし
          </StyleButton>
          <StyleButton
            onClick={() => setImageFilter('vaporwave')}
            active={imageFilter === 'vaporwave'}
          >
            ヴェイパー
          </StyleButton>
        </div>
      </div>
    </>
  )
}
