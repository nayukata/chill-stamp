/**
 * 画像テキストコンテキスト - アプリケーションの状態管理
 *
 * @description
 * 画像テキストジェネレーターの状態と関数を提供するコンテキスト
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react'
import { LgtmTheme, LgtmThemeKey, getTheme } from '@/utils/lgtm-themes'
import {
  TextPosition,
  ImageFilterType,
  readFileAsDataURL,
  loadImageFromUrl,
  getImageFileFromDropEvent,
} from '@/utils/image-processor'
import { IMAGE_EFFECTS } from '@/utils/image-effects'
import { ImageEffect, SizePreset } from '../types'
import { StyleTabType } from '../StyleTabs'
import { NotificationType } from '../../notification/Notification'

// コンテキストの型定義
type MemeContextType = {
  // 状態
  imageUrl: string | null
  styles: LgtmTheme
  selectedTheme: LgtmThemeKey
  isRendering: boolean
  isDragging: boolean
  showUrlInput: boolean
  outputSize: SizePreset
  customSize: { width: number; height: number }
  isCustomSize: boolean
  preserveAspectRatio: boolean
  selectedEffect: ImageEffect
  textPosition: TextPosition
  imageFilter: ImageFilterType
  activeTab: StyleTabType

  // アクション
  setImageUrl: (url: string | null) => void
  updateStyle: <K extends keyof LgtmTheme>(key: K, value: LgtmTheme[K]) => void
  applyTheme: (themeKey: LgtmThemeKey) => void
  setIsRendering: (isRendering: boolean) => void
  setIsDragging: (isDragging: boolean) => void
  setShowUrlInput: (show: boolean) => void
  setActiveTab: (tab: StyleTabType) => void
  setTextPosition: (position: TextPosition) => void
  applyEffect: (effect: ImageEffect) => void
  setImageFilter: (filter: ImageFilterType) => void
  handleSizeChange: (preset: SizePreset) => void
  handleCustomSizeChange: (dimension: 'width' | 'height', value: number) => void
  setIsCustomSize: (isCustom: boolean) => void
  setPreserveAspectRatio: (preserve: boolean) => void

  // ファイル操作
  handleImageChange: (file: File) => Promise<void>
  loadImageFromInputUrl: (url: string) => Promise<void>
  clearImage: () => void
  handleDrop: (e: React.DragEvent) => void
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void

  // 通知
  showNotification: (type: NotificationType, message: string) => void
}

// コンテキストを作成
const MemeContext = createContext<MemeContextType | undefined>(undefined)

// コンテキストを使用するためのフック
export const useLgtm = () => {
  const context = useContext(MemeContext)
  if (!context) {
    throw new Error('useLgtm must be used within MemeProvider')
  }
  return context
}

// プロバイダーコンポーネント
type MemeProviderProps = {
  children: ReactNode
  onShowNotification: (type: NotificationType, message: string) => void
}

export function LgtmProvider({
  children,
  onShowNotification,
}: MemeProviderProps) {
  // 編集対象の画像のURL
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  // 編集対象の画像のスタイル
  const [styles, setStyles] = useState<LgtmTheme>(getTheme('vintagePop'))
  // 編集対象の画像のテーマ
  const [selectedTheme, setSelectedTheme] = useState<LgtmThemeKey>('vintagePop')
  // 画像の生成中かどうか
  const [isRendering, setIsRendering] = useState<boolean>(false)
  // ドラッグ中かどうか
  const [isDragging, setIsDragging] = useState<boolean>(false)
  // URL入力モーダルの表示状態
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false)
  // 出力サイズ
  const [outputSize, setOutputSize] = useState<SizePreset>({
    width: 640,
    height: 480,
    label: '640×480',
  })
  // カスタムサイズ
  const [customSize, setCustomSize] = useState({ width: 640, height: 480 })
  // カスタムサイズかどうか
  const [isCustomSize, setIsCustomSize] = useState(true)
  // アスペクト比を維持するかどうか
  const [preserveAspectRatio, setPreserveAspectRatio] = useState(true)
  // 選択中のエフェクト
  const [selectedEffect, setSelectedEffect] = useState<ImageEffect>(
    IMAGE_EFFECTS[0]
  )
  // テキストの位置
  const [textPosition, setTextPosition] = useState<TextPosition>('center')
  // 画像フィルター
  const [imageFilter, setImageFilter] = useState<ImageFilterType>('none')
  // アクティブなタブ
  const [activeTab, setActiveTab] = useState<StyleTabType>('text')

  // 通知を表示する関数
  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      onShowNotification(type, message)
    },
    [onShowNotification]
  )

  // 画像をファイルから読み込む関数
  const handleImageChange = useCallback(
    async (file: File) => {
      try {
        const dataUrl = await readFileAsDataURL(file)
        setImageUrl(dataUrl)

        // 画像の元のサイズを取得
        const img = new Image()
        img.onload = () => {
          setCustomSize({ width: img.width, height: img.height })
        }
        img.src = dataUrl
      } catch (error) {
        console.error('Failed to read image file:', error)
        showNotification('error', '画像の読み込みに失敗しました')
      }
    },
    [showNotification]
  )

  // 画像を削除する関数
  const clearImage = useCallback(() => {
    setImageUrl(null)
  }, [])

  // URLから画像を読み込む関数
  const loadImageFromInputUrl = useCallback(
    async (url: string) => {
      if (!url.trim()) {
        showNotification('error', 'URLを入力してください')
        return
      }

      try {
        setIsRendering(true)
        const dataUrl = await loadImageFromUrl(url)
        setImageUrl(dataUrl)

        // 画像の元のサイズを取得
        const img = new Image()
        img.onload = () => {
          setCustomSize({ width: img.width, height: img.height })
        }
        img.src = dataUrl

        setShowUrlInput(false)
        showNotification('success', '画像を読み込みました')
      } catch (error) {
        console.error('Failed to load image from URL:', error)
        showNotification('error', 'URLからの画像読み込みに失敗しました')
      } finally {
        setIsRendering(false)
      }
    },
    [showNotification]
  )

  // エフェクトを適用する関数
  const applyEffect = useCallback((effect: ImageEffect) => {
    setSelectedEffect(effect)
  }, [])

  // ドラッグ&ドロップイベント処理
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      const file = getImageFileFromDropEvent(e)
      setIsDragging(false)

      if (file) {
        handleImageChange(file)
      } else {
        showNotification('error', '画像ファイルをドロップしてください')
      }
    },
    [handleImageChange, showNotification]
  )

  // スタイルを更新する関数
  const updateStyle = useCallback(
    <K extends keyof LgtmTheme>(key: K, value: LgtmTheme[K]) => {
      setStyles((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  // テーマを適用する関数
  const applyTheme = useCallback((themeKey: LgtmThemeKey) => {
    setSelectedTheme(themeKey)
    const newTheme = getTheme(themeKey)
    setStyles({
      ...newTheme,
      text: newTheme.text,
    })
  }, [])

  // 出力サイズを設定する関数
  const handleSizeChange = useCallback((preset: SizePreset) => {
    setOutputSize(preset)
    setIsCustomSize(false)
  }, [])

  // カスタムサイズを設定する関数
  const handleCustomSizeChange = useCallback(
    (dimension: 'width' | 'height', value: number) => {
      setCustomSize((prev) => ({ ...prev, [dimension]: value }))
      setIsCustomSize(true)
    },
    []
  )

  const contextValue: MemeContextType = {
    // 状態
    imageUrl,
    styles,
    selectedTheme,
    isRendering,
    isDragging,
    showUrlInput,
    outputSize,
    customSize,
    isCustomSize,
    preserveAspectRatio,
    selectedEffect,
    textPosition,
    imageFilter,
    activeTab,

    // アクション
    setImageUrl,
    updateStyle,
    applyTheme,
    setIsRendering,
    setIsDragging,
    setShowUrlInput,
    setActiveTab,
    setTextPosition,
    applyEffect,
    setImageFilter,
    handleSizeChange,
    handleCustomSizeChange,
    setIsCustomSize,
    setPreserveAspectRatio,

    // ファイル操作
    handleImageChange,
    loadImageFromInputUrl,
    clearImage,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,

    // 通知
    showNotification,
  }

  return (
    <MemeContext.Provider value={contextValue}>{children}</MemeContext.Provider>
  )
}
