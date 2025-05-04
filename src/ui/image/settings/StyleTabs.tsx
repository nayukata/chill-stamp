/**
 * スタイルタブ切り替え - スタイル設定パネルのタブUI
 *
 * @description
 * テキスト、画像効果、サイズの各設定タブを切り替えるナビゲーション
 */

import { StyleButton } from '@/ui/button/StyleButton'

export type StyleTabType = 'text' | 'image' | 'size'

type StyleTabsProps = {
  activeTab: StyleTabType
  onChangeTab: (tab: StyleTabType) => void
}

export function StyleTabs({ activeTab, onChangeTab }: StyleTabsProps) {
  return (
    <div className="flex border-b border-white/10">
      <div className="flex-1">
        <StyleButton
          active={activeTab === 'text'}
          onClick={() => onChangeTab('text')}
          className="w-full py-2 rounded-none"
        >
          <div className="flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 5.5C5 6.33 5.67 7 6.5 7h4v10H8v2h8v-2h-2.5V7H18c.83 0 1.5-.67 1.5-1.5S18.83 4 18 4H6.5C5.67 4 5 4.67 5 5.5z" />
            </svg>
            テキスト
          </div>
        </StyleButton>
      </div>
      <div className="flex-1">
        <StyleButton
          active={activeTab === 'image'}
          onClick={() => onChangeTab('image')}
          className="w-full py-2 rounded-none"
        >
          <div className="flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            画像効果
          </div>
        </StyleButton>
      </div>
      <div className="flex-1">
        <StyleButton
          active={activeTab === 'size'}
          onClick={() => onChangeTab('size')}
          className="w-full py-2 rounded-none"
        >
          <div className="flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 15h2v2h-2v-2zm0-4h2v2h-2v-2zm2 8h-2v2c1 0 2-1 2-2zM13 3h2v2h-2V3zm8 4h2v2h-2V7zm0-4v2h2c0-1-1-2-2-2zM1 7h2v2H1V7zm16-4h2v2h-2V3zm0 16h2v2h-2v-2zM3 3C2 3 1 4 1 5h2V3zm6 0h2v2H9V3zM5 3h2v2H5V3zm-4 8v8c0 1.1.9 2 2 2h12V11H1zm2 8l2.5-3.21 1.79 2.15 2.5-3.22L13 19H3z" />
            </svg>
            サイズ
          </div>
        </StyleButton>
      </div>
    </div>
  )
}
