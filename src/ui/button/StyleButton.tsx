/**
 * スタイル設定ボタン - スタイル設定パネルで使用する共通ボタン
 *
 * @description
 * スタイル設定パネルで使用する統一されたデザインのボタンコンポーネント
 */
import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type StyleButtonProps = {
  active?: boolean
  children: React.ReactNode
  variant?: 'default' | 'gradient' | 'outline'
  size?: 'xs' | 'sm' | 'md'
  title?: string
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function StyleButton({
  active = false,
  children,
  variant = 'default',
  size = 'sm',
  title,
  className = '',
  ...props
}: StyleButtonProps) {
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
  }

  const baseClasses = cn(
    'rounded-md transition-all text-center truncate hover:scale-105 active:scale-95 cursor-pointer',
    sizeClasses[size],
    className
  )

  if (variant === 'gradient' || active) {
    return (
      <button
        className={cn(
          baseClasses,
          'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
        )}
        title={title}
        {...props}
      >
        {children}
      </button>
    )
  }

  if (variant === 'outline') {
    return (
      <button
        className={cn(
          baseClasses,
          'bg-transparent border border-pink-400/50 text-gray-200 hover:border-pink-400'
        )}
        title={title}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      className={cn(baseClasses, 'bg-white/10 hover:bg-white/20 text-gray-200')}
      title={title}
      {...props}
    >
      {children}
    </button>
  )
}
