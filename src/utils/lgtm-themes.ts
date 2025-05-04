/**
 * テキストスタイルのテーマ設定
 *
 * @description
 * テキストのプリセットスタイルを定義
 */

export type LgtmTheme = {
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  fontColor: string
  shadow: boolean
  shadowColor: string
}

export const lgtmThemes = {
  vintagePop: {
    text: 'L G T M',
    fontFamily: "'Comic Sans MS', cursive",
    fontSize: 80,
    fontWeight: 900,
    fontColor: '#FF9FEF',
    shadow: true,
    shadowColor: '#9C27B0',
  },
  chillBlue: {
    text: 'L G T M',
    fontFamily: "'Comic Sans MS', cursive",
    fontSize: 72,
    fontWeight: 700,
    fontColor: '#6ECBF5',
    shadow: true,
    shadowColor: '#3D82AB',
  },
  mintChill: {
    text: 'L G T M',
    fontFamily: "'Comic Sans MS', cursive",
    fontSize: 68,
    fontWeight: 700,
    fontColor: '#98FB98',
    shadow: true,
    shadowColor: '#3CB371',
  },
  lavenderMood: {
    text: 'L G T M',
    fontFamily: "'Tegaki', sans-serif",
    fontSize: 90,
    fontWeight: 700,
    fontColor: '#E6E6FA',
    shadow: true,
    shadowColor: '#9370DB',
  },
  pastelDream: {
    text: 'ありがとう',
    fontFamily: "'Tegaki', sans-serif",
    fontSize: 94,
    fontWeight: 700,
    fontColor: '#FFB6C1',
    shadow: true,
    shadowColor: '#FF69B4',
  },
  sunsetVibes: {
    text: 'ありがとう',
    fontFamily: "'Tegaki', sans-serif",
    fontSize: 94,
    fontWeight: 700,
    fontColor: '#FFA07A',
    shadow: true,
    shadowColor: '#FF7F50',
  },
} as const

export type LgtmThemeKey = keyof typeof lgtmThemes

export const getTheme = (theme: LgtmThemeKey = 'chillBlue'): LgtmTheme => {
  return lgtmThemes[theme] || lgtmThemes.chillBlue
}
