/**
 * 通知コンポーネント - ユーザーへのフィードバック表示
 *
 * @description
 * 処理の成功や失敗を通知するための一時的なポップアップ
 */
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export type NotificationType = 'success' | 'error'

export interface NotificationData {
  type: NotificationType
  message: string
}

type NotificationProps = {
  notification: NotificationData | null
}

export function Notification({ notification }: NotificationProps) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={cn(
            'fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg backdrop-blur-md z-50',
            notification.type === 'success'
              ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 border border-purple-400/30'
              : 'bg-gradient-to-r from-red-500/80 to-pink-500/80 border border-red-400/30'
          )}
        >
          <p className="text-white font-medium flex items-center gap-2">
            {notification.type === 'success' ? (
              <span className="text-lg">✨</span>
            ) : (
              <span className="text-lg">⚠️</span>
            )}
            {notification.message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
