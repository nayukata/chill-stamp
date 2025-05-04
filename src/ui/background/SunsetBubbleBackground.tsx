/**
 * サンセットテーマのバブル背景コンポーネント
 *
 * @description
 * 画面全体に表示されるサンセットカラーのバブル背景
 */
import BubbleBackground from './BubbleBackground'

export function SunsetBubbles() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-transparent">
      <BubbleBackground
        bgColorA="rgb(111, 66, 193)"
        bgColorB="rgb(80, 15, 139)"
        bubbleColors={{
          colorA: '255, 0, 128',
          colorB: '186, 83, 245',
          colorC: '149, 105, 243',
          colorD: '121, 80, 242',
          colorE: '255, 123, 211',
          interactive: '255, 118, 195',
        }}
        blendMode="screen"
      />

      {/* 装飾要素: 光の粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </svg>

        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white/70"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'url(#glow)',
              animation: `float ${
                Math.random() * 3 + 2
              }s ease-in-out infinite alternate`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </div>
  )
}
