/**
 * 画像処理ユーティリティ
 *
 * @description
 * 画像処理に関する便利な関数を提供
 */
import { LgtmTheme } from './lgtm-themes'

/**
 * 画像フィルタータイプ
 */
export type ImageFilterType =
  | 'none'
  | 'sepia'
  | 'grayscale'
  | 'negative'
  | 'blur'
  | 'vaporwave'

/**
 * 画像のアスペクト比を維持したまま、指定サイズに収まるように計算する
 *
 * @param originalWidth - 元の幅
 * @param originalHeight - 元の高さ
 * @param targetWidth - 目標の幅
 * @param targetHeight - 目標の高さ
 * @returns 新しいサイズ { width, height }
 */
export const calculateAspectRatioFit = (
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number
): { width: number; height: number } => {
  const ratio = Math.min(
    targetWidth / originalWidth,
    targetHeight / originalHeight
  )

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  }
}

/**
 * テキスト位置の種類
 */
export type TextPosition = 'top' | 'center' | 'bottom'

/**
 * 画像にフィルターを適用する
 *
 * @param ctx - Canvas 2Dコンテキスト
 * @param filterType - 適用するフィルターの種類
 * @param width - キャンバスの幅
 * @param height - キャンバスの高さ
 */
export const applyImageFilter = (
  ctx: CanvasRenderingContext2D,
  filterType: ImageFilterType,
  width: number,
  height: number
): void => {
  if (filterType === 'none') return

  // 現在のキャンバス内容を一時的に保存
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  switch (filterType) {
    case 'sepia':
      // セピアフィルター
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
      }
      break

    case 'grayscale':
      // グレースケール
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        // 加重平均法によるグレースケール変換
        const gray = 0.299 * r + 0.587 * g + 0.114 * b

        data[i] = data[i + 1] = data[i + 2] = gray
      }
      break

    case 'negative':
      // ネガティブ
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i] // R
        data[i + 1] = 255 - data[i + 1] // G
        data[i + 2] = 255 - data[i + 2] // B
      }
      break

    case 'blur':
      // ボックスブラー（シンプルな方法でぼかし効果を適用）
      ctx.filter = 'blur(5px)'
      ctx.drawImage(ctx.canvas, 0, 0)
      ctx.filter = 'none'
      return // drawImageを使用したので、putImageDataは不要

    case 'vaporwave':
      // ヴェイパーウェイブ風（赤と青のチャンネルを入れ替え、彩度を上げる）
      for (let i = 0; i < data.length; i += 4) {
        // 赤と青のチャンネルを入れ替え
        const temp = data[i]
        data[i] = data[i + 2] * 1.2
        data[i + 2] = temp * 1.2

        // 彩度を上げる（シンプルな方法）
        data[i] = Math.min(255, data[i] * 1.3)
        data[i + 1] = Math.min(255, data[i + 1] * 0.8)
        data[i + 2] = Math.min(255, data[i + 2] * 1.3)
      }
      break
  }

  // 変更を適用
  ctx.putImageData(imageData, 0, 0)
}

/**
 * 画像とテキストを合成してCanvas要素に描画する
 *
 * @param canvas - 描画先のCanvas要素
 * @param imageUrl - 画像のURL
 * @param styles - テキストのスタイル
 * @param width - 出力画像の幅（省略時は元の画像サイズ）
 * @param height - 出力画像の高さ（省略時は元の画像サイズ）
 * @param preserveAspectRatio - アスペクト比を維持するかどうか
 * @param textPosition - テキストの位置（'top', 'center', 'bottom'）
 * @param filterType - 適用する画像フィルター
 * @returns 描画が完了したときに解決するPromise
 */
export const renderLgtmCanvas = (
  canvas: HTMLCanvasElement,
  imageUrl: string,
  styles: LgtmTheme,
  width?: number,
  height?: number,
  preserveAspectRatio = true,
  textPosition: TextPosition = 'center',
  filterType: ImageFilterType = 'none'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas context is not available'))
      return
    }

    const img = new Image()
    img.onload = () => {
      // 出力サイズの決定（指定がない場合は元の画像サイズ）
      let outputWidth = width || img.width
      let outputHeight = height || img.height

      // アスペクト比を維持する場合
      if (preserveAspectRatio && width && height) {
        const newSize = calculateAspectRatioFit(
          img.width,
          img.height,
          outputWidth,
          outputHeight
        )
        outputWidth = newSize.width
        outputHeight = newSize.height
      }

      // キャンバスのサイズを設定
      canvas.width = outputWidth
      canvas.height = outputHeight

      // 背景を透明に設定
      ctx.clearRect(0, 0, outputWidth, outputHeight)

      // 画像を描画（サイズ調整あり）
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        outputWidth,
        outputHeight
      )

      // フィルターを適用
      applyImageFilter(ctx, filterType, outputWidth, outputHeight)

      // テキストのスタイルを設定
      // フォントサイズを画像サイズに合わせて調整
      const scaleFactor = Math.min(outputWidth / 800, outputHeight / 600)
      const adjustedFontSize = Math.max(
        20,
        Math.round(styles.fontSize * scaleFactor)
      )

      ctx.font = `${styles.fontWeight} ${adjustedFontSize}px ${styles.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // 文字間隔を調整（スペースがある場合は対応）
      let displayText = styles.text
      if (displayText.includes(' ')) {
        // すでにスペースが含まれている場合はそのまま使用
      } else if (displayText === 'LGTM' || displayText.length <= 5) {
        // LGTMや短い文字列の場合は文字間隔を広げる（文字間にスペースを挿入）
        displayText = displayText.split('').join(' ')
      }

      // テキスト位置
      const x = outputWidth / 2
      let y: number

      // テキスト位置に基づいて垂直位置を調整
      switch (textPosition) {
        case 'top':
          y = adjustedFontSize * 0.8
          break
        case 'bottom':
          y = outputHeight - adjustedFontSize * 0.8
          break
        case 'center':
        default:
          y = outputHeight / 2
      }

      // 影を描画
      if (styles.shadow) {
        ctx.shadowColor = styles.shadowColor
        ctx.shadowBlur = 10 * scaleFactor
        ctx.shadowOffsetX = 4 * scaleFactor
        ctx.shadowOffsetY = 4 * scaleFactor
      } else {
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // テキストを描画
      ctx.fillStyle = styles.fontColor
      ctx.fillText(displayText, x, y)

      resolve()
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageUrl
  })
}

/**
 * URLから画像をロードしてDataURLに変換する
 *
 * @description
 * 外部もしくは内部URLから画像をロードし、DataURL形式で返却する
 */
export const loadImageFromUrl = async (url: string): Promise<string> => {
  // データURLの場合はそのまま返す
  if (url.startsWith('data:')) {
    return url
  }

  // 相対パスの場合は現在のホストのURLと組み合わせる
  const fullUrl =
    url.startsWith('http') || url.startsWith('data:')
      ? url
      : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`

  try {
    const response = await fetch(fullUrl, { mode: 'cors' })
    if (!response.ok) {
      throw new Error(
        `Failed to load image: ${response.status} ${response.statusText}`
      )
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error loading image from URL:', error)
    throw new Error('画像のロードに失敗しました')
  }
}

/**
 * Canvasからデータ URL を生成する
 *
 * @param canvas - Canvas要素
 * @param format - 画像フォーマット
 * @param quality - 画像品質 (0-1)
 * @returns データURL文字列
 */
export const canvasToDataUrl = (
  canvas: HTMLCanvasElement,
  format = 'image/png',
  quality = 0.9
): string => {
  return canvas.toDataURL(format, quality)
}

/**
 * データURLから画像をダウンロードする
 *
 * @param dataUrl - 画像のデータURL
 * @param filename - ダウンロードするファイル名
 */
export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

/**
 * キャンバスの内容をクリップボードにコピーする
 *
 * @param canvas - Canvas要素
 * @returns コピーが成功したかどうかを示すPromise
 */
export const copyCanvasToClipboard = async (
  canvas: HTMLCanvasElement
): Promise<boolean> => {
  try {
    // Canvasをblobに変換
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas to Blob conversion failed'))
        }
      }, 'image/png')
    })

    // クリップボードAPIを使用して画像をコピー
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])

    return true
  } catch (error) {
    console.error('クリップボードへのコピーに失敗しました:', error)
    return false
  }
}

/**
 * ファイルからデータURLを読み込む
 *
 * @param file - 読み込むファイル
 * @returns データURLを含むPromise
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(event.target.result)
      } else {
        reject(new Error('Failed to read file as data URL'))
      }
    }

    reader.onerror = () => {
      reject(new Error('File reading error'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * ドロップされたアイテムから画像ファイルを抽出する
 *
 * @param event - ドロップイベント
 * @returns 画像ファイルまたはnull
 */
export const getImageFileFromDropEvent = (
  event: React.DragEvent
): File | null => {
  event.preventDefault()

  // ドロップされたファイルを取得
  const files = Array.from(event.dataTransfer.files)

  // 画像ファイルのみをフィルタリング
  const imageFile = files.find((file) => file.type.startsWith('image/'))

  return imageFile || null
}
