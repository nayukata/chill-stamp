import { createContext, useContext, ReactNode } from 'react'
import { LgtmTheme, LgtmThemeKey } from '@/utils/lgtm-themes'
import { TextPosition, ImageFilterType } from '@/utils/image-processor'
import { useLgtm } from './context/LgtmContext'
import { ImageEffect, SizePreset } from './types'
import { StyleTabs, StyleTabType } from './settings/StyleTabs'

// Contextの型定義
type StylePanelContextType = {
  imageUrl: string | null
  styles: LgtmTheme
  updateStyle: <K extends keyof LgtmTheme>(key: K, value: LgtmTheme[K]) => void
  selectedTheme: LgtmThemeKey
  applyTheme: (themeKey: LgtmThemeKey) => void
  activeTab: StyleTabType
  setActiveTab: (tab: StyleTabType) => void
  textPosition: TextPosition
  setTextPosition: (position: TextPosition) => void
  selectedEffect: ImageEffect
  applyEffect: (effect: ImageEffect) => void
  imageFilter: ImageFilterType
  setImageFilter: (filter: ImageFilterType) => void
  outputSize: SizePreset
  customSize: { width: number; height: number }
  isCustomSize: boolean
  preserveAspectRatio: boolean
  handleSizeChange: (preset: SizePreset) => void
  handleCustomSizeChange: (dimension: 'width' | 'height', value: number) => void
  setIsCustomSize: (isCustom: boolean) => void
  setPreserveAspectRatio: (preserve: boolean) => void
}

// StylePanelのContext作成
const StylePanelContext = createContext<StylePanelContextType | undefined>(
  undefined
)

// Contextを使用するためのカスタムフック
export const useStylePanel = () => {
  const context = useContext(StylePanelContext)
  if (!context) {
    throw new Error('useStylePanel must be used within a StylePanelProvider')
  }
  return context
}

// メインとなるStylePanelコンポーネント

/**
 * スタイル設定パネル - 画像生成の設定パネル
 *
 * @description
 * テキスト、画像効果、サイズの設定を提供するパネル
 */
export function StylePanel({ children }: { children: ReactNode }) {
  const { activeTab, setActiveTab } = useLgtm()

  return (
    <div className="w-full md:w-72 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden animate-fadeInScale">
      <h3 className="text-md font-bold p-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500">
        スタイル設定
      </h3>

      {/* タブナビゲーション */}
      <StyleTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      <div className="p-4 pb-10 space-y-4 max-h-[450px] overflow-y-auto mask-t-from-95% mask-b-from-90%">
        {children}
      </div>
    </div>
  )
}

// タブコンテンツ用のコンポーネント
type TabContentProps = {
  tabId: StyleTabType
  children: ReactNode
}

StylePanel.TabContent = function TabContent({
  tabId,
  children,
}: TabContentProps) {
  const { activeTab } = useLgtm()
  if (activeTab !== tabId) return null
  return <>{children}</>
}
