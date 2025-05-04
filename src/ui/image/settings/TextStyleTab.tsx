import { LgtmThemeKey, lgtmThemes } from '@/utils/lgtm-themes'
import { useLgtm } from '../context/LgtmContext'
import { StyleButton } from '@/ui/button/StyleButton'

// プリセットテキスト
const PRESET_TEXTS = [
  'L G T M',
  'Looks Good To Me',
  'Good vibes',
  'Sweet',
  'ありがとう',
  'おつかれさま',
]

/**
 * テキストスタイルタブ - テキスト関連の設定UI
 *
 * @description
 * テキストのスタイル設定（テーマ、フォント、サイズ、色など）を行うコンポーネント
 */
export function TextStyleTab() {
  const {
    styles,
    updateStyle,
    selectedTheme,
    applyTheme,
    textPosition,
    setTextPosition,
  } = useLgtm()

  // プリセットテキストを選択する関数
  const selectPresetText = (text: string) => {
    updateStyle('text', text)
  }

  return (
    <>
      {/* テーマ選択 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          テーマ
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(lgtmThemes) as LgtmThemeKey[]).map((themeKey) => (
            <StyleButton
              key={themeKey}
              onClick={() => applyTheme(themeKey)}
              active={selectedTheme === themeKey}
              className="capitalize"
            >
              {themeKey}
            </StyleButton>
          ))}
        </div>
      </div>

      {/* テキスト入力 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          テキスト
        </label>
        <input
          type="text"
          value={styles.text}
          onChange={(e) => updateStyle('text', e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
        />
      </div>

      {/* プリセットテキスト */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          プリセット
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_TEXTS.map((text) => (
            <StyleButton
              key={text}
              onClick={() => selectPresetText(text)}
              variant="outline"
              size="xs"
            >
              {text}
            </StyleButton>
          ))}
        </div>
      </div>

      {/* テキスト位置 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          テキスト位置
        </label>
        <div className="grid grid-cols-3 gap-2">
          <StyleButton
            onClick={() => setTextPosition('top')}
            active={textPosition === 'top'}
          >
            <span className="flex items-center justify-center gap-1">
              <span>上</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </StyleButton>
          <StyleButton
            onClick={() => setTextPosition('center')}
            active={textPosition === 'center'}
          >
            <span className="flex items-center justify-center gap-1">
              <span>中央</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </StyleButton>
          <StyleButton
            onClick={() => setTextPosition('bottom')}
            active={textPosition === 'bottom'}
          >
            <span className="flex items-center justify-center gap-1">
              <span>下</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </StyleButton>
        </div>
      </div>

      {/* フォントサイズ */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          フォントサイズ: {styles.fontSize}px
        </label>
        <input
          type="range"
          min="20"
          max="200"
          value={styles.fontSize}
          onChange={(e) => updateStyle('fontSize', Number(e.target.value))}
          className="w-full accent-pink-500"
        />
      </div>

      {/* フォントの色とフォントファミリーをコンパクトに */}
      <div className="grid grid-cols-2 gap-4">
        {/* フォントの色 */}
        <div>
          <label className="block text-xs font-medium text-gray-200 mb-1">
            フォント色
          </label>
          <div className="hover:scale-110 transition duration-200">
            <input
              type="color"
              value={styles.fontColor}
              onChange={(e) => updateStyle('fontColor', e.target.value)}
              className="w-8 h-8 p-1 bg-transparent border-0 rounded-md cursor-pointer"
            />
          </div>
        </div>

        {/* フォントファミリー */}
        <div>
          <label className="block text-xs font-medium text-gray-200 mb-1">
            フォント
          </label>
          <select
            value={styles.fontFamily}
            onChange={(e) => updateStyle('fontFamily', e.target.value)}
            className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded-md text-white appearance-none cursor-pointer text-xs"
            style={{ fontFamily: styles.fontFamily }}
          >
            <option value="'Comic Sans MS', cursive">Comic Sans</option>
            <option value="'Tegaki', sans-serif">手書き</option>
            <option value="Impact, sans-serif">Impact</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Courier New', monospace">Courier</option>
            <option value="Georgia, serif">Georgia</option>
          </select>
        </div>
      </div>

      {/* 影の設定をコンパクトに */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={styles.shadow}
          onChange={(e) => updateStyle('shadow', e.target.checked)}
          id="shadow-toggle"
          className="w-4 h-4 accent-pink-500"
        />
        <label
          htmlFor="shadow-toggle"
          className="text-sm font-medium text-gray-200"
        >
          テキスト影
        </label>
        {styles.shadow && (
          <div className="ml-auto">
            <input
              type="color"
              value={styles.shadowColor}
              onChange={(e) => updateStyle('shadowColor', e.target.value)}
              className="w-6 h-6 p-0.5 bg-transparent border-0 rounded-md cursor-pointer"
            />
          </div>
        )}
      </div>
    </>
  )
}
