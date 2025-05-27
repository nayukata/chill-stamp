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
 * エフェクトをキャンバスに適用する
 *
 * @param canvas - Canvas要素
 * @param effect - 適用するエフェクト
 * @param imageFilter - 適用する画像フィルター
 * @returns エフェクトが適用されたCanvas要素を含むPromise
 */
export const applyEffectsToCanvas = async (
  canvas: HTMLCanvasElement,
  effect: {
    borderStyle?: string
    cornerStyle?: string
    overlayUrl?: string
    id?: string // エフェクトIDを追加
  },
  imageFilter: ImageFilterType = 'none'
): Promise<HTMLCanvasElement> => {
  // 元のキャンバスからフィルター適用済みのキャンバスを作成
  const filteredCanvas = document.createElement('canvas')
  filteredCanvas.width = canvas.width
  filteredCanvas.height = canvas.height
  const filteredCtx = filteredCanvas.getContext('2d')

  if (!filteredCtx) {
    throw new Error('Failed to get canvas context')
  }

  // 元の画像を描画
  filteredCtx.drawImage(canvas, 0, 0)

  // フィルターを適用（'none'以外の場合）
  if (imageFilter !== 'none') {
    applyImageFilter(
      filteredCtx,
      imageFilter,
      filteredCanvas.width,
      filteredCanvas.height
    )
  }

  // 効果がなければフィルターのみ適用したキャンバスを返す
  if (
    effect.id === 'none' ||
    (!effect.borderStyle && !effect.cornerStyle && !effect.overlayUrl)
  ) {
    return filteredCanvas
  }

  // エフェクト適用用の新しいキャンバスを作成
  const newCanvas = document.createElement('canvas')
  const ctx = newCanvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // ボーダーサイズを解析（デフォルトは0）
  let borderSize = 0
  if (effect.borderStyle) {
    const borderMatch = effect.borderStyle.match(/(\d+)px/)
    if (borderMatch && borderMatch[1]) {
      borderSize = parseInt(borderMatch[1], 10)
    }
  }

  // キャンバスサイズをボーダーを含めたサイズに設定
  newCanvas.width = filteredCanvas.width + borderSize * 2
  newCanvas.height = filteredCanvas.height + borderSize * 2

  // ボーダーがあれば描画
  if (effect.borderStyle) {
    let borderColor = 'white'
    if (effect.borderStyle.includes('white')) {
      borderColor = 'white'
    } else if (effect.borderStyle.includes('transparent')) {
      borderColor = 'transparent'
    }

    // ボーダーカラーで全体を塗りつぶし
    ctx.fillStyle = borderColor
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)
  }

  // フィルター適用済みの画像を新しいキャンバスの中央に描画
  // ネオンエフェクトの場合は特別な処理
  if (effect.id === 'neon') {
    // ネオンエフェクトは複数のglowエフェクトを重ね合わせて作成

    // 1回目: ピンクのアウターglow
    ctx.shadowColor = '#ff00ff'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.drawImage(
      filteredCanvas,
      0,
      0,
      filteredCanvas.width,
      filteredCanvas.height,
      borderSize,
      borderSize,
      filteredCanvas.width,
      filteredCanvas.height
    )

    // 2回目: ブルーのインナーglow
    ctx.shadowColor = '#0077ff'
    ctx.shadowBlur = 15
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    ctx.drawImage(
      filteredCanvas,
      0,
      0,
      filteredCanvas.width,
      filteredCanvas.height,
      borderSize,
      borderSize,
      filteredCanvas.width,
      filteredCanvas.height
    )
  } else {
    // 通常のドロップシャドウ効果を設定
    if (effect.cornerStyle && effect.cornerStyle.includes('drop-shadow')) {
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 5
      ctx.shadowOffsetY = 5
    }

    // 画像を描画
    ctx.drawImage(
      filteredCanvas,
      0,
      0,
      filteredCanvas.width,
      filteredCanvas.height,
      borderSize,
      borderSize,
      filteredCanvas.width,
      filteredCanvas.height
    )
  }

  // シャドウ設定をリセット
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // オーバーレイ画像がある場合は適用
  if (effect.overlayUrl) {
    try {
      const img = new Image()

      // CORS問題を回避するために適切なURLを構築
      let overlayUrl = effect.overlayUrl
      if (!overlayUrl.startsWith('http') && !overlayUrl.startsWith('data:')) {
        // 相対パスの場合、現在のoriginと結合
        overlayUrl = `${window.location.origin}${
          overlayUrl.startsWith('/') ? '' : '/'
        }${overlayUrl}`
      }

      // CrossOrigin設定を追加
      img.crossOrigin = 'anonymous'

      // 画像の読み込みを待機
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          resolve()
        }
        img.onerror = (error) => {
          reject(new Error(`Failed to load overlay image: ${overlayUrl}`))
        }

        // SVGファイルの場合、Data URLに変換
        if (overlayUrl.endsWith('.svg')) {
          fetch(overlayUrl)
            .then((response) => response.text())
            .then((svgText) => {
              const blob = new Blob([svgText], { type: 'image/svg+xml' })
              const dataUrl = URL.createObjectURL(blob)
              img.src = dataUrl
            })
            .catch(reject)
        } else {
          img.src = overlayUrl
        }
      })

      // エフェクトの種類に基づいて適切なブレンドモードを選択
      let blendMode: GlobalCompositeOperation = 'source-over' // デフォルトは通常の重ね合わせ
      let opacity = 0.7 // デフォルトの透明度

      // エフェクトの種類によってブレンドモードを調整
      if (overlayUrl.includes('vaporwave')) {
        blendMode = 'overlay' // オーバーレイブレンドで色を混合
        opacity = 0.6
      } else if (overlayUrl.includes('grunge')) {
        blendMode = 'multiply' // 暗い部分が強調されるブレンド
        opacity = 0.5
      } else if (overlayUrl.includes('cute')) {
        blendMode = 'source-over' // 標準のオーバーレイ
        opacity = 0.8
      }

      // 選択したブレンドモードを適用
      ctx.globalCompositeOperation = blendMode
      ctx.globalAlpha = opacity

      // オーバーレイ画像を描画
      ctx.drawImage(
        img,
        borderSize,
        borderSize,
        filteredCanvas.width,
        filteredCanvas.height
      )

      // 設定を元に戻す
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1.0
    } catch (error) {
      console.error('Failed to apply overlay effect:', error)
      // エラーが発生してもエフェクト適用を続行
    }
  }

  return newCanvas
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
export const getImageFileFromDropEvent = (event: {
  preventDefault: () => void
  dataTransfer: { files: FileList }
}): File | null => {
  event.preventDefault()

  // ドロップされたファイルを取得
  const files = Array.from(event.dataTransfer.files)

  // 画像ファイルのみをフィルタリング
  const imageFile = files.find((file) => file.type.startsWith('image/'))

  return imageFile || null
}
