import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Chill Stamp | チルなLGTM画像ジェネレーター',
  description:
    '画像にLGTMなどのテキストを追加してシェアできる便利なジェネレーター。チルな雰囲気のオリジナルLGTM画像を簡単に作成、保存できます。',
  keywords:
    'LGTM, 画像ジェネレーター, Looks Good To Me, GitHub, プルリクエスト, コードレビュー, 画像加工, Chill Stamp',
  authors: [{ name: 'Chill Stamp Team' }],
  creator: 'Chill Stamp Team',
  publisher: 'Chill Stamp',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://chill-stamp.vercel.app/',
    title: 'Chill Stamp | チルなLGTM画像ジェネレーター',
    description:
      '画像にLGTMなどのテキストを追加してシェアできる便利なジェネレーター。チルな雰囲気のオリジナルLGTM画像を簡単に作成、保存できます。',
    siteName: 'Chill Stamp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chill Stamp | チルなLGTM画像ジェネレーター',
    description:
      '画像にLGTMなどのテキストを追加してシェアできる便利なジェネレーター。チルな雰囲気のオリジナルLGTM画像を簡単に作成、保存できます。',
    creator: '@chill_stamp',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code', // 実際のコードに置き換える
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/chill-stamp-favicon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png', type: 'image/png' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon/chill-stamp-favicon.svg"
          type="image/svg+xml"
        />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
