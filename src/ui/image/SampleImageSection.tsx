/* eslint-disable @next/next/no-img-element */
/**
 * サンプル画像セクション - 定義済みサンプル画像を表示・選択する
 *
 * @description
 * サンプル画像を表示し、ユーザーが選択できるようにするコンポーネント
 */
import { loadImageFromUrl } from '@/utils/image-processor'
import { useLgtm } from './context/LgtmContext'

// サンプル画像
const SAMPLE_IMAGES = [
  {
    src: '/examples/chill_city.jpg',
    alt: 'チルな街',
  },
  {
    src: '/examples/chill_room.jpg',
    alt: 'チルな部屋',
  },
  {
    src: '/examples/chill_record.png',
    alt: 'レコード',
  },
]

type SampleImageSectionProps = {
  showNotification: (type: 'success' | 'error', message: string) => void
}

export function SampleImageSection({
  showNotification,
}: SampleImageSectionProps) {
  const { setImageUrl, setIsRendering } = useLgtm()

  const handleSelectSample = async (sampleSrc: string) => {
    try {
      setIsRendering(true)
      const dataUrl = await loadImageFromUrl(sampleSrc)
      setImageUrl(dataUrl)
      showNotification('success', 'サンプル画像を読み込みました')
    } catch (error) {
      console.error('Failed to load sample image:', error)
      showNotification('error', 'サンプル画像の読み込みに失敗しました')
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <div className="mt-5 pt-4 border-t border-white/10">
      <p className="text-gray-300 text-sm mb-3">サンプル画像</p>
      <div className="flex gap-2 justify-center">
        {SAMPLE_IMAGES.map((sample, index) => (
          <button
            key={index}
            className="p-1 rounded border border-white/20 hover:border-pink-500/40 transition-colors cursor-pointer"
            onClick={() => handleSelectSample(sample.src)}
          >
            <img
              src={sample.src}
              alt={sample.alt}
              className="w-16 h-16 object-cover rounded"
              title={sample.alt}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
