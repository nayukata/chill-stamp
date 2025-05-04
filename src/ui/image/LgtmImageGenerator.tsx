'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import {
  canvasToDataUrl,
  copyCanvasToClipboard,
  downloadImage as downloadImageUtil,
  renderLgtmCanvas,
} from '@/utils/image-processor'

import { ActionButtons } from './ActionButtons'
import { ImageDropZone } from './ImageDropZone'
import { ImagePreview } from './ImagePreview'
import { ImageUrlInput } from './ImageUrlInput'

import { TextStyleTab } from './settings/TextStyleTab'
import { ImageStyleTab } from './settings/ImageStyleTab'
import { SizeStyleTab } from './settings/SizeStyleTab'
import { LgtmProvider, useLgtm } from './context/LgtmContext'
import {
  Notification,
  NotificationData,
  NotificationType,
} from '../notification/Notification'
import { StylePanel } from './StylePanel'

type MemeImageGeneratorProps = {
  className?: string
}

/**
 * 画像テキストジェネレーター - 画像にテキストをオーバーレイして表示・保存
 *
 * @description
 * アップロードされた画像にテキストを配置し、設定を変更して画像をダウンロード
 */
export function MemeImageGeneratorContainer({
  className,
}: MemeImageGeneratorProps) {
  const [notification, setNotification] = useState<NotificationData | null>(
    null
  )

  // 通知を表示する関数
  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      setNotification({ type, message })
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    },
    []
  )

  return (
    <LgtmProvider onShowNotification={showNotification}>
      <MemeImageGenerator className={className} />
      <Notification notification={notification} />
    </LgtmProvider>
  )
}

// 画像生成コンポーネント
function MemeImageGenerator({ className }: MemeImageGeneratorProps) {
  const {
    imageUrl,
    styles,
    isDragging,
    customSize,
    isCustomSize,
    outputSize,
    preserveAspectRatio,
    textPosition,
    imageFilter,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    showNotification,
    handleImageChange,
  } = useLgtm()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ファイル選択ダイアログを開く関数
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // ファイル選択からの画像読み込み
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleImageChange(file)
      }
    },
    [handleImageChange]
  )

  // クリップボードから画像をペーストする機能
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            handleImageChange(file)
            showNotification('success', '画像をペーストしました')
            break
          }
        }
      }
    },
    [handleImageChange, showNotification]
  )

  // ペースト用のイベントリスナー設定
  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  // 画像とテキストをキャンバスに描画する関数
  const renderCanvas = useCallback(async () => {
    if (!canvasRef.current || !imageUrl) return

    try {
      const size = isCustomSize ? customSize : outputSize
      await renderLgtmCanvas(
        canvasRef.current,
        imageUrl,
        styles,
        size.width,
        size.height,
        preserveAspectRatio,
        textPosition,
        imageFilter
      )
    } catch (error) {
      console.error('Failed to render canvas:', error)
      showNotification('error', 'キャンバスの描画に失敗しました')
    }
  }, [
    imageUrl,
    styles,
    outputSize,
    customSize,
    isCustomSize,
    preserveAspectRatio,
    textPosition,
    imageFilter,
    showNotification,
  ])

  // スタイル変更時にキャンバスを再描画
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  // 画像のダウンロード関数
  const downloadImage = useCallback(() => {
    if (!canvasRef.current) return

    try {
      const dataUrl = canvasToDataUrl(canvasRef.current)
      downloadImageUtil(dataUrl, `Meme-${new Date().getTime()}.png`)
      showNotification('success', '画像をダウンロードしました')
    } catch (error) {
      console.error('Failed to download image:', error)
      showNotification('error', 'ダウンロードに失敗しました')
    }
  }, [showNotification])

  // クリップボードにコピーする関数
  const copyToClipboard = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      const success = await copyCanvasToClipboard(canvasRef.current)
      if (success) {
        showNotification('success', 'クリップボードにコピーしました')
      } else {
        throw new Error('Copy failed')
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      showNotification('error', 'コピーに失敗しました')
    }
  }, [showNotification])

  return (
    <div className={cn('w-full max-w-4xl mx-auto p-4', className)}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* プレビュー領域 */}
        <div className="flex-1 flex flex-col">
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative w-full aspect-square rounded-xl overflow-hidden mb-4 transition-all duration-300 text-shadow-md',
              isDragging
                ? 'bg-pink-500/30 border-2 border-dashed border-pink-400'
                : imageUrl
                ? 'bg-transparent border-0'
                : 'bg-black/20 backdrop-blur-sm border-2 border-white/10'
            )}
          >
            {imageUrl ? (
              <ImagePreview canvasRef={canvasRef} />
            ) : (
              <ImageDropZone openFilePicker={openFilePicker} />
            )}

            <ImageUrlInput />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />

          {imageUrl && (
            <ActionButtons
              onDownload={downloadImage}
              onCopy={copyToClipboard}
            />
          )}
        </div>

        {/* 設定パネル  */}
        <StylePanel>
          <StylePanel.TabContent tabId="text">
            <TextStyleTab />
          </StylePanel.TabContent>
          <StylePanel.TabContent tabId="image">
            <ImageStyleTab />
          </StylePanel.TabContent>
          <StylePanel.TabContent tabId="size">
            <SizeStyleTab />
          </StylePanel.TabContent>
        </StylePanel>
      </div>
    </div>
  )
}
