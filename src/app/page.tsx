/**
 * 画像テキストジェネレーターのメインページ
 *
 * @description
 * サンセットバブル背景と画像テキストジェネレーターを組み合わせたchillなメインページ
 */
import { SunsetBubbles } from '@/ui/background/SunsetBubbleBackground'
import { MemeImageGeneratorContainer } from '@/ui/image'

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 -z-10">
        <SunsetBubbles />
      </div>

      {/* ヘッダー */}
      <header className="w-full py-10 px-4 text-center animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold font-['Comic_Sans_MS',_cursive] bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-scaleIn">
          Chill Stamp
        </h1>
        <p className="mt-4 text-gray-200 max-w-md mx-auto text-xl animate-fadeInDelay font-['Tegaki','Comic_Sans_MS',_sans-serif]">
          画像にテキストを簡単に追加できます 🏄
        </p>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 w-full max-w-7xl px-4 py-8 animate-fadeInScale">
        <div className="backdrop-blur-md bg-black/20 rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 hover:shadow-glow transition duration-300">
          <MemeImageGeneratorContainer />
        </div>
      </main>

      {/* フッター */}
      <footer className="w-full py-6 text-center text-sm text-gray-300 animate-fadeInLong">
        <p className="font-['Comic_Sans_MS',_cursive]">
          © {new Date().getFullYear()} Chill Stamp | Made with ❤️ for chill
          vibes
        </p>
      </footer>
    </div>
  )
}
